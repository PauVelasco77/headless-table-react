import { useState, useEffect, useCallback, useRef } from "react";
import { useTable } from "./use-table";
import type { TableConfig, UseTableReturn } from "./types";

/**
 * Result type for async operations following the Result pattern
 * @template T - The success data type
 * @template E - The error type (defaults to Error)
 */
type AsyncResult<T, E extends Error = Error> =
  | { ok: true; data: T }
  | { ok: false; error: E };

/**
 * Configuration for simple async table operations
 * @template TData - The type of data objects in the table rows
 */
interface SimpleAsyncTableConfig<TData extends object> {
  /**
   * Function to fetch all data from the server
   * @returns Promise resolving to a Result containing the complete data array
   */
  fetchData: () => Promise<AsyncResult<TData[]>>;
  /** Column definitions for the table */
  columns: TableConfig<TData>["columns"];
  /** Pagination configuration (defaults to enabled with 10 items per page) */
  pagination?: TableConfig<TData>["pagination"];
  /** Filtering configuration (defaults to enabled) */
  filtering?: TableConfig<TData>["filtering"];
  /** Whether sorting is enabled (defaults to true) */
  sortable?: boolean;
}

/**
 * Extended return type for simple async table operations
 * @template TData - The type of data objects in the table rows
 */
interface UseSimpleAsyncTableReturn<TData> extends UseTableReturn<TData> {
  /** Current error state, null if no error */
  error: Error | null;
  /** Function to refetch all data */
  refetch: () => Promise<void>;
  /** Whether a refetch operation is in progress */
  isRefetching: boolean;
}

/**
 * Simple async table hook for loading data once and performing client-side operations
 *
 * This hook is ideal for scenarios where:
 * - You have a manageable amount of data (< 1000 items)
 * - You want to load all data upfront and avoid server round-trips
 * - You prefer client-side pagination, sorting, and filtering for better UX
 * - You need offline-capable table functionality
 *
 * The hook fetches all data on mount and then uses the base table functionality
 * for client-side operations. This provides instant responses to user interactions
 * but requires loading all data initially.
 *
 * @template TData - The type of data objects in the table rows
 * @param config - Configuration including fetch function and table settings
 * @returns Table state and actions with async capabilities
 *
 * @example
 * ```tsx
 * const { state, actions, error, refetch } = useSimpleAsyncTable({
 *   fetchData: async () => {
 *     try {
 *       const users = await api.getAllUsers();
 *       return { ok: true, data: users };
 *     } catch (error) {
 *       return { ok: false, error: error as Error };
 *     }
 *   },
 *   columns: [
 *     { key: "name", header: "Name", accessor: "name", sortable: true },
 *     { key: "email", header: "Email", accessor: "email", sortable: true }
 *   ],
 *   pagination: { enabled: true, pageSize: 25 },
 *   filtering: { enabled: true }
 * });
 *
 * // Handle errors
 * if (error) {
 *   return <div>Error: {error.message} <button onClick={refetch}>Retry</button></div>;
 * }
 * ```
 */
export const useSimpleAsyncTable = <TData extends object>(
  config: SimpleAsyncTableConfig<TData>,
): UseSimpleAsyncTableReturn<TData> => {
  const [data, setData] = useState<TData[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isRefetching, setIsRefetching] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Store the fetch function in a ref to avoid dependency cycles
  const fetchDataRef = useRef(config.fetchData);
  fetchDataRef.current = config.fetchData;

  // Create table config with loaded data
  const tableConfig: TableConfig<TData> = {
    columns: config.columns,
    data,
    sortable: config.sortable ?? true,
    pagination: config.pagination ?? {
      enabled: true,
      pageSize: 10,
    },
    filtering: config.filtering ?? {
      enabled: true,
    },
  };

  // Use the base table hook
  const table = useTable(tableConfig);

  /**
   * Fetches all data from the server and updates table state
   */
  const fetchData = useCallback(async () => {
    table.actions.setLoading(true);
    setError(null);

    try {
      const result = await fetchDataRef.current();

      if (result.ok) {
        setData(result.data);
      } else {
        setError(result.error);
        setData([]);
      }
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Unknown error occurred");
      setError(error);
      setData([]);
    } finally {
      table.actions.setLoading(false);
    }
  }, [table.actions]);

  /**
   * Refetches all data from the server
   */
  const refetch = useCallback(async () => {
    setIsRefetching(true);
    await fetchData();
    setIsRefetching(false);
  }, [fetchData]);

  // Initial data fetch
  useEffect(() => {
    if (!hasInitialized) {
      setHasInitialized(true);
      fetchData();
    }
  }, [fetchData, hasInitialized]);

  return {
    state: table.state,
    actions: table.actions,
    columns: table.columns,
    error,
    refetch,
    isRefetching,
  };
};
