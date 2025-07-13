/**
 * Props for the main Pagination wrapper component
 */
export interface PaginationProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Props for PaginationContent component
 */
export interface PaginationContentProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Props for PaginationItem component
 */
export interface PaginationItemProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Props for PaginationLink component
 */
export interface PaginationLinkProps {
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Props for PaginationPrevious component
 */
export interface PaginationPreviousProps {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Props for PaginationNext component
 */
export interface PaginationNextProps {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Props for PaginationEllipsis component
 */
export interface PaginationEllipsisProps {
  className?: string;
}

/**
 * Props for PaginationInfo component
 */
export interface PaginationInfoProps {
  current: number;
  pageSize: number;
  total: number;
  className?: string;
}

/**
 * Props for PaginationSelect component
 */
export interface PaginationSelectProps {
  value: number;
  onValueChange: (value: number) => void;
  options?: number[];
  className?: string;
}

/**
 * Main Pagination wrapper component
 *
 * Provides the container for pagination components following shadcn's composable pattern.
 *
 * @param props - The pagination wrapper props
 * @returns JSX element with pagination wrapper
 */
export function Pagination({ children, className = "" }: PaginationProps) {
  return (
    <nav
      className={`pagination ${className}`}
      role="navigation"
      aria-label="pagination"
    >
      {children}
    </nav>
  );
}

/**
 * PaginationContent component
 *
 * Contains the main pagination controls and items.
 *
 * @param props - The pagination content props
 * @returns JSX element with pagination content wrapper
 */
export function PaginationContent({
  children,
  className = "",
}: PaginationContentProps) {
  return <div className={`pagination-content ${className}`}>{children}</div>;
}

/**
 * PaginationItem component
 *
 * Wrapper for individual pagination items.
 *
 * @param props - The pagination item props
 * @returns JSX element with pagination item wrapper
 */
export function PaginationItem({
  children,
  className = "",
}: PaginationItemProps) {
  return <div className={`pagination-item ${className}`}>{children}</div>;
}

/**
 * PaginationLink component
 *
 * Clickable pagination link for page numbers.
 *
 * @param props - The pagination link props
 * @returns JSX element with pagination link
 */
export function PaginationLink({
  children,
  isActive = false,
  onClick,
  disabled = false,
  className = "",
}: PaginationLinkProps) {
  return (
    <button
      className={`pagination-link ${isActive ? "active" : ""} ${disabled ? "disabled" : ""} ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-current={isActive ? "page" : undefined}
    >
      {children}
    </button>
  );
}

/**
 * PaginationPrevious component
 *
 * Previous page navigation button.
 *
 * @param props - The pagination previous props
 * @returns JSX element with previous button
 */
export function PaginationPrevious({
  onClick,
  disabled = false,
  className = "",
}: PaginationPreviousProps) {
  return (
    <button
      className={`pagination-previous ${disabled ? "disabled" : ""} ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-label="Go to previous page"
    >
      Previous
    </button>
  );
}

/**
 * PaginationNext component
 *
 * Next page navigation button.
 *
 * @param props - The pagination next props
 * @returns JSX element with next button
 */
export function PaginationNext({
  onClick,
  disabled = false,
  className = "",
}: PaginationNextProps) {
  return (
    <button
      className={`pagination-next ${disabled ? "disabled" : ""} ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-label="Go to next page"
    >
      Next
    </button>
  );
}

/**
 * PaginationEllipsis component
 *
 * Displays ellipsis (...) for truncated page ranges.
 *
 * @param props - The pagination ellipsis props
 * @returns JSX element with ellipsis
 */
export function PaginationEllipsis({
  className = "",
}: PaginationEllipsisProps) {
  return (
    <span className={`pagination-ellipsis ${className}`} aria-hidden="true">
      ...
    </span>
  );
}

/**
 * PaginationInfo component
 *
 * Displays pagination information text (e.g., "Showing 1-10 of 100 results").
 *
 * @param props - The pagination info props
 * @returns JSX element with pagination info
 */
export function PaginationInfo({
  current,
  pageSize,
  total,
  className = "",
}: PaginationInfoProps) {
  const start = (current - 1) * pageSize + 1;
  const end = Math.min(current * pageSize, total);

  return (
    <div className={`pagination-info ${className}`}>
      Showing {start}-{end} of {total} results
    </div>
  );
}

/**
 * PaginationSelect component
 *
 * Dropdown to select page size.
 *
 * @param props - The pagination select props
 * @returns JSX element with page size selector
 */
export function PaginationSelect({
  value,
  onValueChange,
  options = [5, 10, 25, 50],
  className = "",
}: PaginationSelectProps) {
  return (
    <div className={`pagination-select-wrapper ${className}`}>
      <label>
        Rows per page:
        <select
          value={value}
          onChange={(e) => onValueChange(Number(e.target.value))}
          className="pagination-select"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
