/**
 * Deep key extraction utility type for nested object access
 * Extracts all possible nested property paths from an object type
 */
export type DeepKeys<T> =
  T extends Array<infer U>
    ? DeepKeys<U>
    : T extends object
      ?
          | {
              [K in keyof T]: K extends string
                ? K | (T[K] extends object ? `${K}.${DeepKeys<T[K]>}` : never)
                : never;
            }[keyof T]
          | (string & {})
      : never;

/**
 * Column definition for table configuration with enhanced type safety
 *
 * @template TData - The type of data objects in the table rows
 * @template TKey - The deep key type for type-safe property access
 */
export interface TableColumn<
  TData,
  TKey extends DeepKeys<TData> = DeepKeys<TData>,
> {
  /** Unique identifier for the column - must be a valid deep key of TData */
  key: TKey;
  /** Display text shown in the column header */
  header: string;
  /**
   * Property key or function to extract data from each row
   * - Use property key for simple field access: 'name'
   * - Use deep property key for nested access: 'user.profile.name'
   * - Use function for computed values: (row) => row.firstName + ' ' + row.lastName
   */
  accessor: TKey | ((row: TData) => unknown);
  /**
   * Whether this column can be sorted
   * - If not specified, inherits from the global sortable setting
   * - If global sortable is true, column is sortable unless explicitly set to false
   * - If global sortable is false/undefined, column is only sortable if explicitly set to true
   */
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
  /**
   * Custom sorting function for complex data types
   * @param row - The row data object
   * @returns A sortable value (string or number)
   */
  sortValue?: (row: TData) => string | number;
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
 * Table configuration options with enhanced type safety
 *
 * @template TData - The type of data objects in the table rows
 */
export interface TableConfig<TData> {
  /** Array of column definitions that define table structure */
  columns: TableColumn<TData>[];
  /** Array of data objects to display in the table */
  data: TData[];
  /**
   * Enable sorting for all columns globally
   * - When true: all columns are sortable by default unless explicitly set to false
   * - When false/undefined: only columns with sortable=true are sortable
   */
  sortable?: boolean;
  /** Pagination configuration */
  pagination?: {
    /** Whether pagination is enabled */
    enabled: boolean;
    /** Default number of items per page (defaults to 10) */
    pageSize?: number;
    /** Total number of items across all pages */
    total?: number;
    /** Current page number (1-based) */
    page?: number;
  };
  /** Search and filtering configuration */
  filtering?: {
    /** Whether search functionality is enabled */
    enabled: boolean;
    /**
     * Column keys that should be searchable
     * If not provided, all columns will be searchable
     */
    searchableColumns?: DeepKeys<TData>[];
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

/**
 * Safely extracts a nested value from an object using a dot-notation path
 *
 * This function provides type-safe access to deeply nested object properties
 * using string paths like "user.profile.email". It handles cases where
 * intermediate properties might be undefined or null.
 *
 * @template T - The type of the source object
 * @template K - The deep key type constrained to valid paths in T
 * @param obj - The source object to extract the value from
 * @param path - Dot-notation path to the desired property (e.g., "user.profile.email")
 * @returns The value at the specified path, or undefined if any part of the path is invalid
 *
 * @example
 * ```tsx
 * interface User {
 *   profile: {
 *     contact: {
 *       email: string;
 *     };
 *   };
 * }
 *
 * const user: User = {
 *   profile: {
 *     contact: {
 *       email: "john@example.com"
 *     }
 *   }
 * };
 *
 * const email = getNestedValue(user, "profile.contact.email"); // "john@example.com"
 * const missing = getNestedValue(user, "profile.missing.field"); // undefined
 * ```
 */
export function getNestedValue<T extends object, K extends DeepKeys<T>>(
  obj: T,
  path: K,
): unknown {
  return path
    .split(".")
    .reduce<unknown>(
      (acc, part) =>
        acc && typeof acc === "object" && part in acc
          ? (acc as Record<string, unknown>)[part]
          : undefined,
      obj,
    );
}
/**
 * Re-export DeepKeys type for external use
 */
