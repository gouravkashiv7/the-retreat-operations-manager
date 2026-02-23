import styled from "styled-components";

const StyledSelect = styled.select`
  font-size: 1.2rem;
  font-family: inherit;
  padding: 0.5rem 0.8rem;
  border: 1px solid
    ${(props) =>
      props.type === "white"
        ? "var(--color-grey-100)"
        : "var(--color-grey-300)"};
  border-radius: var(--border-radius-sm);
  background-color: var(--color-grey-0);
  color: var(--color-grey-700);
  font-weight: 500;
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  width: 100%;
  transition:
    border-color 0.15s,
    box-shadow 0.15s;

  /* Theme-aware option styling */
  option {
    font-size: 1.2rem;
    font-family: inherit;
    background-color: var(--color-grey-0);
    color: var(--color-grey-700);
  }

  &:focus {
    outline: none;
    border-color: var(--color-brand-500);
    box-shadow: 0 0 0 2px var(--color-brand-100, #e0e7ff);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: var(--color-grey-100);
  }

  @media (max-width: 768px) {
    font-size: 1.2rem;
    padding: 0.6rem 0.8rem;
  }
`;

function Select({ options, value, onChange, ...props }) {
  return (
    <StyledSelect value={value} {...props} onChange={onChange}>
      {options?.map((option) => (
        <option value={option.value} key={option.value}>
          {option.label}
        </option>
      ))}
    </StyledSelect>
  );
}

export default Select;
