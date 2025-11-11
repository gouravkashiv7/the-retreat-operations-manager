import styled from "styled-components";
import Heading from "../ui/Heading";
import Row from "../ui/Row";

const MenuContainer = styled.div`
  padding: 2.4rem 4.8rem;

  @media (max-width: 768px) {
    padding: 1.6rem 2.4rem;
  }
`;

const StyledMenu = styled.div`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 3.2rem;
  margin-top: 2.4rem;
`;

function Menu() {
  return (
    <MenuContainer>
      <Row type="horizontal">
        <Heading as="h1">Menu Management</Heading>
      </Row>

      <StyledMenu>
        <Heading as="h2">Food & Beverage Menu</Heading>
        <p style={{ marginTop: "1.6rem", color: "var(--color-grey-600)" }}>
          Manage your retreat's food and beverage offerings, pricing, and
          categories.
        </p>
        {/* Add your menu management components here */}
      </StyledMenu>
    </MenuContainer>
  );
}

export default Menu;
