import styled from "styled-components";

const StyledStat = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 1.6rem;
  display: grid;
  grid-template-columns: 6.4rem 1fr;
  grid-template-rows: auto auto;
  column-gap: 1.6rem;
  row-gap: 0.4rem;

  /* Tablet */
  @media (max-width: 1024px) {
    padding: 1.4rem;
    grid-template-columns: 5.6rem 1fr;
    column-gap: 1.4rem;
  }

  /* Mobile */
  @media (max-width: 768px) {
    padding: 1.2rem;
    grid-template-columns: 4.8rem 1fr;
    column-gap: 1.2rem;
    row-gap: 0.3rem;
    border-radius: var(--border-radius-sm);
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    padding: 1rem;
    grid-template-columns: 4rem 1fr;
    column-gap: 1rem;
    row-gap: 0.2rem;
  }

  /* Very Small Mobile */
  @media (max-width: 360px) {
    padding: 0.8rem;
    grid-template-columns: 3.6rem 1fr;
    column-gap: 0.8rem;
  }
`;

const Icon = styled.div`
  grid-row: 1 / -1;
  aspect-ratio: 1;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-${(props) => props.color}-100);

  & svg {
    width: 3.2rem;
    height: 3.2rem;
    color: var(--color-${(props) => props.color}-700);
  }

  /* Tablet */
  @media (max-width: 1024px) {
    & svg {
      width: 2.8rem;
      height: 2.8rem;
    }
  }

  /* Mobile */
  @media (max-width: 768px) {
    & svg {
      width: 2.4rem;
      height: 2.4rem;
    }
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    & svg {
      width: 2rem;
      height: 2rem;
    }
  }

  /* Very Small Mobile */
  @media (max-width: 360px) {
    & svg {
      width: 1.8rem;
      height: 1.8rem;
    }
  }
`;

const Title = styled.h5`
  align-self: end;
  font-size: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  font-weight: 600;
  color: var(--color-grey-500);

  /* Tablet */
  @media (max-width: 1024px) {
    font-size: 1.1rem;
    letter-spacing: 0.3px;
  }

  /* Mobile */
  @media (max-width: 768px) {
    font-size: 1rem;
    letter-spacing: 0.2px;
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }

  /* Very Small Mobile */
  @media (max-width: 360px) {
    font-size: 0.8rem;
  }
`;

const Value = styled.p`
  font-size: 2.4rem;
  line-height: 1;
  font-weight: 500;

  /* Tablet */
  @media (max-width: 1024px) {
    font-size: 2.2rem;
  }

  /* Mobile */
  @media (max-width: 768px) {
    font-size: 2rem;
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    font-size: 1.8rem;
  }

  /* Very Small Mobile */
  @media (max-width: 360px) {
    font-size: 1.6rem;
  }
`;

function Stat({ icon, title, value, color }) {
  return (
    <StyledStat>
      <Icon color={color}>{icon}</Icon>
      <Title>{title}</Title>
      <Value>{value}</Value>
    </StyledStat>
  );
}

export default Stat;
