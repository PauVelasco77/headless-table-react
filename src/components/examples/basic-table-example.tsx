import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table";

// Sample data
interface Invoice {
  readonly id: string;
  readonly invoice: string;
  readonly paymentStatus: "Paid" | "Pending" | "Unpaid";
  readonly totalAmount: string;
  readonly paymentMethod: string;
}

const invoices: Invoice[] = [
  {
    id: "1",
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    id: "2",
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    id: "3",
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    id: "4",
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    id: "5",
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
];

/**
 * Example demonstrating composable table usage
 *
 * This shows how to build tables using composable components
 * for maximum flexibility and control.
 */
export function BasicTableExample(): React.ReactElement {
  return (
    <div style={{ padding: "2rem" }}>
      <h2>Basic Table Example</h2>
      <p>
        This table is built using composable components. Each part of the table
        is a separate component that can be styled and customized independently.
      </p>

      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">{invoice.invoice}</TableCell>
              <TableCell>
                <span
                  style={{
                    padding: "0.25rem 0.5rem",
                    borderRadius: "0.25rem",
                    fontSize: "0.75rem",
                    backgroundColor:
                      invoice.paymentStatus === "Paid"
                        ? "#dcfce7"
                        : invoice.paymentStatus === "Pending"
                          ? "#fef3c7"
                          : "#fee2e2",
                    color:
                      invoice.paymentStatus === "Paid"
                        ? "#166534"
                        : invoice.paymentStatus === "Pending"
                          ? "#92400e"
                          : "#991b1b",
                  }}
                >
                  {invoice.paymentStatus}
                </span>
              </TableCell>
              <TableCell>{invoice.paymentMethod}</TableCell>
              <TableCell className="text-right">
                {invoice.totalAmount}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          backgroundColor: "#f8fafc",
          borderRadius: "0.5rem",
          fontSize: "0.875rem",
        }}
      >
        <h4>Usage</h4>
        <p>The table components follow a composable pattern:</p>
        <ul style={{ paddingLeft: "1.5rem" }}>
          <li>
            <code>Table</code> - Main table container with responsive wrapper
          </li>
          <li>
            <code>TableCaption</code> - Table caption/title
          </li>
          <li>
            <code>TableHeader</code> - Table header section
          </li>
          <li>
            <code>TableBody</code> - Table body section
          </li>
          <li>
            <code>TableRow</code> - Table row
          </li>
          <li>
            <code>TableHead</code> - Header cell
          </li>
          <li>
            <code>TableCell</code> - Data cell
          </li>
        </ul>

        <pre
          style={{
            marginTop: "1rem",
            padding: "1rem",
            backgroundColor: "#f3f4f6",
            borderRadius: "0.25rem",
            overflow: "auto",
            fontSize: "0.75rem",
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
</Table>`}
        </pre>
      </div>
    </div>
  );
}
