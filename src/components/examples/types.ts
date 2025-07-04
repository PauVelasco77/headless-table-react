/**
 * Shared types and data for table examples
 */

/**
 * User interface for table examples
 */
export interface User extends Record<string, unknown> {
  readonly id: number;
  readonly name: string;
  readonly email: string;
  readonly age: number;
  readonly department: string;
  readonly salary: number;
  readonly active: boolean;
}

/**
 * Sample user data for table examples
 */
export const sampleUsers: readonly User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    age: 30,
    department: "Engineering",
    salary: 85000,
    active: true,
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    age: 28,
    department: "Design",
    salary: 75000,
    active: true,
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    age: 35,
    department: "Engineering",
    salary: 95000,
    active: false,
  },
  {
    id: 4,
    name: "Alice Brown",
    email: "alice@example.com",
    age: 32,
    department: "Marketing",
    salary: 70000,
    active: true,
  },
  {
    id: 5,
    name: "Charlie Wilson",
    email: "charlie@example.com",
    age: 29,
    department: "Sales",
    salary: 65000,
    active: true,
  },
  {
    id: 6,
    name: "Diana Davis",
    email: "diana@example.com",
    age: 31,
    department: "HR",
    salary: 68000,
    active: false,
  },
  {
    id: 7,
    name: "Eve Miller",
    email: "eve@example.com",
    age: 27,
    department: "Engineering",
    salary: 80000,
    active: true,
  },
  {
    id: 8,
    name: "Frank Garcia",
    email: "frank@example.com",
    age: 33,
    department: "Design",
    salary: 78000,
    active: true,
  },
  {
    id: 9,
    name: "Grace Martinez",
    email: "grace@example.com",
    age: 26,
    department: "Marketing",
    salary: 72000,
    active: true,
  },
  {
    id: 10,
    name: "Henry Lopez",
    email: "henry@example.com",
    age: 34,
    department: "Sales",
    salary: 69000,
    active: false,
  },
  {
    id: 11,
    name: "Ivy Anderson",
    email: "ivy@example.com",
    age: 25,
    department: "Engineering",
    salary: 82000,
    active: true,
  },
  {
    id: 12,
    name: "Jack Taylor",
    email: "jack@example.com",
    age: 36,
    department: "HR",
    salary: 71000,
    active: true,
  },
] as const;
