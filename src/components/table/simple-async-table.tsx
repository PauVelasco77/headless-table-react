import React from "react";
import { Table } from "./table";
import { useSimpleAsyncTable } from "./use-simple-async-table";
import type { TableConfig } from "./types";

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
  columns: import("./types").TableColumn<TData>[];
  /** Pagination configuration (defaults to enabled with 10 items per page) */
  pagination?: TableConfig<TData>["pagination"];
  /** Filtering configuration (defaults to enabled) */
  filtering?: TableConfig<TData>["filtering"];
  /** Whether sorting is enabled (defaults to true) */
  sortable?: boolean;
}

/**
 * Props for the SimpleAsyncTable component
 *
 * @template TData - The type of data objects in the table rows
 */
interface SimpleAsyncTableProps<TData extends object> {
  /** Simple async table configuration including fetchData function and columns */
  config: SimpleAsyncTableConfig<TData>;
  /** Additional CSS class names to apply to the table container */
  className?: string;
  /**
   * Callback function triggered when a table row is clicked
   * @param row - The complete data object for the clicked row
   */
  onRowClick?: (row: TData) => void;
  /**
   * Callback function triggered when an error occurs
   * @param error - The error that occurred
   */
  onError?: (error: Error) => void;
  /**
   * Custom error display component
   * @param error - The error to display
   * @param refetch - Function to retry the failed operation
   */
  errorComponent?: (
    error: Error,
    refetch: () => Promise<void>,
  ) => React.ReactNode;
  /**
   * Custom loading display component
   * @param isRefetching - Whether a refetch operation is in progress
   */
  loadingComponent?: (isRefetching: boolean) => React.ReactNode;
  /**
   * Show refresh button
   */
  showRefreshButton?: boolean;
}

/**
 * Simple async table component for client-side operations
 *
 * This component loads all data once and performs pagination, sorting, and filtering
 * on the client side. It's ideal for smaller datasets where you want to avoid
 * server round-trips for better user experience.
 *
 * Features:
 * - Load all data once on mount
 * - Client-side pagination, sorting, and filtering
 * - Automatic loading states
 * - Error handling with retry functionality
 * - Instant responses to user interactions
 * - Type-safe column definitions with deep key inference
 * - Custom error and loading components
 *
 * @template TData - The type of data objects in the table rows
 * @param props - Simple async table configuration and event handlers
 * @returns Fully functional async table with client-side operations
 *
 * @example
 * ```tsx
 * interface User {
 *   id: number;
 *   name: string;
 *   email: string;
 * }
 *
 * const fetchAllUsers = async () => {
 *   try {
 *     const response = await fetch('/api/users');
 *     const users = await response.json();
 *     return { ok: true, data: users };
 *   } catch (error) {
 *     return { ok: false, error: error as Error };
 *   }
 * };
 *
 * <SimpleAsyncTable
 *   config={{
 *     fetchData: fetchAllUsers,
 *     columns: [
 *       { key: "name", header: "Name", accessor: "name", sortable: true },
 *       { key: "email", header: "Email", accessor: "email", sortable: true }
 *     ],
 *     pagination: { enabled: true, pageSize: 25 },
 *     filtering: { enabled: true }
 *   }}
 *   onRowClick={(user) => console.log('Clicked:', user.name)}
 *   showRefreshButton={true}
 * />
 * ```
 */
export function SimpleAsyncTable<TData extends object>({
  config,
  className = "",
  onRowClick,
  onError,
  errorComponent,
  loadingComponent,
  showRefreshButton = false,
}: SimpleAsyncTableProps<TData>) {
  const { state, actions, columns, error, refetch, isRefetching } =
    useSimpleAsyncTable<TData>({
      fetchData: config.fetchData,
      columns: config.columns,
      pagination: config.pagination ?? {
        enabled: true,
        pageSize: 10,
      },
      filtering: config.filtering ?? {
        enabled: true,
      },
      sortable: config.sortable ?? true,
    });

  // Call onError callback when error occurs
  React.useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  // Render custom error component if provided
  if (error && errorComponent) {
    return <>{errorComponent(error, refetch)}</>;
  }

  // Render default error state
  if (error) {
    return (
      <div className={`table-container ${className}`}>
        <div
          style={{
            padding: "1rem",
            backgroundColor: "#fee2e2",
            border: "1px solid #fca5a5",
            borderRadius: "4px",
            color: "#991b1b",
            marginBottom: "1rem",
          }}
        >
          <strong>Error:</strong> {error.message}
          <button
            onClick={refetch}
            style={{
              marginLeft: "1rem",
              padding: "0.25rem 0.5rem",
              backgroundColor: "#dc2626",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`table-container ${className}`}>
      {/* Show refresh button and refetching indicator */}
      {(showRefreshButton || isRefetching) && (
        <div
          style={{
            marginBottom: "1rem",
            display: "flex",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          {showRefreshButton && (
            <button
              onClick={refetch}
              disabled={state.loading || isRefetching}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor:
                  state.loading || isRefetching ? "#6b7280" : "#10b981",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor:
                  state.loading || isRefetching ? "not-allowed" : "pointer",
              }}
            >
              {isRefetching ? "🔄 Refreshing..." : "🔄 Refresh"}
            </button>
          )}

          <button
            onClick={actions.reset}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#6b7280",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Show refetching indicator */}
      {isRefetching && (
        <div
          style={{
            padding: "0.5rem",
            backgroundColor: "#dbeafe",
            border: "1px solid #93c5fd",
            borderRadius: "4px",
            color: "#1e40af",
            marginBottom: "1rem",
            fontSize: "14px",
          }}
        >
          🔄 Refreshing data...
        </div>
      )}

      {/* Render custom loading component if provided */}
      {loadingComponent && (state.loading || isRefetching) && (
        <div style={{ marginBottom: "1rem" }}>
          {loadingComponent(isRefetching)}
        </div>
      )}

      <Table
        config={{
          columns,
          data: state.data,
          sortable: config.sortable ?? true,
          pagination: config.pagination ?? {
            enabled: true,
            pageSize: 10,
          },
          filtering: config.filtering ?? {
            enabled: true,
          },
        }}
        className={className}
        onRowClick={onRowClick}
      />
    </div>
  );
}
