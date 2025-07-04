import { useState } from "react";
import { Table, useTable } from "./components/table";
import type { TableColumn, TableConfig } from "./components/table";
import {
  ServerSideTableExample,
  ClientSideTableExample,
  CustomAsyncTableExample,
} from "./components/async-table-examples";
import {
  PokemonServerSideExample,
  PokemonClientSideExample,
} from "./components/pokemon-table-example";
import { PokemonSuspenseExample } from "./components/pokemon-suspense-example";
import "./components/table/table.css";
import "./App.css";

// Sample data types
interface User extends Record<string, unknown> {
  id: number;
  name: string;
  email: string;
  age: number;
  department: string;
  salary: number;
  active: boolean;
}

// Sample data
const sampleUsers: User[] = [
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
] as const;

const App = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Define table columns
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
      key: "age",
      header: "Age",
      accessor: "age",
      sortable: true,
      width: 80,
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
  ] as const;

  // Table configuration
  const tableConfig: TableConfig<User> = {
    columns,
    data: sampleUsers,
    sortable: true,
    pagination: {
      enabled: true,
      pageSize: 5,
    },
    filtering: {
      enabled: true,
      searchableColumns: ["name", "email", "department"],
    },
  };

  const handleRowClick = (user: User): void => {
    setSelectedUser(user);
  };

  return (
    <div className="app">
      <div className="container">
        <h1>Headless Table Demo</h1>

        {/* Example 1: Full-featured table */}
        <section>
          <h2>Full-featured Table</h2>
          <p>
            This table includes sorting, pagination, filtering, and custom cell
            rendering.
          </p>

          <Table<User>
            config={tableConfig}
            onRowClick={handleRowClick}
            className="demo-table"
          />

          {selectedUser && (
            <div className="selected-user">
              <h3>Selected User:</h3>
              <p>
                <strong>Name:</strong> {selectedUser.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>Department:</strong> {selectedUser.department}
              </p>
              <button onClick={() => setSelectedUser(null)}>
                Clear Selection
              </button>
            </div>
          )}
        </section>

        {/* Example 2: Simple table with just the hook */}
        <section>
          <h2>Custom Implementation with useTable Hook</h2>
          <p>
            This shows how to use the useTable hook directly for custom
            implementations.
          </p>

          <SimpleTableExample />
        </section>

        {/* Example 3: Async data examples */}
        <section>
          <h2>Async Data Examples</h2>

          <h3>Server-side Operations</h3>
          <p>
            This example shows server-side pagination, sorting, and filtering.
          </p>
          <ServerSideTableExample />

          <h3>Client-side Operations</h3>
          <p>
            This example loads all data once and performs operations on the
            client.
          </p>
          <ClientSideTableExample />

          <h3>Custom Async Implementation</h3>
          <p>This example shows manual async data management.</p>
          <CustomAsyncTableExample />
        </section>

        {/* Example 4: Pokemon API examples */}
        <section>
          <h2>🐱 Pokemon API Examples</h2>
          <p>
            Real-world examples using the Pokemon API to demonstrate async
            loading, error handling, and different data management strategies.
          </p>

          <h3>Pokemon with Server-Side Pagination</h3>
          <p>
            Loads Pokemon data page by page with real network delays. Try
            searching for Pokemon names or types like "fire" or "water".
          </p>
          <PokemonServerSideExample />

          <h3>Load All Pokemon (Generation 1)</h3>
          <p>
            Loads all 151 original Pokemon at once. This demonstrates longer
            loading times and client-side operations after data is loaded.
            Toggle shiny sprites!
          </p>
          <PokemonClientSideExample />
        </section>

        {/* Example 5: Pokemon with Suspense */}
        <section>
          <h2>⚡ Pokemon with Suspense</h2>
          <p>
            Modern React Suspense example with declarative loading states. The
            component suspends while fetching data, showing a beautiful
            fallback.
          </p>

          <h3>Suspense-based Pokemon Table</h3>
          <p>
            Uses React 18's Suspense and the 'use' hook for clean, declarative
            loading. Change the Pokemon count to see different loading times!
          </p>
          <PokemonSuspenseExample />
        </section>
      </div>
    </div>
  );
};

// Example of using just the hook for custom implementation
const SimpleTableExample = () => {
  const simpleConfig: TableConfig<User> = {
    columns: [
      { key: "name", header: "Name", accessor: "name", sortable: true },
      {
        key: "department",
        header: "Department",
        accessor: "department",
        sortable: true,
      },
      { key: "salary", header: "Salary", accessor: "salary", sortable: true },
    ],
    data: sampleUsers.slice(0, 5), // Just first 5 users
    sortable: true,
  };

  const { state, actions } = useTable<User>(simpleConfig);

  return (
    <div className="simple-table">
      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => actions.reset()}>Reset Table</button>
        <span style={{ marginLeft: "1rem", color: "#666" }}>
          Showing {state.paginatedData.length} users
        </span>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {simpleConfig.columns.map((column) => (
              <th
                key={column.key}
                style={{
                  padding: "0.5rem",
                  borderBottom: "2px solid #ddd",
                  textAlign: "left",
                  cursor: "pointer",
                  backgroundColor: "#f8f9fa",
                }}
                onClick={() => {
                  const newDirection =
                    state.sort?.key === column.key &&
                    state.sort.direction === "asc"
                      ? "desc"
                      : "asc";
                  actions.setSort({ key: column.key, direction: newDirection });
                }}
              >
                {column.header}
                {state.sort?.key === column.key && (
                  <span>{state.sort.direction === "asc" ? " ↑" : " ↓"}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {state.paginatedData.map((user, index) => (
            <tr key={index}>
              <td style={{ padding: "0.5rem", borderBottom: "1px solid #ddd" }}>
                {String(user.name)}
              </td>
              <td style={{ padding: "0.5rem", borderBottom: "1px solid #ddd" }}>
                {String(user.department)}
              </td>
              <td style={{ padding: "0.5rem", borderBottom: "1px solid #ddd" }}>
                ${Number(user.salary).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
