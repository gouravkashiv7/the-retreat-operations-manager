import styled, { css } from "styled-components";

const Row = styled.div.attrs((props) => ({
  type: props.type || "vertical",
}))`
  display: flex;

  /* Base styles for all row types */
  ${(props) =>
    props.type === "horizontal" &&
    css`
      justify-content: space-between;
      align-items: center;

      /* Tablet */
      @media (max-width: 768px) {
        gap: 1.2rem;

        /* Allow wrapping on tablet if needed */
        ${(props) =>
          props.$wrapOnTablet &&
          css`
            flex-wrap: wrap;
          `}
      }

      /* Mobile */
      @media (max-width: 480px) {
        gap: 1rem;

        /* Convert to column on mobile if specified */
        ${(props) =>
          props.$stackOnMobile &&
          css`
            flex-direction: column;
            align-items: stretch;
            justify-content: flex-start;
          `}

        /* Center align on mobile */
        ${(props) =>
          props.$centerOnMobile &&
          css`
            justify-content: center;
            text-align: center;
          `}
      }

      /* Small Mobile */
      @media (max-width: 360px) {
        gap: 0.8rem;
      }
    `}

  ${(props) =>
    props.type === "vertical" &&
    css`
      flex-direction: column;
      gap: 1.6rem;

      /* Tablet */
      @media (max-width: 768px) {
        gap: 1.4rem;
      }

      /* Mobile */
      @media (max-width: 480px) {
        gap: 1.2rem;
      }

      /* Small Mobile */
      @media (max-width: 360px) {
        gap: 1rem;
      }
    `}

  /* New responsive type that adapts automatically */
  ${(props) =>
    props.type === "responsive" &&
    css`
      justify-content: space-between;
      align-items: center;

      /* Tablet - start adapting */
      @media (max-width: 1024px) {
        gap: 1.4rem;
      }

      /* Mobile - switch to column */
      @media (max-width: 768px) {
        flex-direction: column;
        align-items: stretch;
        gap: 1.2rem;
        justify-content: flex-start;
      }

      /* Small Mobile */
      @media (max-width: 480px) {
        gap: 1rem;
      }
    `}

  /* Wrap type for flexible layouts */
  ${(props) =>
    props.type === "wrap" &&
    css`
      flex-wrap: wrap;
      gap: 1.6rem;

      /* Tablet */
      @media (max-width: 768px) {
        gap: 1.2rem;
      }

      /* Mobile - reduce gap and adjust wrap */
      @media (max-width: 480px) {
        gap: 1rem;

        /* Force single column on very small screens */
        ${(props) =>
          props.$singleColumnMobile &&
          css`
            & > * {
              flex: 1 1 100%;
            }
          `}
      }
    `}

  /* Common mobile utility props */
  @media (max-width: 768px) {
    ${(props) =>
      props.$tabletDirection &&
      css`
        flex-direction: ${props.$tabletDirection};
      `}

    ${(props) =>
      props.$tabletAlign &&
      css`
        align-items: ${props.$tabletAlign};
      `}
    
    ${(props) =>
      props.$tabletJustify &&
      css`
        justify-content: ${props.$tabletJustify};
      `}
  }

  @media (max-width: 480px) {
    ${(props) =>
      props.$mobileDirection &&
      css`
        flex-direction: ${props.$mobileDirection};
      `}

    ${(props) =>
      props.$mobileAlign &&
      css`
        align-items: ${props.$mobileAlign};
      `}
    
    ${(props) =>
      props.$mobileJustify &&
      css`
        justify-content: ${props.$mobileJustify};
      `}
    
    ${(props) =>
      props.$fullWidthMobile &&
      css`
        width: 100%;
      `}
  }

  /* Handle content that shouldn't break on mobile */
  @media (max-width: 480px) {
    ${(props) =>
      props.$noShrink &&
      css`
        & > * {
          flex-shrink: 0;
        }
      `}
  }
`;

export default Row;
