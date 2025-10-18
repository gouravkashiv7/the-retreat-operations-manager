import styled from "styled-components";
import HeaderMenu from "./HeaderMenu";
import UserAvatar from "../features/authentication/UserAvatar";
import { HiBars3 } from "react-icons/hi2";
import { MobileToggleButton } from "./MobileToggleButton";
import { useMobile } from "../context/MobileContext";

const StyledHeader = styled.header`
  background-color: var(--color-grey-0);
  padding: 1.2rem 4.8rem;
  border-bottom: 1px solid var(--color-grey-100);
  display: flex;
  gap: 2.4rem;
  align-items: center;
  justify-content: flex-end;

  @media (max-width: 768px) {
    padding: 1.2rem 2.4rem;
    justify-content: space-between;
  }

  @media (max-width: 480px) {
    padding: 1rem 1.6rem;
    gap: 1.6rem;
  }
`;

const HeaderLeft = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    gap: 1.2rem;
  }
`;

function Header() {
  const { toggleSidebar } = useMobile();

  return (
    <StyledHeader>
      <HeaderLeft>
        <MobileToggleButton onClick={toggleSidebar}>
          <HiBars3 />
        </MobileToggleButton>
      </HeaderLeft>
      <UserAvatar />
      <HeaderMenu />
    </StyledHeader>
  );
}

export default Header;
