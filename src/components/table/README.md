# Headless Table Component

A flexible, reusable headless table component for React with TypeScript support.

## Features

- **Headless Design**: Provides functionality without enforcing UI, allowing full customization
- **TypeScript Support**: Fully typed with generic support for type safety
- **Sorting**: Click column headers to sort data in ascending/descending order
- **Pagination**: Built-in pagination with configurable page sizes
- **Filtering**: Global search across specified columns
- **Custom Rendering**: Custom cell renderers for complex data display
- **Loading States**: Built-in loading state management
- **Responsive**: Mobile-friendly design with responsive controls

## Quick Start

### Basic Usage

```tsx
import { Table } from './components/table';
import type { TableConfig } from './components/table';

interface User {
  readonly id: number;
  readonly name: string;
  readonly email: string;
}

const users: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
];

const config: TableConfig<User> = {
  columns: [
    { key: 'id', header: 'ID', accessor: 'id', sortable: true },
    { key: 'name', header: 'Name', accessor: 'name', sortable: true },
    { key: 'email', header: 'Email', accessor: 'email', sortable: true },
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
  return <Table<User> config={config} />;
}
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
                key={column.key}
                onClick={() => {
                  const newDirection = 
                    state.sort?.key === column.key && state.sort.direction === 'asc' 
                      ? 'desc' 
                      : 'asc';
                  actions.setSort({ key: column.key, direction: newDirection });
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
                <td key={column.key}>
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
  readonly columns: readonly TableColumn<TData>[];
  readonly data: readonly TData[];
  readonly sortable?: boolean;
  readonly pagination?: {
    readonly enabled: boolean;
    readonly pageSize?: number;
  };
  readonly filtering?: {
    readonly enabled: boolean;
    readonly searchableColumns?: readonly string[];
  };
}
```

### TableColumn<TData>

Column definition for the table.

```tsx
interface TableColumn<TData> {
  readonly key: string;
  readonly header: string;
  readonly accessor: keyof TData | ((row: TData) => unknown);
  readonly sortable?: boolean;
  readonly width?: string | number;
  readonly render?: (value: unknown, row: TData) => React.ReactNode;
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
<Table<User>
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

## TypeScript Tips

1. **Extend Record<string, unknown>**: Your data type should extend `Record<string, unknown>` for proper type inference:

```tsx
interface User extends Record<string, unknown> {
  readonly id: number;
  readonly name: string;
  // ... other properties
}
```

2. **Use readonly**: Use `readonly` for arrays and object properties to prevent accidental mutations.

3. **Generic Type Parameter**: Always specify the generic type parameter when using the Table component:

```tsx
<Table<User> config={config} />
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