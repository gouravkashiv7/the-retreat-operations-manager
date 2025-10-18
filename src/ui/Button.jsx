import styled, { css } from "styled-components";

const sizes = {
  small: css`
    font-size: 1.2rem;
    padding: 0.4rem 0.8rem;
    text-transform: uppercase;
    font-weight: 600;
    text-align: center;

    @media (max-width: 768px) {
      font-size: 1.1rem;
      padding: 0.5rem 0.9rem;
    }

    @media (max-width: 480px) {
      font-size: 1rem;
      padding: 0.6rem 1rem;
      min-height: 3.6rem; /* Better touch target */
    }
  `,
  medium: css`
    font-size: 1.4rem;
    padding: 1.2rem 1.6rem;
    font-weight: 500;

    @media (max-width: 768px) {
      font-size: 1.3rem;
      padding: 1.1rem 1.5rem;
    }

    @media (max-width: 480px) {
      font-size: 1.4rem; /* Slightly larger for mobile readability */
      padding: 1.2rem 1.6rem;
      min-height: 4.4rem; /* Minimum touch target size */
      font-weight: 600; /* Better readability on mobile */
    }
  `,
  large: css`
    font-size: 1.6rem;
    padding: 1.2rem 2.4rem;
    font-weight: 500;

    @media (max-width: 768px) {
      font-size: 1.5rem;
      padding: 1.3rem 2.2rem;
    }

    @media (max-width: 480px) {
      font-size: 1.6rem;
      padding: 1.4rem 2.4rem;
      min-height: 4.8rem; /* Enhanced touch target */
      font-weight: 600;
    }
  `,
};

const variations = {
  primary: css`
    color: var(--color-brand-50);
    background-color: var(--color-brand-600);

    &:hover {
      background-color: var(--color-brand-700);
    }

    @media (max-width: 480px) {
      &:active {
        background-color: var(--color-brand-700);
        transform: scale(0.98); /* Touch feedback */
      }
    }
  `,
  secondary: css`
    color: var(--color-grey-600);
    background: var(--color-grey-0);
    border: 1px solid var(--color-grey-200);

    &:hover {
      background-color: var(--color-grey-50);
    }

    @media (max-width: 480px) {
      &:active {
        background-color: var(--color-grey-100);
        transform: scale(0.98);
      }
    }
  `,
  danger: css`
    color: var(--color-red-100);
    background-color: var(--color-red-700);

    &:hover {
      background-color: var(--color-red-800);
    }

    @media (max-width: 480px) {
      &:active {
        background-color: var(--color-red-800);
        transform: scale(0.98);
      }
    }
  `,
};

const Button = styled.button.attrs((props) => ({
  // Use transient props with $ prefix
  $variation: props.$variation || "primary",
  $size: props.$size || "medium",
}))`
  border: none;
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  width: ${(props) => (props.$fullWidth ? "100%" : "auto")};

  /* Disable default button styles on mobile */
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  /* Improve touch experience */
  touch-action: manipulation;

  /* Use transient props in styles */
  ${(props) => sizes[props.$size]}
  ${(props) => variations[props.$variation]}

  /* Mobile-specific enhancements */
  @media (max-width: 480px) {
    /* Remove focus outline and replace with custom style */
    &:focus {
      outline: 2px solid var(--color-brand-500);
      outline-offset: 2px;
    }

    /* Prevent text selection on tap */
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;

    /* Smooth transform for active state */
    transition: transform 0.1s ease, background-color 0.2s ease;
  }

  /* Disabled state */
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;

    @media (max-width: 480px) {
      opacity: 0.5;
    }
  }

  /* Loading state indicator for mobile */
  ${(props) =>
    props.$isLoading &&
    css`
      @media (max-width: 480px) {
        position: relative;
        color: transparent;

        &::after {
          content: "";
          position: absolute;
          width: 1.6rem;
          height: 1.6rem;
          border: 2px solid transparent;
          border-top-color: currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
      }
    `}

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export default Button;
