import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  useTable,
  createColumnHelper,
} from "../table";
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
import { TableSearchInput } from "../search-input";
import { users } from "../../mock/users";

interface User {
  readonly id: number;
  readonly firstName: string;
  readonly lastName: string;
  readonly age: number;
  readonly gender: string;
  readonly email: string;
  readonly phone: string;
  readonly address: {
    readonly city: string;
    readonly state: string;
    readonly country: string;
  };
  readonly company: {
    readonly department: string;
    readonly name: string;
    readonly title: string;
  };
  readonly role: string;
}

/**
 * Users table example demonstrating the use of columnHelper function
 * with composable table components
 */
export const UsersTableExample: React.FC = () => {
  // Create a column helper for the User type
  const columnHelper = createColumnHelper<User>();

  // Define columns using the column helper with consistent widths
  const columns = [
    columnHelper.accessor("firstName", {
      header: "First Name",
      sortable: true,
      width: "15%", // Percentage width
      render: (value) => <strong>{String(value)}</strong>,
    }),

    columnHelper.accessor("lastName", {
      header: "Last Name",
      sortable: true,
      width: "15%", // Percentage width
    }),

    columnHelper.accessor("age", {
      header: "Age",
      sortable: true,
      width: 80, // Fixed pixel width for small columns
      render: (value) => (
        <span className={Number(value) >= 40 ? "senior" : "junior"}>
          {String(value)}
        </span>
      ),
    }),

    columnHelper.accessor("email", {
      header: "Email",
      sortable: true,
      width: "25%", // Larger percentage for email
      render: (value) => (
        <a href={`mailto:${value}`} style={{ color: "#0066cc" }}>
          {String(value)}
        </a>
      ),
    }),

    columnHelper.accessor("address.city", {
      header: "City",
      sortable: true,
      width: "12%", // Percentage width
    }),

    columnHelper.accessor("company.department", {
      header: "Department",
      sortable: true,
      width: "18%", // Percentage width
      render: (value) => (
        <span
          style={{
            padding: "4px 8px",
            borderRadius: "4px",
            backgroundColor: "#f0f8ff",
            fontSize: "0.875rem",
          }}
        >
          {String(value)}
        </span>
      ),
    }),

    // Display column example - actions
    columnHelper.display({
      id: "actions",
      header: "Actions",
      width: 150, // Fixed pixel width for action buttons
      render: (_, row) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => alert(`Editing ${row.firstName} ${row.lastName}`)}
            style={{
              padding: "4px 8px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.75rem",
            }}
          >
            Edit
          </button>
          <button
            onClick={() => alert(`Deleting ${row.firstName} ${row.lastName}`)}
            style={{
              padding: "4px 8px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.75rem",
            }}
          >
            Delete
          </button>
        </div>
      ),
    }),
  ];

  // Use the table hook with the column helper columns
  const { state, actions } = useTable<User>({
    columns,
    data: users.users as User[],
    sortable: true,
    pagination: {
      enabled: true,
      pageSize: 10,
    },
    filtering: {
      enabled: true,
      searchableColumns: ["firstName", "lastName", "email", "address.city"],
    },
  });

  return (
    <div style={{ padding: "20px" }}>
      <h2>Users Table Example with Column Helper</h2>
      <p>
        This example demonstrates using the <code>createColumnHelper</code>{" "}
        function to create type-safe columns with various accessor types and
        consistent column widths:
      </p>
      <ul style={{ marginBottom: "20px" }}>
        <li>Property accessors (firstName, lastName, age)</li>
        <li>Deep property accessors (address.city, company.department)</li>
        <li>Display columns (actions with custom buttons)</li>
        <li>Custom render functions for styling and formatting</li>
        <li>
          <strong>Width control:</strong> Percentage widths (15%, 25%) and fixed
          pixel widths (80px, 150px)
        </li>
      </ul>

      {/* Search Input */}
      <div style={{ marginBottom: "16px" }}>
        <TableSearchInput state={state} actions={actions} />
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={String(column.key)}
                onClick={
                  column.sortable
                    ? () => {
                        const newDirection =
                          state.sort?.key === column.key &&
                          state.sort.direction === "asc"
                            ? "desc"
                            : "asc";
                        actions.setSort({
                          key: String(column.key),
                          direction: newDirection,
                        });
                      }
                    : undefined
                }
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
          {state.paginatedData.map((user) => (
            <TableRow key={user.id}>
              {columns.map((column) => {
                let value: unknown;
                if (typeof column.accessor === "function") {
                  value = column.accessor(user);
                } else if (typeof column.accessor === "string") {
                  // Handle deep property access
                  const keys = column.accessor.split(".");
                  value = keys.reduce(
                    (obj: unknown, key) =>
                      (obj as Record<string, unknown>)?.[key],
                    user,
                  );
                } else {
                  value = user[column.accessor as keyof User];
                }

                const cellContent = column.render
                  ? column.render(value, user)
                  : String(value ?? "");

                return (
                  <TableCell key={String(column.key)}>{cellContent}</TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {state.pagination && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "16px",
            padding: "16px 0",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <PaginationInfo
            current={state.pagination.page}
            pageSize={state.pagination.pageSize}
            total={state.filteredData.length}
          />

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <PaginationSelect
              value={state.pagination.pageSize}
              onValueChange={(newPageSize) => {
                actions.setPageSize(newPageSize);
                actions.setPage(1); // Reset to first page when changing page size
              }}
              options={[5, 10, 25, 50]}
            />

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
                  Math.ceil(
                    state.filteredData.length / state.pagination.pageSize,
                  ),
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
                    disabled={
                      state.pagination.page >=
                      Math.ceil(
                        state.filteredData.length / state.pagination.pageSize,
                      )
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}

      {/* Table Info */}
      <div style={{ marginTop: "20px", fontSize: "0.875rem", color: "#666" }}>
        <p>
          <strong>Features demonstrated:</strong>
        </p>
        <ul>
          <li>✅ Type-safe column definitions with createColumnHelper</li>
          <li>✅ Property accessors (firstName, lastName, age, email)</li>
          <li>✅ Deep property accessors (address.city, company.department)</li>
          <li>✅ Display columns (actions with buttons)</li>
          <li>✅ Custom render functions for styling</li>
          <li>
            ✅ <strong>Consistent column widths</strong> using percentage and
            pixel values
          </li>
          <li>✅ Sortable columns with visual indicators</li>
          <li>✅ Search functionality using project's TableSearchInput</li>
          <li>✅ Pagination using project's pagination components</li>
          <li>✅ Composable table components</li>
        </ul>
      </div>
    </div>
  );
};
