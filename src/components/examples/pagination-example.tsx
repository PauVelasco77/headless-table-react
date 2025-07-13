import { useState } from "react";
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

/**
 * Example component demonstrating shadcn-style pagination usage
 *
 * This shows how to use the composable pagination components
 * similar to how shadcn/ui pagination works.
 */
export function PaginationExample() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const totalItems = 150; // Mock total items
  const totalPages = Math.ceil(totalItems / pageSize);

  // Generate page numbers with ellipsis
  const pages = generatePaginationRange(currentPage, totalPages, 1);

  const handlePageChange = (page: number): void => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePageSizeChange = (newPageSize: number): void => {
    setPageSize(newPageSize);
    // Reset to first page when changing page size
    setCurrentPage(1);
  };

  return (
    <div className="pagination-example">
      <h2>Shadcn-style Pagination Example</h2>

      {/* Mock content */}
      <div style={{ padding: "2rem", background: "#f9fafb", margin: "1rem 0" }}>
        <p>Current page: {currentPage}</p>
        <p>Page size: {pageSize}</p>
        <p>Total items: {totalItems}</p>
        <p>Total pages: {totalPages}</p>
      </div>

      {/* Pagination with info and controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
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
          options={[5, 10, 25, 50, 100]}
        />
      </div>

      {/* Simple pagination without page numbers */}
      <div style={{ marginTop: "2rem" }}>
        <h3>Simple Pagination (No page numbers)</h3>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
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
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Custom styled pagination */}
      <div style={{ marginTop: "2rem" }}>
        <h3>Custom Styled Pagination</h3>
        <Pagination className="custom-pagination">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="custom-nav-button"
              />
            </PaginationItem>

            {/* Show only a few pages around current */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = Math.max(1, currentPage - 2) + i;
              if (page > totalPages) return null;

              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={page === currentPage}
                    onClick={() => handlePageChange(page)}
                    className="custom-page-link"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="custom-nav-button"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
