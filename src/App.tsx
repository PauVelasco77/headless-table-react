import "./components/table/table.css";
import "./App.css";
import { PaginationExample } from "./components/examples/pagination-example";
import { PaginationUsageGuide } from "./components/examples/pagination-usage-guide";
import { SearchExample } from "./components/examples/search-example";
import { SearchUsageGuide } from "./components/examples/search-usage-guide";
import { BasicTableExample } from "./components/examples/basic-table-example";
import { AdvancedTableExample } from "./components/examples/advanced-table-example";
import { UsersTableExample } from "./components/examples/users-table-example";
import { DataTableExample } from "./components/examples/data-table-example";
import { TableUsageGuide } from "./components/examples/table-usage-guide";

const App = () => {
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
      <h1>React Table Components</h1>
      <p
        style={{ fontSize: "1.125rem", marginBottom: "2rem", color: "#6b7280" }}
      >
        Composable table components built with React. Build flexible, accessible
        tables with full control over styling and behavior.
      </p>

      <section style={{ marginBottom: "3rem" }}>
        <TableUsageGuide />
      </section>

      <section style={{ marginBottom: "3rem" }}>
        <h2>Basic Table Example</h2>
        <BasicTableExample />
      </section>

      <section style={{ marginBottom: "3rem" }}>
        <AdvancedTableExample />
      </section>

      <section style={{ marginBottom: "3rem" }}>
        <UsersTableExample />
      </section>

      <section style={{ marginBottom: "3rem" }}>
        <DataTableExample />
      </section>

      <section style={{ marginBottom: "3rem" }}>
        <h2>Search Components Demo</h2>
        <SearchExample />
      </section>

      <section style={{ marginBottom: "3rem" }}>
        <h2>Pagination Demo</h2>
        <PaginationExample />
      </section>

      <section style={{ marginBottom: "3rem" }}>
        <SearchUsageGuide />
      </section>

      <section>
        <PaginationUsageGuide />
      </section>
    </div>
  );
};

export default App;
