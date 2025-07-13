import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import type { TableColumn, UseTableReturn } from "./types";
import { TableSearchInput } from "../search-input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationInfo,
  PaginationSelect,
  generatePaginationRange,
} from "../pagination";

/**
 * Props for the DataTable component
 */
export interface DataTableProps<TData extends object> {
  /** Table state and actions from useTable hook */
  table: UseTableReturn<TData>;
  /** Optional click handler for table rows */
  onRowClick?: (row: TData) => void;
  /** Additional CSS class for the table container */
  className?: string;
  /** Whether to show the search input (default: true) */
  showSearch?: boolean;
  /** Whether to show pagination (default: true) */
  showPagination?: boolean;
  /** Whether to show pagination info (default: true) */
  showPaginationInfo?: boolean;
  /** Whether to show page size selector (default: true) */
  showPageSizeSelector?: boolean;
  /** Custom page size options for the selector */
  pageSizeOptions?: number[];
  /** Whether to show loading state */
  loading?: boolean;
  /** Custom loading component */
  loadingComponent?: React.ReactNode;
  /** Custom empty state component */
  emptyComponent?: React.ReactNode;
}

/**
 * Complete DataTable component with built-in search, filtering, and pagination
 *
 * This component provides a ready-to-use table with all common functionality:
 * - Sortable columns with visual indicators
 * - Search/filtering with the project's search input
 * - Pagination with navigation and page size selection
 * - Loading, empty, and error states
 * - Row click handling
 * - Fully customizable styling
 *
 * @template TData - The type of data objects in the table rows
 * @param props - DataTable configuration props
 * @returns Complete table with search and pagination
 *
 * @example
 * ```tsx
 * interface User {
 *   readonly id: number;
 *   readonly name: string;
 *   readonly email: string;
 * }
 *
 * const MyDataTable = () => {
 *   const columnHelper = createColumnHelper<User>();
 *
 *   const columns = [
 *     columnHelper.accessor("name", {
 *       header: "Name",
 *       sortable: true,
 *       width: "40%",
 *     }),
 *     columnHelper.accessor("email", {
 *       header: "Email",
 *       sortable: true,
 *       width: "60%",
 *     }),
 *   ];
 *
 *   const table = useTable<User>({
 *     columns,
 *     data: users,
 *     sortable: true,
 *     pagination: { enabled: true, pageSize: 10 },
 *     filtering: { enabled: true },
 *   });
 *
 *   return (
 *     <DataTable
 *       table={table}
 *       onRowClick={(user) => console.log('Clicked:', user)}
 *     />
 *   );
 * };
 * ```
 */
export const DataTable = <TData extends object>({
  table,
  onRowClick,
  className = "",
  showSearch = true,
  showPagination = true,
  showPaginationInfo = true,
  showPageSizeSelector = true,
  pageSizeOptions = [5, 10, 25, 50],
  loading = false,
  loadingComponent,
  emptyComponent,
}: DataTableProps<TData>): React.ReactElement => {
  const { state, actions, columns } = table;

  // Handle column sorting
  const handleSort = (column: TableColumn<TData>): void => {
    if (!column.sortable) return;

    const newDirection =
      state.sort?.key === column.key && state.sort.direction === "asc"
        ? "desc"
        : "asc";

    actions.setSort({
      key: String(column.key),
      direction: newDirection,
    });
  };

  // Handle row clicks
  const handleRowClick = (row: TData): void => {
    if (onRowClick) {
      onRowClick(row);
    }
  };

  // Calculate total pages for pagination
  const totalPages = state.pagination
    ? Math.ceil(state.filteredData.length / state.pagination.pageSize)
    : 0;

  // Render loading state
  if (loading || state.loading) {
    return (
      <div className={`data-table-container ${className}`}>
        {loadingComponent || (
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <div>Loading...</div>
          </div>
        )}
      </div>
    );
  }

  // Render empty state
  if (state.paginatedData.length === 0 && !state.searchQuery) {
    return (
      <div className={`data-table-container ${className}`}>
        {emptyComponent || (
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <div>No data available</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`data-table-container ${className}`}>
      {/* Search Input */}
      {showSearch && (
        <div style={{ marginBottom: "1rem" }}>
          <TableSearchInput state={state} actions={actions} />
        </div>
      )}

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={String(column.key)}
                onClick={() => handleSort(column)}
                style={{
                  cursor: column.sortable ? "pointer" : "default",
                  userSelect: "none",
                  ...(column.width && { width: column.width }),
                }}
              >
                {column.header}
                {state.sort?.key === column.key && (
                  <span style={{ marginLeft: "4px" }}>
                    {state.sort.direction === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {state.paginatedData.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                style={{ textAlign: "center", padding: "2rem" }}
              >
                {state.searchQuery
                  ? `No results found for "${state.searchQuery}"`
                  : "No data available"}
              </TableCell>
            </TableRow>
          ) : (
            state.paginatedData.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                onClick={() => handleRowClick(row)}
                style={{
                  cursor: onRowClick ? "pointer" : "default",
                }}
              >
                {columns.map((column) => {
                  let value: unknown;
                  if (typeof column.accessor === "function") {
                    value = column.accessor(row);
                  } else if (typeof column.accessor === "string") {
                    // Handle deep property access
                    const keys = column.accessor.split(".");
                    value = keys.reduce(
                      (obj: unknown, key) =>
                        (obj as Record<string, unknown>)?.[key],
                      row,
                    );
                  } else {
                    value = row[column.accessor as keyof TData];
                  }

                  const cellContent = column.render
                    ? column.render(value, row)
                    : String(value ?? "");

                  return (
                    <TableCell key={String(column.key)}>
                      {cellContent}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {showPagination && state.pagination && totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "1rem",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          {/* Pagination Info */}
          {showPaginationInfo && (
            <PaginationInfo
              current={state.pagination.page}
              pageSize={state.pagination.pageSize}
              total={state.filteredData.length}
            />
          )}

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {/* Page Size Selector */}
            {showPageSizeSelector && (
              <PaginationSelect
                value={state.pagination.pageSize}
                onValueChange={(newPageSize) => {
                  actions.setPageSize(newPageSize);
                  actions.setPage(1); // Reset to first page when changing page size
                }}
                options={pageSizeOptions}
              />
            )}

            {/* Pagination Navigation */}
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => actions.setPage(state.pagination!.page - 1)}
                    disabled={state.pagination.page === 1}
                  />
                </PaginationItem>

                {generatePaginationRange(
                  state.pagination.page,
                  totalPages,
                  1,
                ).map((page, index) => (
                  <PaginationItem key={index}>
                    {page === "ellipsis" ? (
                      <span style={{ padding: "8px" }}>...</span>
                    ) : (
                      <PaginationLink
                        isActive={page === state.pagination!.page}
                        onClick={() => actions.setPage(page as number)}
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => actions.setPage(state.pagination!.page + 1)}
                    disabled={state.pagination.page >= totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}
    </div>
  );
};
