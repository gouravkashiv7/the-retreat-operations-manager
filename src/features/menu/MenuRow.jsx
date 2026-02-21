import styled from "styled-components";
import { HiPencil, HiTrash, HiOutlinePhoto } from "react-icons/hi2";

import Menus from "../../ui/Menus";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import Table from "../../ui/Table";
import CreateMenuItemForm from "./CreateMenuItemForm";
import { useDeleteItem } from "../common/useDeleteItem";
import { formatCurrency } from "../../utils/helpers";

const Img = styled.img`
  display: block;
  width: 6.4rem;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);

  @media (max-width: 768px) {
    width: 4.8rem;
    transform: scale(1.2) translateX(-4px);
  }
`;

const ImgPlaceholder = styled.div`
  width: 6.4rem;
  aspect-ratio: 3 / 2;
  background-color: var(--color-grey-100);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-grey-400);
  font-size: 2.4rem;
  border-radius: var(--border-radius-sm);

  @media (max-width: 768px) {
    width: 4.8rem;
  }
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

const Category = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: var(--color-green-700);

  @media (max-width: 600px) {
    display: none;
  }
`;

function MenuRow({ menuItem }) {
  const { isDeleting, deleteItem } = useDeleteItem("menu_item", "menu");
  const {
    id: menuItemId,
    name,
    price,
    category,
    image,
    description,
  } = menuItem;

  return (
    <Table.Row>
      {image ? (
        <Img src={image} alt={name} />
      ) : (
        <ImgPlaceholder>
          <HiOutlinePhoto />
        </ImgPlaceholder>
      )}
      <Item>{name}</Item>
      <Category>{category}</Category>
      <Price>{formatCurrency(price)}</Price>
      <div>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={menuItemId} />

            <Menus.List id={menuItemId}>
              <Modal.Open opens="edit">
                <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
              </Modal.Open>

              <Modal.Open opens="delete">
                <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
              </Modal.Open>
            </Menus.List>

            <Modal.Window name="edit">
              <CreateMenuItemForm itemToEdit={menuItem} />
            </Modal.Window>

            <Modal.Window name="delete">
              <ConfirmDelete
                resourceName="menu item"
                disabled={isDeleting}
                onConfirm={() => deleteItem(menuItemId)}
              />
            </Modal.Window>
          </Menus.Menu>
        </Modal>
      </div>
    </Table.Row>
  );
}

export default MenuRow;
