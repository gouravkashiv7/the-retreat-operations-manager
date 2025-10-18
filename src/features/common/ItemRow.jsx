import styled from "styled-components";
import CreateItemForm from "./CreateItemForm";
import Modal from "../../ui/Modal.jsx";
import ConfirmDelete from "../../ui/ConfirmDelete.jsx";

import { calculateDiscount, formatCurrency } from "../../utils/helpers";
import { useDeleteItem } from "./useDeleteItem.js";
import { HiPencil, HiSquare2Stack, HiTrash } from "react-icons/hi2";
import { useCreateItem } from "./useCreateItem.js";
import Table from "../../ui/Table.jsx";
import Menus from "../../ui/Menus.jsx";

const Img = styled.img`
  display: block;
  width: 6.4rem;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);
`;

const Item = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Price = styled.div`
  font-family: "Sono";
  font-weight: 600;
`;

const Discount = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: var(--color-green-700);
`;

function ItemRow({ item, queryKey, itemName }) {
  const {
    id: itemId,
    name,
    maxCapacity,
    regularPrice,
    discount: discountPercentage,
    image,
    description,
  } = item;

  const discount = calculateDiscount(regularPrice, discountPercentage);
  const { isDeleting, deleteItem } = useDeleteItem(itemName, queryKey);
  const { isCreating, createItem } = useCreateItem(itemName, queryKey);

  function handleDuplicate() {
    createItem({
      name: `Copy of ${name}`,
      maxCapacity,
      regularPrice,
      discount: discountPercentage,
      image,
      description,
    });
  }

  return (
    <>
      <Table.Row>
        <Img src={image} />
        <Item>{name}</Item>
        <div> Fits upto {maxCapacity} guests.</div>
        <Price>{formatCurrency(regularPrice)}</Price>
        {discount ? (
          <Discount>{formatCurrency(discount)}</Discount>
        ) : (
          <span> &mdash;</span>
        )}
        <div>
          <Modal>
            <Menus.Menu>
              <Menus.Toggle id={itemId} />
              <Menus.List id={itemId}>
                <Menus.Button
                  icon={<HiSquare2Stack />}
                  onClick={handleDuplicate}
                  disabled={isCreating}
                >
                  Duplicate
                </Menus.Button>
                <Modal.Open opens="edit-form">
                  <Menus.Button icon={<HiPencil />}> Edit</Menus.Button>
                </Modal.Open>
                <Modal.Open opens="delete-item">
                  <Menus.Button icon={<HiTrash />}> Delete</Menus.Button>
                </Modal.Open>
              </Menus.List>

              <Modal.Window name="edit-form">
                <CreateItemForm
                  itemToUpdate={item}
                  itemName={itemName}
                  queryKey={queryKey}
                />
              </Modal.Window>

              <Modal.Window name="delete-item">
                <ConfirmDelete
                  resourceName={itemName}
                  onConfirm={() => deleteItem(itemId)}
                  disabled={isDeleting}
                />
              </Modal.Window>
            </Menus.Menu>
          </Modal>
        </div>
      </Table.Row>
    </>
  );
}

export default ItemRow;
