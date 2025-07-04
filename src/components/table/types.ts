/**
 * Column definition for table configuration
 */
export interface TableColumn<TData> {
  key: string;
  header: string;
  accessor: keyof TData | ((row: TData) => unknown);
  sortable?: boolean;
  width?: string | number;
  render?: (value: unknown, row: TData) => React.ReactNode;
}

/**
 * Sort configuration
 */
export interface TableSort {
  key: string;
  direction: "asc" | "desc";
}

/**
 * Pagination configuration
 */
export interface TablePagination {
  page: number;
  pageSize: number;
  total: number;
}

/**
 * Table configuration options
 */
export interface TableConfig<TData> {
  columns: TableColumn<TData>[];
  data: TData[];
  sortable?: boolean;
  pagination?: {
    enabled: boolean;
    pageSize?: number;
  };
  filtering?: {
    enabled: boolean;
    searchableColumns?: string[];
  };
}

/**
 * Table state managed by the hook
 */
export interface TableState<TData> {
  data: TData[];
  filteredData: TData[];
  paginatedData: TData[];
  sort: TableSort | null;
  pagination: TablePagination | null;
  searchQuery: string;
  loading: boolean;
}

/**
 * Table actions returned by the hook
 */
export interface TableActions {
  setSort: (sort: TableSort | null) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearchQuery: (query: string) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

/**
 * Return type of the useTable hook
 */
export interface UseTableReturn<TData> {
  state: TableState<TData>;
  actions: TableActions;
  columns: TableColumn<TData>[];
}
