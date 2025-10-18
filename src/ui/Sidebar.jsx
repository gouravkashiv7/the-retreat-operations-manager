// import styled from "styled-components";
// import Logo from "./Logo";
// import MainNav from "./MainNav";

// const StyledSidebar = styled.header`
//   background-color: var(--color-grey-0);
//   padding: 3.2rem 2.4rem;
//   border-right: 1px solid var(--color-grey-100);
//   grid-row: 1/-1;
//   height: 100%;
//   display: flex;
//   flex-direction: column;
//   gap: 3.2rem;
// `;

// function Sidebar({ onItemClick }) {
//   return (
//     <StyledSidebar>
//       <Logo />
//       <MainNav onItemClick={onItemClick} />
//     </StyledSidebar>
//   );
// }

// export default Sidebar;

import styled from "styled-components";
import Logo from "./Logo";
import MainNav from "./MainNav";
import { useMobile } from "../context/MobileContext";

const StyledSidebar = styled.header`
  background-color: var(--color-grey-0);
  padding: 3.2rem 2.4rem;
  border-right: 1px solid var(--color-grey-100);
  grid-row: 1/-1;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 26rem;
    z-index: 999;
    transform: ${(props) =>
      props.$show ? "translateX(0)" : "translateX(-100%)"};
    transition: transform 0.3s ease-in-out;
    box-shadow: ${(props) =>
      props.$show ? "2px 0 8px rgba(0, 0, 0, 0.15)" : "none"};
  }

  @media (max-width: 480px) {
    width: 85vw;
    max-width: 26rem;
  }
`;

function Sidebar() {
  const { showSidebarOnMobile, closeSidebar } = useMobile();

  return (
    <StyledSidebar $show={showSidebarOnMobile}>
      <Logo />
      <MainNav onItemClick={closeSidebar} />
    </StyledSidebar>
  );
}

export default Sidebar;
