// import styled from "styled-components";

// const StyledFormRow = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 0.8rem;
//   padding: 1.2rem 0;
// `;

// const Label = styled.label`
//   font-weight: 500;
// `;

// const Error = styled.span`
//   font-size: 1.4rem;
//   color: var(--color-red-700);
// `;

// function FormRowVertical({ label, error, children }) {
//   return (
//     <StyledFormRow>
//       {label && <Label htmlFor={children.props.id}>{label}</Label>}
//       {children}
//       {error && <Error>{error}</Error>}
//     </StyledFormRow>
//   );
// }

// export default FormRowVertical;

import styled from "styled-components";

const StyledFormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding: 1.2rem 0;

  @media (max-width: 768px) {
    gap: 0.6rem;
    padding: 1rem 0;
  }

  @media (max-width: 480px) {
    gap: 0.5rem;
    padding: 0.8rem 0;
  }

  /* Ensure child inputs are mobile-friendly */
  & input,
  & select,
  & textarea {
    @media (max-width: 480px) {
      font-size: 16px; /* Prevents zoom on iOS */
      padding: 1rem 1.2rem;
    }
  }
`;

const Label = styled.label`
  font-weight: 500;

  @media (max-width: 480px) {
    font-size: 1.3rem;
  }
`;

const Error = styled.span`
  font-size: 1.4rem;
  color: var(--color-red-700);

  @media (max-width: 480px) {
    font-size: 1.2rem;
    line-height: 1.3;
  }
`;

function FormRowVertical({ label, error, children }) {
  return (
    <StyledFormRow>
      {label && <Label htmlFor={children.props.id}>{label}</Label>}
      {children}
      {error && <Error>{error}</Error>}
    </StyledFormRow>
  );
}

export default FormRowVertical;
