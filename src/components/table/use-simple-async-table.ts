import { useState, useEffect, useCallback } from "react";
import { useTable } from "./use-table";
import type { TableConfig, UseTableReturn } from "./types";

/**
 * Result type for async operations
 */
type AsyncResult<T, E extends Error = Error> =
  | { ok: true; data: T }
  | { ok: false; error: E };

/**
 * Configuration for simple async table
 */
interface SimpleAsyncTableConfig<TData> {
  fetchData: () => Promise<AsyncResult<TData[]>>;
  columns: TableConfig<TData>["columns"];
  pagination?: TableConfig<TData>["pagination"];
  filtering?: TableConfig<TData>["filtering"];
  sortable?: boolean;
}

/**
 * Extended return type for simple async table
 */
interface UseSimpleAsyncTableReturn<TData> extends UseTableReturn<TData> {
  error: Error | null;
  refetch: () => Promise<void>;
  isRefetching: boolean;
}

/**
 * Simple async table hook for loading data once and performing client-side operations
 * Use this when you want to load all data upfront and handle pagination/sorting/filtering on the client
 */
export const useSimpleAsyncTable = <TData extends Record<string, unknown>>(
  config: SimpleAsyncTableConfig<TData>,
): UseSimpleAsyncTableReturn<TData> => {
  const [data, setData] = useState<TData[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isRefetching, setIsRefetching] = useState(false);

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

  // Fetch data function
  const fetchData = useCallback(async () => {
    table.actions.setLoading(true);
    setError(null);

    try {
      const result = await config.fetchData();

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
  }, [config, table.actions]);

  // Refetch data
  const refetch = useCallback(async () => {
    setIsRefetching(true);
    await fetchData();
    setIsRefetching(false);
  }, [fetchData]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    state: table.state,
    actions: table.actions,
    columns: table.columns,
    error,
    refetch,
    isRefetching,
  };
};
