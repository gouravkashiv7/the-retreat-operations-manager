import styled from "styled-components";
import TableOperations from "../../ui/TableOperations";
import Filter from "../../ui/Filter";
import SortBy from "../../ui/SortBy";
import { useSearchParams } from "react-router-dom";

const categories = [
  { value: "all", label: "All" },
  { value: "Snacks", label: "Snacks" },
  { value: "Soups & Salads", label: "Soups & Salads" },
  { value: "Desserts", label: "Desserts" },
  { value: "Breakfast", label: "Breakfast" },
  { value: "Lunch / Dinner", label: "Lunch / Dinner" },
  { value: "Drinks & Beverages", label: "Drinks & Beverages" },
  { value: "Roti, Rice and Dahi", label: "Roti, Rice and Dahi" },
  { value: "Himachali Cuisine", label: "Himachali Cuisine" },
];

const sortOptions = [
  { value: "name-asc", label: "Name (A–Z)" },
  { value: "name-desc", label: "Name (Z–A)" },
  { value: "price-asc", label: "Price (low first)" },
  { value: "price-desc", label: "Price (high first)" },
];

/* Stack controls vertically on small screens */
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

/* Desktop filter is horizontal buttons, hidden on mobile */
const DesktopFilter = styled.div`
  @media (max-width: 640px) {
    display: none;
  }
`;

/* Mobile: category + sort as compact dropdowns side-by-side */
const MobileControls = styled.div`
  display: none;

  @media (max-width: 640px) {
    display: flex;
    gap: 0.8rem;
  }
`;

const MobileSelect = styled.select`
  flex: 1;
  padding: 0.7rem 1rem;
  font-size: 1.3rem;
  font-family: inherit;
  border: 1px solid var(--color-grey-300);
  border-radius: var(--border-radius-sm);
  background: var(--color-grey-0);
  color: var(--color-grey-700);
  font-weight: 500;
  box-shadow: var(--shadow-sm);
  cursor: pointer;

  option {
    font-size: 1.3rem;
    font-family: inherit;
    background-color: var(--color-grey-0);
    color: var(--color-grey-700);
  }

  &:focus {
    outline: none;
    border-color: var(--color-brand-500);
    box-shadow: 0 0 0 2px var(--color-brand-100, #e0e7ff);
  }
`;

function MenuTableOperations() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get("category") || "all";
  const currentSort = searchParams.get("sortBy") || "name-asc";

  function handleCategoryChange(e) {
    searchParams.set("category", e.target.value);
    setSearchParams(searchParams);
  }

  function handleSortChange(e) {
    searchParams.set("sortBy", e.target.value);
    setSearchParams(searchParams);
  }

  return (
    <Wrapper>
      {/* Desktop: filter buttons + sort dropdown */}
      <DesktopFilter>
        <TableOperations>
          <Filter filterField="category" options={categories} />
          <SortBy options={sortOptions} />
        </TableOperations>
      </DesktopFilter>

      {/* Mobile: two compact selects */}
      <MobileControls>
        <MobileSelect value={currentCategory} onChange={handleCategoryChange}>
          {categories.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </MobileSelect>

        <MobileSelect value={currentSort} onChange={handleSortChange}>
          {sortOptions.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </MobileSelect>
      </MobileControls>
    </Wrapper>
  );
}

export default MenuTableOperations;
