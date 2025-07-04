import { Table } from "../table";
import type { TableColumn } from "../table";
import "../table/table.css";

// Complex nested data structure to demonstrate type safety
interface Company {
  readonly id: number;
  readonly name: string;
  readonly founded: number;
  readonly employees: {
    readonly total: number;
    readonly engineering: number;
    readonly sales: number;
  };
  readonly headquarters: {
    readonly address: {
      readonly street: string;
      readonly city: string;
      readonly country: string;
    };
    readonly coordinates: {
      readonly lat: number;
      readonly lng: number;
    };
  };
  readonly financials: {
    readonly revenue: number;
    readonly valuation: number;
    readonly funding: {
      readonly series: string;
      readonly amount: number;
      readonly investors: readonly string[];
    }[];
  };
  readonly isPublic: boolean;
  readonly tags: readonly string[];
}

// Sample data with nested structure
const sampleCompanies: readonly Company[] = [
  {
    id: 1,
    name: "TechCorp",
    founded: 2010,
    employees: { total: 1500, engineering: 800, sales: 300 },
    headquarters: {
      address: { street: "123 Tech St", city: "San Francisco", country: "USA" },
      coordinates: { lat: 37.7749, lng: -122.4194 },
    },
    financials: {
      revenue: 50000000,
      valuation: 1000000000,
      funding: [
        {
          series: "Series A",
          amount: 10000000,
          investors: ["VC Fund 1", "Angel Investor"],
        },
        {
          series: "Series B",
          amount: 25000000,
          investors: ["VC Fund 2", "Corporate Venture"],
        },
      ],
    },
    isPublic: false,
    tags: ["SaaS", "Enterprise", "AI"],
  },
  {
    id: 2,
    name: "InnovateLabs",
    founded: 2015,
    employees: { total: 850, engineering: 500, sales: 150 },
    headquarters: {
      address: { street: "456 Innovation Ave", city: "Austin", country: "USA" },
      coordinates: { lat: 30.2672, lng: -97.7431 },
    },
    financials: {
      revenue: 25000000,
      valuation: 500000000,
      funding: [
        {
          series: "Seed",
          amount: 2000000,
          investors: ["Seed Fund", "Accelerator"],
        },
        {
          series: "Series A",
          amount: 15000000,
          investors: ["Growth VC", "Strategic Partner"],
        },
      ],
    },
    isPublic: false,
    tags: ["Fintech", "Mobile", "Blockchain"],
  },
  {
    id: 3,
    name: "DataFlow Inc",
    founded: 2008,
    employees: { total: 3200, engineering: 1800, sales: 600 },
    headquarters: {
      address: { street: "789 Data Blvd", city: "Seattle", country: "USA" },
      coordinates: { lat: 47.6062, lng: -122.3321 },
    },
    financials: {
      revenue: 150000000,
      valuation: 5000000000,
      funding: [
        { series: "IPO", amount: 200000000, investors: ["Public Market"] },
      ],
    },
    isPublic: true,
    tags: ["Analytics", "Big Data", "Cloud"],
  },
  {
    id: 4,
    name: "GreenTech Solutions",
    founded: 2018,
    employees: { total: 420, engineering: 250, sales: 80 },
    headquarters: {
      address: { street: "321 Eco Way", city: "Portland", country: "USA" },
      coordinates: { lat: 45.5152, lng: -122.6784 },
    },
    financials: {
      revenue: 8000000,
      valuation: 150000000,
      funding: [
        {
          series: "Seed",
          amount: 3000000,
          investors: ["Climate VC", "Impact Fund"],
        },
        {
          series: "Series A",
          amount: 12000000,
          investors: ["Green Ventures", "Clean Energy Fund"],
        },
      ],
    },
    isPublic: false,
    tags: ["CleanTech", "Sustainability", "IoT"],
  },
] as const;

// Type-safe column definitions with deep key access
const columns: TableColumn<Company>[] = [
  {
    key: "name",
    header: "Company",
    accessor: "name",
    sortable: true,
    render: (value, row) => (
      <div
        style={{
          fontWeight: "bold",
          color: row.isPublic ? "#10b981" : "#3b82f6",
        }}
      >
        {String(value)}
        {row.isPublic && (
          <span style={{ marginLeft: "8px", fontSize: "12px" }}>(Public)</span>
        )}
      </div>
    ),
  },
  {
    key: "founded",
    header: "Founded",
    accessor: "founded",
    sortable: true,
    width: 100,
    render: (value) => String(value),
  },
  {
    key: "employees.total",
    header: "Total Employees",
    accessor: "employees.total",
    sortable: true,
    width: 120,
    render: (value) => Number(value).toLocaleString(),
  },
  {
    key: "employees.engineering",
    header: "Engineers",
    accessor: "employees.engineering",
    sortable: true,
    width: 100,
    render: (value, row) => {
      const total = row.employees.total;
      const engineers = Number(value);
      const percentage = Math.round((engineers / total) * 100);
      return (
        <div>
          <div>{engineers.toLocaleString()}</div>
          <div style={{ fontSize: "12px", color: "#6b7280" }}>
            ({percentage}%)
          </div>
        </div>
      );
    },
  },
  {
    key: "headquarters.address.city",
    header: "Location",
    accessor: "headquarters.address.city",
    sortable: true,
    render: (value, row) => (
      <div>
        <div style={{ fontWeight: "500" }}>{String(value)}</div>
        <div style={{ fontSize: "12px", color: "#6b7280" }}>
          {row.headquarters.address.country}
        </div>
      </div>
    ),
  },
  {
    key: "financials.revenue",
    header: "Revenue",
    accessor: "financials.revenue",
    sortable: true,
    width: 120,
    sortValue: (row) => row.financials.revenue, // Custom sort function for numbers
    render: (value) => {
      const revenue = Number(value);
      if (revenue >= 1000000000) {
        return `$${(revenue / 1000000000).toFixed(1)}B`;
      } else if (revenue >= 1000000) {
        return `$${(revenue / 1000000).toFixed(1)}M`;
      } else {
        return `$${(revenue / 1000).toFixed(0)}K`;
      }
    },
  },
  {
    key: "financials.valuation",
    header: "Valuation",
    accessor: "financials.valuation",
    sortable: true,
    width: 120,
    sortValue: (row) => row.financials.valuation,
    render: (value) => {
      const valuation = Number(value);
      if (valuation >= 1000000000) {
        return `$${(valuation / 1000000000).toFixed(1)}B`;
      } else {
        return `$${(valuation / 1000000).toFixed(0)}M`;
      }
    },
  },
  {
    key: "tags",
    header: "Tags",
    accessor: "tags",
    render: (value) => (
      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
        {(value as readonly string[]).map((tag, index) => (
          <span
            key={index}
            style={{
              padding: "2px 8px",
              borderRadius: "12px",
              fontSize: "12px",
              fontWeight: "500",
              backgroundColor: "#f3f4f6",
              color: "#374151",
              border: "1px solid #d1d5db",
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    ),
  },
];

/**
 * Example demonstrating enhanced type safety with deep nested object access
 */
export const TypeSafeTableExample = () => {
  return (
    <div>
      <div
        style={{
          marginBottom: "1rem",
          padding: "1rem",
          backgroundColor: "#f0f9ff",
          border: "1px solid #0ea5e9",
          borderRadius: "8px",
          fontSize: "14px",
        }}
      >
        <strong>🔒 Type-Safe Table with Deep Key Access</strong>
        <p style={{ margin: "0.5rem 0 0 0", color: "#0369a1" }}>
          This example demonstrates enhanced type safety with:
        </p>
        <ul style={{ margin: "0.5rem 0 0 1rem", color: "#0369a1" }}>
          <li>
            <strong>Deep key inference:</strong> Access nested properties like{" "}
            <code>"employees.total"</code>
          </li>
          <li>
            <strong>Type-safe columns:</strong> Column keys are validated
            against data structure
          </li>
          <li>
            <strong>Custom sort functions:</strong> Proper numeric sorting for
            financial data
          </li>
          <li>
            <strong>Readonly data:</strong> Immutable data structures with
            proper typing
          </li>
          <li>
            <strong>Complex rendering:</strong> Rich cell content with
            conditional styling
          </li>
        </ul>
      </div>

      <Table
        config={{
          columns,
          data: sampleCompanies as Company[], // Cast from readonly to mutable for table
          sortable: true,
          pagination: {
            enabled: true,
            pageSize: 5,
          },
          filtering: {
            enabled: true,
            searchableColumns: [
              "name",
              "headquarters.address.city",
              "headquarters.address.country",
              "tags",
            ],
          },
        }}
        className="typesafe-table"
        onRowClick={(company) => {
          const latestFunding =
            company.financials.funding[company.financials.funding.length - 1];
          alert(`${company.name} Details:
Founded: ${company.founded}
Total Employees: ${company.employees.total.toLocaleString()}
Location: ${company.headquarters.address.city}, ${company.headquarters.address.country}
Revenue: $${(company.financials.revenue / 1000000).toFixed(1)}M
Latest Funding: ${latestFunding.series} - $${(latestFunding.amount / 1000000).toFixed(1)}M
Tags: ${company.tags.join(", ")}`);
        }}
      />

      <div
        style={{
          marginTop: "1rem",
          padding: "0.75rem",
          backgroundColor: "#f9fafb",
          border: "1px solid #d1d5db",
          borderRadius: "6px",
          fontSize: "13px",
          color: "#374151",
        }}
      >
        <strong>💡 Try the type safety:</strong> In your IDE, when defining
        columns, you'll get autocomplete for all valid deep keys like{" "}
        <code>"employees.engineering"</code>,
        <code>"headquarters.address.city"</code>, etc. Invalid keys will show
        TypeScript errors!
      </div>
    </div>
  );
};
