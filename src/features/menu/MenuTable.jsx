import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import Spinner from "../../ui/Spinner";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Modal from "../../ui/Modal";
import Empty from "../../ui/Empty";
import ConfirmDelete from "../../ui/ConfirmDelete";
import Button from "../../ui/Button";
import CreateMenuItemForm from "./CreateMenuItemForm";
import { useItems } from "../common/useItems";
import { getMenuItems } from "../../services/apiMenu";
import { useDeleteItem } from "../common/useDeleteItem";
import { useAuthorization } from "../authentication/useAuthorization";
import { formatCurrency } from "../../utils/helpers";
import MenuRow from "./MenuRow";
import { HiPencil, HiTrash, HiOutlinePhoto } from "react-icons/hi2";

/* ── Layout shells ── */
const DesktopTable = styled.div`
  @media (max-width: 640px) {
    display: none;
  }
`;

const MobileGrid = styled.div`
  display: none;

  @media (max-width: 640px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.2rem;
  }

  @media (max-width: 380px) {
    grid-template-columns: 1fr;
  }
`;

/* ── Menu item card ── */
const MenuCard = styled.div`
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: var(--shadow-md);
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 14rem;
  object-fit: cover;
  object-position: center;
`;

const CardImagePlaceholder = styled.div`
  width: 100%;
  height: 14rem;
  background: var(--color-grey-100);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-grey-300);
  font-size: 3.6rem;
`;

const CardBody = styled.div`
  padding: 1.2rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const CardName = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  font-family: "Sono";
  color: var(--color-grey-700);
  line-height: 1.3;
`;

const CategoryBadge = styled.span`
  display: inline-block;
  background: var(--color-green-100);
  color: var(--color-green-700);
  font-size: 1.1rem;
  font-weight: 600;
  padding: 0.2rem 0.7rem;
  border-radius: 100px;
  text-transform: capitalize;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 0.8rem;
`;

const CardPrice = styled.div`
  font-size: 1.6rem;
  font-weight: 800;
  font-family: "Sono";
  color: var(--color-brand-600);
`;

const CardActions = styled.div`
  display: flex;
  gap: 0.6rem;
  border-top: 1px solid var(--color-grey-100);
  padding: 0.8rem 1.2rem;
  justify-content: flex-end;
`;

/* ── Individual card component ── */
function MenuItemCard({ menuItem, isGuest }) {
  const { isDeleting, deleteItem } = useDeleteItem("menu_item", "menu");
  const { id, name, price, category, image } = menuItem;

  return (
    <Modal>
      <MenuCard>
        {image ? (
          <CardImage src={image} alt={name} />
        ) : (
          <CardImagePlaceholder>
            <HiOutlinePhoto />
          </CardImagePlaceholder>
        )}

        <CardBody>
          <CardName>{name}</CardName>
          {category && <CategoryBadge>{category}</CategoryBadge>}
          <PriceRow>
            <CardPrice>{formatCurrency(price)}</CardPrice>
          </PriceRow>
        </CardBody>

        {!isGuest && (
          <CardActions>
            <Modal.Open opens={`edit-${id}`}>
              <Button $size="small" $variation="secondary">
                <HiPencil style={{ marginRight: "0.3rem" }} />
                Edit
              </Button>
            </Modal.Open>
            <Modal.Open opens={`delete-${id}`}>
              <Button $size="small" $variation="danger" disabled={isDeleting}>
                <HiTrash style={{ marginRight: "0.3rem" }} />
                Del
              </Button>
            </Modal.Open>
          </CardActions>
        )}
      </MenuCard>

      <Modal.Window name={`edit-${id}`}>
        <CreateMenuItemForm itemToEdit={menuItem} />
      </Modal.Window>

      <Modal.Window name={`delete-${id}`}>
        <ConfirmDelete
          resourceName="menu item"
          disabled={isDeleting}
          onConfirm={() => deleteItem(id)}
        />
      </Modal.Window>
    </Modal>
  );
}

/* ── Main table component ── */
function MenuTable() {
  const { isGuest } = useAuthorization();
  const { isLoading, items: menuItems } = useItems("menu", getMenuItems);
  const [searchParams] = useSearchParams();

  if (isLoading) return <Spinner />;
  if (!menuItems?.length) return <Empty resourceName="menu items" />;

  // 1) Filter
  const filterValue = searchParams.get("category") || "all";
  let filteredMenuItems =
    filterValue === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === filterValue);

  // 2) Sort
  const sortBy = searchParams.get("sortBy") || "name-asc";
  const [field, direction] = sortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;
  const sortedMenuItems = [...filteredMenuItems].sort((a, b) =>
    field === "name"
      ? a.name.localeCompare(b.name) * modifier
      : (a[field] - b[field]) * modifier,
  );

  return (
    <Menus>
      {/* Desktop Table */}
      <DesktopTable>
        <Table
          columns={
            isGuest ? "0.6fr 1.8fr 1.2fr 1fr" : "0.6fr 1.8fr 1.2fr 1fr 0.5fr"
          }
        >
          <Table.Header>
            <div>Image</div>
            <div>Item</div>
            <div>Category</div>
            <div>Price</div>
            {!isGuest && <div></div>}
          </Table.Header>

          <Table.Body
            data={sortedMenuItems}
            render={(item) => <MenuRow menuItem={item} key={item.id} />}
          />
        </Table>
      </DesktopTable>

      {/* Mobile Card Grid */}
      <MobileGrid>
        {sortedMenuItems.map((item) => (
          <MenuItemCard key={item.id} menuItem={item} isGuest={isGuest} />
        ))}
      </MobileGrid>
    </Menus>
  );
}

export default MenuTable;
