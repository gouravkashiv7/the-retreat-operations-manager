// components/bookings/AccommodationSelector.styles.js
import styled from "styled-components";

export const SelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;

  /* Mobile */
  @media (max-width: 768px) {
    gap: 1.5rem;
  }
`;

export const RetreatCountSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  background: var(--color-grey-50);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--color-grey-200);
  transition: all 0.2s ease;

  /* Dark mode */
  ${(props) =>
    props.theme.darkMode &&
    `
    background: var(--color-grey-100);
    border-color: var(--color-grey-300);
  `}

  /* Tablet */
  @media (max-width: 1024px) {
    padding: 1.3rem;
    gap: 1.3rem;
  }

  /* Mobile */
  @media (max-width: 768px) {
    padding: 1.2rem;
    gap: 1.2rem;
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    padding: 1rem;
    gap: 1rem;
  }
`;

export const RetreatSelectionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  /* Mobile */
  @media (max-width: 768px) {
    gap: 1.2rem;
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    gap: 1rem;
  }
`;

export const RetreatCard = styled.div`
  padding: 1.8rem;
  background: var(--color-grey-0);
  border: 2px solid var(--color-grey-200);
  border-radius: var(--border-radius-md);
  transition: all 0.3s ease;
  box-shadow: var(--shadow-sm);

  &:hover {
    border-color: var(--color-brand-300);
    box-shadow: var(--shadow-md);
    transform: translateY(-1px);
  }

  &.selected {
    border-color: var(--color-brand-500);
    background: var(--color-brand-50);
    box-shadow: var(--shadow-md);
  }

  /* Dark mode */
  ${(props) =>
    props.theme.darkMode &&
    `
    background: var(--color-grey-0);
    border-color: var(--color-grey-300);

    &:hover {
      border-color: var(--color-brand-400);
      box-shadow: var(--shadow-md);
    }

    &.selected {
      border-color: var(--color-brand-500);
      background: var(--color-brand-900);
    }
  `}

  /* Tablet */
  @media (max-width: 1024px) {
    padding: 1.6rem;
  }

  /* Mobile */
  @media (max-width: 768px) {
    padding: 1.4rem;
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    padding: 1.2rem;
    border-width: 1.5px;
  }
`;

export const RetreatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.2rem;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid var(--color-grey-200);
  transition: border-color 0.2s ease;

  /* Dark mode */
  ${(props) =>
    props.theme.darkMode &&
    `
    border-bottom-color: var(--color-grey-300);
  `}

  /* Mobile */
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.8rem;
    margin-bottom: 1rem;
    padding-bottom: 0.6rem;
  }
`;

export const RetreatTitle = styled.h4`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-800);
  margin: 0;
  transition: color 0.2s ease;

  /* Dark mode */
  ${(props) =>
    props.theme.darkMode &&
    `
    color: var(--color-grey-800);
  `}

  /* Mobile */
  @media (max-width: 480px) {
    font-size: 1.4rem;
  }
`;

export const RetreatDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  /* Tablet */
  @media (max-width: 1024px) {
    gap: 1.2rem;
  }

  /* Mobile */
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    gap: 1.2rem;
  }
`;

export const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  /* Make form elements full width on mobile */
  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const DetailLabel = styled.span`
  font-size: 1.3rem;
  font-weight: 500;
  color: var(--color-grey-600);
  transition: color 0.2s ease;

  /* Dark mode */
  ${(props) =>
    props.theme.darkMode &&
    `
    color: var(--color-grey-500);
  `}

  /* Mobile */
  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

export const DetailValue = styled.span`
  font-size: 1.4rem;
  color: var(--color-grey-800);
  font-weight: ${(props) => (props.$bold ? "600" : "400")};
  transition: color 0.2s ease;

  /* Dark mode */
  ${(props) =>
    props.theme.darkMode &&
    `
    color: var(--color-grey-700);
  `}

  /* Mobile */
  @media (max-width: 480px) {
    font-size: 1.3rem;
  }
`;

export const PriceDisplay = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-brand-600);
  text-align: right;
  transition: color 0.2s ease;

  /* Dark mode */
  ${(props) =>
    props.theme.darkMode &&
    `
    color: var(--color-brand-500);
  `}

  /* Mobile */
  @media (max-width: 480px) {
    font-size: 1.4rem;
    text-align: left;
  }
`;

export const ErrorMessage = styled.div`
  color: var(--color-red-700);
  font-size: 1.4rem;
  font-weight: 500;
  padding: 1rem;
  background: var(--color-red-100);
  border: 1px solid var(--color-red-200);
  border-radius: var(--border-radius-sm);
  transition: all 0.2s ease;

  /* Dark mode */
  ${(props) =>
    props.theme.darkMode &&
    `
    color: var(--color-red-400);
    background: var(--color-red-900);
    border-color: var(--color-red-800);
  `}

  /* Mobile */
  @media (max-width: 480px) {
    font-size: 1.3rem;
    padding: 0.8rem;
  }
`;

export const StyledSelect = styled.select`
  padding: 1.2rem 1rem;
  border: 2px solid var(--color-grey-300);
  border-radius: var(--border-radius-md);
  font-size: 1.4rem;
  background-color: var(--color-grey-0);
  transition: all 0.3s ease;
  color: var(--color-grey-900);
  min-height: 4.8rem;
  width: 100%;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: var(--color-brand-600);
    box-shadow: 0 0 0 4px var(--color-brand-100);
    transform: translateY(-1px);
  }

  &:disabled {
    background-color: var(--color-grey-100);
    color: var(--color-grey-500);
    cursor: not-allowed;
  }

  &::placeholder {
    color: var(--color-grey-500);
  }

  /* Dark mode */
  ${(props) =>
    props.theme.darkMode &&
    `
    background: var(--color-grey-0);
    border-color: var(--color-grey-400);
    color: var(--color-grey-900);

    &:focus {
      border-color: var(--color-brand-500);
      box-shadow: 0 0 0 4px var(--color-brand-900);
    }

    &:disabled {
      background-color: var(--color-grey-200);
      color: var(--color-grey-600);
    }

    &::placeholder {
      color: var(--color-grey-500);
    }

    option {
      background: var(--color-grey-0);
      color: var(--color-grey-900);
    }
  `}

  /* Mobile */
  @media (max-width: 768px) {
    padding: 1.4rem 1.2rem;
    font-size: 1.6rem;
    min-height: 5.2rem;
    border-width: 1.5px;
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    padding: 1.2rem 1rem;
    font-size: 1.6rem;
    min-height: 4.8rem;
    border-radius: var(--border-radius-sm);
  }
`;

export const StyledInput = styled.input`
  padding: 1.2rem 1rem;
  border: 2px solid var(--color-grey-300);
  border-radius: var(--border-radius-md);
  font-size: 1.4rem;
  transition: all 0.3s ease;
  background: var(--color-grey-0);
  color: var(--color-grey-900);
  min-height: 4.8rem;
  width: 100%;

  &:focus {
    outline: none;
    border-color: var(--color-brand-600);
    box-shadow: 0 0 0 4px var(--color-brand-100);
    transform: translateY(-1px);
  }

  &:disabled {
    background-color: var(--color-grey-100);
    color: var(--color-grey-500);
    cursor: not-allowed;
  }

  &::placeholder {
    color: var(--color-grey-500);
  }

  /* Dark mode */
  ${(props) =>
    props.theme.darkMode &&
    `
    background: var(--color-grey-0);
    border-color: var(--color-grey-400);
    color: var(--color-grey-900);

    &:focus {
      border-color: var(--color-brand-500);
      box-shadow: 0 0 0 4px var(--color-brand-900);
    }

    &:disabled {
      background-color: var(--color-grey-200);
      color: var(--color-grey-600);
    }

    &::placeholder {
      color: var(--color-grey-500);
    }
  `}

  /* Mobile */
  @media (max-width: 768px) {
    padding: 1.4rem 1.2rem;
    font-size: 1.6rem;
    min-height: 5.2rem;
    border-width: 1.5px;
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    padding: 1.2rem 1rem;
    font-size: 1.6rem;
    min-height: 4.8rem;
    border-radius: var(--border-radius-sm);
  }
`;

export const RemoveButton = styled.button`
  background: var(--color-red-100);
  border: 1px solid var(--color-red-200);
  color: var(--color-red-700);
  cursor: pointer;
  font-size: 1.3rem;
  font-weight: 500;
  padding: 0.6rem 1.2rem;
  border-radius: var(--border-radius-sm);
  transition: all 0.3s ease;

  &:hover {
    background: var(--color-red-200);
    border-color: var(--color-red-300);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  /* Dark mode */
  ${(props) =>
    props.theme.darkMode &&
    `
    background: var(--color-red-900);
    border-color: var(--color-red-800);
    color: var(--color-red-400);

    &:hover {
      background: var(--color-red-800);
      border-color: var(--color-red-700);
    }
  `}

  /* Mobile */
  @media (max-width: 480px) {
    font-size: 1.2rem;
    padding: 0.8rem 1.4rem;
    align-self: flex-start;
  }
`;

export const TotalPriceSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: var(--color-grey-50);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--color-grey-200);
  margin-top: 1rem;
  transition: all 0.2s ease;

  /* Dark mode */
  ${(props) =>
    props.theme.darkMode &&
    `
    background: var(--color-grey-100);
    border-color: var(--color-grey-300);
  `}

  /* Mobile */
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    padding: 1.2rem;
  }
`;

export const TotalPriceLabel = styled.span`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-grey-800);
  transition: color 0.2s ease;

  /* Dark mode */
  ${(props) =>
    props.theme.darkMode &&
    `
    color: var(--color-grey-800);
  `}

  /* Mobile */
  @media (max-width: 480px) {
    font-size: 1.4rem;
  }
`;

export const TotalPriceValue = styled.span`
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-brand-600);
  transition: color 0.2s ease;

  /* Dark mode */
  ${(props) =>
    props.theme.darkMode &&
    `
    color: var(--color-brand-500);
  `}

  /* Mobile */
  @media (max-width: 480px) {
    font-size: 1.6rem;
  }
`;

export const PriceInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  width: 100%;

  /* Mobile */
  @media (max-width: 480px) {
    gap: 0.6rem;
  }
`;

export const PriceInput = styled(StyledInput)`
  flex: 1;
  min-width: 0; /* Allow input to shrink */
`;

export const PriceSuffix = styled.span`
  font-size: 1.4rem;
  font-weight: 500;
  color: var(--color-grey-600);
  white-space: nowrap;
  transition: color 0.2s ease;

  /* Dark mode */
  ${(props) =>
    props.theme.darkMode &&
    `
    color: var(--color-grey-500);
  `}

  /* Mobile */
  @media (max-width: 480px) {
    font-size: 1.3rem;
  }
`;

export const NumberInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
`;

export const NumberInput = styled(StyledInput)`
  flex: 1;
  text-align: center;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

export const NumberButton = styled.button`
  background: var(--color-grey-100);
  border: 1px solid var(--color-grey-300);
  color: var(--color-grey-700);
  cursor: pointer;
  font-size: 1.8rem;
  font-weight: 600;
  width: 4rem;
  height: 4.8rem;
  border-radius: var(--border-radius-md);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: var(--color-grey-200);
    border-color: var(--color-grey-400);
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    background: var(--color-grey-100);
    color: var(--color-grey-400);
    cursor: not-allowed;
    transform: none;
  }

  /* Dark mode */
  ${(props) =>
    props.theme.darkMode &&
    `
    background: var(--color-grey-200);
    border-color: var(--color-grey-400);
    color: var(--color-grey-700);

    &:hover {
      background: var(--color-grey-300);
      border-color: var(--color-grey-500);
    }

    &:disabled {
      background: var(--color-grey-100);
      color: var(--color-grey-500);
    }
  `}

  /* Mobile */
  @media (max-width: 768px) {
    width: 4.4rem;
    height: 5.2rem;
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    width: 4rem;
    height: 4.8rem;
  }
`;
