import React from "react";

// Composable table components
interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
}

/**
 * Main table container component
 */
export function Table({ className = "", children, ...props }: TableProps) {
  return (
    <div className={`table-container ${className}`}>
      <div style={{ display: "grid" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="table" {...props}>
            {children}
          </table>
        </div>
      </div>
    </div>
  );
}

interface TableHeaderProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

/**
 * Table header section component
 */
export function TableHeader({ children, ...props }: TableHeaderProps) {
  return <thead {...props}>{children}</thead>;
}

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

/**
 * Table body section component
 */
export function TableBody({ children, ...props }: TableBodyProps) {
  return <tbody {...props}>{children}</tbody>;
}

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
}

/**
 * Table row component
 */
export function TableRow({
  className = "",
  children,
  ...props
}: TableRowProps) {
  return (
    <tr className={`table-row ${className}`} {...props}>
      {children}
    </tr>
  );
}

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

/**
 * Table header cell component
 */
export function TableHead({
  className = "",
  children,
  ...props
}: TableHeadProps) {
  return (
    <th className={`table-header ${className}`} {...props}>
      {children}
    </th>
  );
}

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

/**
 * Table data cell component
 */
export function TableCell({
  className = "",
  children,
  ...props
}: TableCellProps) {
  return (
    <td className={`table-cell ${className}`} {...props}>
      {children}
    </td>
  );
}

interface TableCaptionProps
  extends React.HTMLAttributes<HTMLTableCaptionElement> {
  children: React.ReactNode;
}

/**
 * Table caption component
 */
export function TableCaption({
  className = "",
  children,
  ...props
}: TableCaptionProps) {
  return (
    <caption className={`table-caption ${className}`} {...props}>
      {children}
    </caption>
  );
}
