/**
 * Column definition for table configuration
 *
 * @template TData - The type of data objects in the table rows
 */
export interface TableColumn<TData> {
  /** Unique identifier for the column */
  key: string;
  /** Display text shown in the column header */
  header: string;
  /**
   * Property key or function to extract data from each row
   * - Use property key for simple field access: 'name'
   * - Use function for computed values: (row) => row.firstName + ' ' + row.lastName
   */
  accessor: keyof TData | ((row: TData) => unknown);
  /** Whether this column can be sorted (defaults to false) */
  sortable?: boolean;
  /** Fixed width for the column (CSS width value or number for pixels) */
  width?: string | number;
  /**
   * Custom render function for the cell content
   * @param value - The extracted value from the accessor
   * @param row - The complete row data object
   * @returns React element or string to display in the cell
   */
  render?: (value: unknown, row: TData) => React.ReactNode;
}

/**
 * Sort configuration for table columns
 */
export interface TableSort {
  /** The column key to sort by */
  key: string;
  /** Sort direction - ascending or descending */
  direction: "asc" | "desc";
}

/**
 * Pagination state information
 */
export interface TablePagination {
  /** Current page number (1-based) */
  page: number;
  /** Number of items to display per page */
  pageSize: number;
  /** Total number of items across all pages */
  total: number;
}

/**
 * Table configuration options
 *
 * @template TData - The type of data objects in the table rows
 */
export interface TableConfig<TData> {
  /** Array of column definitions that define table structure */
  columns: TableColumn<TData>[];
  /** Array of data objects to display in the table */
  data: TData[];
  /** Enable sorting for all columns (can be overridden per column) */
  sortable?: boolean;
  /** Pagination configuration */
  pagination?: {
    /** Whether pagination is enabled */
    enabled: boolean;
    /** Default number of items per page (defaults to 10) */
    pageSize?: number;
  };
  /** Search and filtering configuration */
  filtering?: {
    /** Whether search functionality is enabled */
    enabled: boolean;
    /**
     * Column keys that should be searchable
     * If not provided, all columns will be searchable
     */
    searchableColumns?: string[];
  };
}

/**
 * Table state managed by the hook
 *
 * @template TData - The type of data objects in the table rows
 */
export interface TableState<TData> {
  /** Original unmodified data array */
  data: TData[];
  /** Data after applying search filters */
  filteredData: TData[];
  /** Data for the current page (after filtering, sorting, and pagination) */
  paginatedData: TData[];
  /** Current sort configuration, null if no sorting applied */
  sort: TableSort | null;
  /** Current pagination state, null if pagination disabled */
  pagination: TablePagination | null;
  /** Current search query string */
  searchQuery: string;
  /** Whether the table is in a loading state */
  loading: boolean;
}

/**
 * Table actions returned by the hook for controlling table state
 */
export interface TableActions {
  /**
   * Set the sort configuration
   * @param sort - Sort configuration or null to clear sorting
   */
  setSort: (sort: TableSort | null) => void;
  /**
   * Navigate to a specific page
   * @param page - Page number (1-based)
   */
  setPage: (page: number) => void;
  /**
   * Change the number of items per page
   * @param pageSize - Number of items to show per page
   */
  setPageSize: (pageSize: number) => void;
  /**
   * Update the search query
   * @param query - Search string to filter data
   */
  setSearchQuery: (query: string) => void;
  /**
   * Set the loading state
   * @param loading - Whether the table should show loading state
   */
  setLoading: (loading: boolean) => void;
  /** Reset all table state to initial values */
  reset: () => void;
}

/**
 * Return type of the useTable hook
 *
 * @template TData - The type of data objects in the table rows
 */
export interface UseTableReturn<TData> {
  /** Current table state including data, pagination, sorting, etc. */
  state: TableState<TData>;
  /** Actions to control and update table state */
  actions: TableActions;
  /** Column definitions passed from the configuration */
  columns: TableColumn<TData>[];
}
