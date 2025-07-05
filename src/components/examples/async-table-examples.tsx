import { useState } from "react";
import { Table, AsyncTable, SimpleAsyncTable } from "../table";
import type { TableColumn } from "../table";
import "../table/table.css";

// Sample data types
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  department: string;
  salary: number;
  active: boolean;
}

// Mock API functions
const mockUsers: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    age: 30,
    department: "Engineering",
    salary: 85000,
    active: true,
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    age: 28,
    department: "Design",
    salary: 75000,
    active: true,
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    age: 35,
    department: "Engineering",
    salary: 95000,
    active: false,
  },
  {
    id: 4,
    name: "Alice Brown",
    email: "alice@example.com",
    age: 32,
    department: "Marketing",
    salary: 70000,
    active: true,
  },
  {
    id: 5,
    name: "Charlie Wilson",
    email: "charlie@example.com",
    age: 29,
    department: "Sales",
    salary: 65000,
    active: true,
  },
  {
    id: 6,
    name: "Diana Davis",
    email: "diana@example.com",
    age: 31,
    department: "HR",
    salary: 68000,
    active: false,
  },
  {
    id: 7,
    name: "Eve Miller",
    email: "eve@example.com",
    age: 27,
    department: "Engineering",
    salary: 80000,
    active: true,
  },
  {
    id: 8,
    name: "Frank Garcia",
    email: "frank@example.com",
    age: 33,
    department: "Design",
    salary: 78000,
    active: true,
  },
  {
    id: 9,
    name: "Grace Martinez",
    email: "grace@example.com",
    age: 26,
    department: "Marketing",
    salary: 72000,
    active: true,
  },
  {
    id: 10,
    name: "Henry Lopez",
    email: "henry@example.com",
    age: 34,
    department: "Sales",
    salary: 69000,
    active: false,
  },
  {
    id: 11,
    name: "Ivy Anderson",
    email: "ivy@example.com",
    age: 25,
    department: "Engineering",
    salary: 82000,
    active: true,
  },
  {
    id: 12,
    name: "Jack Taylor",
    email: "jack@example.com",
    age: 36,
    department: "HR",
    salary: 71000,
    active: true,
  },
];

/**
 * Mock API function that simulates server-side pagination, sorting, and filtering
 */
const fetchUsersWithPagination = async (params: {
  page?: number;
  pageSize?: number;
  sort?: { key: string; direction: "asc" | "desc" } | null;
  searchQuery?: string;
}) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Simulate occasional errors
  if (Math.random() < 0.1) {
    return { ok: false, error: new Error("Network error occurred") } as const;
  }

  let filteredUsers = [...mockUsers];

  // Apply search filter
  if (params.searchQuery?.trim()) {
    const query = params.searchQuery.toLowerCase();
    filteredUsers = filteredUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.department.toLowerCase().includes(query),
    );
  }

  // Apply sorting
  if (params.sort) {
    filteredUsers.sort((a, b) => {
      const aValue = a[params.sort!.key as keyof User];
      const bValue = b[params.sort!.key as keyof User];

      let comparison = 0;
      const aStr = String(aValue);
      const bStr = String(bValue);
      if (aStr < bStr) comparison = -1;
      if (aStr > bStr) comparison = 1;

      return params.sort!.direction === "desc" ? -comparison : comparison;
    });
  }

  // Apply pagination
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 10;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  return {
    ok: true,
    data: {
      data: paginatedUsers,
      total: filteredUsers.length,
    },
  } as const;
};

/**
 * Mock API function that loads all data at once
 */
const fetchAllUsers = async () => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate occasional errors
  if (Math.random() < 0.1) {
    return { ok: false, error: new Error("Failed to load users") } as const;
  }

  return { ok: true, data: mockUsers } as const;
};

// Column definitions
const columns: TableColumn<User>[] = [
  {
    key: "id",
    header: "ID",
    accessor: "id",
    sortable: true,
    width: 80,
  },
  {
    key: "name",
    header: "Name",
    accessor: "name",
    sortable: true,
    render: (value, row) => (
      <div style={{ fontWeight: row.active ? "bold" : "normal" }}>
        {String(value)}
      </div>
    ),
  },
  {
    key: "email",
    header: "Email",
    accessor: "email",
    sortable: true,
    render: (value) => (
      <a href={`mailto:${value}`} style={{ color: "#007bff" }}>
        {String(value)}
      </a>
    ),
  },
  {
    key: "department",
    header: "Department",
    accessor: "department",
    sortable: true,
  },
  {
    key: "salary",
    header: "Salary",
    accessor: "salary",
    sortable: true,
    render: (value) => `$${Number(value).toLocaleString()}`,
  },
  {
    key: "status",
    header: "Status",
    accessor: "active",
    sortable: true,
    render: (value) => (
      <span
        style={{
          padding: "0.25rem 0.5rem",
          borderRadius: "4px",
          fontSize: "12px",
          fontWeight: "bold",
          backgroundColor: value ? "#d4edda" : "#f8d7da",
          color: value ? "#155724" : "#721c24",
        }}
      >
        {value ? "Active" : "Inactive"}
      </span>
    ),
  },
];

/**
 * Example 1: Server-side pagination, sorting, and filtering using AsyncTable
 */
export const ServerSideTableExample = () => {
  return (
    <div>
      <div
        style={{
          marginBottom: "1rem",
          padding: "0.75rem",
          backgroundColor: "#f0f9ff",
          border: "1px solid #0ea5e9",
          borderRadius: "8px",
          fontSize: "14px",
        }}
      >
        <strong>🚀 Server-Side AsyncTable:</strong> This example uses the{" "}
        <code>AsyncTable</code> component which automatically handles
        server-side pagination, sorting, and filtering. All operations trigger
        new API calls with debounced search (300ms delay).
      </div>

      <AsyncTable
        config={{
          fetchData: fetchUsersWithPagination,
          columns,
          pagination: {
            enabled: true,
            pageSize: 5,
          },
          filtering: {
            enabled: true,
            searchableColumns: ["name", "email", "department"],
          },
          sortable: true,
        }}
        className="server-side-table"
        onRowClick={(user) => {
          alert(`Server-side clicked: ${user.name} (${user.email})`);
        }}
      />
    </div>
  );
};

/**
 * Example 2: Load all data once, then client-side operations using SimpleAsyncTable
 */
export const ClientSideTableExample = () => {
  return (
    <div>
      <div
        style={{
          marginBottom: "1rem",
          padding: "0.75rem",
          backgroundColor: "#f0fdf4",
          border: "1px solid #10b981",
          borderRadius: "8px",
          fontSize: "14px",
        }}
      >
        <strong>⚡ Client-Side SimpleAsyncTable:</strong> This example uses the{" "}
        <code>SimpleAsyncTable</code> component which loads all data once, then
        performs pagination, sorting, and filtering on the client side. This
        provides instant responses to user interactions after the initial load.
      </div>

      <SimpleAsyncTable
        config={{
          fetchData: fetchAllUsers,
          columns,
          pagination: {
            enabled: true,
            pageSize: 5,
          },
          filtering: {
            enabled: true,
            searchableColumns: ["name", "email", "department"],
          },
          sortable: true,
        }}
        className="client-side-table"
        showRefreshButton={true}
        onRowClick={(user) => {
          alert(`Client-side clicked: ${user.name} (${user.email})`);
        }}
      />
    </div>
  );
};

/**
 * Example 3: Custom async implementation with manual data management
 */
export const CustomAsyncTableExample = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchAllUsers();
      if (result.ok) {
        setUsers(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        style={{
          marginBottom: "1rem",
          display: "flex",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <button onClick={loadUsers} disabled={loading}>
          {loading ? "Loading..." : "Load Users"}
        </button>
        {error && (
          <div style={{ color: "red", fontSize: "14px" }}>
            Error: {error.message}
          </div>
        )}
      </div>

      <Table
        config={{
          columns,
          data: users,
          sortable: true,
          pagination: {
            enabled: true,
            pageSize: 5,
          },
          filtering: {
            enabled: true,
            searchableColumns: ["name", "email", "department"],
          },
        }}
        className="custom-async-table"
      />
    </div>
  );
};
