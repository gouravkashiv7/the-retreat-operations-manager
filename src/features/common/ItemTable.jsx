import Spinner from "../../ui/Spinner";
import ItemRow from "./ItemRow";

import { useItems } from "./useItems";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import { useSearchParams } from "react-router-dom";

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
    </Menus>
  );
}

export default ItemTable;
