import { useState, useEffect } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  PaginationInfo,
  PaginationSelect,
  generatePaginationRange,
} from "../pagination";

// Mock data for examples
const generateMockData = (total: number) =>
  Array.from({ length: total }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    description: `Description for item ${i + 1}`,
    category: ["Electronics", "Books", "Clothing", "Home"][i % 4],
  }));

/**
 * Comprehensive pagination usage guide with multiple examples
 */
export function PaginationUsageGuide() {
  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>Pagination Usage Guide</h1>
      <p>
        This guide shows different ways to implement pagination using our
        shadcn-style components.
      </p>

      <BasicPaginationExample />
      <TableWithPaginationExample />
      <SimplePaginationExample />
      <CustomStyledPaginationExample />
      <ServerSidePaginationExample />
      <URLPaginationExample />
    </div>
  );
}

/**
 * Example 1: Basic pagination with page numbers
 */
function BasicPaginationExample() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalItems = 100;
  const pageSize = 10;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Generate page numbers with ellipsis
  const pages = generatePaginationRange(currentPage, totalPages, 1);

  return (
    <section
      style={{
        marginBottom: "3rem",
        padding: "1.5rem",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
      }}
    >
      <h2>1. Basic Pagination</h2>
      <p>
        Standard pagination with page numbers, previous/next buttons, and
        ellipsis for large page counts.
      </p>

      <div
        style={{
          marginBottom: "1rem",
          padding: "1rem",
          backgroundColor: "#f9fafb",
          borderRadius: "4px",
        }}
      >
        <p>
          <strong>Current Page:</strong> {currentPage}
        </p>
        <p>
          <strong>Total Items:</strong> {totalItems}
        </p>
        <p>
          <strong>Items per Page:</strong> {pageSize}
        </p>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
            />
          </PaginationItem>

          {pages.map((page, index) => (
            <PaginationItem key={index}>
              {page === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  isActive={page === currentPage}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage >= totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <details style={{ marginTop: "1rem" }}>
        <summary style={{ cursor: "pointer", fontWeight: "500" }}>
          View Code
        </summary>
        <pre
          style={{
            backgroundColor: "#f3f4f6",
            padding: "1rem",
            borderRadius: "4px",
            overflow: "auto",
            fontSize: "0.875rem",
          }}
        >
          {`const [currentPage, setCurrentPage] = useState(1);
const totalPages = Math.ceil(totalItems / pageSize);
const pages = generatePaginationRange(currentPage, totalPages, 1);

<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        disabled={currentPage <= 1}
      />
    </PaginationItem>

    {pages.map((page, index) => (
      <PaginationItem key={index}>
        {page === 'ellipsis' ? (
          <PaginationEllipsis />
        ) : (
          <PaginationLink
            isActive={page === currentPage}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </PaginationLink>
        )}
      </PaginationItem>
    ))}

    <PaginationItem>
      <PaginationNext
        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage >= totalPages}
      />
    </PaginationItem>
  </PaginationContent>
</Pagination>`}
        </pre>
      </details>
    </section>
  );
}

/**
 * Example 2: Complete table with pagination, info, and page size selector
 */
function TableWithPaginationExample() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const allData = generateMockData(50);
  const totalItems = allData.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Calculate current page data
  const startIndex = (currentPage - 1) * pageSize;
  const currentData = allData.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page
  };

  const pages = generatePaginationRange(currentPage, totalPages, 1);

  return (
    <section
      style={{
        marginBottom: "3rem",
        padding: "1.5rem",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
      }}
    >
      <h2>2. Table with Complete Pagination</h2>
      <p>
        Full-featured table with pagination info, page size selector, and data
        display.
      </p>

      {/* Data Table */}
      <div
        style={{
          marginBottom: "1rem",
          border: "1px solid #e5e7eb",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ backgroundColor: "#f9fafb" }}>
            <tr>
              <th
                style={{
                  padding: "0.75rem",
                  textAlign: "left",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                ID
              </th>
              <th
                style={{
                  padding: "0.75rem",
                  textAlign: "left",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                Name
              </th>
              <th
                style={{
                  padding: "0.75rem",
                  textAlign: "left",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                Category
              </th>
              <th
                style={{
                  padding: "0.75rem",
                  textAlign: "left",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, index) => (
              <tr
                key={item.id}
                style={{
                  backgroundColor: index % 2 === 0 ? "white" : "#f9fafb",
                }}
              >
                <td
                  style={{
                    padding: "0.75rem",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {item.id}
                </td>
                <td
                  style={{
                    padding: "0.75rem",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {item.name}
                </td>
                <td
                  style={{
                    padding: "0.75rem",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {item.category}
                </td>
                <td
                  style={{
                    padding: "0.75rem",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {item.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Complete Pagination Layout */}
      <div className="table-pagination">
        <PaginationInfo
          current={currentPage}
          pageSize={pageSize}
          total={totalItems}
        />

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
              />
            </PaginationItem>

            {pages.map((page, index) => (
              <PaginationItem key={index}>
                {page === "ellipsis" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    isActive={page === currentPage}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        <PaginationSelect
          value={pageSize}
          onValueChange={handlePageSizeChange}
          options={[5, 10, 25, 50]}
        />
      </div>

      <details style={{ marginTop: "1rem" }}>
        <summary style={{ cursor: "pointer", fontWeight: "500" }}>
          View Code
        </summary>
        <pre
          style={{
            backgroundColor: "#f3f4f6",
            padding: "1rem",
            borderRadius: "4px",
            overflow: "auto",
            fontSize: "0.875rem",
          }}
        >
          {`// Calculate current page data
const startIndex = (currentPage - 1) * pageSize;
const currentData = allData.slice(startIndex, startIndex + pageSize);

// Complete pagination layout
<div className="table-pagination">
  <PaginationInfo 
    current={currentPage} 
    pageSize={pageSize} 
    total={totalItems} 
  />

  <Pagination>
    <PaginationContent>
      {/* Previous button */}
      <PaginationItem>
        <PaginationPrevious
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        />
      </PaginationItem>

      {/* Page numbers with ellipsis */}
      {pages.map((page, index) => (
        <PaginationItem key={index}>
          {page === 'ellipsis' ? (
            <PaginationEllipsis />
          ) : (
            <PaginationLink
              isActive={page === currentPage}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </PaginationLink>
          )}
        </PaginationItem>
      ))}

      {/* Next button */}
      <PaginationItem>
        <PaginationNext
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        />
      </PaginationItem>
    </PaginationContent>
  </Pagination>

  <PaginationSelect
    value={pageSize}
    onValueChange={handlePageSizeChange}
    options={[5, 10, 25, 50]}
  />
</div>`}
        </pre>
      </details>
    </section>
  );
}

/**
 * Example 3: Simple pagination (just prev/next with page info)
 */
function SimplePaginationExample() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 15;

  return (
    <section
      style={{
        marginBottom: "3rem",
        padding: "1.5rem",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
      }}
    >
      <h2>3. Simple Pagination</h2>
      <p>
        Minimal pagination with just previous/next buttons and page information.
      </p>

      <div
        style={{
          marginBottom: "1rem",
          padding: "1rem",
          backgroundColor: "#f9fafb",
          borderRadius: "4px",
          textAlign: "center",
        }}
      >
        <p>Content for page {currentPage}</p>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
            />
          </PaginationItem>

          <PaginationItem>
            <span
              style={{
                padding: "0.5rem 1rem",
                fontSize: "0.875rem",
                color: "#6b7280",
              }}
            >
              Page {currentPage} of {totalPages}
            </span>
          </PaginationItem>

          <PaginationItem>
            <PaginationNext
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage >= totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <details style={{ marginTop: "1rem" }}>
        <summary style={{ cursor: "pointer", fontWeight: "500" }}>
          View Code
        </summary>
        <pre
          style={{
            backgroundColor: "#f3f4f6",
            padding: "1rem",
            borderRadius: "4px",
            overflow: "auto",
            fontSize: "0.875rem",
          }}
        >
          {`<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        disabled={currentPage <= 1}
      />
    </PaginationItem>
    
    <PaginationItem>
      <span style={{ padding: "0.5rem 1rem", fontSize: "0.875rem", color: "#6b7280" }}>
        Page {currentPage} of {totalPages}
      </span>
    </PaginationItem>

    <PaginationItem>
      <PaginationNext
        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage >= totalPages}
      />
    </PaginationItem>
  </PaginationContent>
</Pagination>`}
        </pre>
      </details>
    </section>
  );
}

/**
 * Example 4: Custom styled pagination
 */
function CustomStyledPaginationExample() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 8;

  // Show only current page and adjacent pages
  const getVisiblePages = () => {
    const pages = [];
    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <section
      style={{
        marginBottom: "3rem",
        padding: "1.5rem",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
      }}
    >
      <h2>4. Custom Styled Pagination</h2>
      <p>
        Customized pagination with limited visible pages and custom styling.
      </p>

      <div
        style={{
          marginBottom: "1rem",
          padding: "1rem",
          backgroundColor: "#f9fafb",
          borderRadius: "4px",
          textAlign: "center",
        }}
      >
        <p>Custom content for page {currentPage}</p>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
              className="custom-nav-button"
            />
          </PaginationItem>

          {/* Show first page if not visible */}
          {currentPage > 2 && (
            <>
              <PaginationItem>
                <PaginationLink onClick={() => setCurrentPage(1)}>
                  1
                </PaginationLink>
              </PaginationItem>
              {currentPage > 3 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
            </>
          )}

          {/* Show visible pages */}
          {getVisiblePages().map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={page === currentPage}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* Show last page if not visible */}
          {currentPage < totalPages - 1 && (
            <>
              {currentPage < totalPages - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink onClick={() => setCurrentPage(totalPages)}>
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage >= totalPages}
              className="custom-nav-button"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <details style={{ marginTop: "1rem" }}>
        <summary style={{ cursor: "pointer", fontWeight: "500" }}>
          View Code
        </summary>
        <pre
          style={{
            backgroundColor: "#f3f4f6",
            padding: "1rem",
            borderRadius: "4px",
            overflow: "auto",
            fontSize: "0.875rem",
          }}
        >
          {`// Custom logic for visible pages
const getVisiblePages = () => {
  const pages = [];
  const start = Math.max(1, currentPage - 1);
  const end = Math.min(totalPages, currentPage + 1);
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
};

<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious /* ... */ />
    </PaginationItem>

    {/* Show first page if not visible */}
    {currentPage > 2 && (
      <>
        <PaginationItem>
          <PaginationLink onClick={() => setCurrentPage(1)}>1</PaginationLink>
        </PaginationItem>
        {currentPage > 3 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
      </>
    )}

    {/* Show visible pages */}
    {getVisiblePages().map((page) => (
      <PaginationItem key={page}>
        <PaginationLink
          isActive={page === currentPage}
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </PaginationLink>
      </PaginationItem>
    ))}

    {/* Show last page if not visible */}
    {currentPage < totalPages - 1 && (
      <>
        {currentPage < totalPages - 2 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationLink onClick={() => setCurrentPage(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      </>
    )}

    <PaginationItem>
      <PaginationNext /* ... */ />
    </PaginationItem>
  </PaginationContent>
</Pagination>`}
        </pre>
      </details>
    </section>
  );
}

/**
 * Example 5: Server-side pagination simulation
 */
function ServerSidePaginationExample() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<
    Array<{
      id: number;
      name: string;
      status: string;
      date: string;
    }>
  >([]);
  const totalItems = 200; // This would come from your API
  const totalPages = Math.ceil(totalItems / pageSize);

  // Simulate API call
  const fetchData = async (page: number, size: number) => {
    setLoading(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Generate mock data for the current page
    const startIndex = (page - 1) * size;
    const mockData = Array.from({ length: size }, (_, i) => ({
      id: startIndex + i + 1,
      name: `Server Item ${startIndex + i + 1}`,
      status: ["Active", "Inactive", "Pending"][Math.floor(Math.random() * 3)],
      date: new Date(2024, 0, 1 + startIndex + i).toLocaleDateString(),
    }));

    setData(mockData);
    setLoading(false);
  };

  // Load data when page or page size changes
  useState(() => {
    fetchData(currentPage, pageSize);
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchData(page, pageSize);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
    fetchData(1, newPageSize);
  };

  const pages = generatePaginationRange(currentPage, totalPages, 2);

  return (
    <section
      style={{
        marginBottom: "3rem",
        padding: "1.5rem",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
      }}
    >
      <h2>5. Server-Side Pagination</h2>
      <p>
        Pagination that fetches data from a server/API for each page change.
      </p>

      {loading ? (
        <div style={{ padding: "2rem", textAlign: "center", color: "#6b7280" }}>
          Loading...
        </div>
      ) : (
        <div
          style={{
            marginBottom: "1rem",
            border: "1px solid #e5e7eb",
            borderRadius: "4px",
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ backgroundColor: "#f9fafb" }}>
              <tr>
                <th
                  style={{
                    padding: "0.75rem",
                    textAlign: "left",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  ID
                </th>
                <th
                  style={{
                    padding: "0.75rem",
                    textAlign: "left",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  Name
                </th>
                <th
                  style={{
                    padding: "0.75rem",
                    textAlign: "left",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    padding: "0.75rem",
                    textAlign: "left",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr
                  key={item.id}
                  style={{
                    backgroundColor: index % 2 === 0 ? "white" : "#f9fafb",
                  }}
                >
                  <td
                    style={{
                      padding: "0.75rem",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    {item.id}
                  </td>
                  <td
                    style={{
                      padding: "0.75rem",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    {item.name}
                  </td>
                  <td
                    style={{
                      padding: "0.75rem",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    <span
                      style={{
                        padding: "0.25rem 0.5rem",
                        borderRadius: "4px",
                        fontSize: "0.75rem",
                        backgroundColor:
                          item.status === "Active"
                            ? "#dcfce7"
                            : item.status === "Inactive"
                              ? "#fee2e2"
                              : "#fef3c7",
                        color:
                          item.status === "Active"
                            ? "#166534"
                            : item.status === "Inactive"
                              ? "#991b1b"
                              : "#92400e",
                      }}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "0.75rem",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    {item.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="table-pagination">
        <PaginationInfo
          current={currentPage}
          pageSize={pageSize}
          total={totalItems}
        />

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1 || loading}
              />
            </PaginationItem>

            {pages.map((page, index) => (
              <PaginationItem key={index}>
                {page === "ellipsis" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    isActive={page === currentPage}
                    onClick={() => handlePageChange(page)}
                    disabled={loading}
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages || loading}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        <PaginationSelect
          value={pageSize}
          onValueChange={handlePageSizeChange}
          options={[5, 10, 25, 50]}
        />
      </div>

      <details style={{ marginTop: "1rem" }}>
        <summary style={{ cursor: "pointer", fontWeight: "500" }}>
          View Code
        </summary>
        <pre
          style={{
            backgroundColor: "#f3f4f6",
            padding: "1rem",
            borderRadius: "4px",
            overflow: "auto",
            fontSize: "0.875rem",
          }}
        >
          {`const [currentPage, setCurrentPage] = useState(1);
const [pageSize, setPageSize] = useState(10);
const [loading, setLoading] = useState(false);
const [data, setData] = useState([]);

// Simulate API call
const fetchData = async (page: number, size: number) => {
  setLoading(true);
  
  try {
    // Replace with your actual API call
    const response = await fetch(\`/api/data?page=\${page}&size=\${size}\`);
    const result = await response.json();
    setData(result.data);
  } catch (error) {
    console.error('Failed to fetch data:', error);
  } finally {
    setLoading(false);
  }
};

const handlePageChange = (page: number) => {
  setCurrentPage(page);
  fetchData(page, pageSize);
};

const handlePageSizeChange = (newPageSize: number) => {
  setPageSize(newPageSize);
  setCurrentPage(1);
  fetchData(1, newPageSize);
};

// Disable pagination controls while loading
<PaginationPrevious
  onClick={() => handlePageChange(currentPage - 1)}
  disabled={currentPage <= 1 || loading}
/>

<PaginationLink
  isActive={page === currentPage}
  onClick={() => handlePageChange(page)}
  disabled={loading}
>
  {page}
</PaginationLink>`}
        </pre>
      </details>
    </section>
  );
}

/**
 * Example 6: Pagination with URL search parameters
 */
function URLPaginationExample() {
  // Get initial values from URL search params
  const getInitialPage = (): number => {
    if (typeof window === "undefined") return 1;
    const params = new URLSearchParams(window.location.search);
    const page = parseInt(params.get("page") || "1");
    return page > 0 ? page : 1;
  };

  const getInitialPageSize = (): number => {
    if (typeof window === "undefined") return 10;
    const params = new URLSearchParams(window.location.search);
    const size = parseInt(params.get("size") || "10");
    return [5, 10, 25, 50].includes(size) ? size : 10;
  };

  const [currentPage, setCurrentPage] = useState(getInitialPage);
  const [pageSize, setPageSize] = useState(getInitialPageSize);
  const allData = generateMockData(75);
  const totalItems = allData.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Update URL when pagination changes
  const updateURL = (page: number, size: number) => {
    if (typeof window === "undefined") return;

    const url = new URL(window.location.href);
    url.searchParams.set("page", page.toString());
    url.searchParams.set("size", size.toString());

    // Update URL without triggering a page reload
    window.history.replaceState({}, "", url.toString());
  };

  // Calculate current page data
  const startIndex = (currentPage - 1) * pageSize;
  const currentData = allData.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL(page, pageSize);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    const newTotalPages = Math.ceil(totalItems / newPageSize);
    const newPage = currentPage > newTotalPages ? 1 : currentPage;

    setPageSize(newPageSize);
    setCurrentPage(newPage);
    updateURL(newPage, newPageSize);
  };

  // Listen for browser back/forward navigation
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handlePopState = () => {
      setCurrentPage(getInitialPage());
      setPageSize(getInitialPageSize());
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const pages = generatePaginationRange(currentPage, totalPages, 1);

  return (
    <section
      style={{
        marginBottom: "3rem",
        padding: "1.5rem",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
      }}
    >
      <h2>6. URL-Persisted Pagination</h2>
      <p>
        Pagination state is saved in URL search parameters. Try changing pages
        and refreshing the browser - your pagination state will be preserved!
      </p>

      <div
        style={{
          marginBottom: "1rem",
          padding: "1rem",
          backgroundColor: "#e0f2fe",
          borderRadius: "4px",
          border: "1px solid #0891b2",
        }}
      >
        <p style={{ margin: 0, fontSize: "0.875rem", color: "#0c4a6e" }}>
          <strong>💡 Try this:</strong> Change the page or page size, then
          refresh your browser. The pagination state will be restored from the
          URL!
        </p>
        <p
          style={{
            margin: "0.5rem 0 0 0",
            fontSize: "0.75rem",
            color: "#0369a1",
          }}
        >
          Current URL:{" "}
          <code
            style={{
              backgroundColor: "white",
              padding: "0.125rem 0.25rem",
              borderRadius: "2px",
            }}
          >
            {typeof window !== "undefined"
              ? window.location.search || "(no params)"
              : "(no params)"}
          </code>
        </p>
      </div>

      {/* Data Table */}
      <div
        style={{
          marginBottom: "1rem",
          border: "1px solid #e5e7eb",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ backgroundColor: "#f9fafb" }}>
            <tr>
              <th
                style={{
                  padding: "0.75rem",
                  textAlign: "left",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                ID
              </th>
              <th
                style={{
                  padding: "0.75rem",
                  textAlign: "left",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                Name
              </th>
              <th
                style={{
                  padding: "0.75rem",
                  textAlign: "left",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                Category
              </th>
              <th
                style={{
                  padding: "0.75rem",
                  textAlign: "left",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, index) => (
              <tr
                key={item.id}
                style={{
                  backgroundColor: index % 2 === 0 ? "white" : "#f9fafb",
                }}
              >
                <td
                  style={{
                    padding: "0.75rem",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {item.id}
                </td>
                <td
                  style={{
                    padding: "0.75rem",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {item.name}
                </td>
                <td
                  style={{
                    padding: "0.75rem",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {item.category}
                </td>
                <td
                  style={{
                    padding: "0.75rem",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {item.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Layout */}
      <div className="table-pagination">
        <PaginationInfo
          current={currentPage}
          pageSize={pageSize}
          total={totalItems}
        />

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
              />
            </PaginationItem>

            {pages.map((page, index) => (
              <PaginationItem key={index}>
                {page === "ellipsis" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    isActive={page === currentPage}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        <PaginationSelect
          value={pageSize}
          onValueChange={handlePageSizeChange}
          options={[5, 10, 25, 50]}
        />
      </div>

      <details style={{ marginTop: "1rem" }}>
        <summary style={{ cursor: "pointer", fontWeight: "500" }}>
          View Code
        </summary>
        <pre
          style={{
            backgroundColor: "#f3f4f6",
            padding: "1rem",
            borderRadius: "4px",
            overflow: "auto",
            fontSize: "0.875rem",
          }}
        >
          {`// Get initial values from URL search params
const getInitialPage = (): number => {
  if (typeof window === 'undefined') return 1;
  const params = new URLSearchParams(window.location.search);
  const page = parseInt(params.get('page') || '1');
  return page > 0 ? page : 1;
};

const getInitialPageSize = (): number => {
  if (typeof window === 'undefined') return 10;
  const params = new URLSearchParams(window.location.search);
  const size = parseInt(params.get('size') || '10');
  return [5, 10, 25, 50].includes(size) ? size : 10;
};

const [currentPage, setCurrentPage] = useState(getInitialPage);
const [pageSize, setPageSize] = useState(getInitialPageSize);

// Update URL when pagination changes
const updateURL = (page: number, size: number) => {
  if (typeof window === 'undefined') return;
  
  const url = new URL(window.location.href);
  url.searchParams.set('page', page.toString());
  url.searchParams.set('size', size.toString());
  
  // Update URL without triggering a page reload
  window.history.replaceState({}, '', url.toString());
};

const handlePageChange = (page: number) => {
  setCurrentPage(page);
  updateURL(page, pageSize);
};

const handlePageSizeChange = (newPageSize: number) => {
  const newTotalPages = Math.ceil(totalItems / newPageSize);
  const newPage = currentPage > newTotalPages ? 1 : currentPage;
  
  setPageSize(newPageSize);
  setCurrentPage(newPage);
  updateURL(newPage, newPageSize);
};

  // Listen for browser back/forward navigation
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handlePopState = () => {
      setCurrentPage(getInitialPage());
      setPageSize(getInitialPageSize());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

// Usage with React Router (if using):
// import { useSearchParams } from 'react-router-dom';
// 
// const [searchParams, setSearchParams] = useSearchParams();
// const currentPage = parseInt(searchParams.get('page') || '1');
// const pageSize = parseInt(searchParams.get('size') || '10');
// 
// const handlePageChange = (page: number) => {
//   setSearchParams(prev => {
//     prev.set('page', page.toString());
//     return prev;
//   });
// };`}
        </pre>
      </details>
    </section>
  );
}
