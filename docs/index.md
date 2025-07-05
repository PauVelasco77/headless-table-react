# React Table Documentation

Welcome to the React Table Component Library documentation! This library provides flexible, type-safe, headless table components for React with comprehensive async data handling capabilities.

## 📚 Documentation Overview

### 🚀 **Getting Started**
- **[Main README](README.md)** - Project overview, quick start, and basic examples
- **[License](../LICENSE)** - MIT License information

### 🏗️ **Core Documentation**
- **[Table Component Guide](README.md)** - Complete API reference and component usage
- **[Async Data Guide](ASYNC_GUIDE.md)** - Async data loading patterns and best practices
- **[Migration Guide](MIGRATION.md)** - Upgrade guide from v1.x to v2.x

### 📋 **Examples & Patterns**
- **[Examples Collection](EXAMPLES.md)** - 11 comprehensive examples covering all use cases
- **[Async Table Components Guide](ASYNC_TABLE_COMPONENTS_GUIDE.md)** - High-level async components documentation

## 🎯 **Quick Navigation**

### Choose Your Component

| Need | Component | Documentation |
|------|-----------|---------------|
| Static data or full control | `Table` | [Table Guide](README.md#basic-usage) |
| Server-side operations | `AsyncTable` | [Async Guide](ASYNC_GUIDE.md#server-side-operations) |
| Client-side operations | `SimpleAsyncTable` | [Async Guide](ASYNC_GUIDE.md#client-side-operations) |
| Custom implementation | `useTable` hook | [Table Guide](README.md#using-the-hook-only) |

### Common Use Cases

- **📊 Basic Table**: Start with [Table Component Guide](README.md#basic-usage)
- **🔄 Server-Side Data**: See [AsyncTable Examples](ASYNC_GUIDE.md#server-side-operations)
- **⚡ Client-Side Data**: See [SimpleAsyncTable Examples](ASYNC_GUIDE.md#client-side-operations)
- **🎨 Custom Rendering**: Check [Custom Cell Rendering](README.md#custom-cell-rendering)
- **🔍 Advanced Features**: Browse [Examples Collection](EXAMPLES.md)

## 🏛️ **Architecture Overview**

```
React Table Library
├── Table              # Static data, full control
├── AsyncTable         # Server-side operations
├── SimpleAsyncTable   # Client-side operations
└── Hooks              # useTable, useAsyncTable, useSimpleAsyncTable
```

## 🎓 **Learning Path**

1. **Start Here**: [Main README](README.md) - Get familiar with the library
2. **Basic Usage**: [Table Component Guide](README.md#basic-usage) - Learn the core component
3. **Async Data**: [Async Data Guide](ASYNC_GUIDE.md) - Handle dynamic data
4. **Real Examples**: [Examples Collection](EXAMPLES.md) - See practical implementations
5. **Advanced**: [Migration Guide](MIGRATION.md) - Understand the architecture

## 🔧 **Development**

- **Source Code**: All components are in `src/components/table/`
- **Examples**: Live examples are in `src/components/examples/`
- **Types**: TypeScript definitions with full generic support

## 🤝 **Contributing**

This is a demonstration project showcasing modern React table patterns. The codebase serves as a reference for building production-ready table components with TypeScript and React.

---

**💡 Tip**: Use your browser's search (Ctrl/Cmd + F) to quickly find specific topics across the documentation! 