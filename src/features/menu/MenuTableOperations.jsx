import TableOperations from "../../ui/TableOperations";
import Filter from "../../ui/Filter";
import SortBy from "../../ui/SortBy";

function MenuTableOperations() {
  return (
    <TableOperations>
      <Filter
        filterField="category"
        options={[
          { value: "all", label: "All" },
          { value: "Snacks", label: "Snacks" },
          { value: "Soups & Salads", label: "Soups & Salads" },
          { value: "Desserts", label: "Desserts" },
          { value: "Breakfast", label: "Breakfast" },
          { value: "Lunch / Dinner", label: "Lunch / Dinner" },
          { value: "Drinks & Beverages", label: "Drinks & Beverages" },
          { value: "Roti, Rice and Dahi", label: "Roti, Rice and Dahi" },
          { value: "Himachali Cuisine", label: "Himachali Cuisine" },
        ]}
      />

      <SortBy
        options={[
          { value: "name-asc", label: "Sort by name (A-Z)" },
          { value: "name-desc", label: "Sort by name (Z-A)" },
          { value: "price-asc", label: "Sort by price (low first)" },
          { value: "price-desc", label: "Sort by price (high first)" },
        ]}
      />
    </TableOperations>
  );
}

export default MenuTableOperations;
