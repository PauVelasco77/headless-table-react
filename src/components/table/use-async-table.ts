import { useState, useEffect, useCallback } from "react";
import { useTable } from "./use-table";
import type { TableConfig, UseTableReturn, TableSort } from "./types";

/**
 * Result type for async operations
 */
type AsyncResult<T, E extends Error = Error> =
  | { ok: true; data: T }
  | { ok: false; error: E };

/**
 * Configuration for async table operations
 */
interface AsyncTableConfig<TData> {
  fetchData: (params: {
    page?: number;
    pageSize?: number;
    sort?: TableSort | null;
    searchQuery?: string;
  }) => Promise<
    AsyncResult<{
      data: TData[];
      total: number;
    }>
  >;
  columns: TableConfig<TData>["columns"];
  initialPageSize?: number;
  enableClientSideOperations?: boolean;
}

/**
 * Extended return type for async table
 */
interface UseAsyncTableReturn<TData> extends UseTableReturn<TData> {
  error: Error | null;
  refetch: () => Promise<void>;
  isRefetching: boolean;
}

/**
 * Custom hook for managing async table data
 * Handles server-side pagination, sorting, and filtering
 */
export const useAsyncTable = <TData extends Record<string, unknown>>(
  config: AsyncTableConfig<TData>,
): UseAsyncTableReturn<TData> => {
  const [error, setError] = useState<Error | null>(null);
  const [isRefetching, setIsRefetching] = useState(false);
  const [serverData, setServerData] = useState<TData[]>([]);
  const [totalCount, setTotalCount] = useState(0);

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

  // Fetch data function
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
        const result = await config.fetchData(params);

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
    [config, table.actions],
  );

  // Refetch current data
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

  // Enhanced actions that trigger server requests
  const enhancedActions = {
    ...table.actions,
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
    fetchData({
      page: 1,
      pageSize: config.initialPageSize ?? 10,
      sort: null,
      searchQuery: "",
    });
  }, [fetchData, config.initialPageSize]);

  return {
    state: enhancedState,
    actions: enhancedActions,
    columns: table.columns,
    error,
    refetch,
    isRefetching,
  };
};
