import Spinner from "../../ui/Spinner";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Modal from "../../ui/Modal";
import { useUsers } from "./useUsers";
import UserRow from "./UserRow";
import Empty from "../../ui/Empty";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import Avatar from "../../ui/Avatar";
import ConfirmDelete from "../../ui/ConfirmDelete";
import { HiKey, HiTrash } from "react-icons/hi2";
import { useDeleteUser } from "./useDeleteUser";
import { useResetPassword } from "./useResetPassword";

const DesktopTable = styled.div`
  @media (max-width: 600px) {
    display: none;
  }
`;

const MobileCardList = styled.div`
  display: none;
  flex-direction: column;
  gap: 1.6rem;

  @media (max-width: 600px) {
    display: flex;
  }
`;

const UserCard = styled.div`
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 1.6rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  box-shadow: var(--shadow-sm);
`;

const UserCardTop = styled.div`
  display: flex;
  align-items: center;
  gap: 1.6rem;
`;

const UserCardInfo = styled.div`
  flex: 1;
  min-width: 0;

  & .name {
    font-weight: 700;
    font-size: 1.6rem;
    color: var(--color-grey-700);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  & .email {
    font-size: 1.3rem;
    color: var(--color-grey-500);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const UserCardMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RoleBadge = styled.span`
  display: inline-block;
  background-color: var(--color-green-100);
  color: var(--color-green-700);
  padding: 0.3rem 1rem;
  border-radius: 100px;
  font-size: 1.25rem;
  font-weight: 600;
  font-family: "Sono";
  text-transform: capitalize;
`;

const JoinedDate = styled.span`
  font-size: 1.2rem;
  color: var(--color-grey-400);
`;

const CardActions = styled.div`
  display: flex;
  gap: 0.8rem;
  justify-content: flex-end;
  border-top: 1px solid var(--color-grey-100);
  padding-top: 1.2rem;
`;

function UserMobileCard({ user }) {
  const { id, email, role, full_name, avatar, created_at } = user;
  const { isDeleting, deleteUser } = useDeleteUser();
  const { isResetting, resetPassword } = useResetPassword();
  const displayRole = role || "guest";

  return (
    <UserCard>
      <UserCardTop>
        <Avatar src={avatar} fullName={full_name} />
        <UserCardInfo>
          <div className="name">{full_name || "N/A"}</div>
          <div className="email">{email}</div>
        </UserCardInfo>
      </UserCardTop>

      <UserCardMeta>
        <RoleBadge>{displayRole}</RoleBadge>
        <JoinedDate>
          Joined {new Date(created_at).toLocaleDateString()}
        </JoinedDate>
      </UserCardMeta>

      <CardActions>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={id} />
            <Menus.List id={id}>
              <Menus.Button
                icon={<HiKey />}
                onClick={() =>
                  resetPassword({ id, newPassword: "password123" })
                }
                disabled={isResetting}
              >
                Reset Password
              </Menus.Button>

              <Modal.Open opens="delete">
                <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
              </Modal.Open>
            </Menus.List>
          </Menus.Menu>

          <Modal.Window name="delete">
            <ConfirmDelete
              resourceName="user"
              disabled={isDeleting}
              onConfirm={() => deleteUser(id)}
            />
          </Modal.Window>
        </Modal>
      </CardActions>
    </UserCard>
  );
}

function UserTable() {
  const { isLoading, users } = useUsers();
  const [searchParams] = useSearchParams();

  if (isLoading) return <Spinner />;
  if (!users?.length) return <Empty resource="users" />;

  const filterValue = searchParams.get("role") || "all";
  let filteredUsers;
  if (filterValue === "all") filteredUsers = users;
  if (filterValue !== "all") {
    filteredUsers = users.filter(
      (user) => (user.role || "guest") === filterValue,
    );
  }

  return (
    <Menus>
      {/* Desktop Table */}
      <DesktopTable>
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
      </DesktopTable>

      {/* Mobile Cards */}
      <MobileCardList>
        {filteredUsers.map((user) => (
          <UserMobileCard key={user.id} user={user} />
        ))}
      </MobileCardList>
    </Menus>
  );
}

export default UserTable;
