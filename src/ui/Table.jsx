import { createContext, useContext } from "react";
import styled from "styled-components";

const TableContainer = styled.div`
  width: 100%;

  /* Horizontal scroll ONLY on mobile */
  @media (max-width: 768px) {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    margin: 0 -1rem;
    padding: 0 1rem;

    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  @media (max-width: 480px) {
    margin: 0 -0.5rem;
    padding: 0 0.5rem;
  }
`;

const StyledTable = styled.div`
  border: 1px solid var(--color-grey-200);
  font-size: 1.4rem;
  background-color: var(--color-grey-0);
  border-radius: 7px;
  overflow: hidden;
  width: 100%; /* Normal width on desktop */

  /* Mobile-specific styles */
  @media (max-width: 768px) {
    font-size: 1.3rem;
    border-radius: 5px;
    min-width: max-content; /* Only expand on mobile when needed */
    width: auto; /* Allow expansion beyond container */
  }
`;

const CommonRow = styled.div`
  display: grid;
  grid-template-columns: ${(props) => props.$columns};
  column-gap: 2.4rem;
  align-items: center;
  transition: none;
  width: 100%; /* Normal behavior on desktop */

  /* Mobile-specific */
  @media (max-width: 768px) {
    column-gap: 1.6rem;
    min-width: max-content; /* Only on mobile */
  }

  @media (max-width: 480px) {
    column-gap: 1.2rem;
  }
`;

const StyledHeader = styled(CommonRow)`
  padding: 1.6rem 2.4rem;
  background-color: var(--color-grey-50);
  border-bottom: 1px solid var(--color-grey-100);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  font-weight: 600;
  color: var(--color-grey-600);

  @media (max-width: 768px) {
    padding: 1.4rem 2rem;
    min-width: max-content; /* Only on mobile */
  }

  @media (max-width: 480px) {
    padding: 1.2rem 1.6rem;
    font-size: 1.2rem;
  }
`;

const StyledRow = styled(CommonRow)`
  padding: 1.2rem 2.4rem;

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }

  @media (max-width: 768px) {
    padding: 1rem 2rem;
    min-width: max-content; /* Only on mobile */
  }

  @media (max-width: 480px) {
    padding: 0.8rem 1.6rem;
  }
`;

const StyledBody = styled.section`
  margin: 0.4rem 0;
  width: 100%;

  @media (max-width: 768px) {
    margin: 0.2rem 0;
    min-width: max-content; /* Only on mobile */
  }
`;
const Footer = styled.footer`
  background-color: var(--color-grey-50);
  display: flex;
  justify-content: center;
  padding: 1.2rem;

  &:not(:has(*)) {
    display: none;
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }

  @media (max-width: 480px) {
    padding: 0.8rem;
  }
`;

const Empty = styled.p`
  font-size: 1.6rem;
  font-weight: 500;
  text-align: center;
  margin: 2.4rem;

  @media (max-width: 768px) {
    font-size: 1.4rem;
    margin: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.3rem;
    margin: 1.6rem;
  }
`;

const TableContext = createContext();

function Table({ columns, children }) {
  return (
    <TableContainer>
      <TableContext.Provider value={{ columns }}>
        <StyledTable role="table">{children}</StyledTable>
      </TableContext.Provider>
    </TableContainer>
  );
}

function Header({ children }) {
  const { columns } = useContext(TableContext);
  return (
    <StyledHeader role="row" $columns={columns} as="header">
      {children}
    </StyledHeader>
  );
}

function Row({ children }) {
  const { columns } = useContext(TableContext);
  return (
    <StyledRow role="row" $columns={columns}>
      {children}
    </StyledRow>
  );
}

function Body({ data, render }) {
  if (!data || data.length === 0)
    return <Empty>No data to show at the moment</Empty>;

  return <StyledBody>{data.map(render)}</StyledBody>;
}

Table.Header = Header;
Table.Row = Row;
Table.Body = Body;
Table.Footer = Footer;

export default Table;
