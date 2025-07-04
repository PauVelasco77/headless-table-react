# AsyncTable and SimpleAsyncTable Components Guide

This guide explains how to use the new `AsyncTable` and `SimpleAsyncTable` components that solve the problem of using async hooks with the table system.

## 🎯 **Problem Solved**

Previously, to use `useAsyncTable` or `useSimpleAsyncTable`, you had to:

1. Create a custom component that uses the hook
2. Manually handle the state and pass it to the `Table` component
3. Handle errors and loading states yourself

Now you can use the pre-built components that handle all of this automatically!

## 📦 **Available Components**

### 1. `AsyncTable` - Server-side Operations
- Uses `useAsyncTable` internally
- Handles server-side pagination, sorting, and filtering
- Perfect for large datasets

### 2. `SimpleAsyncTable` - Client-side Operations  
- Uses `useSimpleAsyncTable` internally
- Loads all data once, then handles operations client-side
- Perfect for smaller datasets

## 🚀 **Quick Start**

### AsyncTable Example

```tsx
import { AsyncTable } from './components/table';

interface User {
  id: number;
  name: string;
  email: string;
}

const fetchUsers = async (params) => {
  try {
    const response = await fetch(`/api/users?page=${params.page}&pageSize=${params.pageSize}`);
    const data = await response.json();
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: error as Error };
  }
};

const MyAsyncTable = () => {
  return (
    <AsyncTable
      config={{
        fetchData: fetchUsers,
        columns: [
          { key: "name", header: "Name", accessor: "name", sortable: true },
          { key: "email", header: "Email", accessor: "email", sortable: true }
        ],
        initialPageSize: 10
      }}
      onRowClick={(user) => console.log('Clicked:', user)}
      onError={(error) => console.error('Error:', error)}
    />
  );
};
```

### SimpleAsyncTable Example

```tsx
import { SimpleAsyncTable } from './components/table';

const fetchAllUsers = async () => {
  try {
    const response = await fetch('/api/users');
    const users = await response.json();
    return { ok: true, data: users };
  } catch (error) {
    return { ok: false, error: error as Error };
  }
};

const MySimpleAsyncTable = () => {
  return (
    <SimpleAsyncTable
      config={{
        fetchData: fetchAllUsers,
        columns: [
          { key: "name", header: "Name", accessor: "name", sortable: true },
          { key: "email", header: "Email", accessor: "email", sortable: true }
        ],
        pagination: { enabled: true, pageSize: 25 },
        filtering: { enabled: true }
      }}
      onRowClick={(user) => console.log('Clicked:', user)}
      showRefreshButton={true}
    />
  );
};
```

## 🔧 **API Reference**

### AsyncTable Props

```tsx
interface AsyncTableProps<TData extends object> {
  config: {
    fetchData: (params: {
      page: number;
      pageSize: number;
      sort?: TableSort | null;
      searchQuery?: string;
    }) => Promise<AsyncResult<{
      data: TData[];
      total: number;
    }>>;
    columns: TableColumn<TData>[];
    initialPageSize?: number;
  };
  className?: string;
  onRowClick?: (row: TData) => void;
  onError?: (error: Error) => void;
  errorComponent?: (error: Error, refetch: () => Promise<void>) => React.ReactNode;
  loadingComponent?: (isRefetching: boolean) => React.ReactNode;
}
```

### SimpleAsyncTable Props

```tsx
interface SimpleAsyncTableProps<TData extends object> {
  config: {
    fetchData: () => Promise<AsyncResult<TData[]>>;
    columns: TableColumn<TData>[];
    pagination?: TableConfig<TData>["pagination"];
    filtering?: TableConfig<TData>["filtering"];
    sortable?: boolean;
  };
  className?: string;
  onRowClick?: (row: TData) => void;
  onError?: (error: Error) => void;
  errorComponent?: (error: Error, refetch: () => Promise<void>) => React.ReactNode;
  loadingComponent?: (isRefetching: boolean) => React.ReactNode;
  showRefreshButton?: boolean;
}
```

## 🎨 **Advanced Usage**

### Custom Error Component

```tsx
const customErrorComponent = (error: Error, refetch: () => Promise<void>) => (
  <div className="custom-error">
    <h4>🚨 Something went wrong!</h4>
    <p>{error.message}</p>
    <button onClick={refetch}>Try Again</button>
  </div>
);

<AsyncTable
  config={config}
  errorComponent={customErrorComponent}
/>
```

### Custom Loading Component

```tsx
const customLoadingComponent = (isRefetching: boolean) => (
  <div className="custom-loading">
    <div className="spinner" />
    {isRefetching ? "Refreshing..." : "Loading..."}
  </div>
);

<AsyncTable
  config={config}
  loadingComponent={customLoadingComponent}
/>
```

### Error Handling

```tsx
<AsyncTable
  config={config}
  onError={(error) => {
    // Log to analytics
    console.error('Table error:', error);
    
    // Show toast notification
    toast.error(`Failed to load data: ${error.message}`);
  }}
/>
```

## 🔄 **Migration from Hook-based Approach**

### Before (Using hooks manually)

```tsx
const MyTable = () => {
  const { state, columns, error, refetch } = useAsyncTable({
    fetchData: fetchUsers,
    columns: userColumns,
    initialPageSize: 10,
  });

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Table
      config={{
        columns,
        data: state.data,
        sortable: true,
        pagination: { enabled: true },
        filtering: { enabled: true },
      }}
    />
  );
};
```

### After (Using AsyncTable component)

```tsx
const MyTable = () => {
  return (
    <AsyncTable
      config={{
        fetchData: fetchUsers,
        columns: userColumns,
        initialPageSize: 10,
      }}
    />
  );
};
```

## 🎯 **When to Use Each Approach**

### Use `AsyncTable` when:
- You have large datasets (>1000 items)
- You want server-side pagination, sorting, filtering
- You need real-time data updates
- You want to minimize client memory usage

### Use `SimpleAsyncTable` when:
- You have smaller datasets (<1000 items)
- You want instant responses to user interactions
- You need offline-capable functionality
- You want to minimize server requests

### Use the hooks directly when:
- You need full control over the data flow
- You're integrating with complex state management
- You need custom loading/error handling logic
- You're building a custom table component

## 🔍 **Features Included**

### AsyncTable Features:
- ✅ Server-side pagination, sorting, filtering
- ✅ Automatic loading states
- ✅ Error handling with retry
- ✅ Debounced search (300ms)
- ✅ Custom error/loading components
- ✅ Type-safe column definitions

### SimpleAsyncTable Features:
- ✅ Client-side pagination, sorting, filtering
- ✅ Automatic loading states
- ✅ Error handling with retry
- ✅ Refresh button option
- ✅ Reset filters functionality
- ✅ Custom error/loading components
- ✅ Type-safe column definitions

## 🚀 **Performance Tips**

1. **Use AsyncTable for large datasets** to avoid loading all data at once
2. **Use SimpleAsyncTable for smaller datasets** for better user experience
3. **Implement proper error boundaries** around your tables
4. **Use React.memo** for expensive custom render functions
5. **Consider virtual scrolling** for very large client-side datasets

## 📚 **Examples**

Check out the complete examples in:
- `src/components/examples/async-table-component-example.tsx`
- `src/components/examples/async-table-examples.tsx`
- `src/components/examples/pokemon-table-example.tsx`

## 🎉 **Benefits**

1. **Simplified Usage**: No need to manually handle hooks and state
2. **Built-in Error Handling**: Automatic error states with retry functionality
3. **Loading States**: Built-in loading indicators and custom component support
4. **Type Safety**: Full TypeScript support with proper inference
5. **Consistent API**: Same interface as the base Table component
6. **Flexible**: Support for custom error and loading components
7. **Performance**: Optimized for both server-side and client-side operations

This approach gives you the best of both worlds: the power of the async hooks with the simplicity of a ready-to-use component! 