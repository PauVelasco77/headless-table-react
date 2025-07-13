import { useState } from "react";
import {
  Search,
  SearchWrapper,
  SearchInput,
  SearchIcon,
  SearchClear,
  SearchResults,
} from "../search-input";

/**
 * Example component demonstrating shadcn-style search usage
 *
 * This shows how to use the composable search components
 * similar to how shadcn/ui components work.
 */
export function SearchExample() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Mock data
  const allItems = [
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

  const filteredItems = allItems.filter((item) =>
    item.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSearch = (value: string): void => {
    setSearchQuery(value);
    // Simulate loading
    if (value) {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 300);
    }
  };

  const handleClear = (): void => {
    setSearchQuery("");
    setIsLoading(false);
  };

  return (
    <div className="search-example">
      <h2>Shadcn-style Search Example</h2>

      {/* Basic Search */}
      <div style={{ marginBottom: "2rem" }}>
        <h3>Basic Search</h3>
        <Search>
          <SearchWrapper>
            <SearchIcon />
            <SearchInput
              placeholder="Search fruits..."
              value={searchQuery}
              onChange={handleSearch}
            />
            {searchQuery && <SearchClear onClick={handleClear} />}
          </SearchWrapper>
        </Search>

        <SearchResults
          total={allItems.length}
          filtered={filteredItems.length}
          searchQuery={searchQuery}
        />
      </div>

      {/* Search with Loading State */}
      <div style={{ marginBottom: "2rem" }}>
        <h3>Search with Loading State</h3>
        <Search>
          <SearchWrapper>
            <SearchIcon />
            <SearchInput
              placeholder="Search with loading..."
              value={searchQuery}
              onChange={handleSearch}
              disabled={isLoading}
            />
            {searchQuery && !isLoading && <SearchClear onClick={handleClear} />}
          </SearchWrapper>
        </Search>

        {isLoading && (
          <div style={{ padding: "0.5rem 0", color: "#6b7280" }}>
            Searching...
          </div>
        )}

        {!isLoading && (
          <SearchResults
            total={allItems.length}
            filtered={filteredItems.length}
            searchQuery={searchQuery}
          />
        )}
      </div>

      {/* Custom Styled Search */}
      <div style={{ marginBottom: "2rem" }}>
        <h3>Custom Styled Search</h3>
        <Search className="custom-search">
          <SearchWrapper className="custom-search-wrapper">
            <SearchIcon className="custom-search-icon" />
            <SearchInput
              placeholder="Custom search..."
              value={searchQuery}
              onChange={handleSearch}
              className="custom-search-input"
            />
            {searchQuery && (
              <SearchClear
                onClick={handleClear}
                className="custom-search-clear"
              />
            )}
          </SearchWrapper>
        </Search>
      </div>

      {/* Compact Search */}
      <div style={{ marginBottom: "2rem" }}>
        <h3>Compact Search (No Icons)</h3>
        <Search>
          <SearchWrapper>
            <SearchInput
              placeholder="Compact search..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </SearchWrapper>
        </Search>
      </div>

      {/* Left-aligned Search */}
      <div style={{ marginBottom: "2rem" }}>
        <h3>Left-aligned Search</h3>
        <Search style={{ justifyContent: "flex-start" }}>
          <SearchWrapper style={{ maxWidth: "250px" }}>
            <SearchIcon />
            <SearchInput
              placeholder="Left-aligned..."
              value={searchQuery}
              onChange={handleSearch}
            />
            {searchQuery && <SearchClear onClick={handleClear} />}
          </SearchWrapper>
        </Search>
      </div>

      {/* Results Display */}
      <div style={{ marginTop: "2rem" }}>
        <h3>Search Results</h3>
        {searchQuery && (
          <div
            style={{
              padding: "1rem",
              background: "#f9fafb",
              borderRadius: "0.5rem",
              border: "1px solid #e5e7eb",
            }}
          >
            {filteredItems.length > 0 ? (
              <ul style={{ margin: 0, paddingLeft: "1.5rem" }}>
                {filteredItems.map((item, index) => (
                  <li key={index} style={{ marginBottom: "0.25rem" }}>
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ margin: 0, color: "#6b7280" }}>
                No results found for "{searchQuery}"
              </p>
            )}
          </div>
        )}
      </div>

      {/* Usage Guide */}
      <div
        style={{
          marginTop: "3rem",
          padding: "1rem",
          background: "#f0f9ff",
          borderRadius: "0.5rem",
        }}
      >
        <h4>Usage Guide</h4>
        <p>The search components follow the shadcn composable pattern:</p>
        <ul>
          <li>
            <code>Search</code> - Main container
          </li>
          <li>
            <code>SearchWrapper</code> - Input wrapper with positioning
          </li>
          <li>
            <code>SearchInput</code> - The actual input field
          </li>
          <li>
            <code>SearchIcon</code> - Search icon (optional)
          </li>
          <li>
            <code>SearchClear</code> - Clear button (optional)
          </li>
          <li>
            <code>SearchResults</code> - Results information display
          </li>
        </ul>
      </div>
    </div>
  );
}
