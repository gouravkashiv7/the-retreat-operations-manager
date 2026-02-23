import styled from "styled-components";
import Modal from "../../ui/Modal.jsx";
import Menus from "../../ui/Menus.jsx";
import CreateItemForm from "./CreateItemForm";
import { calculateDiscount, formatCurrency } from "../../utils/helpers";
import { HiPencil } from "react-icons/hi2";
import { useAuthorization } from "../../features/authentication/useAuthorization";

const Card = styled.div`
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-sm);
`;

const CardImage = styled.img`
  width: 100%;
  height: 16rem;
  object-fit: cover;
  object-position: center;
`;

const CardBody = styled.div`
  padding: 1.6rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CardTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-grey-700);
  font-family: "Sono";
`;

const CardMeta = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.8rem 1.6rem;
`;

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  & span:first-child {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--color-grey-400);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  & span:last-child {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-grey-700);
  }
`;

const DiscountBadge = styled.span`
  display: inline-block;
  background-color: var(--color-green-100);
  color: var(--color-green-700);
  padding: 0.2rem 0.8rem;
  border-radius: 100px;
  font-size: 1.3rem;
  font-weight: 600;
  font-family: "Sono";
`;

const CardFooter = styled.div`
  padding: 1.2rem 1.6rem;
  border-top: 1px solid var(--color-grey-100);
  display: flex;
  justify-content: flex-end;
`;

function ItemMobileCard({ item, queryKey, itemName }) {
  const {
    id: itemId,
    name,
    maxCapacity,
    regularPrice,
    discount: discountPercentage,
    image,
  } = item;

  const discount = calculateDiscount(regularPrice, discountPercentage);
  const { isGuest } = useAuthorization();

  return (
    <Card>
      {image && <CardImage src={image} alt={name} />}
      <CardBody>
        <CardTitle>{name}</CardTitle>
        <CardMeta>
          <MetaItem>
            <span>Capacity</span>
            <span>Up to {maxCapacity} guests</span>
          </MetaItem>
          <MetaItem>
            <span>Price / Night</span>
            <span>{formatCurrency(regularPrice)}</span>
          </MetaItem>
          {discount ? (
            <MetaItem>
              <span>Discounted Price</span>
              <DiscountBadge>{formatCurrency(discount)}</DiscountBadge>
            </MetaItem>
          ) : null}
        </CardMeta>
      </CardBody>

      {!isGuest && (
        <CardFooter>
          <Modal>
            <Menus.Menu>
              <Menus.Toggle id={itemId} />
              <Menus.List id={itemId}>
                <Modal.Open opens="edit-form">
                  <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
                </Modal.Open>
              </Menus.List>

              <Modal.Window name="edit-form">
                <CreateItemForm
                  itemToUpdate={item}
                  itemName={itemName}
                  queryKey={queryKey}
                />
              </Modal.Window>
            </Menus.Menu>
          </Modal>
        </CardFooter>
      )}
    </Card>
  );
}

export default ItemMobileCard;
