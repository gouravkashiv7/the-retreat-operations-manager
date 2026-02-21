import Heading from "../ui/Heading";
import SignupForm from "../features/authentication/SignupForm";
import UserTable from "../features/authentication/UserTable";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import Row from "../ui/Row";
import UserTableOperations from "../features/authentication/UserTableOperations";

function Users() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">All Users</Heading>

        <UserTableOperations />

        <Modal>
          <Modal.Open opens="user-form">
            <Button>Add new user</Button>
          </Modal.Open>
          <Modal.Window name="user-form">
            <SignupForm />
          </Modal.Window>
        </Modal>
      </Row>

      <Row>
        <UserTable />
      </Row>
    </>
  );
}

export default Users;
