import Spinner from "../../ui/Spinner";
import ItemRow from "./ItemRow";
import { useItems } from "./useItems";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";

const MobileTableContainer = styled.div`
  @media (max-width: 768px) {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    margin: 0 -1rem;
    padding: 0 1rem;

    /* Hide scrollbar */
    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  @media (max-width: 480px) {
    margin: 0 -0.5rem;
    padding: 0 0.5rem;
  }
`;

const MobileHeader = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
    font-size: 1.4rem;
    color: var(--color-grey-600);
    margin-bottom: 1rem;
    text-align: center;
  }
`;

function ItemTable({ queryKey, queryFn, itemName }) {
  const { isLoading, items } = useItems(queryKey, queryFn);
  const [searchParams] = useSearchParams();

  if (isLoading) return <Spinner />;

  if (!items || items.length === 0) {
    return (
      <Empty
        resourceName={`${itemName.charAt(0).toUpperCase() + itemName.slice(1)}`}
      />
    );
  }

  const sortBy = searchParams.get("sortBy") || "name-asc";
  const [field, direction] = sortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;
  const sortedItems = items.sort((a, b) => (a[field] - b[field]) * modifier);

  return (
    <Menus>
      <MobileHeader>Scroll horizontally to view all columns</MobileHeader>
      <MobileTableContainer>
        <Table columns="0.6fr 1.8fr 2.2fr 1fr 1fr 1fr">
          <Table.Header>
            <div></div>
            <div>Cabin</div>
            <div>Capacity</div>
            <div>Price</div>
            <div>Discount</div>
            <div></div>
          </Table.Header>

          <Table.Body
            data={sortedItems}
            render={(item) => (
              <ItemRow
                item={item}
                key={item.id}
                queryKey={queryKey}
                itemName={itemName}
              />
            )}
          />
        </Table>
      </MobileTableContainer>
    </Menus>
  );
}

export default ItemTable;
