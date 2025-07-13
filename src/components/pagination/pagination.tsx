import { TableActions, TableState } from "../table";

/**
 * Props for the Pagination component
 * @template TData - The type of data being paginated
 */
interface PaginationProps<TData extends object> {
  /** Pagination state containing current page, page size, and total count */
  pagination: NonNullable<TableState<TData>["pagination"]>;
  /** Actions object containing methods to control pagination state */
  actions: TableActions;
}

/**
 * Pagination component that provides navigation controls for paginated data
 *
 * Displays current page information, navigation buttons, and page size selector.
 * Handles user interactions to change pages and adjust the number of items per page.
 *
 * @template TData - The type of data being paginated
 * @param props - The pagination props containing state and actions
 * @returns JSX element with pagination controls
 */
export function Pagination<TData extends object>({
  pagination,
  actions,
}: PaginationProps<TData>) {
  /**
   * Generates pagination information text
   * @returns Formatted string showing current page range and total items
   */
  const getPaginationInfo = (): string => {
    const start = (pagination.page - 1) * pagination.pageSize + 1;
    const end = Math.min(
      pagination.page * pagination.pageSize,
      pagination.total,
    );

    return `Showing ${start}-${end} of ${pagination.total} results`;
  };

  /**
   * Calculates the total number of pages
   * @returns Total page count based on data size and page size
   */
  const getTotalPages = (): number => {
    if (!pagination) return 1;
    return Math.ceil(pagination.total / pagination.pageSize);
  };

  return (
    <div className="table-pagination">
      <div className="pagination-info">{getPaginationInfo()}</div>

      <div className="pagination-controls">
        <button
          onClick={() => actions.setPage(pagination.page - 1)}
          disabled={pagination.page <= 1}
          className="pagination-button"
        >
          Previous
        </button>

        <span className="pagination-current">
          Page {pagination.page} of {getTotalPages()}
        </span>

        <button
          onClick={() => actions.setPage(pagination!.page + 1)}
          disabled={pagination.page >= getTotalPages()}
          className="pagination-button"
        >
          Next
        </button>
      </div>

      <div className="pagination-size">
        <label>
          Rows per page:
          <select
            value={pagination.pageSize}
            onChange={(e) => actions.setPageSize(Number(e.target.value))}
            className="pagination-select"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </label>
      </div>
    </div>
  );
}
