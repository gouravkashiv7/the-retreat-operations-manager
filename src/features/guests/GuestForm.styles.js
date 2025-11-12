// components/guests/GuestForm.styles.js
import styled from "styled-components";

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;

  /* Tablet */
  @media (max-width: 1024px) {
    gap: 1.8rem;
  }

  /* Mobile */
  @media (max-width: 768px) {
    gap: 1.5rem;
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    gap: 1.2rem;
  }
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  /* Tablet */
  @media (max-width: 1024px) {
    gap: 1.3rem;
  }

  /* Mobile */
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.2rem;
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    gap: 1rem;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  /* Mobile */
  @media (max-width: 768px) {
    gap: 0.4rem;
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    gap: 0.3rem;
  }
`;

export const Label = styled.label`
  font-weight: 600;
  color: var(--color-grey-800);
  font-size: 1.4rem;
  line-height: 1.3;
  transition: color 0.2s ease;

  /* Dark mode */
  ${(props) =>
    props.theme === "dark" &&
    `
    color: var(--color-grey-200);
  `}

  /* Tablet */
  @media (max-width: 1024px) {
    font-size: 1.3rem;
  }

  /* Mobile */
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

export const Input = styled.input`
  padding: 1.2rem 1rem;
  border: 2px solid var(--color-grey-300);
  border-radius: var(--border-radius-md);
  font-size: 1.5rem;
  transition: all 0.3s ease;
  background: var(--color-grey-0);
  min-height: 5rem;
  color: var(--color-grey-900);

  &:focus {
    outline: none;
    border-color: var(--color-brand-600);
    box-shadow: 0 0 0 4px var(--color-brand-100);
    transform: translateY(-1px);
  }

  &.error {
    border-color: var(--color-red-600);
    box-shadow: 0 0 0 4px var(--color-red-100);
  }

  &::placeholder {
    color: var(--color-grey-500);
    font-size: 1.4rem;
  }

  /* Dark mode */
  ${(props) =>
    props.theme === "dark" &&
    `
    background: var(--color-dark-600);
    border-color: var(--color-dark-400);
    color: var(--color-grey-100);

    &:focus {
      border-color: var(--color-brand-400);
      box-shadow: 0 0 0 4px var(--color-brand-900);
      background: var(--color-dark-500);
    }

    &.error {
      border-color: var(--color-red-500);
      box-shadow: 0 0 0 4px var(--color-red-900);
    }

    &::placeholder {
      color: var(--color-grey-500);
    }
  `}

  /* Tablet */
  @media (max-width: 1024px) {
    padding: 1.1rem 0.9rem;
    font-size: 1.4rem;
    min-height: 4.8rem;
  }

  /* Mobile */
  @media (max-width: 768px) {
    padding: 1rem 0.8rem;
    font-size: 1.6rem; /* Prevent zoom on iOS */
    min-height: 5.2rem;
    border-width: 1.5px;
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    padding: 0.9rem 0.7rem;
    font-size: 1.6rem;
    min-height: 4.8rem;
    border-radius: var(--border-radius-sm);
  }

  /* Very Small Mobile */
  @media (max-width: 360px) {
    padding: 0.8rem 0.6rem;
    min-height: 4.6rem;
  }
`;

export const Select = styled.select`
  padding: 1.2rem 1rem;
  border: 2px solid var(--color-grey-300);
  border-radius: var(--border-radius-md);
  font-size: 1.5rem;
  background-color: var(--color-grey-0);
  transition: all 0.3s ease;
  min-height: 5rem;
  cursor: pointer;
  color: var(--color-grey-900);

  &:focus {
    outline: none;
    border-color: var(--color-brand-600);
    box-shadow: 0 0 0 4px var(--color-brand-100);
    transform: translateY(-1px);
  }

  &.error {
    border-color: var(--color-red-600);
    box-shadow: 0 0 0 4px var(--color-red-100);
  }

  /* Dark mode */
  ${(props) =>
    props.theme === "dark" &&
    `
    background: var(--color-dark-600);
    border-color: var(--color-dark-400);
    color: var(--color-grey-100);

    &:focus {
      border-color: var(--color-brand-400);
      box-shadow: 0 0 0 4px var(--color-brand-900);
      background: var(--color-dark-500);
    }

    &.error {
      border-color: var(--color-red-500);
      box-shadow: 0 0 0 4px var(--color-red-900);
    }
  `}

  /* Tablet */
  @media (max-width: 1024px) {
    padding: 1.1rem 0.9rem;
    font-size: 1.4rem;
    min-height: 4.8rem;
  }

  /* Mobile */
  @media (max-width: 768px) {
    padding: 1rem 0.8rem;
    font-size: 1.6rem;
    min-height: 5.2rem;
    border-width: 1.5px;
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    padding: 0.9rem 0.7rem;
    font-size: 1.6rem;
    min-height: 4.8rem;
    border-radius: var(--border-radius-sm);
  }

  /* Very Small Mobile */
  @media (max-width: 360px) {
    padding: 0.8rem 0.6rem;
    min-height: 4.6rem;
  }
`;

export const TextArea = styled.textarea`
  padding: 1.2rem 1rem;
  border: 2px solid var(--color-grey-300);
  border-radius: var(--border-radius-md);
  font-size: 1.5rem;
  min-height: 100px;
  resize: vertical;
  transition: all 0.3s ease;
  background: var(--color-grey-0);
  line-height: 1.5;
  color: var(--color-grey-900);

  &:focus {
    outline: none;
    border-color: var(--color-brand-600);
    box-shadow: 0 0 0 4px var(--color-brand-100);
    transform: translateY(-1px);
  }

  &.error {
    border-color: var(--color-red-600);
    box-shadow: 0 0 0 4px var(--color-red-100);
  }

  &::placeholder {
    color: var(--color-grey-500);
    font-size: 1.4rem;
  }

  /* Dark mode */
  ${(props) =>
    props.theme === "dark" &&
    `
    background: var(--color-dark-600);
    border-color: var(--color-dark-400);
    color: var(--color-grey-100);

    &:focus {
      border-color: var(--color-brand-400);
      box-shadow: 0 0 0 4px var(--color-brand-900);
      background: var(--color-dark-500);
    }

    &.error {
      border-color: var(--color-red-500);
      box-shadow: 0 0 0 4px var(--color-red-900);
    }

    &::placeholder {
      color: var(--color-grey-500);
    }
  `}

  /* Tablet */
  @media (max-width: 1024px) {
    padding: 1.1rem 0.9rem;
    font-size: 1.4rem;
    min-height: 90px;
  }

  /* Mobile */
  @media (max-width: 768px) {
    padding: 1rem 0.8rem;
    font-size: 1.6rem;
    min-height: 100px;
    border-width: 1.5px;
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    padding: 0.9rem 0.7rem;
    font-size: 1.6rem;
    min-height: 90px;
    border-radius: var(--border-radius-sm);
  }

  /* Very Small Mobile */
  @media (max-width: 360px) {
    padding: 0.8rem 0.6rem;
    min-height: 80px;
  }
`;

export const ErrorMessage = styled.span`
  color: var(--color-red-700);
  font-size: 1.3rem;
  font-weight: 500;
  margin-top: 0.3rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.2s ease;

  /* Dark mode */
  ${(props) =>
    props.theme === "dark" &&
    `
    color: var(--color-red-400);
  `}

  /* Mobile */
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1.2rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-grey-200);
  transition: border-color 0.2s ease;

  /* Dark mode */
  ${(props) =>
    props.theme === "dark" &&
    `
    border-top-color: var(--color-dark-400);
  `}

  /* Tablet */
  @media (max-width: 1024px) {
    margin-top: 1.8rem;
    padding-top: 1.3rem;
    gap: 1rem;
  }

  /* Mobile */
  @media (max-width: 768px) {
    flex-direction: column-reverse;
    gap: 1rem;
    margin-top: 1.5rem;
    padding-top: 1.2rem;
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    gap: 0.8rem;
    margin-top: 1.2rem;
    padding-top: 1rem;
  }
`;

export const FullWidth = styled.div`
  grid-column: 1 / -1;

  /* Mobile */
  @media (max-width: 768px) {
    grid-column: 1;
  }
`;

export const FormHeader = styled.h2`
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--color-grey-900);
  margin-bottom: 1rem;
  text-align: center;
  transition: color 0.2s ease;

  /* Dark mode */
  ${(props) =>
    props.theme === "dark" &&
    `
    color: var(--color-grey-100);
  `}

  /* Tablet */
  @media (max-width: 1024px) {
    font-size: 2rem;
  }

  /* Mobile */
  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 0.8rem;
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    font-size: 1.6rem;
    margin-bottom: 0.6rem;
  }
`;

export const RequiredIndicator = styled.span`
  color: var(--color-red-600);
  margin-left: 0.3rem;
  transition: color 0.2s ease;

  /* Dark mode */
  ${(props) =>
    props.theme === "dark" &&
    `
    color: var(--color-red-400);
  `}
`;

export const FormDescription = styled.p`
  color: var(--color-grey-600);
  font-size: 1.4rem;
  text-align: center;
  margin-bottom: 2rem;
  line-height: 1.5;
  transition: color 0.2s ease;

  /* Dark mode */
  ${(props) =>
    props.theme === "dark" &&
    `
    color: var(--color-grey-400);
  `}

  /* Mobile */
  @media (max-width: 768px) {
    font-size: 1.3rem;
    margin-bottom: 1.5rem;
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    font-size: 1.2rem;
    margin-bottom: 1.2rem;
  }
`;
