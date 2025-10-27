import Button from "../../ui/Button";
import CreateItemForm from "../../features/common/CreateItemForm";

import Modal from "../../ui/Modal";

function AddItem({ itemName }) {
  return (
    <div>
      <Modal>
        <Modal.Open opens="item-form">
          <Button>{`Add New ${
            itemName.charAt(0).toUpperCase() + itemName.slice(1)
          }`}</Button>
        </Modal.Open>
        <Modal.Window name="item-form">
          {/* <CreateItemForm itemName={itemName} queryKey={`${itemName}s`} /> */}
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddItem;
