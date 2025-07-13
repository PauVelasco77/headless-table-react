import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table";

// Sample data
interface User {
  readonly id: number;
  readonly name: string;
  readonly email: string;
  readonly role: "Admin" | "User" | "Moderator";
  readonly status: "Active" | "Inactive";
  readonly lastLogin: string;
}

const users: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "Active",
    lastLogin: "2024-01-15",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "User",
    status: "Active",
    lastLogin: "2024-01-14",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "Moderator",
    status: "Inactive",
    lastLogin: "2024-01-10",
  },
  {
    id: 4,
    name: "Alice Brown",
    email: "alice@example.com",
    role: "User",
    status: "Active",
    lastLogin: "2024-01-16",
  },
];

type SortField = keyof User;
type SortDirection = "asc" | "desc";

interface SortConfig {
  readonly field: SortField;
  readonly direction: SortDirection;
}

/**
 * Advanced example demonstrating table with sorting and filtering
 */
export function AdvancedTableExample(): React.ReactElement {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [filter, setFilter] = useState("");

  // Sort and filter data
  const sortedAndFilteredData = useMemo(() => {
    let filteredData = users;

    // Apply filter
    if (filter) {
      filteredData = users.filter(
        (user) =>
          user.name.toLowerCase().includes(filter.toLowerCase()) ||
          user.email.toLowerCase().includes(filter.toLowerCase()) ||
          user.role.toLowerCase().includes(filter.toLowerCase()),
      );
    }

    // Apply sort
    if (sortConfig) {
      filteredData = [...filteredData].sort((a, b) => {
        const aValue = a[sortConfig.field];
        const bValue = b[sortConfig.field];

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredData;
  }, [sortConfig, filter]);

  const handleSort = (field: SortField): void => {
    setSortConfig((prevConfig) => {
      if (prevConfig?.field === field) {
        // Toggle direction or remove sort
        if (prevConfig.direction === "asc") {
          return { field, direction: "desc" };
        } else {
          return null; // Remove sort
        }
      } else {
        // Set new sort field
        return { field, direction: "asc" };
      }
    });
  };

  const getSortIcon = (field: SortField): string => {
    if (sortConfig?.field !== field) return "";
    return sortConfig.direction === "asc" ? " ↑" : " ↓";
  };

  const getStatusColor = (status: User["status"]): React.CSSProperties => {
    return {
      padding: "0.25rem 0.5rem",
      borderRadius: "0.25rem",
      fontSize: "0.75rem",
      fontWeight: "500",
      backgroundColor: status === "Active" ? "#dcfce7" : "#fee2e2",
      color: status === "Active" ? "#166534" : "#991b1b",
    };
  };

  const getRoleColor = (role: User["role"]): React.CSSProperties => {
    const colors = {
      Admin: { backgroundColor: "#dbeafe", color: "#1e40af" },
      Moderator: { backgroundColor: "#fef3c7", color: "#92400e" },
      User: { backgroundColor: "#f3e8ff", color: "#7c3aed" },
    };

    return {
      padding: "0.25rem 0.5rem",
      borderRadius: "0.25rem",
      fontSize: "0.75rem",
      fontWeight: "500",
      ...colors[role],
    };
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Advanced Table Example</h2>
      <p>
        This example shows sorting, filtering, and custom styling with
        composable table components.
      </p>

      {/* Filter Input */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Filter users..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: "0.5rem",
            border: "1px solid #d1d5db",
            borderRadius: "0.25rem",
            width: "300px",
          }}
        />
      </div>

      <Table>
        <TableCaption>
          User management table with sorting and filtering capabilities.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead
              style={{ cursor: "pointer", userSelect: "none" }}
              onClick={() => handleSort("name")}
            >
              Name{getSortIcon("name")}
            </TableHead>
            <TableHead
              style={{ cursor: "pointer", userSelect: "none" }}
              onClick={() => handleSort("email")}
            >
              Email{getSortIcon("email")}
            </TableHead>
            <TableHead
              style={{ cursor: "pointer", userSelect: "none" }}
              onClick={() => handleSort("role")}
            >
              Role{getSortIcon("role")}
            </TableHead>
            <TableHead
              style={{ cursor: "pointer", userSelect: "none" }}
              onClick={() => handleSort("status")}
            >
              Status{getSortIcon("status")}
            </TableHead>
            <TableHead
              style={{ cursor: "pointer", userSelect: "none" }}
              onClick={() => handleSort("lastLogin")}
            >
              Last Login{getSortIcon("lastLogin")}
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedAndFilteredData.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <span style={getRoleColor(user.role)}>{user.role}</span>
              </TableCell>
              <TableCell>
                <span style={getStatusColor(user.status)}>{user.status}</span>
              </TableCell>
              <TableCell>{user.lastLogin}</TableCell>
              <TableCell>
                <button
                  style={{
                    padding: "0.25rem 0.5rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "0.25rem",
                    backgroundColor: "white",
                    cursor: "pointer",
                    fontSize: "0.75rem",
                  }}
                  onClick={() => alert(`Edit user: ${user.name}`)}
                >
                  Edit
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {sortedAndFilteredData.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "2rem",
            color: "#6b7280",
          }}
        >
          No users found matching your filter.
        </div>
      )}

      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          backgroundColor: "#f0f9ff",
          borderRadius: "0.5rem",
          fontSize: "0.875rem",
        }}
      >
        <h4>Features Demonstrated</h4>
        <ul style={{ paddingLeft: "1.5rem" }}>
          <li>✅ Composable table components</li>
          <li>✅ Sortable columns (click headers)</li>
          <li>✅ Text filtering</li>
          <li>✅ Custom cell styling</li>
          <li>✅ Interactive elements in cells</li>
          <li>✅ Empty state handling</li>
          <li>✅ Responsive design</li>
        </ul>

        <p style={{ marginTop: "1rem" }}>
          <strong>Try it:</strong> Click on column headers to sort, or type in
          the filter box to search users.
        </p>
      </div>
    </div>
  );
}
