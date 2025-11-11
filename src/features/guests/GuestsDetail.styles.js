import styled from "styled-components";

export const PageLayout = styled.div`
  padding: 2rem 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;

  /* Tablet */
  @media (max-width: 1024px) {
    padding: 1.5rem 1.2rem;
  }

  /* Mobile */
  @media (max-width: 768px) {
    padding: 1rem 1rem;
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    padding: 0.8rem 0.8rem;
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
  gap: 1.5rem;

  /* Tablet */
  @media (max-width: 1024px) {
    margin-bottom: 2rem;
    gap: 1.2rem;
  }

  /* Mobile */
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    gap: 1.2rem;
    margin-bottom: 1.5rem;
  }
`;

export const Title = styled.h1`
  font-size: 2.8rem;
  font-weight: 700;
  color: var(--color-grey-900);
  line-height: 1.2;
  background: linear-gradient(
    135deg,
    var(--color-brand-600),
    var(--color-brand-500)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  /* Tablet */
  @media (max-width: 1024px) {
    font-size: 2.4rem;
  }

  /* Mobile */
  @media (max-width: 768px) {
    font-size: 2.2rem;
    text-align: center;
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    font-size: 2rem;
  }

  /* Very Small Mobile */
  @media (max-width: 360px) {
    font-size: 1.8rem;
  }
`;

export const Controls = styled.div`
  display: flex;
  gap: 1.2rem;
  align-items: center;
  flex-wrap: wrap;

  /* Tablet */
  @media (max-width: 1024px) {
    gap: 1rem;
  }

  /* Mobile */
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    gap: 0.8rem;
  }
`;

export const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.8rem;
  margin-bottom: 3rem;

  /* Tablet */
  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2.5rem;
  }

  /* Mobile */
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.2rem;
    margin-bottom: 2rem;
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  /* Very Small Mobile */
  @media (max-width: 360px) {
    gap: 0.8rem;
  }
`;

export const StatCard = styled.div`
  background: linear-gradient(135deg, white, var(--color-grey-50));
  padding: 2rem 1.5rem;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  border-left: 6px solid var(--color-brand-500);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(
      90deg,
      var(--color-brand-500),
      var(--color-brand-300)
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }

  /* Tablet */
  @media (max-width: 1024px) {
    padding: 1.8rem 1.3rem;
    border-left-width: 5px;
  }

  /* Mobile */
  @media (max-width: 768px) {
    padding: 1.5rem 1.2rem;
    border-left-width: 4px;
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    padding: 1.3rem 1rem;
    text-align: center;
  }

  /* Very Small Mobile */
  @media (max-width: 360px) {
    padding: 1.2rem 0.8rem;
  }
`;

export const StatNumber = styled.div`
  font-size: 2.4rem;
  font-weight: 800;
  color: var(--color-grey-900);
  line-height: 1.1;
  margin-bottom: 0.5rem;

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

export const StatLabel = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-grey-600);
  line-height: 1.3;

  /* Tablet */
  @media (max-width: 1024px) {
    font-size: 1.4rem;
  }

  /* Mobile */
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    font-size: 1.2rem;
  }

  /* Very Small Mobile */
  @media (max-width: 360px) {
    font-size: 1.1rem;
  }
`;

// Additional utility components
export const Section = styled.section`
  margin-bottom: 3rem;

  /* Mobile */
  @media (max-width: 768px) {
    margin-bottom: 2rem;
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    margin-bottom: 1.5rem;
  }
`;

export const Card = styled.div`
  background: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  padding: 2rem;
  border: 1px solid var(--color-grey-200);

  /* Mobile */
  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: var(--border-radius-md);
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    padding: 1.2rem;
    border-radius: var(--border-radius-sm);
  }
`;
