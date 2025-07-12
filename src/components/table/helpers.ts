import type { DeepKeys, TableColumn } from "./types";

/**
 * Column helper for creating table columns with a fluent API
 * @template TData - The type of data objects in the table rows
 */
export interface ColumnHelper<TData> {
  /**
   * Create a column with a property accessor
   * @param accessor - Property key or accessor function
   * @param options - Column configuration options
   */
  accessor<TKey extends DeepKeys<TData>>(
    accessor: TKey,
    options?: Partial<Omit<TableColumn<TData, TKey>, "key" | "accessor">>,
  ): TableColumn<TData, TKey>;

  /**
   * Create a column with a function accessor
   * @param accessor - Function to extract data from row
   * @param options - Column configuration options (id is required for function accessors)
   */
  accessor<TValue>(
    accessor: (row: TData) => TValue,
    options: Partial<Omit<TableColumn<TData>, "key" | "accessor">> & {
      id: string;
    },
  ): TableColumn<TData>;

  /**
   * Create a display column (no data accessor)
   * @param options - Column configuration options (id is required)
   */
  display(
    options: Partial<Omit<TableColumn<TData>, "key" | "accessor">> & {
      id: string;
      render: TableColumn<TData>["render"];
    },
  ): TableColumn<TData>;
}

/**
 * Creates a column helper for building table columns with a fluent API
 * @template TData - The type of data objects in the table rows
 * @returns Column helper with accessor methods
 *
 * @example
 * ```tsx
 * interface Person {
 *   firstName: string;
 *   lastName: string;
 *   age: number;
 *   visits: number;
 *   status: string;
 *   progress: number;
 * }
 *
 * const columnHelper = createColumnHelper<Person>();
 *
 * const columns = [
 *   columnHelper.accessor('firstName', {
 *     header: 'First Name',
 *     render: (value) => String(value),
 *   }),
 *   columnHelper.accessor(row => row.lastName, {
 *     id: 'lastName',
 *     header: 'Last Name',
 *     render: (value) => <i>{String(value)}</i>,
 *   }),
 *   columnHelper.accessor('age', {
 *     header: 'Age',
 *     sortable: true,
 *   }),
 *   columnHelper.display({
 *     id: 'actions',
 *     header: 'Actions',
 *     render: (_, row) => <button>Edit {row.firstName}</button>,
 *   }),
 * ];
 * ```
 */
export const createColumnHelper = <TData>(): ColumnHelper<TData> => {
  return {
    accessor: (
      accessor: DeepKeys<TData> | ((row: TData) => unknown),
      options:
        | Partial<Omit<TableColumn<TData>, "key" | "accessor">>
        | (Partial<Omit<TableColumn<TData>, "key" | "accessor">> & {
            id: string;
          }) = {},
    ): TableColumn<TData> => {
      if (typeof accessor === "function") {
        // Function accessor - requires id
        const { id, ...columnOptions } = options as { id: string } & Partial<
          Omit<TableColumn<TData>, "key" | "accessor">
        >;
        if (!id) {
          throw new Error("Function accessors must have an id property");
        }
        return {
          key: id as DeepKeys<TData>,
          header: String(id),
          accessor: accessor as (row: TData) => unknown,
          ...columnOptions,
        };
      } else {
        // Property accessor
        return {
          key: accessor as DeepKeys<TData>,
          header: String(accessor),
          accessor: accessor as DeepKeys<TData>,
          ...options,
        };
      }
    },

    display: (options): TableColumn<TData> => {
      const { id, render, ...columnOptions } = options;
      if (!id) {
        throw new Error("Display columns must have an id property");
      }
      if (!render) {
        throw new Error("Display columns must have a render function");
      }

      return {
        key: id as DeepKeys<TData>,
        header: String(id),
        accessor: id as DeepKeys<TData>,
        render,
        ...columnOptions,
      };
    },
  };
};

/**
 * Legacy helper function for creating simple table columns
 * @deprecated Use createColumnHelper instead for better type safety and features
 */
export const createTableColumn = <
  TData,
  TKey extends DeepKeys<TData> = DeepKeys<TData>,
>(
  key: TKey,
  header: string,
  accessor: TKey | ((row: TData) => unknown),
): TableColumn<TData> => {
  return { key, header, accessor };
};
