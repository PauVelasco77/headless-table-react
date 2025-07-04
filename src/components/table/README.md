# Headless Table Component

A flexible, reusable headless table component for React with TypeScript support.

## Features

- **Headless Design**: Provides functionality without enforcing UI, allowing full customization
- **TypeScript Support**: Fully typed with generic support for enhanced type safety
- **Sorting**: Click column headers to sort data in ascending/descending order
- **Pagination**: Built-in pagination with configurable page sizes
- **Filtering**: Global search across specified columns with deep key support
- **Custom Rendering**: Custom cell renderers for complex data display
- **Loading States**: Built-in loading state management
- **Responsive**: Mobile-friendly design with responsive controls
- **Nested Property Access**: Type-safe access to nested object properties

## Quick Start

### Basic Usage

```tsx
import { Table } from './components/table';
import type { TableConfig } from './components/table';

interface User {
  id: number;
  name: string;
  email: string;
  department: string;
}

const users: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', department: 'Engineering' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', department: 'Design' },
];

const config: TableConfig<User> = {
  columns: [
    { key: 'id', header: 'ID', accessor: 'id', sortable: true },
    { key: 'name', header: 'Name', accessor: 'name', sortable: true },
    { key: 'email', header: 'Email', accessor: 'email', sortable: true },
    { key: 'department', header: 'Department', accessor: 'department', sortable: true },
  ],
  data: users,
  sortable: true,
  pagination: {
    enabled: true,
    pageSize: 10,
  },
  filtering: {
    enabled: true,
    searchableColumns: ['name', 'email'],
  },
};

function MyComponent() {
  return (
    <Table 
      config={config} 
      onRowClick={(user) => console.log('Clicked:', user.name)}
    />
  );
}
```

### Nested Property Access

```tsx
interface Company {
  id: number;
  name: string;
  address: {
    city: string;
    country: string;
  };
  employees: {
    total: number;
    engineering: number;
  };
}

const columns: TableColumn<Company>[] = [
  { key: 'name', header: 'Company', accessor: 'name', sortable: true },
  { key: 'address.city', header: 'City', accessor: 'address.city', sortable: true },
  { key: 'address.country', header: 'Country', accessor: 'address.country', sortable: true },
  { key: 'employees.total', header: 'Employees', accessor: 'employees.total', sortable: true },
];
```

### Using the Hook Only

For complete customization, use the `useTable` hook directly:

```tsx
import { useTable } from './components/table';

function CustomTable() {
  const { state, actions, columns } = useTable<User>(config);

  return (
    <div>
      <input
        value={state.searchQuery}
        onChange={(e) => actions.setSearchQuery(e.target.value)}
        placeholder="Search..."
      />
      
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                onClick={() => {
                  const newDirection = 
                    state.sort?.key === column.key && state.sort.direction === 'asc' 
                      ? 'desc' 
                      : 'asc';
                  actions.setSort({ key: String(column.key), direction: newDirection });
                }}
              >
                {column.header}
                {state.sort?.key === column.key && (
                  <span>{state.sort.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {state.paginatedData.map((row, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={String(column.key)}>
                  {typeof column.accessor === 'function' 
                    ? String(column.accessor(row))
                    : String(row[column.accessor])
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

## API Reference

### TableConfig<TData>

Configuration object for the table.

```tsx
interface TableConfig<TData> {
  columns: TableColumn<TData>[];
  data: TData[];
  sortable?: boolean;
  pagination?: {
    enabled: boolean;
    pageSize?: number;
  };
  filtering?: {
    enabled: boolean;
    searchableColumns?: DeepKeys<TData>[];
  };
}
```

### TableColumn<TData>

Column definition for the table with deep key support.

```tsx
interface TableColumn<TData, TKey extends DeepKeys<TData> = DeepKeys<TData>> {
  key: TKey;
  header: string;
  accessor: TKey | ((row: TData) => unknown);
  sortable?: boolean;
  width?: string | number;
  render?: (value: unknown, row: TData) => React.ReactNode;
  sortValue?: (row: TData) => string | number;
}
```

### Table Component Props

```tsx
interface TableProps<TData extends object> {
  config: TableConfig<TData>;
  className?: string;
  onRowClick?: (row: TData) => void;
}
```

### useTable Hook

Returns table state and actions.

```tsx
const { state, actions, columns } = useTable<TData>(config);
```

#### State

- `data`: Original data array
- `filteredData`: Data after applying search filter
- `paginatedData`: Data for current page
- `sort`: Current sort configuration
- `pagination`: Current pagination state
- `searchQuery`: Current search query
- `loading`: Loading state

#### Actions

- `setSort(sort)`: Set sort configuration
- `setPage(page)`: Change current page
- `setPageSize(size)`: Change page size
- `setSearchQuery(query)`: Set search query
- `setLoading(loading)`: Set loading state
- `reset()`: Reset all state to initial values

## Advanced Examples

### Custom Cell Rendering

```tsx
const columns: TableColumn<User>[] = [
  {
    key: 'avatar',
    header: 'Avatar',
    accessor: 'avatarUrl',
    render: (value, row) => (
      <img 
        src={String(value)} 
        alt={row.name} 
        style={{ width: 40, height: 40, borderRadius: '50%' }}
      />
    ),
  },
  {
    key: 'status',
    header: 'Status',
    accessor: 'active',
    render: (value) => (
      <span className={value ? 'status-active' : 'status-inactive'}>
        {value ? 'Active' : 'Inactive'}
      </span>
    ),
  },
];
```

### Computed Columns

```tsx
const columns: TableColumn<User>[] = [
  {
    key: 'fullName',
    header: 'Full Name',
    accessor: (row) => `${row.firstName} ${row.lastName}`,
    sortable: true,
  },
  {
    key: 'age',
    header: 'Age',
    accessor: (row) => {
      const today = new Date();
      const birthDate = new Date(row.birthDate);
      return today.getFullYear() - birthDate.getFullYear();
    },
    sortable: true,
  },
];
```

### Row Click Handling

```tsx
<Table
  config={config}
  onRowClick={(user) => {
    console.log('Clicked user:', user);
    // Navigate to user detail page, open modal, etc.
  }}
/>
```

## Styling

The component uses CSS classes that you can customize:

- `.table-container`: Main container
- `.table-search`: Search input container
- `.table`: Table element
- `.table-header`: Header cells
- `.table-row`: Table rows
- `.table-cell`: Table cells
- `.table-pagination`: Pagination container
- `.pagination-button`: Pagination buttons

Import the default styles:

```tsx
import './components/table/table.css';
```

Or create your own custom styles using the provided CSS classes.

## TypeScript Support

### Enhanced Type Safety

The library now uses flexible generic constraints that work with any object type:

```tsx
// ✅ Works perfectly - no index signature required
interface User {
  id: number;
  name: string;
  email: string;
}

// ✅ Supports complex nested structures
interface Company {
  name: string;
  address: {
    city: string;
    country: string;
  };
  employees: {
    total: number;
    departments: {
      engineering: number;
      sales: number;
    };
  };
}

// ✅ Deep key access is fully type-safe
const columns: TableColumn<Company>[] = [
  { key: 'address.city', header: 'City', accessor: 'address.city' },
  { key: 'employees.departments.engineering', header: 'Engineers', accessor: 'employees.departments.engineering' },
];
```

### Generic Type Parameter

Always specify the generic type parameter for full type safety:

```tsx
<Table<User> config={config} />
```

### Deep Key Inference

The `DeepKeys<T>` utility type provides type-safe access to nested properties:

```tsx
type UserKeys = DeepKeys<User>; // 'id' | 'name' | 'email' | 'profile.bio' | 'profile.address.city' | ...
```

## Performance Considerations

- **Memoization**: The hook uses `useMemo` and `useCallback` for optimal performance
- **Large Datasets**: For very large datasets, consider server-side pagination and filtering
- **Custom Renders**: Memoize complex render functions to avoid unnecessary re-renders

```tsx
const renderStatus = useCallback((value: unknown) => (
  <StatusBadge active={Boolean(value)} />
), []);
```

## Migration Guide

### From v1.x to v2.x

The main change is the removal of the `Record<string, unknown>` constraint:

```tsx
// ❌ Old - required index signature
interface User extends Record<string, unknown> {
  id: number;
  name: string;
}

// ✅ New - clean interface definition
interface User {
  id: number;
  name: string;
}
```

All existing functionality remains the same, but your interfaces are now cleaner and more type-safe.
