// components/ui/SearchBar.jsx
import styled from "styled-components";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import Spinner from "./Spinner";

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 4rem;
  border: 1px solid var(--color-grey-300);
  border-radius: var(--border-radius-sm);
  font-size: 1.4rem;
  background-color: var(--color-grey-0);
  color: var(--color-grey-700);
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: var(--color-brand-600);
    box-shadow: 0 0 0 3px var(--color-brand-100);
    background-color: var(--color-grey-0);
  }

  &::placeholder {
    color: var(--color-grey-500);
  }

  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    background-color: var(--color-grey-0);
    color: var(--color-grey-700);
    border-color: var(--color-grey-300);

    &:focus {
      background-color: var(--color-grey-0);
      border-color: var(--color-brand-600);
      box-shadow: 0 0 0 3px var(--color-brand-800);
    }
  }
`;

const SearchIcon = styled(HiOutlineMagnifyingGlass)`
  position: absolute;
  left: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  width: 2rem;
  height: 2rem;
  color: var(--color-grey-500);
`;

const SpinnerContainer = styled.div`
  position: absolute;
  right: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
`;

function SearchBar({
  placeholder = "Search...",
  value,
  onChange,
  isLoading = false,
  ...props
}) {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <SearchContainer>
      <SearchIcon />
      <SearchInput
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        {...props}
      />
      {isLoading && (
        <SpinnerContainer>
          <Spinner size="small" />
        </SpinnerContainer>
      )}
    </SearchContainer>
  );
}

export default SearchBar;
