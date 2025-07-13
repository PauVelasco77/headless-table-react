import React from "react";
import type { TableActions, TableState } from "../table";

/**
 * Props for the main Search wrapper component
 */
export interface SearchProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Props for SearchInput component
 */
export interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

/**
 * Props for SearchWrapper component
 */
export interface SearchWrapperProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Props for SearchClear component
 */
export interface SearchClearProps {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Props for SearchIcon component
 */
export interface SearchIconProps {
  className?: string;
}

/**
 * Props for SearchResults component
 */
export interface SearchResultsProps {
  total: number;
  filtered: number;
  searchQuery: string;
  className?: string;
}

/**
 * Props for the table-integrated SearchInput component
 */
export interface TableSearchInputProps<TData extends object> {
  state: TableState<TData>;
  actions: TableActions;
}

/**
 * Main Search wrapper component
 *
 * Provides the container for search components following shadcn's composable pattern.
 *
 * @param props - The search wrapper props
 * @returns JSX element with search wrapper
 */
export function Search({ children, className = "", style }: SearchProps) {
  return (
    <div className={`search ${className}`} style={style} role="search">
      {children}
    </div>
  );
}

/**
 * SearchWrapper component
 *
 * Contains the main search input and related controls.
 *
 * @param props - The search wrapper props
 * @returns JSX element with search wrapper
 */
export function SearchWrapper({
  children,
  className = "",
  style,
}: SearchWrapperProps) {
  // Check if children include SearchIcon or SearchClear components
  const hasIcon = React.Children.toArray(children).some(
    (child) => React.isValidElement(child) && child.type === SearchIcon,
  );
  const hasClear = React.Children.toArray(children).some(
    (child) => React.isValidElement(child) && child.type === SearchClear,
  );

  const wrapperClasses = [
    "search-wrapper",
    hasIcon && "has-icon",
    hasClear && "has-clear",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClasses} style={style}>
      {children}
    </div>
  );
}

/**
 * SearchInput component
 *
 * The main search input field.
 *
 * @param props - The search input props
 * @returns JSX element with search input
 */
export function SearchInput({
  placeholder = "Search...",
  value = "",
  onChange,
  className = "",
  disabled = false,
}: SearchInputProps) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className={`search-input ${disabled ? "disabled" : ""} ${className}`}
      disabled={disabled}
      aria-label="Search"
    />
  );
}

/**
 * SearchIcon component
 *
 * Displays a search icon.
 *
 * @param props - The search icon props
 * @returns JSX element with search icon
 */
export function SearchIcon({ className = "" }: SearchIconProps) {
  return (
    <svg
      className={`search-icon ${className}`}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

/**
 * SearchClear component
 *
 * Clear button for search input.
 *
 * @param props - The search clear props
 * @returns JSX element with clear button
 */
export function SearchClear({
  onClick,
  disabled = false,
  className = "",
}: SearchClearProps) {
  return (
    <button
      type="button"
      className={`search-clear ${disabled ? "disabled" : ""} ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-label="Clear search"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 6L6 18" />
        <path d="M6 6l12 12" />
      </svg>
    </button>
  );
}

/**
 * SearchResults component
 *
 * Displays search results information.
 *
 * @param props - The search results props
 * @returns JSX element with search results info
 */
export function SearchResults({
  total,
  filtered,
  searchQuery,
  className = "",
}: SearchResultsProps) {
  if (!searchQuery) {
    return (
      <div className={`search-results ${className}`}>
        Showing {total} results
      </div>
    );
  }

  return (
    <div className={`search-results ${className}`}>
      Found {filtered} of {total} results for "{searchQuery}"
    </div>
  );
}

/**
 * Table-integrated SearchInput component
 *
 * Pre-configured search input that works with table state and actions.
 * This is the equivalent of your original SearchInput component.
 *
 * @param props - The table search input props
 * @returns JSX element with table search input
 */
export function TableSearchInput<TData extends object>({
  state,
  actions,
}: TableSearchInputProps<TData>) {
  return (
    <Search className="table-search">
      <SearchWrapper>
        <SearchIcon />
        <SearchInput
          placeholder="Search..."
          value={state.searchQuery}
          onChange={actions.setSearchQuery}
        />
        {state.searchQuery && (
          <SearchClear onClick={() => actions.setSearchQuery("")} />
        )}
      </SearchWrapper>
    </Search>
  );
}
