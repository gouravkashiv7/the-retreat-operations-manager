import styled from "styled-components";

const StyledFormRow = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 24rem 1fr 1.2fr;
  gap: 2.4rem;
  padding: 1.2rem 0;

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    padding-bottom: 0;
  }

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }

  &:has(button) {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
  }

  /* Tablet */
  @media (max-width: 1024px) {
    grid-template-columns: 20rem 1fr 1.2fr;
    gap: 2rem;
    padding: 1rem 0;
  }

  /* Small Tablet */
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.2rem;
    align-items: stretch;
    padding: 1.6rem 0;

    &:not(:last-child) {
      border-bottom: 1px solid var(--color-grey-100);
      padding-bottom: 1.6rem;
    }

    /* Reset button row styles for mobile */
    &:has(button) {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;
    }
  }

  /* Mobile */
  @media (max-width: 480px) {
    gap: 1rem;
    padding: 1.4rem 0;

    &:not(:last-child) {
      padding-bottom: 1.4rem;
    }

    &:has(button) {
      gap: 0.8rem;
    }
  }

  /* Small Mobile */
  @media (max-width: 360px) {
    gap: 0.8rem;
    padding: 1.2rem 0;

    &:not(:last-child) {
      padding-bottom: 1.2rem;
    }
  }
`;

const Label = styled.label`
  font-weight: 500;

  /* Tablet */
  @media (max-width: 768px) {
    font-size: 1.4rem;
    margin-bottom: 0.4rem;
    display: block;
  }

  /* Mobile */
  @media (max-width: 480px) {
    font-size: 1.3rem;
    font-weight: 600; /* Better readability on small screens */
  }
`;

const Error = styled.span`
  font-size: 1.4rem;
  color: var(--color-red-700);

  /* Tablet */
  @media (max-width: 768px) {
    font-size: 1.3rem;
    grid-column: 1 / -1; /* Span full width on mobile */
    order: 3; /* Ensure error appears after input */
    margin-top: -0.4rem; /* Pull error closer to input */
  }

  /* Mobile */
  @media (max-width: 480px) {
    font-size: 1.2rem;
    line-height: 1.3;
    margin-top: -0.2rem;
  }
`;

const ChildrenWrapper = styled.div`
  /* Ensure form controls are mobile-friendly */
  & input,
  & select,
  & textarea {
    width: 100%;

    @media (max-width: 768px) {
      font-size: 16px; /* Prevent zoom on iOS */
    }

    @media (max-width: 480px) {
      min-height: 4.4rem; /* Better touch targets */
      padding: 1rem 1.2rem;
    }
  }

  /* Specific styling for different input types on mobile */
  @media (max-width: 480px) {
    input[type="text"],
    input[type="email"],
    input[type="password"],
    input[type="number"] {
      height: 4.4rem;
    }

    select {
      height: 4.4rem;
    }

    textarea {
      min-height: 10rem;
    }
  }
`;

function FormRow({ label, error, children }) {
  return (
    <StyledFormRow>
      {label && (
        <Label htmlFor={children.props?.id || "discount"}>{label}</Label>
      )}
      <ChildrenWrapper>{children}</ChildrenWrapper>
      {error && <Error>{error}</Error>}
    </StyledFormRow>
  );
}

export default FormRow;
