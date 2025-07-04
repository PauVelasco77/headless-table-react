import React from "react";
import type { TableConfig } from "./types";
import { useTable } from "./use-table";

interface TableProps<TData extends Record<string, unknown>> {
  config: TableConfig<TData>;
  className?: string;
  onRowClick?: (row: TData) => void;
}

/**
 * Headless table component that provides structure and functionality
 */
export function Table<TData extends Record<string, unknown>>({
  config,
  className = "",
  onRowClick,
}: TableProps<TData>) {
  const { state, actions, columns } = useTable(config);

  const handleSort = (columnKey: string): void => {
    const column = columns.find((col) => col.key === columnKey);
    if (!column?.sortable && config.sortable !== true) return;

    const newDirection =
      state.sort?.key === columnKey && state.sort.direction === "asc"
        ? "desc"
        : "asc";

    actions.setSort({ key: columnKey, direction: newDirection });
  };

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

  const getSortIcon = (columnKey: string): string => {
    if (state.sort?.key !== columnKey) return "";
    return state.sort.direction === "asc" ? " ↑" : " ↓";
  };

  const getPaginationInfo = (): string => {
    if (!state.pagination) return "";

    const { page, pageSize, total } = state.pagination;
    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, total);

    return `Showing ${start}-${end} of ${total} results`;
  };

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
