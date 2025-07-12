import { Table } from "../table/table";
import { users } from "../../mock/users";
import { useTable, createColumnHelper } from "../table";

const columnHelper = createColumnHelper<(typeof users.users)[0]>();

export default function UsersTable() {
  const columns = [
    columnHelper.accessor("id", {
      header: "#",
    }),
    columnHelper.accessor("image", {
      header: "",
      sortable: false, // Disable sorting for image column
      render: (_, row) => (
        <img src={row.image} alt={row.firstName} width={30} height={30} />
      ),
    }),
    columnHelper.accessor("firstName", {
      header: "First Name",
    }),
    columnHelper.accessor("lastName", {
      header: "Last Name",
    }),
    columnHelper.accessor("email", {
      header: "Email",
    }),
    columnHelper.accessor("phone", {
      header: "Phone",
    }),
    columnHelper.accessor("username", {
      header: "Username",
    }),
    columnHelper.accessor("password", {
      header: "Password",
    }),
  ];

  const {
    actions,
    columns: tableColumns,
    state,
  } = useTable({
    data: users.users,
    columns,
    pagination: {
      enabled: true,
      pageSize: 10,
    },
    filtering: {
      enabled: true,
    },
    sortable: true,
  });

  return <Table columns={tableColumns} state={state} actions={actions} />;
}
