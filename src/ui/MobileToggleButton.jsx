import styled from "styled-components";

export const MobileToggleButton = styled.button`
  display: none;
  background: none;
  border: none;
  padding: 0.8rem;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  color: var(--color-grey-600);

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
  }

  &:hover {
    background-color: var(--color-grey-100);
  }

  @media (max-width: 480px) {
    padding: 0.6rem;

    & svg {
      width: 2rem;
      height: 2rem;
    }
  }
`;
