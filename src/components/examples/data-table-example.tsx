import React from "react";
import { DataTable, useTable, createColumnHelper } from "../table";
import { users } from "../../mock/users";

interface User {
  readonly id: number;
  readonly firstName: string;
  readonly lastName: string;
  readonly age: number;
  readonly email: string;
  readonly address: {
    readonly city: string;
    readonly state: string;
  };
  readonly company: {
    readonly department: string;
    readonly title: string;
  };
}

/**
 * Example demonstrating the ready-to-use DataTable component
 *
 * This shows how simple it is to create a fully functional table with:
 * - Search functionality
 * - Sortable columns
 * - Pagination with page size selection
 * - Row click handling
 * - Consistent column widths
 */
export const DataTableExample: React.FC = () => {
  // Create column helper for type-safe column definitions
  const columnHelper = createColumnHelper<User>();

  // Define columns with consistent widths
  const columns = [
    columnHelper.accessor("firstName", {
      header: "First Name",
      sortable: true,
      width: "20%",
      render: (value) => <strong>{String(value)}</strong>,
    }),

    columnHelper.accessor("lastName", {
      header: "Last Name",
      sortable: true,
      width: "20%",
    }),

    columnHelper.accessor("email", {
      header: "Email",
      sortable: true,
      width: "30%",
      render: (value) => (
        <a href={`mailto:${value}`} style={{ color: "#0066cc" }}>
          {String(value)}
        </a>
      ),
    }),

    columnHelper.accessor("address.city", {
      header: "City",
      sortable: true,
      width: "15%",
    }),

    columnHelper.accessor("company.department", {
      header: "Department",
      sortable: true,
      width: "15%",
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
  ];

  // Use the table hook with configuration
  const table = useTable<User>({
    columns,
    data: users.users,
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

  // Handle row clicks
  const handleRowClick = (user: User): void => {
    alert(`Clicked on ${user.firstName} ${user.lastName} (${user.email})`);
  };

  return (
    <div style={{ padding: "clamp(1rem, 2vw, 20px)" }}>
      <h2 style={{ fontSize: "clamp(1.25rem, 3vw, 1.5rem)" }}>
        DataTable Component Example
      </h2>

      <p
        style={{
          marginBottom: "20px",
          color: "#6b7280",
          fontSize: "clamp(0.875rem, 2vw, 1rem)",
          lineHeight: "1.6",
        }}
      >
        This example shows how easy it is to create a complete table with just
        the <code>DataTable</code> component, <code>useTable</code> hook, and{" "}
        <code>createColumnHelper</code>. Everything is built-in:
      </p>

      <ul
        style={{
          marginBottom: "20px",
          color: "#6b7280",
          fontSize: "clamp(0.875rem, 2vw, 1rem)",
          lineHeight: "1.6",
        }}
      >
        <li>✅ Search input with real-time filtering</li>
        <li>✅ Sortable columns with visual indicators</li>
        <li>✅ Pagination with page navigation and size selection</li>
        <li>✅ Row click handling</li>
        <li>✅ Loading and empty states</li>
        <li>✅ Responsive design</li>
      </ul>

      {/* Simple DataTable usage */}
      <DataTable
        table={table}
        onRowClick={handleRowClick}
        className="custom-data-table"
      />

      <div
        style={{
          marginTop: "20px",
          fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)",
          color: "#666",
        }}
      >
        <p>
          <strong>Code required:</strong>
        </p>
        <pre
          style={{
            backgroundColor: "#f5f5f5",
            padding: "clamp(8px, 2vw, 12px)",
            borderRadius: "4px",
            fontSize: "clamp(0.7rem, 1.5vw, 0.8rem)",
            overflow: "auto",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {`// 1. Define columns with columnHelper
const columnHelper = createColumnHelper<User>();
const columns = [
  columnHelper.accessor("firstName", {
    header: "First Name",
    sortable: true,
    width: "20%",
  }),
  // ... more columns
];

// 2. Setup table with useTable hook
const table = useTable<User>({
  columns,
  data: users,
  sortable: true,
  pagination: { enabled: true, pageSize: 10 },
  filtering: { enabled: true },
});

// 3. Render with DataTable component
<DataTable
  table={table}
  onRowClick={(user) => console.log(user)}
/>`}
        </pre>
      </div>
    </div>
  );
};
