import { useState, useMemo, useCallback } from "react";
import type {
  TableConfig,
  TableState,
  TableActions,
  UseTableReturn,
  TableSort,
  TablePagination,
  DeepKeys,
} from "./types";
import { getNestedValue } from "./types";

/**
 * Custom hook for managing table state and functionality with enhanced type safety
 *
 * This hook handles all table operations including:
 * - Data filtering based on search queries with deep key support
 * - Sorting by column values (ascending/descending) with custom sort functions
 * - Pagination with configurable page sizes
 * - Loading states for async operations
 * - Type-safe nested property access
 *
 * @template TData - The type of data objects in the table rows
 * @param config - Table configuration including columns, data, and feature settings
 * @returns Object containing table state, actions, and column definitions
 *
 * @example
 * ```tsx
 * interface User {
 *   id: number;
 *   name: string;
 *   profile: { email: string; address: { city: string } };
 * }
 *
 * const { state, actions, columns } = useTable<User>({
 *   columns: [
 *     { key: "name", header: "Name", accessor: "name", sortable: true },
 *     { key: "profile.email", header: "Email", accessor: "profile.email", sortable: true },
 *     { key: "profile.address.city", header: "City", accessor: "profile.address.city" }
 *   ],
 *   data: users,
 *   pagination: { enabled: true, pageSize: 10 },
 *   filtering: {
 *     enabled: true,
 *     searchableColumns: ["name", "profile.email"] // Type-safe deep keys
 *   }
 * });
 * ```
 */
export const useTable = <TData extends object>(
  config: TableConfig<TData>,
): UseTableReturn<TData> => {
  // Internal state management
  const [sort, setSort] = useState<TableSort | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(config.pagination?.page ?? 1);
  const [pageSize, setPageSize] = useState(config.pagination?.pageSize ?? 10);
  const [loading, setLoading] = useState(false);

  /**
   * Filters data based on search query across searchable columns with deep key support
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

        let value: unknown;
        if (typeof column.accessor === "function") {
          value = column.accessor(row);
        } else {
          // Use type-safe nested value access
          value = getNestedValue(row, column.accessor as DeepKeys<TData>);
        }

        return String(value ?? "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      }),
    );
  }, [config.data, config.columns, config.filtering, searchQuery]);

  /**
   * Sorts the filtered data based on current sort configuration with enhanced type handling
   * Supports custom sort functions and proper numeric/string comparison
   */
  const sortedData = useMemo(() => {
    if (!sort) return filteredData;

    const column = config.columns.find((col) => col.key === sort.key);
    if (!column) return filteredData;

    return [...filteredData].sort((a, b) => {
      let aValue: unknown;
      let bValue: unknown;

      // Use custom sort function if provided
      if (column.sortValue) {
        aValue = column.sortValue(a);
        bValue = column.sortValue(b);
      } else if (typeof column.accessor === "function") {
        aValue = column.accessor(a);
        bValue = column.accessor(b);
      } else {
        // Use type-safe nested value access
        aValue = getNestedValue(a, column.accessor as DeepKeys<TData>);
        bValue = getNestedValue(b, column.accessor as DeepKeys<TData>);
      }

      // Handle null/undefined values
      if (aValue === bValue) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      let comparison = 0;

      // Handle numeric comparison
      if (typeof aValue === "number" && typeof bValue === "number") {
        comparison = aValue - bValue;
      } else {
        // String comparison with locale support
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sort.direction === "desc" ? -comparison : comparison;
    });
  }, [filteredData, sort, config.columns]);

  /**
   * Calculates pagination state based on sorted data and current page settings
   * Returns null if pagination is disabled
   */
  const pagination = useMemo((): TablePagination | null => {
    if (!config.pagination?.enabled) return null;

    const total = config.pagination?.total ?? sortedData.length;
    const totalPages = Math.ceil(total / pageSize);
    const safePage = Math.min(Math.max(1, currentPage), totalPages || 1);

    return {
      page: safePage,
      pageSize,
      total,
    };
  }, [
    config.pagination?.enabled,
    config.pagination?.total,
    sortedData.length,
    pageSize,
    currentPage,
  ]);

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
