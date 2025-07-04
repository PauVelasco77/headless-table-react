import { useState } from "react";
import { Table } from "../table";
import type { TableColumn, TableConfig } from "../table";
import type { User } from "./types";
import { sampleUsers } from "./types";

/**
 * Full-featured table example with sorting, pagination, filtering, and custom cell rendering
 */
export const FullFeaturedTableExample = () => {
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
    data: sampleUsers as User[],
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
    <div className="full-featured-table-example">
      <Table
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
          <button onClick={() => setSelectedUser(null)}>Clear Selection</button>
        </div>
      )}
    </div>
  );
};
