import Spinner from "../../ui/Spinner";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import { useUsers } from "./useUsers";
import UserRow from "./UserRow";
import Empty from "../../ui/Empty";
import { useSearchParams } from "react-router-dom";

function UserTable() {
  const { isLoading, users } = useUsers();
  const [searchParams] = useSearchParams();

  if (isLoading) return <Spinner />;

  if (!users?.length) return <Empty resource="users" />;

  // 1) FILTER
  const filterValue = searchParams.get("role") || "all";

  let filteredUsers;
  if (filterValue === "all") filteredUsers = users;
  if (filterValue !== "all") {
    // Treat null/undefined roles as 'guest' for filtering purposes
    filteredUsers = users.filter(
      (user) => (user.role || "guest") === filterValue,
    );
  }

  return (
    <Menus>
      <Table columns="0.6fr 1.5fr 2fr 1fr 1fr 0.5fr">
        <Table.Header>
          <div></div>
          <div>Full Name</div>
          <div>Email</div>
          <div>Role</div>
          <div>Created At</div>
          <div></div>
        </Table.Header>

        <Table.Body
          data={filteredUsers}
          render={(user) => <UserRow user={user} key={user.id} />}
        />
      </Table>
    </Menus>
  );
}

export default UserTable;
