# Migration Guide: v1.x to v2.x

This guide helps you migrate from the previous version of the table library to the new enhanced type-safe version.

## 🚀 **What Changed**

### Generic Constraint Relaxation

The main change in v2.x is the relaxation of generic constraints from `extends Record<string, unknown>` to `extends object`. This makes the library more flexible and allows for cleaner interface definitions.

## 📋 **Migration Steps**

### 1. **Remove Index Signatures from Interfaces**

**Before (v1.x):**
```tsx
// ❌ Required extending Record<string, unknown>
interface User extends Record<string, unknown> {
  id: number;
  name: string;
  email: string;
}

// ❌ Or adding index signatures
interface Product {
  id: number;
  name: string;
  price: number;
  [key: string]: unknown; // This was required
}
```

**After (v2.x):**
```tsx
// ✅ Clean interface definitions
interface User {
  id: number;
  name: string;
  email: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  // No index signature needed!
}
```

### 2. **Update Hook Usage**

The hook signatures remain the same, but you can now use cleaner types:

**Before (v1.x):**
```tsx
interface User extends Record<string, unknown> {
  id: number;
  name: string;
  email: string;
}

const { state, actions } = useTable<User>({
  columns: [
    { key: 'name', header: 'Name', accessor: 'name' },
    { key: 'email', header: 'Email', accessor: 'email' },
  ],
  data: users,
});
```

**After (v2.x):**
```tsx
interface User {
  id: number;
  name: string;
  email: string;
}

const { state, actions } = useTable<User>({
  columns: [
    { key: 'name', header: 'Name', accessor: 'name' },
    { key: 'email', header: 'Email', accessor: 'email' },
  ],
  data: users,
});
```

### 3. **Async Hooks Migration**

**Before (v1.x):**
```tsx
interface User extends Record<string, unknown> {
  id: number;
  name: string;
  email: string;
}

const { state, error } = useAsyncTable<User>({
  fetchData: async (params) => {
    // ... fetch logic
  },
  columns: userColumns,
});
```

**After (v2.x):**
```tsx
interface User {
  id: number;
  name: string;
  email: string;
}

const { state, error } = useAsyncTable<User>({
  fetchData: async (params) => {
    // ... fetch logic (unchanged)
  },
  columns: userColumns,
});
```

## 🎯 **Enhanced Features**

### Deep Key Type Safety

v2.x provides enhanced type safety for nested property access:

```tsx
interface Company {
  id: number;
  name: string;
  address: {
    street: string;
    city: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  employees: {
    total: number;
    departments: {
      engineering: number;
      sales: number;
    };
  };
}

// ✅ All these are now fully type-safe
const columns: TableColumn<Company>[] = [
  { key: 'name', header: 'Company', accessor: 'name' },
  { key: 'address.city', header: 'City', accessor: 'address.city' },
  { key: 'address.coordinates.lat', header: 'Latitude', accessor: 'address.coordinates.lat' },
  { key: 'employees.departments.engineering', header: 'Engineers', accessor: 'employees.departments.engineering' },
];
```

### Improved IntelliSense

With cleaner interfaces, you'll get better TypeScript IntelliSense and error messages:

```tsx
// ✅ Better autocomplete and type checking
interface User {
  id: number;
  name: string;
  profile: {
    email: string;
    avatar: string;
  };
}

// TypeScript will now provide better suggestions for:
// - column.key values
// - column.accessor paths
// - searchableColumns options
```

## ⚠️ **Breaking Changes**

### None! 

This is a **non-breaking change**. All existing code will continue to work exactly as before. The only change is that you can now remove the `Record<string, unknown>` constraints from your interfaces if you want cleaner code.

## 🔄 **Gradual Migration**

You can migrate gradually:

1. **Keep existing interfaces** - They will continue to work
2. **Update new interfaces** - Use clean definitions for new code
3. **Refactor when convenient** - Remove constraints during regular maintenance

```tsx
// ✅ Both approaches work in v2.x
interface OldUser extends Record<string, unknown> {
  id: number;
  name: string;
} // Still works!

interface NewUser {
  id: number;
  name: string;
} // Cleaner and preferred
```

## 📝 **Migration Checklist**

- [ ] **Review interfaces**: Identify interfaces extending `Record<string, unknown>`
- [ ] **Remove constraints**: Remove `extends Record<string, unknown>` from interfaces
- [ ] **Remove index signatures**: Remove `[key: string]: unknown` if only added for the library
- [ ] **Test functionality**: Ensure all table features work as expected
- [ ] **Update types**: Take advantage of improved deep key type safety
- [ ] **Clean up imports**: Remove any workaround types you may have created

## 🎉 **Benefits After Migration**

1. **Cleaner Code**: No more boilerplate constraints in interfaces
2. **Better Type Safety**: Enhanced deep key inference and checking
3. **Improved DX**: Better IntelliSense and error messages
4. **Future Proof**: Ready for upcoming TypeScript improvements
5. **Reduced Complexity**: Simpler interface definitions

## 💡 **Tips**

### 1. Use TypeScript Strict Mode
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true
  }
}
```

### 2. Leverage Deep Key Types
```tsx
import type { DeepKeys } from './components/table';

type UserKeys = DeepKeys<User>; // Get all possible key paths
```

### 3. Use Readonly for Immutability
```tsx
interface User {
  readonly id: number;
  readonly name: string;
  readonly profile: {
    readonly email: string;
  };
}
```

## ❓ **FAQ**

### Q: Do I need to update my existing code immediately?
**A:** No, existing code will continue to work. You can migrate gradually.

### Q: Will this affect performance?
**A:** No, this is purely a TypeScript change with no runtime impact.

### Q: Can I mix old and new interface styles?
**A:** Yes, both styles work in v2.x.

### Q: What if I encounter type errors after migration?
**A:** The migration should be seamless. If you encounter issues, you can temporarily keep the old constraints while investigating.

## 📞 **Support**

If you encounter any issues during migration:

1. Check that your TypeScript version is up to date
2. Ensure your interfaces are properly defined
3. Verify that you're using the correct generic types
4. Refer to the examples in the documentation

The migration should be smooth and straightforward. Enjoy the enhanced type safety and cleaner code! 🎉 