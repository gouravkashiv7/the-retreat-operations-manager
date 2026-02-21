import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import Spinner from "../../ui/Spinner";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Empty from "../../ui/Empty";
import { useItems } from "../common/useItems";
import { getMenuItems } from "../../services/apiMenu";
import MenuRow from "./MenuRow";

const CategoryHeader = styled.div`
  @media (max-width: 600px) {
    display: none;
  }
`;

function MenuTable() {
  const { isLoading, items: menuItems } = useItems("menu", getMenuItems);
  const [searchParams] = useSearchParams();

  if (isLoading) return <Spinner />;
  if (!menuItems?.length) return <Empty resourceName="menu items" />;

  // 1) FILTER
  const filterValue = searchParams.get("category") || "all";

  let filteredMenuItems;
  if (filterValue === "all") filteredMenuItems = menuItems;
  if (filterValue !== "all")
    filteredMenuItems = menuItems.filter(
      (item) => item.category === filterValue,
    );

  // 2) SORT
  const sortBy = searchParams.get("sortBy") || "name-asc";
  const [field, direction] = sortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;
  const sortedMenuItems = filteredMenuItems.sort(
    (a, b) => (a[field] - b[field]) * modifier,
  );

  // Special handle for string sorting (name)
  if (field === "name") {
    sortedMenuItems.sort((a, b) => a.name.localeCompare(b.name) * modifier);
  }

  return (
    <Menus>
      <Table columns="0.6fr 1.8fr 1.2fr 1fr 0.5fr">
        <Table.Header>
          <div>Image</div>
          <div>Item</div>
          <CategoryHeader>Category</CategoryHeader>
          <div>Price</div>
          <div></div>
        </Table.Header>

        <Table.Body
          data={sortedMenuItems}
          render={(item) => <MenuRow menuItem={item} key={item.id} />}
        />
      </Table>
    </Menus>
  );
}

export default MenuTable;
