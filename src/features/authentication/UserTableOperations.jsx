import TableOperations from "../../ui/TableOperations";
import Filter from "../../ui/Filter";

function UserTableOperations() {
  return (
    <TableOperations>
      <Filter
        filterField="role"
        options={[
          { value: "all", label: "All" },
          { value: "guest", label: "Guests" },
          { value: "cook", label: "Cooks" },
          { value: "staff", label: "Staff" },
          { value: "admin", label: "Admins" },
        ]}
      />
    </TableOperations>
  );
}

export default UserTableOperations;
