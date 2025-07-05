# React Table Component Library

A flexible, type-safe, headless table component library for React with TypeScript support. Built with modern React patterns and comprehensive async data handling capabilities.

## 🚀 Features

- **🎯 Headless Design**: Provides functionality without enforcing UI, allowing full customization
- **🔒 Type Safety**: Fully typed with generic support and enhanced type inference
- **📊 Sorting**: Click column headers to sort data in ascending/descending order
- **📄 Pagination**: Built-in pagination with configurable page sizes
- **🔍 Filtering**: Global search across specified columns with deep key support
- **🎨 Custom Rendering**: Custom cell renderers for complex data display
- **⚡ Async Support**: Multiple async data loading patterns with error handling
- **🔄 Loading States**: Built-in loading state management
- **📱 Responsive**: Mobile-friendly design with responsive controls
- **🌐 Real-world Examples**: Pokemon API integration examples

## 📦 Quick Start

### Basic Table Usage

```tsx
import { Table } from './components/table';

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

function MyTable() {
  return (
    <Table
      config={{
        columns: [
          { key: 'name', header: 'Name', accessor: 'name', sortable: true },
          { key: 'email', header: 'Email', accessor: 'email', sortable: true },
          { key: 'department', header: 'Department', accessor: 'department', sortable: true },
        ],
        data: users,
        pagination: { enabled: true, pageSize: 10 },
        filtering: { enabled: true, searchableColumns: ['name', 'email'] },
      }}
      onRowClick={(user) => console.log('Clicked:', user.name)}
    />
  );
}
```

### Async Data Loading

```tsx
import { AsyncTable } from './components/table';

function ServerSideTable() {
  return (
    <AsyncTable
      config={{
        fetchData: async ({ page, pageSize, sort, searchQuery }) => {
          const response = await fetch(`/api/users?page=${page}&size=${pageSize}`);
          const data = await response.json();
          
          return response.ok 
            ? { ok: true, data: { data: data.users, total: data.total } }
            : { ok: false, error: new Error(data.message) };
        },
        columns: [
          { key: 'name', header: 'Name', accessor: 'name', sortable: true },
          { key: 'email', header: 'Email', accessor: 'email', sortable: true },
        ],
        pagination: { enabled: true, pageSize: 10 },
        filtering: { enabled: true, searchableColumns: ['name', 'email'] },
      }}
      onRowClick={(user) => console.log('Clicked:', user.name)}
    />
  );
}
```

### Client-Side Data Loading

```tsx
import { SimpleAsyncTable } from './components/table';

function ClientSideTable() {
  return (
    <SimpleAsyncTable
      config={{
        fetchData: async () => {
          const response = await fetch('/api/users/all');
          const users = await response.json();
          
          return response.ok 
            ? { ok: true, data: users }
            : { ok: false, error: new Error('Failed to load users') };
        },
        columns: [
          { key: 'name', header: 'Name', accessor: 'name', sortable: true },
          { key: 'email', header: 'Email', accessor: 'email', sortable: true },
        ],
        pagination: { enabled: true, pageSize: 10 },
        filtering: { enabled: true, searchableColumns: ['name', 'email'] },
      }}
      showRefreshButton={true}
      onRowClick={(user) => console.log('Clicked:', user.name)}
    />
  );
}
```

## 🏗️ Architecture

### Core Components

- **`Table`**: Main headless table component for static data with full feature support
- **`AsyncTable`**: High-level component for server-side operations (pagination, sorting, filtering trigger API calls)
- **`SimpleAsyncTable`**: High-level component for client-side operations (load once, then operate locally)
- **`useTable`**: Core hook for table state management and custom implementations
- **`useAsyncTable`**: Hook for server-side data operations (used internally by AsyncTable)
- **`useSimpleAsyncTable`**: Hook for client-side operations (used internally by SimpleAsyncTable)

### Type Safety

The library uses enhanced TypeScript generics with flexible constraints:

```tsx
// ✅ Works with any object type - no index signature required
interface User {
  id: number;
  name: string;
  email: string;
}

// ✅ Supports nested property access with type safety
interface Company {
  name: string;
  address: {
    city: string;
    country: string;
  };
}

// Deep key access: 'address.city' is fully type-safe
```

## 📚 Documentation

📖 **[Complete Documentation](docs/index.md)** - Comprehensive documentation index with navigation guide

### Quick Links
- **[Table Component Guide](docs/README.md)** - Complete API reference and examples
- **[Async Data Guide](docs/ASYNC_GUIDE.md)** - Async data loading patterns and best practices
- **[Examples Collection](docs/EXAMPLES.md)** - 11 comprehensive examples covering all use cases
- **[Migration Guide](docs/MIGRATION.md)** - Upgrade guide from v1.x to v2.x

## 🎯 Examples

The project includes 11 comprehensive examples organized by complexity:

### Basic Examples (3)
- **Full-Featured Table**: Complete demonstration with all features
- **Simple Table**: Direct hook usage with custom rendering
- **Action Button Table**: CRUD operations with action buttons

### Async Examples (3)
- **Server-Side Table**: Backend-driven pagination, sorting, filtering
- **Client-Side Table**: Load once, operate locally
- **Custom Async**: Manual async data management

### Pokemon API Examples (5)
- **Server-Side Pokemon**: Real API integration with pagination
- **Client-Side Pokemon**: Load all 151 Pokemon with rich rendering
- **Pokemon Suspense**: React 18 Suspense integration
- **Pokemon Row Suspense**: Individual row loading states
- **Pokemon Page Suspense**: On-demand page loading with skeletons

## 🔧 Development

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
```

### Tech Stack

- **React 19** - Latest React with concurrent features
- **TypeScript 5.7** - Enhanced type safety and inference
- **Vite 6** - Fast development and build tooling
- **ESLint + Prettier** - Code quality and formatting

## 🎨 Design Principles

1. **Headless First**: Functionality without UI constraints
2. **Type Safety**: Comprehensive TypeScript support with generic inference
3. **Performance**: Efficient data handling and rendering optimizations
4. **Accessibility**: Semantic HTML and keyboard navigation support
5. **Developer Experience**: Intuitive APIs with excellent TypeScript IntelliSense
6. **Real-world Ready**: Production-ready with error handling and loading states

## 🚀 Key Improvements

### Recent Updates

- **Enhanced Type Safety**: Removed restrictive `Record<string, unknown>` constraints
- **Flexible Generics**: Now works with any object type without index signatures
- **Improved Examples**: All Pokemon examples now use the unified Table component
- **Better Documentation**: Comprehensive guides and API references
- **Production Ready**: Error handling, loading states, and performance optimizations

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

This is a demonstration project showcasing modern React table patterns. The codebase serves as a reference for building production-ready table components with TypeScript and React.

### Component Selection Guide

Choose the right component for your use case:

- **`Table`**: Use for static data or when you need full control over data management
- **`AsyncTable`**: Use for server-side pagination, sorting, and filtering (each operation triggers an API call)
- **`SimpleAsyncTable`**: Use when you want to load all data once, then handle pagination/sorting/filtering on the client
- **`useTable` hook**: Use when building custom table implementations or need direct access to table state

### Quick Decision Tree

```
Do you have static data? → Use Table
Do you need server-side operations? → Use AsyncTable  
Do you want to load data once and operate locally? → Use SimpleAsyncTable
Do you need custom table UI? → Use useTable hook
```
