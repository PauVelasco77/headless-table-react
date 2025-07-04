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
 */
export const useTable = <TData extends Record<string, unknown>>(
  config: TableConfig<TData>,
): UseTableReturn<TData> => {
  const [sort, setSort] = useState<TableSort | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(config.pagination?.pageSize ?? 10);
  const [loading, setLoading] = useState(false);

  // Filter data based on search query
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

  // Sort filtered data
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

  // Calculate pagination
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

  // Get paginated data
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;

    const startIndex = (pagination.page - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;

    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, pagination]);

  // Actions
  const handleSetSort = useCallback((newSort: TableSort | null) => {
    setSort(newSort);
    setCurrentPage(1); // Reset to first page when sorting
  }, []);

  const handleSetPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleSetPageSize = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  }, []);

  const handleSetSearchQuery = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

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
