# Table Examples

This directory contains organized table examples that demonstrate different patterns and use cases for the headless table system.

## Complete File Structure

```
src/components/
├── examples/                          # ALL table examples organized here
│   ├── index.ts                      # Main exports (ALL examples)
│   ├── types.ts                      # Shared types and sample data
│   ├── README.md                     # This file
│   │
│   ├── full-featured-table-example.tsx    # Basic examples
│   ├── simple-table-example.tsx
│   ├── action-button-table-example.tsx
│   │
│   ├── async-table-examples.tsx           # Async data loading examples
│   │
│   ├── pokemon-table-example.tsx          # Pokemon API examples
│   ├── pokemon-suspense-example.tsx       # Pokemon with Suspense
│   ├── pokemon-row-suspense-example.tsx   # Row-level Suspense
│   └── pokemon-page-suspense-example.tsx  # Page-level Suspense
│
└── table/                           # Core table system
```

## All Table Examples (11 Total)

### 🔧 **Basic Table Examples** (3 examples)

#### 1. Full-Featured Table
- **File**: `examples/full-featured-table-example.tsx`
- **Features**: Sorting, pagination, filtering, custom rendering, row clicks
- **Use Case**: Complete table demonstration

#### 2. Simple Table  
- **File**: `examples/simple-table-example.tsx`
- **Features**: Custom HTML, manual sorting, reset functionality
- **Use Case**: Direct `useTable` hook usage

#### 3. Action Button Table
- **File**: `examples/action-button-table-example.tsx`
- **Features**: View/Edit/Delete buttons, no row clicks
- **Use Case**: Admin panels, CRUD operations

### ⚡ **Async Table Examples** (3 examples)

#### 4. Server-Side Table
- **File**: `async-table-examples.tsx` → `ServerSideTableExample`
- **Features**: Server-side pagination, sorting, filtering
- **Use Case**: Large datasets with backend processing

#### 5. Client-Side Table
- **File**: `async-table-examples.tsx` → `ClientSideTableExample`
- **Features**: Load all data once, client-side operations
- **Use Case**: Medium datasets, offline-first apps

#### 6. Custom Async Table
- **File**: `async-table-examples.tsx` → `CustomAsyncTableExample`
- **Features**: Manual async data management
- **Use Case**: Custom loading patterns

### 🐱 **Pokemon API Examples** (5 examples)

#### 7. Pokemon Server-Side
- **File**: `pokemon-table-example.tsx` → `PokemonServerSideExample`
- **Features**: Real API, server-side pagination, type badges
- **Use Case**: Real-world API integration

#### 8. Pokemon Client-Side
- **File**: `pokemon-table-example.tsx` → `PokemonClientSideExample`
- **Features**: Load all 151 Pokemon, shiny sprites toggle
- **Use Case**: Complete dataset with rich rendering

#### 9. Pokemon with Suspense ⚡
- **File**: `pokemon-suspense-example.tsx` → `PokemonSuspenseExample`
- **Features**: React 18 Suspense, declarative loading
- **Use Case**: Modern loading patterns

#### 10. Pokemon Row-Level Suspense 🎭
- **File**: `pokemon-row-suspense-example.tsx` → `PokemonRowSuspenseExample`
- **Features**: Individual row suspense, staggered loading
- **Use Case**: Progressive data loading

#### 11. Pokemon Page-Level Suspense 📄
- **File**: `pokemon-page-suspense-example.tsx` → `PokemonPageSuspenseExample`
- **Features**: On-demand page loading, skeleton animations, unified Table component
- **Use Case**: Efficient large dataset handling with modern React patterns

## Import Strategy

All examples are available through a single import:

```tsx
import {
  // Basic examples
  FullFeaturedTableExample,
  SimpleTableExample,
  ActionButtonTableExample,
  
  // Async examples
  ServerSideTableExample,
  ClientSideTableExample,
  CustomAsyncTableExample,
  
  // Pokemon examples
  PokemonServerSideExample,
  PokemonClientSideExample,
  PokemonSuspenseExample,
  PokemonRowSuspenseExample,
  PokemonPageSuspenseExample,
} from "./components/examples";
```

## Design Patterns Demonstrated

### 1. **Data Loading Patterns**
- **Immediate**: Load data on component mount
- **Server-Side**: Backend handles pagination/sorting
- **Client-Side**: Frontend handles all operations
- **Suspense**: Declarative loading with React 18
- **Progressive**: Load data as needed

### 2. **Interaction Patterns**
- **Row Clicks**: Entire row clickable for selection
- **Action Buttons**: Specific actions per row
- **Search/Filter**: Real-time data filtering
- **Pagination**: Navigate through large datasets

### 3. **Loading Patterns**
- **Global Loading**: Single loading state for entire table
- **Row-Level Loading**: Individual row loading states
- **Page-Level Loading**: Load only current page data
- **Skeleton Loading**: Animated placeholders

### 4. **Error Handling**
- **Result Pattern**: Structured error handling
- **Retry Logic**: Refetch capabilities
- **Graceful Degradation**: Fallback states

## Technical Features

### 🎯 **Core Capabilities**
- Sorting (client & server-side)
- Pagination (configurable page sizes)
- Filtering/Search (multiple columns)
- Custom cell rendering
- Row selection and interaction
- Responsive design

### 🔄 **Async Features**
- Loading states
- Error handling
- Retry mechanisms
- Caching strategies
- Real-time updates

### 🎨 **UI/UX Features**
- Skeleton loading animations
- Type-based color coding
- Interactive sprites
- Hover effects
- Status indicators

## Benefits of This Organization

1. **📚 Learning Path**: Examples progress from simple to complex
2. **🔍 Pattern Discovery**: Easy to find specific patterns
3. **🚀 Quick Start**: Copy examples as starting points
4. **📖 Documentation**: Each example is self-documenting
5. **🔧 Maintainability**: Centralized imports and organization
6. **🎯 Real-World**: Pokemon examples show practical API usage
7. **🔄 Consistency**: All examples now use the unified Table component
8. **🎨 Modern Patterns**: Demonstrates latest React and TypeScript best practices 