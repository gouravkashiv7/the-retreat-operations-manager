import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import CreateMenuItemForm from "./CreateMenuItemForm";

function AddMenuItem() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="menu-form">
          <Button>Add new item</Button>
        </Modal.Open>
        <Modal.Window name="menu-form">
          <CreateMenuItemForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddMenuItem;
