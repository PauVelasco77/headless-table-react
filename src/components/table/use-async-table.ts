import { useState, useEffect, useCallback, useRef } from "react";
import { useTable } from "./use-table";
import type { TableConfig, UseTableReturn, TableSort } from "./types";

/**
 * Result type for async operations following the Result pattern
 * @template T - The success data type
 * @template E - The error type (defaults to Error)
 */
type AsyncResult<T, E extends Error = Error> =
  | { ok: true; data: T }
  | { ok: false; error: E };

/**
 * Configuration for async table operations
 * @template TData - The type of data objects in the table rows
 */
interface AsyncTableConfig<TData extends object> {
  /**
   * Function to fetch data from the server
   * @param params - Request parameters including pagination, sorting, and search
   * @returns Promise resolving to a Result containing data array and total count
   */
  fetchData: (params: {
    /** Current page number (1-based) */
    page?: number;
    /** Number of items per page */
    pageSize?: number;
    /** Current sort configuration */
    sort?: TableSort | null;
    /** Current search query */
    searchQuery?: string;
  }) => Promise<
    AsyncResult<{
      /** Array of data items for the current page */
      data: TData[];
      /** Total number of items across all pages */
      total: number;
    }>
  >;
  /** Column definitions for the table */
  columns: TableConfig<TData>["columns"];
  /** Initial number of items per page (defaults to 10) */
  initialPageSize?: number;
  /** Whether to enable client-side operations (currently unused) */
  enableClientSideOperations?: boolean;
}

/**
 * Extended return type for async table operations
 * @template TData - The type of data objects in the table rows
 */
interface UseAsyncTableReturn<TData> extends UseTableReturn<TData> {
  /** Current error state, null if no error */
  error: Error | null;
  /** Function to refetch current data */
  refetch: () => Promise<void>;
  /** Whether a refetch operation is in progress */
  isRefetching: boolean;
}

/**
 * Custom hook for managing async table data with server-side operations
 *
 * This hook extends the base table functionality to work with server-side data:
 * - Fetches data from server on pagination, sorting, and filtering changes
 * - Handles loading states and error management
 * - Provides debounced search functionality (300ms delay)
 * - Supports data refetching and error recovery
 *
 * @template TData - The type of data objects in the table rows
 * @param config - Configuration including fetch function and column definitions
 * @returns Extended table state and actions with async capabilities
 *
 * @example
 * ```tsx
 * const { state, actions, error, refetch } = useAsyncTable({
 *   fetchData: async ({ page, pageSize, sort, searchQuery }) => {
 *     try {
 *       const response = await api.getUsers({ page, pageSize, sort, searchQuery });
 *       return { ok: true, data: response };
 *     } catch (error) {
 *       return { ok: false, error: error as Error };
 *     }
 *   },
 *   columns: [
 *     { key: "name", header: "Name", accessor: "name", sortable: true },
 *     { key: "email", header: "Email", accessor: "email", sortable: true }
 *   ],
 *   initialPageSize: 20
 * });
 *
 * // Handle errors
 * if (error) {
 *   return <div>Error: {error.message} <button onClick={refetch}>Retry</button></div>;
 * }
 * ```
 */
export const useAsyncTable = <TData extends object>(
  config: AsyncTableConfig<TData>,
): UseAsyncTableReturn<TData> => {
  const [error, setError] = useState<Error | null>(null);
  const [isRefetching, setIsRefetching] = useState(false);
  const [serverData, setServerData] = useState<TData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Store the fetch function in a ref to avoid dependency cycles
  const fetchDataRef = useRef(config.fetchData);
  fetchDataRef.current = config.fetchData;

  // Create base table config
  const tableConfig: TableConfig<TData> = {
    columns: config.columns,
    data: serverData,
    sortable: true,
    pagination: {
      enabled: true,
      pageSize: config.initialPageSize ?? 10,
    },
    filtering: {
      enabled: true,
    },
  };

  // Use the base table hook
  const table = useTable(tableConfig);

  /**
   * Fetches data from the server and updates table state
   * @param params - Parameters for the server request
   */
  const fetchData = useCallback(
    async (params: {
      page?: number;
      pageSize?: number;
      sort?: TableSort | null;
      searchQuery?: string;
    }) => {
      table.actions.setLoading(true);
      setError(null);

      try {
        const result = await fetchDataRef.current(params);

        if (result.ok) {
          setServerData(result.data.data);
          setTotalCount(result.data.total);
        } else {
          setError(result.error);
          setServerData([]);
          setTotalCount(0);
        }
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Unknown error occurred");
        setError(error);
        setServerData([]);
        setTotalCount(0);
      } finally {
        table.actions.setLoading(false);
      }
    },
    [table.actions],
  );

  /**
   * Refetches the current data with existing parameters
   */
  const refetch = useCallback(async () => {
    setIsRefetching(true);
    await fetchData({
      page: table.state.pagination?.page ?? 1,
      pageSize: table.state.pagination?.pageSize ?? 10,
      sort: table.state.sort,
      searchQuery: table.state.searchQuery,
    });
    setIsRefetching(false);
  }, [
    fetchData,
    table.state.pagination,
    table.state.sort,
    table.state.searchQuery,
  ]);

  /**
   * Enhanced actions that trigger server requests
   * All actions automatically update the server state
   */
  const enhancedActions = {
    ...table.actions,
    /**
     * Sets sort configuration and fetches sorted data from server
     * @param sort - New sort configuration
     */
    setSort: useCallback(
      (sort: TableSort | null) => {
        table.actions.setSort(sort);
        fetchData({
          page: 1, // Reset to first page when sorting
          pageSize: table.state.pagination?.pageSize ?? 10,
          sort,
          searchQuery: table.state.searchQuery,
        });
      },
      [
        table.actions,
        fetchData,
        table.state.pagination?.pageSize,
        table.state.searchQuery,
      ],
    ),

    /**
     * Navigates to a specific page and fetches data for that page
     * @param page - Target page number (1-based)
     */
    setPage: useCallback(
      (page: number) => {
        table.actions.setPage(page);
        fetchData({
          page,
          pageSize: table.state.pagination?.pageSize ?? 10,
          sort: table.state.sort,
          searchQuery: table.state.searchQuery,
        });
      },
      [
        table.actions,
        fetchData,
        table.state.pagination?.pageSize,
        table.state.sort,
        table.state.searchQuery,
      ],
    ),

    /**
     * Changes page size and fetches data for the first page
     * @param pageSize - New number of items per page
     */
    setPageSize: useCallback(
      (pageSize: number) => {
        table.actions.setPageSize(pageSize);
        fetchData({
          page: 1, // Reset to first page when changing page size
          pageSize,
          sort: table.state.sort,
          searchQuery: table.state.searchQuery,
        });
      },
      [table.actions, fetchData, table.state.sort, table.state.searchQuery],
    ),

    /**
     * Updates search query with debounced server request (300ms delay)
     * @param query - New search string
     */
    setSearchQuery: useCallback(
      (query: string) => {
        table.actions.setSearchQuery(query);
        // Debounce search to avoid too many requests
        const timeoutId = setTimeout(() => {
          fetchData({
            page: 1, // Reset to first page when searching
            pageSize: table.state.pagination?.pageSize ?? 10,
            sort: table.state.sort,
            searchQuery: query,
          });
        }, 300);

        return () => clearTimeout(timeoutId);
      },
      [
        table.actions,
        fetchData,
        table.state.pagination?.pageSize,
        table.state.sort,
      ],
    ),
  };

  // Enhanced state with server-side pagination info
  const enhancedState = {
    ...table.state,
    pagination: table.state.pagination
      ? {
          ...table.state.pagination,
          total: totalCount, // Use server-provided total count
        }
      : null,
    // For server-side operations, paginatedData is the same as data
    paginatedData: config.enableClientSideOperations
      ? table.state.paginatedData
      : serverData,
    filteredData: config.enableClientSideOperations
      ? table.state.filteredData
      : serverData,
  };

  // Initial data fetch
  useEffect(() => {
    if (!hasInitialized) {
      setHasInitialized(true);
      fetchData({
        page: 1,
        pageSize: config.initialPageSize ?? 10,
        sort: null,
        searchQuery: "",
      });
    }
  }, [config.initialPageSize, fetchData, hasInitialized]);

  return {
    state: enhancedState,
    actions: enhancedActions,
    columns: table.columns,
    error,
    refetch,
    isRefetching,
  };
};
