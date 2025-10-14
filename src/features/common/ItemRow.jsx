import { useState } from "react";

import styled from "styled-components";
import CreateItemForm from "./CreateItemForm";

import { calculateDiscount, formatCurrency } from "../../utils/helpers";
import { useDeleteItem } from "./useDeleteItem.js";
import { HiPencil, HiSquare2Stack, HiTrash } from "react-icons/hi2";
import { useCreateItem } from "./useCreateItem.js";

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 0.6fr 1.8fr 2.2fr 1fr 1fr 1fr;
  column-gap: 2.4rem;
  align-items: center;
  padding: 1.4rem 2.4rem;

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }
`;

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
  const [showForm, setShowForm] = useState(false);
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
      <TableRow role="row">
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
          <button onClick={handleDuplicate} disabled={isCreating}>
            <HiSquare2Stack />
          </button>
          <button onClick={() => setShowForm((show) => !show)}>
            <HiPencil />
          </button>
          <button onClick={() => deleteItem(itemId)} disabled={isDeleting}>
            <HiTrash />
          </button>
        </div>
      </TableRow>
      {showForm && (
        <CreateItemForm
          itemToEdit={item}
          itemName={itemName}
          onClose={() => setShowForm(false)}
        />
      )}
    </>
  );
}

export default ItemRow;
