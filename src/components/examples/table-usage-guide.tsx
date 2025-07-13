import React from "react";

/**
 * Comprehensive usage guide for table components
 *
 * Shows how to use the composable table components
 */
export function TableUsageGuide(): React.ReactElement {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Table Components Usage Guide</h1>
      <p>
        This guide explains how to use our composable table components. Build
        tables using individual composable components for maximum flexibility
        and control.
      </p>

      {/* Composable Approach */}
      <section style={{ marginBottom: "3rem" }}>
        <h2>✨ Composable Tables</h2>
        <p>
          Build tables using individual composable components. This approach
          gives you maximum flexibility and control.
        </p>

        <div
          style={{
            padding: "1rem",
            backgroundColor: "#f0f9ff",
            borderRadius: "0.5rem",
            marginBottom: "1rem",
          }}
        >
          <h4>Benefits:</h4>
          <ul style={{ paddingLeft: "1.5rem" }}>
            <li>✅ Full control over table structure</li>
            <li>✅ Easy to customize individual parts</li>
            <li>✅ Follows modern component patterns</li>
            <li>✅ Compatible with any styling approach</li>
            <li>✅ Easier to add custom functionality</li>
          </ul>
        </div>

        <h3>Available Components</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1rem",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{
              padding: "1rem",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
            }}
          >
            <code>Table</code>
            <p style={{ fontSize: "0.875rem", margin: "0.5rem 0 0 0" }}>
              Main table container with responsive wrapper
            </p>
          </div>
          <div
            style={{
              padding: "1rem",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
            }}
          >
            <code>TableHeader</code>
            <p style={{ fontSize: "0.875rem", margin: "0.5rem 0 0 0" }}>
              Table header section (&lt;thead&gt;)
            </p>
          </div>
          <div
            style={{
              padding: "1rem",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
            }}
          >
            <code>TableBody</code>
            <p style={{ fontSize: "0.875rem", margin: "0.5rem 0 0 0" }}>
              Table body section (&lt;tbody&gt;)
            </p>
          </div>
          <div
            style={{
              padding: "1rem",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
            }}
          >
            <code>TableRow</code>
            <p style={{ fontSize: "0.875rem", margin: "0.5rem 0 0 0" }}>
              Table row (&lt;tr&gt;)
            </p>
          </div>
          <div
            style={{
              padding: "1rem",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
            }}
          >
            <code>TableHead</code>
            <p style={{ fontSize: "0.875rem", margin: "0.5rem 0 0 0" }}>
              Header cell (&lt;th&gt;)
            </p>
          </div>
          <div
            style={{
              padding: "1rem",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
            }}
          >
            <code>TableCell</code>
            <p style={{ fontSize: "0.875rem", margin: "0.5rem 0 0 0" }}>
              Data cell (&lt;td&gt;)
            </p>
          </div>
          <div
            style={{
              padding: "1rem",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
            }}
          >
            <code>TableCaption</code>
            <p style={{ fontSize: "0.875rem", margin: "0.5rem 0 0 0" }}>
              Table caption (&lt;caption&gt;)
            </p>
          </div>
        </div>

        <h3>Basic Usage</h3>
        <pre
          style={{
            padding: "1rem",
            backgroundColor: "#f3f4f6",
            borderRadius: "0.5rem",
            overflow: "auto",
            fontSize: "0.875rem",
          }}
        >
          {`import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table";

function MyTable() {
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell>{invoice.invoice}</TableCell>
            <TableCell>{invoice.paymentStatus}</TableCell>
            <TableCell>{invoice.paymentMethod}</TableCell>
            <TableCell className="text-right">{invoice.totalAmount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}`}
        </pre>

        <h3>Adding Sorting</h3>
        <pre
          style={{
            padding: "1rem",
            backgroundColor: "#f3f4f6",
            borderRadius: "0.5rem",
            overflow: "auto",
            fontSize: "0.875rem",
          }}
        >
          {`function SortableTable() {
  const [sortConfig, setSortConfig] = useState(null);

  const handleSort = (field) => {
    setSortConfig(prevConfig => {
      if (prevConfig?.field === field) {
        return prevConfig.direction === "asc" 
          ? { field, direction: "desc" }
          : null;
      }
      return { field, direction: "asc" };
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead 
            onClick={() => handleSort("name")}
            style={{ cursor: "pointer" }}
          >
            Name {getSortIcon("name")}
          </TableHead>
          {/* ... other headers */}
        </TableRow>
      </TableHeader>
      {/* ... rest of table */}
    </Table>
  );
}`}
        </pre>

        <h3>Adding Filtering</h3>
        <pre
          style={{
            padding: "1rem",
            backgroundColor: "#f3f4f6",
            borderRadius: "0.5rem",
            overflow: "auto",
            fontSize: "0.875rem",
          }}
        >
          {`function FilterableTable() {
  const [filter, setFilter] = useState("");
  
  const filteredData = useMemo(() => {
    if (!filter) return data;
    
    return data.filter(item =>
      item.name.toLowerCase().includes(filter.toLowerCase()) ||
      item.email.toLowerCase().includes(filter.toLowerCase())
    );
  }, [data, filter]);

  return (
    <div>
      <input
        type="text"
        placeholder="Filter..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}`}
        </pre>
      </section>

      {/* Best Practices */}
      <section>
        <h2>💡 Best Practices</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1rem",
          }}
        >
          <div
            style={{
              padding: "1rem",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
            }}
          >
            <h4>🎨 Styling</h4>
            <ul style={{ fontSize: "0.875rem", paddingLeft: "1.5rem" }}>
              <li>Use className props for custom styles</li>
              <li>Leverage CSS custom properties</li>
              <li>Consider dark mode support</li>
              <li>Use consistent spacing and typography</li>
            </ul>
          </div>

          <div
            style={{
              padding: "1rem",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
            }}
          >
            <h4>♿ Accessibility</h4>
            <ul style={{ fontSize: "0.875rem", paddingLeft: "1.5rem" }}>
              <li>Use TableCaption for screen readers</li>
              <li>Add proper ARIA labels</li>
              <li>Ensure keyboard navigation works</li>
              <li>Provide sort indicators for screen readers</li>
            </ul>
          </div>

          <div
            style={{
              padding: "1rem",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
            }}
          >
            <h4>⚡ Performance</h4>
            <ul style={{ fontSize: "0.875rem", paddingLeft: "1.5rem" }}>
              <li>Use React.memo for large datasets</li>
              <li>Implement virtualization if needed</li>
              <li>Consider pagination for performance</li>
              <li>Optimize re-renders with useMemo</li>
            </ul>
          </div>

          <div
            style={{
              padding: "1rem",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
            }}
          >
            <h4>🔧 Customization</h4>
            <ul style={{ fontSize: "0.875rem", paddingLeft: "1.5rem" }}>
              <li>Extend components with custom props</li>
              <li>Use render props for complex cells</li>
              <li>Compose with other UI components</li>
              <li>Build reusable table patterns</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
