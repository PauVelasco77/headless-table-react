import React from "react";
import type { TableConfig } from "./types";
import { useTable } from "./use-table";

/**
 * Props for the Table component
 *
 * @template TData - The type of data objects in the table rows
 */
interface TableProps<TData extends Record<string, unknown>> {
  /** Table configuration including columns, data, and feature settings */
  config: TableConfig<TData>;
  /** Additional CSS class names to apply to the table container */
  className?: string;
  /**
   * Callback function triggered when a table row is clicked
   * @param row - The complete data object for the clicked row
   */
  onRowClick?: (row: TData) => void;
}

/**
 * Headless table component that provides complete table functionality
 *
 * Features:
 * - Sorting: Click column headers to sort data
 * - Pagination: Navigate through large datasets
 * - Filtering: Search through table data
 * - Custom rendering: Use render functions for complex cell content
 * - Row interactions: Handle row clicks and selections
 *
 * @template TData - The type of data objects in the table rows
 * @param props - Table configuration and event handlers
 * @returns Fully functional table with all specified features
 *
 * @example
 * ```tsx
 * const users = [
 *   { id: 1, name: "John", email: "john@example.com" },
 *   { id: 2, name: "Jane", email: "jane@example.com" }
 * ];
 *
 * const columns = [
 *   { key: "name", header: "Name", accessor: "name", sortable: true },
 *   { key: "email", header: "Email", accessor: "email", sortable: true }
 * ];
 *
 * <Table
 *   config={{
 *     columns,
 *     data: users,
 *     pagination: { enabled: true, pageSize: 10 },
 *     filtering: { enabled: true }
 *   }}
 *   onRowClick={(user) => console.log('Clicked:', user.name)}
 * />
 * ```
 */
export function Table<TData extends Record<string, unknown>>({
  config,
  className = "",
  onRowClick,
}: TableProps<TData>) {
  const { state, actions, columns } = useTable(config);

  /**
   * Handles column header clicks for sorting
   * @param columnKey - The key of the column to sort by
   */
  const handleSort = (columnKey: string): void => {
    const column = columns.find((col) => col.key === columnKey);
    if (!column?.sortable && config.sortable !== true) return;

    const newDirection =
      state.sort?.key === columnKey && state.sort.direction === "asc"
        ? "desc"
        : "asc";

    actions.setSort({ key: columnKey, direction: newDirection });
  };

  /**
   * Renders the content of a table cell
   * @param column - Column definition containing accessor and render function
   * @param row - The data object for the current row
   * @returns React node to display in the cell
   */
  const renderCell = (
    column: (typeof columns)[0],
    row: TData,
  ): React.ReactNode => {
    const value =
      typeof column.accessor === "function"
        ? column.accessor(row)
        : row[column.accessor];

    return column.render ? column.render(value, row) : String(value);
  };

  /**
   * Gets the sort indicator icon for a column header
   * @param columnKey - The key of the column to check
   * @returns Sort icon string (↑ for asc, ↓ for desc, empty for no sort)
   */
  const getSortIcon = (columnKey: string): string => {
    if (state.sort?.key !== columnKey) return "";
    return state.sort.direction === "asc" ? " ↑" : " ↓";
  };

  /**
   * Generates pagination information text
   * @returns Formatted string showing current page range and total items
   */
  const getPaginationInfo = (): string => {
    if (!state.pagination) return "";

    const { page, pageSize, total } = state.pagination;
    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, total);

    return `Showing ${start}-${end} of ${total} results`;
  };

  /**
   * Calculates the total number of pages
   * @returns Total page count based on data size and page size
   */
  const getTotalPages = (): number => {
    if (!state.pagination) return 1;
    return Math.ceil(state.pagination.total / state.pagination.pageSize);
  };

  return (
    <div className={`table-container ${className}`}>
      {/* Search Input */}
      {config.filtering?.enabled && (
        <div className="table-search">
          <input
            type="text"
            placeholder="Search..."
            value={state.searchQuery}
            onChange={(e) => actions.setSearchQuery(e.target.value)}
            className="table-search-input"
          />
        </div>
      )}

      {/* Loading State */}
      {state.loading && <div className="table-loading">Loading...</div>}

      {/* Table */}
      <table className="table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                style={{ width: column.width }}
                className={`table-header ${
                  column.sortable || config.sortable ? "sortable" : ""
                }`}
                onClick={() => handleSort(column.key)}
              >
                {column.header}
                {getSortIcon(column.key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {state.paginatedData.map((row, index) => (
            <tr
              key={index}
              className={`table-row ${onRowClick ? "clickable" : ""}`}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((column) => (
                <td key={column.key} className="table-cell">
                  {renderCell(column, row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Empty State */}
      {state.paginatedData.length === 0 && !state.loading && (
        <div className="table-empty">No data available</div>
      )}

      {/* Pagination */}
      {state.pagination && (
        <div className="table-pagination">
          <div className="pagination-info">{getPaginationInfo()}</div>

          <div className="pagination-controls">
            <button
              onClick={() => actions.setPage(state.pagination!.page - 1)}
              disabled={state.pagination.page <= 1}
              className="pagination-button"
            >
              Previous
            </button>

            <span className="pagination-current">
              Page {state.pagination.page} of {getTotalPages()}
            </span>

            <button
              onClick={() => actions.setPage(state.pagination!.page + 1)}
              disabled={state.pagination.page >= getTotalPages()}
              className="pagination-button"
            >
              Next
            </button>
          </div>

          <div className="pagination-size">
            <label>
              Rows per page:
              <select
                value={state.pagination.pageSize}
                onChange={(e) => actions.setPageSize(Number(e.target.value))}
                className="pagination-select"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
