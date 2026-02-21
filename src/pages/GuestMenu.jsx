import styled from "styled-components";
import GuestMenuDisplay from "../features/menu/GuestMenuDisplay";

const StyledGuestMenu = styled.main`
  background-color: var(--color-grey-50);
  min-height: 100vh;
  padding: 4.8rem 0;

  @media (max-width: 768px) {
    padding: 2.4rem 0;
  }
`;

function GuestMenu() {
  return (
    <StyledGuestMenu>
      <GuestMenuDisplay />
    </StyledGuestMenu>
  );
}

export default GuestMenu;
