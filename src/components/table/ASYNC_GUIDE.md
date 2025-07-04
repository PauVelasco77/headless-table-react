# Async Data Management Guide

This guide covers different approaches to managing async data with the headless table component.

## 🎯 **Three Approaches to Async Data**

### 1. **Server-Side Operations** (`useAsyncTable`)
Best for large datasets where you want the server to handle pagination, sorting, and filtering.

```tsx
import { useAsyncTable } from './components/table';

const MyServerSideTable = () => {
  const { state, actions, columns, error, refetch, isRefetching } = useAsyncTable<User>({
    fetchData: async (params) => {
      // Your API call here
      const response = await fetch(`/api/users?page=${params.page}&sort=${params.sort?.key}`);
      const data = await response.json();
      
      if (!response.ok) {
        return { ok: false, error: new Error(data.message) };
      }
      
      return { 
        ok: true, 
        data: { 
          data: data.users, 
          total: data.total 
        } 
      };
    },
    columns,
    initialPageSize: 10,
  });

  return (
    <div>
      {error && <div>Error: {error.message}</div>}
      <button onClick={refetch}>Refresh</button>
      <Table<User> config={{ columns, data: state.data, ...otherConfig }} />
    </div>
  );
};
```

**Features:**
- ✅ Server-side pagination, sorting, filtering
- ✅ Automatic loading states
- ✅ Error handling
- ✅ Refetch capability
- ✅ Debounced search (300ms)

### 2. **Client-Side Operations** (`useSimpleAsyncTable`)
Best for smaller datasets where you want to load all data once and handle operations on the client.

```tsx
import { useSimpleAsyncTable } from './components/table';

const MyClientSideTable = () => {
  const { state, actions, columns, error, refetch, isRefetching } = useSimpleAsyncTable<User>({
    fetchData: async () => {
      const response = await fetch('/api/users');
      const data = await response.json();
      
      if (!response.ok) {
        return { ok: false, error: new Error(data.message) };
      }
      
      return { ok: true, data: data.users };
    },
    columns,
    pagination: { enabled: true, pageSize: 10 },
    filtering: { enabled: true, searchableColumns: ['name', 'email'] },
  });

  return (
    <div>
      {error && <div>Error: {error.message}</div>}
      <button onClick={refetch}>Refresh</button>
      <button onClick={actions.reset}>Reset Filters</button>
      <Table<User> config={{ columns, data: state.data, ...otherConfig }} />
    </div>
  );
};
```

**Features:**
- ✅ One-time data loading
- ✅ Client-side pagination, sorting, filtering
- ✅ Fast operations (no server requests)
- ✅ Full table functionality
- ✅ Reset capability

### 3. **Manual Management** (Custom Implementation)
Best when you need full control over data loading and state management.

```tsx
import { useState, useEffect } from 'react';
import { Table } from './components/table';

const MyCustomTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message);
      }
      
      setUsers(data.users);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div>
      {error && <div>Error: {error.message}</div>}
      <button onClick={loadUsers} disabled={loading}>
        {loading ? 'Loading...' : 'Load Users'}
      </button>
      <Table<User> config={{ columns, data: users, ...otherConfig }} />
    </div>
  );
};
```

**Features:**
- ✅ Full control over loading logic
- ✅ Custom error handling
- ✅ Integration with external state management
- ✅ Custom loading triggers

## 🔧 **API Reference**

### `useAsyncTable<TData>(config)`

**Config:**
```tsx
interface AsyncTableConfig<TData> {
  fetchData: (params: {
    page?: number;
    pageSize?: number;
    sort?: TableSort | null;
    searchQuery?: string;
  }) => Promise<AsyncResult<{
    data: TData[];
    total: number;
  }>>;
  columns: TableColumn<TData>[];
  initialPageSize?: number;
  enableClientSideOperations?: boolean;
}
```

**Returns:**
```tsx
interface UseAsyncTableReturn<TData> {
  state: TableState<TData>;
  actions: TableActions;
  columns: TableColumn<TData>[];
  error: Error | null;
  refetch: () => Promise<void>;
  isRefetching: boolean;
}
```

### `useSimpleAsyncTable<TData>(config)`

**Config:**
```tsx
interface SimpleAsyncTableConfig<TData> {
  fetchData: () => Promise<AsyncResult<TData[]>>;
  columns: TableColumn<TData>[];
  pagination?: TableConfig<TData>['pagination'];
  filtering?: TableConfig<TData>['filtering'];
  sortable?: boolean;
}
```

**Returns:**
```tsx
interface UseSimpleAsyncTableReturn<TData> {
  state: TableState<TData>;
  actions: TableActions;
  columns: TableColumn<TData>[];
  error: Error | null;
  refetch: () => Promise<void>;
  isRefetching: boolean;
}
```

### `AsyncResult<T>` Type

```tsx
type AsyncResult<T, E extends Error = Error> =
  | { ok: true; data: T }
  | { ok: false; error: E };
```

## 🚀 **Real-World Examples**

### REST API Integration

```tsx
const fetchUsers = async (params: any) => {
  try {
    const url = new URL('/api/users', window.location.origin);
    
    if (params.page) url.searchParams.set('page', params.page.toString());
    if (params.pageSize) url.searchParams.set('limit', params.pageSize.toString());
    if (params.sort) {
      url.searchParams.set('sortBy', params.sort.key);
      url.searchParams.set('sortOrder', params.sort.direction);
    }
    if (params.searchQuery) url.searchParams.set('search', params.searchQuery);
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
      return { ok: false, error: new Error(data.message) };
    }
    
    return { 
      ok: true, 
      data: { 
        data: data.users, 
        total: data.pagination.total 
      } 
    };
  } catch (error) {
    return { ok: false, error: error as Error };
  }
};
```

### GraphQL Integration

```tsx
import { useQuery } from '@apollo/client';

const GET_USERS = gql`
  query GetUsers($page: Int, $pageSize: Int, $sortBy: String, $sortOrder: String, $search: String) {
    users(page: $page, pageSize: $pageSize, sortBy: $sortBy, sortOrder: $sortOrder, search: $search) {
      data {
        id
        name
        email
        department
      }
      pagination {
        total
        page
        pageSize
      }
    }
  }
`;

const GraphQLTable = () => {
  const [params, setParams] = useState({ page: 1, pageSize: 10 });
  
  const { data, loading, error, refetch } = useQuery(GET_USERS, {
    variables: params,
  });

  const { state, actions, columns } = useTable({
    columns: userColumns,
    data: data?.users?.data ?? [],
    // ... other config
  });

  // Custom actions that update GraphQL variables
  const customActions = {
    ...actions,
    setPage: (page: number) => {
      setParams(prev => ({ ...prev, page }));
      actions.setPage(page);
    },
    // ... other custom actions
  };

  return <Table config={{ columns, data: state.data }} />;
};
```

## 🎨 **Best Practices**

### 1. **Error Handling**
Always use the Result type pattern for consistent error handling:

```tsx
const fetchData = async (): Promise<AsyncResult<User[]>> => {
  try {
    const response = await fetch('/api/users');
    
    if (!response.ok) {
      return { ok: false, error: new Error(`HTTP ${response.status}`) };
    }
    
    const data = await response.json();
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: error as Error };
  }
};
```

### 2. **Loading States**
Show appropriate loading states for better UX:

```tsx
const MyTable = () => {
  const { state, error, isRefetching } = useAsyncTable(config);
  
  return (
    <div>
      {state.loading && <div>Loading initial data...</div>}
      {isRefetching && <div>Refreshing data...</div>}
      {error && <div>Error: {error.message}</div>}
      <Table config={tableConfig} />
    </div>
  );
};
```

### 3. **Debounced Search**
The `useAsyncTable` hook automatically debounces search queries by 300ms. For custom implementations:

```tsx
import { useDeferredValue } from 'react';

const MyTable = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);
  
  useEffect(() => {
    // Fetch data with deferredSearchQuery
  }, [deferredSearchQuery]);
};
```

### 4. **Optimistic Updates**
For better UX, you can implement optimistic updates:

```tsx
const updateUser = async (userId: number, updates: Partial<User>) => {
  // Optimistically update local state
  setUsers(prev => prev.map(user => 
    user.id === userId ? { ...user, ...updates } : user
  ));
  
  try {
    await fetch(`/api/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  } catch (error) {
    // Revert on error
    refetch();
  }
};
```

## 🔍 **Troubleshooting**

### Common Issues

1. **Search not working**: Ensure `searchableColumns` are specified in the config
2. **Pagination not updating**: Check that your API returns the correct `total` count
3. **Sort not working**: Verify that your API handles the sort parameters correctly
4. **Memory leaks**: Always cleanup async operations in useEffect cleanup functions

### Performance Tips

1. **Use server-side operations** for large datasets (>1000 items)
2. **Implement virtual scrolling** for very large client-side datasets
3. **Memoize expensive computations** in custom render functions
4. **Use React.memo** for table rows if they're expensive to render

```tsx
const MemoizedRow = React.memo(({ user }: { user: User }) => (
  <tr>
    <td>{user.name}</td>
    <td>{user.email}</td>
  </tr>
));
``` 