import { useState } from "react";
import {
  Search,
  SearchWrapper,
  SearchInput,
  SearchIcon,
  SearchClear,
  SearchResults,
} from "../search-input";

// Simple mock data for demonstration
const mockItems = [
  "Apple",
  "Banana",
  "Cherry",
  "Date",
  "Elderberry",
  "Fig",
  "Grape",
  "Honeydew",
  "Kiwi",
  "Lemon",
  "Mango",
  "Orange",
  "Papaya",
  "Quince",
  "Raspberry",
];

/**
 * Usage guide for search components
 *
 * Demonstrates different ways to use the composable search components
 * similar to how shadcn/ui components work.
 */
export function SearchUsageGuide() {
  // Standalone search state
  const [searchQuery, setSearchQuery] = useState("");
  const filteredItems = mockItems.filter((item) =>
    item.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="search-usage-guide">
      <h1>Search Components Usage Guide</h1>

      <section style={{ marginBottom: "3rem" }}>
        <h2>1. Basic Search</h2>
        <p>Build your own search using composable components:</p>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <Search style={{ justifyContent: "flex-start" }}>
            <SearchWrapper style={{ maxWidth: "300px" }}>
              <SearchIcon />
              <SearchInput
                placeholder="Search items..."
                value={searchQuery}
                onChange={setSearchQuery}
              />
              {searchQuery && (
                <SearchClear onClick={() => setSearchQuery("")} />
              )}
            </SearchWrapper>
          </Search>

          <SearchResults
            total={mockItems.length}
            filtered={filteredItems.length}
            searchQuery={searchQuery}
          />
        </div>

        <div
          style={{
            maxHeight: "300px",
            overflowY: "auto",
            border: "1px solid #e5e7eb",
            borderRadius: "0.5rem",
            padding: "1rem",
          }}
        >
          <ul style={{ margin: 0, paddingLeft: "1.5rem" }}>
            {filteredItems.map((item, index) => (
              <li key={index} style={{ marginBottom: "0.25rem" }}>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            backgroundColor: "#f8fafc",
            borderRadius: "0.5rem",
            fontSize: "0.875rem",
          }}
        >
          <strong>Code:</strong>
          <pre style={{ marginTop: "0.5rem", overflow: "auto" }}>
            {`import {
  Search,
  SearchWrapper,
  SearchInput,
  SearchIcon,
  SearchClear,
  SearchResults,
} from "../search-input";

// In your component:
<Search>
  <SearchWrapper>
    <SearchIcon />
    <SearchInput
      placeholder="Search..."
      value={searchQuery}
      onChange={setSearchQuery}
    />
    {searchQuery && (
      <SearchClear onClick={() => setSearchQuery("")} />
    )}
  </SearchWrapper>
</Search>

<SearchResults
  total={totalItems}
  filtered={filteredItems}
  searchQuery={searchQuery}
/>`}
          </pre>
        </div>
      </section>

      <section style={{ marginBottom: "3rem" }}>
        <h2>2. Minimal Search</h2>
        <p>Simple search without icons:</p>

        <Search>
          <SearchWrapper>
            <SearchInput
              placeholder="Simple search..."
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </SearchWrapper>
        </Search>

        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            backgroundColor: "#f8fafc",
            borderRadius: "0.5rem",
            fontSize: "0.875rem",
          }}
        >
          <strong>Code:</strong>
          <pre style={{ marginTop: "0.5rem", overflow: "auto" }}>
            {`<Search>
  <SearchWrapper>
    <SearchInput
      placeholder="Simple search..."
      value={searchQuery}
      onChange={setSearchQuery}
    />
  </SearchWrapper>
</Search>`}
          </pre>
        </div>
      </section>

      <section style={{ marginBottom: "3rem" }}>
        <h2>3. Available Components</h2>

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
            <h4>
              <code>Search</code>
            </h4>
            <p>
              Main container component. Provides layout and styling context.
            </p>
            <ul style={{ fontSize: "0.875rem", margin: "0.5rem 0" }}>
              <li>
                <code>children</code> - React nodes
              </li>
              <li>
                <code>className</code> - Optional CSS class
              </li>
              <li>
                <code>style</code> - Optional inline styles
              </li>
            </ul>
          </div>

          <div
            style={{
              padding: "1rem",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
            }}
          >
            <h4>
              <code>SearchWrapper</code>
            </h4>
            <p>Wraps input and controls with relative positioning.</p>
            <ul style={{ fontSize: "0.875rem", margin: "0.5rem 0" }}>
              <li>
                <code>children</code> - React nodes
              </li>
              <li>
                <code>className</code> - Optional CSS class
              </li>
              <li>
                <code>style</code> - Optional inline styles
              </li>
            </ul>
          </div>

          <div
            style={{
              padding: "1rem",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
            }}
          >
            <h4>
              <code>SearchInput</code>
            </h4>
            <p>The actual input field with proper styling and accessibility.</p>
            <ul style={{ fontSize: "0.875rem", margin: "0.5rem 0" }}>
              <li>
                <code>placeholder</code> - Input placeholder
              </li>
              <li>
                <code>value</code> - Current value
              </li>
              <li>
                <code>onChange</code> - Change handler
              </li>
              <li>
                <code>disabled</code> - Disabled state
              </li>
              <li>
                <code>className</code> - Optional CSS class
              </li>
            </ul>
          </div>

          <div
            style={{
              padding: "1rem",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
            }}
          >
            <h4>
              <code>SearchIcon</code>
            </h4>
            <p>Search icon positioned inside the input.</p>
            <ul style={{ fontSize: "0.875rem", margin: "0.5rem 0" }}>
              <li>
                <code>className</code> - Optional CSS class
              </li>
            </ul>
          </div>

          <div
            style={{
              padding: "1rem",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
            }}
          >
            <h4>
              <code>SearchClear</code>
            </h4>
            <p>Clear button to reset the search.</p>
            <ul style={{ fontSize: "0.875rem", margin: "0.5rem 0" }}>
              <li>
                <code>onClick</code> - Click handler
              </li>
              <li>
                <code>disabled</code> - Disabled state
              </li>
              <li>
                <code>className</code> - Optional CSS class
              </li>
            </ul>
          </div>

          <div
            style={{
              padding: "1rem",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
            }}
          >
            <h4>
              <code>SearchResults</code>
            </h4>
            <p>Displays search results information.</p>
            <ul style={{ fontSize: "0.875rem", margin: "0.5rem 0" }}>
              <li>
                <code>total</code> - Total items count
              </li>
              <li>
                <code>filtered</code> - Filtered items count
              </li>
              <li>
                <code>searchQuery</code> - Current search query
              </li>
              <li>
                <code>className</code> - Optional CSS class
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2>4. Styling & Customization</h2>
        <p>
          All components accept <code>className</code> props for custom styling.
          The CSS classes follow a consistent naming pattern:
        </p>

        <ul>
          <li>
            <code>.search</code> - Main container
          </li>
          <li>
            <code>.search-wrapper</code> - Input wrapper
          </li>
          <li>
            <code>.search-input</code> - Input field
          </li>
          <li>
            <code>.search-icon</code> - Search icon
          </li>
          <li>
            <code>.search-clear</code> - Clear button
          </li>
          <li>
            <code>.search-results</code> - Results info
          </li>
        </ul>

        <p>
          The components also support dark mode and responsive design out of the
          box.
        </p>

        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            backgroundColor: "#f0f9ff",
            borderRadius: "0.5rem",
            fontSize: "0.875rem",
          }}
        >
          <h4>Table Integration</h4>
          <p>
            For table integration, use the <code>TableSearchInput</code>{" "}
            component:
          </p>
          <pre style={{ marginTop: "0.5rem", overflow: "auto" }}>
            {`import { TableSearchInput } from "../search-input";

// In your component:
<TableSearchInput state={state} actions={actions} />`}
          </pre>
        </div>
      </section>
    </div>
  );
}
