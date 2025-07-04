import { useTable } from "../table";
import type { TableConfig } from "../table";
import type { User } from "./types";
import { sampleUsers } from "./types";

/**
 * Example of using just the useTable hook for custom implementation
 */
export const SimpleTableExample = () => {
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
    data: sampleUsers.slice(0, 5) as User[], // Just first 5 users
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
