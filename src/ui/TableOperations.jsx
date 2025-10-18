import styled from "styled-components";

const TableOperations = styled.div`
  display: flex;
  align-items: center;
  gap: 1.6rem;

  @media (max-width: 768px) {
    gap: 1.2rem;
    flex-wrap: wrap;
  }

  @media (max-width: 480px) {
    gap: 1rem;
    justify-content: center;
  }
`;
export default TableOperations;
