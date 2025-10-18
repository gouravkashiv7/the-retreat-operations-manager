// import styled from "styled-components";
// import Header from "./Header";
// import Sidebar from "./Sidebar";
// import { Outlet } from "react-router-dom";

// const StyledAppLayout = styled.div`
//   display: grid;
//   grid-template-columns: 26rem 1fr;
//   grid-template-rows: auto 1fr;
//   height: 100vh;
// `;

// const Main = styled.main`
//   background-color: var(--color-grey-50);
//   padding: 4rem 4.8rem 6.4rem;
//   overflow: auto;
// `;

// const Container = styled.div`
//   max-width: 120rem;
//   margin: 0 auto;
//   display: flex;
//   flex-direction: column;
//   gap: 3.2rem;
// `;

// function AppLayout() {
//   return (
//     <StyledAppLayout>
//       <Header />
//       <Sidebar />
//       <Main>
//         <Container>
//           <Outlet />
//         </Container>
//       </Main>
//     </StyledAppLayout>
//   );
// }

// export default AppLayout;

import styled from "styled-components";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { useMobile } from "../context/MobileContext";

const StyledAppLayout = styled.div`
  display: grid;
  grid-template-columns: 26rem 1fr;
  grid-template-rows: auto 1fr;
  height: 100vh;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;

    /* Hide sidebar by default on mobile */
    ${(props) =>
      props.$showSidebar
        ? `
      grid-template-columns: 26rem 1fr;
    `
        : ""}
  }
`;

const Main = styled.main`
  background-color: var(--color-grey-50);
  padding: 4rem 4.8rem 6.4rem;
  overflow: auto;

  @media (max-width: 768px) {
    padding: 2rem 1.6rem 3.2rem;
  }

  @media (max-width: 480px) {
    padding: 1.6rem 1.2rem 2.4rem;
  }
`;

const Container = styled.div`
  max-width: 120rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;

  @media (max-width: 768px) {
    gap: 2.4rem;
  }
`;

const MobileOverlay = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: ${(props) => (props.$show ? "block" : "none")};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 998;
  }
`;

function AppLayout() {
  const { showSidebarOnMobile, closeSidebar } = useMobile();

  return (
    <>
      <MobileOverlay $show={showSidebarOnMobile} onClick={closeSidebar} />
      <StyledAppLayout $showSidebar={showSidebarOnMobile}>
        <Header />
        <Sidebar />
        <Main>
          <Container>
            <Outlet />
          </Container>
        </Main>
      </StyledAppLayout>
    </>
  );
}

export default AppLayout;
