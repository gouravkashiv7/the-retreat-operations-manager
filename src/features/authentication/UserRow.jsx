import styled from "styled-components";
import Table from "../../ui/Table";
import Modal from "../../ui/Modal";
import Menus from "../../ui/Menus";
import ConfirmDelete from "../../ui/ConfirmDelete";
import { HiKey, HiTrash } from "react-icons/hi2";
import { useDeleteUser } from "./useDeleteUser";
import { useResetPassword } from "./useResetPassword";
import Avatar from "../../ui/Avatar";

const Role = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: var(--color-green-700);
  background-color: var(--color-green-100);
  padding: 0.4rem 1.2rem;
  border-radius: 100px;
  text-transform: capitalize;
  display: inline-block;
  text-align: center;
  width: max-content;
`;

const Email = styled.div`
  color: var(--color-grey-500);
`;

const FullName = styled.div`
  font-weight: 600;
  color: var(--color-grey-600);
`;

function UserRow({ user }) {
  const { id, email, role, full_name, avatar, created_at } = user;
  const { isDeleting, deleteUser } = useDeleteUser();
  const { isResetting, resetPassword } = useResetPassword();

  const displayRole = role || "guest"; // Default role if null

  return (
    <Table.Row>
      <Avatar src={avatar} fullName={full_name} />
      <FullName>{full_name || "N/A"}</FullName>
      <Email>{email}</Email>
      <Role>{displayRole}</Role>
      <div>{new Date(created_at).toLocaleDateString()}</div>

      <div>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={id} />

            <Menus.List id={id}>
              <Menus.Button
                icon={<HiKey />}
                onClick={
                  () => resetPassword({ id, newPassword: "password123" }) // Simple reset default for this example
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
      </div>
    </Table.Row>
  );
}

export default UserRow;
