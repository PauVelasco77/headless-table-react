import { useState } from "react";
import { Table } from "../table";
import type { TableColumn, TableConfig } from "../table";
import type { User } from "./types";
import { sampleUsers } from "./types";

/**
 * Example table with action buttons in the last column instead of clickable rows
 */
export const ActionButtonTableExample = () => {
  const [actionResult, setActionResult] = useState<string>("");

  const handleEdit = (user: User): void => {
    setActionResult(`Editing user: ${user.name} (ID: ${user.id})`);
  };

  const handleDelete = (user: User): void => {
    setActionResult(`Deleting user: ${user.name} (ID: ${user.id})`);
  };

  const handleView = (user: User): void => {
    setActionResult(`Viewing details for: ${user.name} (${user.email})`);
  };

  // Define columns with action buttons in the last column
  const actionColumns: TableColumn<User>[] = [
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
    {
      key: "actions",
      header: "Actions",
      accessor: "id", // We use id as accessor but render custom buttons
      sortable: false,
      width: 200,
      render: (_, row) => (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent row click if there was one
              handleView(row);
            }}
            style={{
              padding: "0.25rem 0.5rem",
              fontSize: "12px",
              border: "1px solid #007bff",
              backgroundColor: "#007bff",
              color: "white",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            View
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(row);
            }}
            style={{
              padding: "0.25rem 0.5rem",
              fontSize: "12px",
              border: "1px solid #28a745",
              backgroundColor: "#28a745",
              color: "white",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row);
            }}
            style={{
              padding: "0.25rem 0.5rem",
              fontSize: "12px",
              border: "1px solid #dc3545",
              backgroundColor: "#dc3545",
              color: "white",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      ),
    },
  ] as const;

  // Table configuration - note we don't provide onRowClick
  const actionTableConfig: TableConfig<User> = {
    columns: actionColumns,
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

  return (
    <div className="action-table-example">
      <Table
        config={actionTableConfig}
        // Note: No onRowClick prop - we handle clicks via buttons
        className="demo-table"
      />

      {actionResult && (
        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            backgroundColor: "#f8f9fa",
            border: "1px solid #dee2e6",
            borderRadius: "4px",
          }}
        >
          <h4>Action Result:</h4>
          <p>{actionResult}</p>
          <button
            onClick={() => setActionResult("")}
            style={{
              padding: "0.25rem 0.5rem",
              fontSize: "12px",
              border: "1px solid #6c757d",
              backgroundColor: "#6c757d",
              color: "white",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
};
