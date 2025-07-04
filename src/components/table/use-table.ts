import { useState, useMemo, useCallback } from "react";
import type {
  TableConfig,
  TableState,
  TableActions,
  UseTableReturn,
  TableSort,
  TablePagination,
} from "./types";

/**
 * Custom hook for managing table state and functionality
 *
 * This hook handles all table operations including:
 * - Data filtering based on search queries
 * - Sorting by column values (ascending/descending)
 * - Pagination with configurable page sizes
 * - Loading states for async operations
 *
 * @template TData - The type of data objects in the table rows
 * @param config - Table configuration including columns, data, and feature settings
 * @returns Object containing table state, actions, and column definitions
 *
 * @example
 * ```tsx
 * const { state, actions, columns } = useTable({
 *   columns: [
 *     { key: "name", header: "Name", accessor: "name", sortable: true },
 *     { key: "email", header: "Email", accessor: "email" }
 *   ],
 *   data: users,
 *   pagination: { enabled: true, pageSize: 10 },
 *   filtering: { enabled: true }
 * });
 *
 * // Access current page data
 * console.log(state.paginatedData);
 *
 * // Control table state
 * actions.setSort({ key: "name", direction: "asc" });
 * actions.setPage(2);
 * actions.setSearchQuery("john");
 * ```
 */
export const useTable = <TData extends Record<string, unknown>>(
  config: TableConfig<TData>,
): UseTableReturn<TData> => {
  // Internal state management
  const [sort, setSort] = useState<TableSort | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(config.pagination?.pageSize ?? 10);
  const [loading, setLoading] = useState(false);

  /**
   * Filters data based on search query across searchable columns
   * Performs case-insensitive string matching on specified or all columns
   */
  const filteredData = useMemo(() => {
    if (!config.filtering?.enabled || !searchQuery.trim()) {
      return config.data;
    }

    const searchableColumns =
      config.filtering.searchableColumns ??
      config.columns.map((col) => col.key);

    return config.data.filter((row) =>
      searchableColumns.some((columnKey) => {
        const column = config.columns.find((col) => col.key === columnKey);
        if (!column) return false;

        const value =
          typeof column.accessor === "function"
            ? column.accessor(row)
            : row[column.accessor];

        return String(value).toLowerCase().includes(searchQuery.toLowerCase());
      }),
    );
  }, [config.data, config.columns, config.filtering, searchQuery]);

  /**
   * Sorts the filtered data based on current sort configuration
   * Handles string conversion for safe comparison of unknown types
   */
  const sortedData = useMemo(() => {
    if (!sort) return filteredData;

    const column = config.columns.find((col) => col.key === sort.key);
    if (!column) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue =
        typeof column.accessor === "function"
          ? column.accessor(a)
          : a[column.accessor];
      const bValue =
        typeof column.accessor === "function"
          ? column.accessor(b)
          : b[column.accessor];

      let comparison = 0;

      // Convert to strings for comparison to handle unknown types safely
      const aStr = String(aValue);
      const bStr = String(bValue);

      if (aStr < bStr) comparison = -1;
      if (aStr > bStr) comparison = 1;

      return sort.direction === "desc" ? -comparison : comparison;
    });
  }, [filteredData, sort, config.columns]);

  /**
   * Calculates pagination state based on sorted data and current page settings
   * Returns null if pagination is disabled
   */
  const pagination = useMemo((): TablePagination | null => {
    if (!config.pagination?.enabled) return null;

    const total = sortedData.length;
    const totalPages = Math.ceil(total / pageSize);
    const safePage = Math.min(Math.max(1, currentPage), totalPages || 1);

    return {
      page: safePage,
      pageSize,
      total,
    };
  }, [config.pagination?.enabled, sortedData.length, pageSize, currentPage]);

  /**
   * Extracts the data for the current page from sorted data
   * Returns all data if pagination is disabled
   */
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;

    const startIndex = (pagination.page - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;

    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, pagination]);

  // Action handlers with automatic page resets for better UX

  /**
   * Updates sort configuration and resets to first page
   * @param newSort - New sort configuration or null to clear sorting
   */
  const handleSetSort = useCallback((newSort: TableSort | null) => {
    setSort(newSort);
    setCurrentPage(1); // Reset to first page when sorting
  }, []);

  /**
   * Navigates to a specific page
   * @param page - Target page number (1-based)
   */
  const handleSetPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  /**
   * Changes page size and resets to first page
   * @param newPageSize - New number of items per page
   */
  const handleSetPageSize = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  }, []);

  /**
   * Updates search query and resets to first page
   * @param query - New search string
   */
  const handleSetSearchQuery = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  /**
   * Resets all table state to initial values
   */
  const handleReset = useCallback(() => {
    setSort(null);
    setSearchQuery("");
    setCurrentPage(1);
    setPageSize(config.pagination?.pageSize ?? 10);
    setLoading(false);
  }, [config.pagination?.pageSize]);

  const state: TableState<TData> = {
    data: config.data,
    filteredData,
    paginatedData,
    sort,
    pagination,
    searchQuery,
    loading,
  };

  const actions: TableActions = {
    setSort: handleSetSort,
    setPage: handleSetPage,
    setPageSize: handleSetPageSize,
    setSearchQuery: handleSetSearchQuery,
    setLoading,
    reset: handleReset,
  };

  return {
    state,
    actions,
    columns: config.columns,
  };
};
