import styled from "styled-components";

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-bottom: 3.2rem;
  padding: 0 0.4rem;

  /* Tablet */
  @media (max-width: 768px) {
    gap: 0.6rem;
    margin-bottom: 2.8rem;
    padding: 0;
  }

  /* Mobile */
  @media (max-width: 480px) {
    gap: 0.5rem;
    margin-bottom: 2.4rem;
  }

  /* Small Mobile */
  @media (max-width: 360px) {
    margin-bottom: 2rem;
  }
`;

const Title = styled.h1`
  font-size: 2.4rem;
  font-weight: 700;
  color: var(--color-grey-900);
  margin: 0;
  line-height: 1.2;

  /* Tablet */
  @media (max-width: 768px) {
    font-size: 2.2rem;
    line-height: 1.3;
  }

  /* Mobile */
  @media (max-width: 480px) {
    font-size: 2rem;
    font-weight: 600;
  }

  /* Small Mobile */
  @media (max-width: 360px) {
    font-size: 1.8rem;
  }

  /* Landscape mode on mobile */
  @media (max-width: 480px) and (orientation: landscape) {
    font-size: 1.8rem;
    margin-bottom: 0.2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.6rem;
  color: var(--color-grey-600);
  margin: 0;
  line-height: 1.4;
  max-width: 60rem;

  /* Tablet */
  @media (max-width: 768px) {
    font-size: 1.5rem;
    line-height: 1.5;
    max-width: 100%;
  }

  /* Mobile */
  @media (max-width: 480px) {
    font-size: 1.4rem;
    line-height: 1.6;
    color: var(--color-grey-700);
  }

  /* Small Mobile */
  @media (max-width: 360px) {
    font-size: 1.3rem;
    line-height: 1.5;
  }

  /* Landscape mode on mobile */
  @media (max-width: 480px) and (orientation: landscape) {
    font-size: 1.3rem;
    line-height: 1.4;
  }
`;

const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-top: 1.6rem;

  /* Tablet */
  @media (max-width: 768px) {
    margin-top: 1.4rem;
    gap: 1rem;
  }

  /* Mobile */
  @media (max-width: 480px) {
    margin-top: 1.2rem;
    gap: 0.8rem;
    flex-direction: column;
    align-items: stretch;
  }

  /* Small Mobile */
  @media (max-width: 360px) {
    margin-top: 1rem;
    gap: 0.6rem;
  }
`;

// Main UserHeader component
function ItemHeader({ title, subtitle, actions, children }) {
  return (
    <HeaderContainer>
      <Title>{title}</Title>
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
      {actions && <ActionContainer>{actions}</ActionContainer>}
      {children}
    </HeaderContainer>
  );
}

export default ItemHeader;
