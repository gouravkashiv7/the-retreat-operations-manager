import styled from "styled-components";

const StyledEmpty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4.8rem 2.4rem;
  text-align: center;
  background-color: var(--color-grey-50);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--color-grey-200);
  margin: 2.4rem 0;
`;

const EmptyIcon = styled.div`
  width: 6.4rem;
  height: 6.4rem;
  margin-bottom: 1.6rem;
  color: var(--color-grey-400);

  svg {
    width: 100%;
    height: 100%;
  }
`;

const EmptyMessage = styled.p`
  font-size: 1.8rem;
  font-weight: 500;
  color: var(--color-grey-600);
  margin-bottom: 0.8rem;
`;

const EmptySubtitle = styled.p`
  font-size: 1.4rem;
  color: var(--color-grey-500);
  line-height: 1.6;
`;

function Empty({ resourceName }) {
  return (
    <StyledEmpty>
      <EmptyIcon>
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      </EmptyIcon>
      <EmptyMessage>No {resourceName} could be found.</EmptyMessage>
      <EmptySubtitle>Try adjusting your search or filters</EmptySubtitle>
    </StyledEmpty>
  );
}

export default Empty;
