// components/bookings/CreateBookingForm.styles.js
import styled from "styled-components";

export const FormContainer = styled.div`
  padding: 1rem 0;
  max-height: 70vh;
  overflow-y: auto;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: var(--color-grey-100);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--color-grey-400);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: var(--color-grey-500);
  }

  /* Mobile */
  @media (max-width: 768px) {
    padding: 0.5rem 0;
    max-height: 65vh;
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    max-height: 60vh;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (max-width: 768px) {
    gap: 1.5rem;
  }
`;

export const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  background: var(--color-grey-50);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--color-grey-200);

  @media (max-width: 768px) {
    padding: 1.2rem;
    gap: 1.2rem;
    border-radius: var(--border-radius-sm);
  }

  @media (max-width: 480px) {
    padding: 1rem;
    gap: 1rem;
  }
`;

export const SectionTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--color-grey-800);
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.6rem;
  }

  @media (max-width: 480px) {
    font-size: 1.4rem;
  }
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  @media (max-width: 768px) {
    gap: 0.4rem;
  }
`;

export const Label = styled.label`
  font-weight: 600;
  color: var(--color-grey-700);
  font-size: 1.4rem;

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

export const CheckboxLabel = styled(Label)`
  display: flex;
  align-items: center;
  cursor: pointer;

  input[type="checkbox"] {
    margin-right: 1.1rem;
    width: 1.6rem;
    height: 1.6rem;
    accent-color: var(--color-brand-600);
    cursor: pointer;

    /* Remove default browser styles */
    border: none;
    outline: none;

    /* Mobile optimization */
    @media (max-width: 768px) {
      width: 1.8rem;
      height: 1.8rem;
    }
  }
`;

export const Input = styled.input`
  padding: 1rem;
  border: 2px solid var(--color-grey-300);
  border-radius: var(--border-radius-md);
  font-size: 1.4rem;
  background: var(--color-grey-0);
  color: var(--color-grey-900);
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: var(--color-brand-600);
    box-shadow: 0 0 0 3px var(--color-brand-100);
  }

  &:disabled {
    background-color: var(--color-grey-100);
    color: var(--color-grey-500);
    cursor: not-allowed;
  }

  &::placeholder {
    color: var(--color-grey-500);
  }

  @media (max-width: 768px) {
    padding: 1.2rem 1rem;
    font-size: 1.6rem;
    min-height: 4.8rem;
    border-width: 1.5px;
  }

  @media (max-width: 480px) {
    padding: 1rem 0.8rem;
    font-size: 1.6rem;
    min-height: 4.4rem;
    border-radius: var(--border-radius-sm);
  }
`;

export const Select = styled.select`
  padding: 1rem;
  border: 2px solid var(--color-grey-300);
  border-radius: var(--border-radius-md);
  font-size: 1.4rem;
  background-color: var(--color-grey-0);
  color: var(--color-grey-900);
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: var(--color-brand-600);
    box-shadow: 0 0 0 3px var(--color-brand-100);
  }

  &::placeholder {
    color: var(--color-grey-500);
  }

  @media (max-width: 768px) {
    padding: 1.2rem 1rem;
    font-size: 1.6rem;
    min-height: 4.8rem;
    border-width: 1.5px;
  }

  @media (max-width: 480px) {
    padding: 1rem 0.8rem;
    font-size: 1.6rem;
    min-height: 4.4rem;
    border-radius: var(--border-radius-sm);
  }
`;

export const TextArea = styled.textarea`
  padding: 1rem;
  border: 2px solid var(--color-grey-300);
  border-radius: var(--border-radius-md);
  font-size: 1.4rem;
  min-height: 80px;
  resize: vertical;
  line-height: 1.4;
  background: var(--color-grey-0);
  color: var(--color-grey-900);

  &:focus {
    outline: none;
    border-color: var(--color-brand-600);
    box-shadow: 0 0 0 3px var(--color-brand-100);
  }

  &::placeholder {
    color: var(--color-grey-500);
  }

  @media (max-width: 768px) {
    padding: 1.2rem 1rem;
    font-size: 1.6rem;
    min-height: 100px;
    border-width: 1.5px;
  }

  @media (max-width: 480px) {
    padding: 1rem 0.8rem;
    font-size: 1.6rem;
    min-height: 90px;
    border-radius: var(--border-radius-sm);
  }
`;

export const GuestInfoCard = styled.div`
  padding: 1.5rem;
  background: var(--color-grey-50);
  border: 2px solid var(--color-brand-200);
  border-radius: var(--border-radius-md);
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    padding: 1.2rem;
    margin-bottom: 0.8rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

export const GuestInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--color-grey-200);

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    padding: 0.4rem 0;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.3rem;
  }
`;

export const GuestInfoLabel = styled.span`
  font-weight: 600;
  color: var(--color-grey-700);
  font-size: 1.4rem;

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

export const GuestInfoValue = styled.span`
  color: var(--color-grey-800);
  font-size: 1.4rem;

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

export const ErrorMessage = styled.div`
  color: var(--color-red-700);
  font-size: 1.3rem;
  font-weight: 500;
  padding: 1rem;
  background: var(--color-red-100);
  border: 1px solid var(--color-red-300);
  border-radius: var(--border-radius-sm);

  @media (max-width: 768px) {
    font-size: 1.2rem;
    padding: 0.8rem;
  }

  @media (max-width: 480px) {
    font-size: 1.1rem;
    padding: 0.7rem;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-grey-200);

  @media (max-width: 768px) {
    flex-direction: column;
    margin-top: 1.5rem;
    padding-top: 1.2rem;
    gap: 0.8rem;
  }

  @media (max-width: 480px) {
    margin-top: 1.2rem;
    padding-top: 1rem;
    gap: 0.6rem;
  }
`;

export const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: var(--color-grey-50);
  border-radius: var(--border-radius-md);

  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
    padding: 0.8rem;
    gap: 0.8rem;
    flex-direction: column;
  }

  @media (max-width: 480px) {
    margin-bottom: 1.2rem;
    padding: 0.6rem;
    gap: 0.6rem;
  }
`;

export const Step = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.3rem;
  font-weight: ${(props) => (props.$active ? "600" : "400")};
  color: ${(props) =>
    props.$active ? "var(--color-brand-600)" : "var(--color-grey-500)"};

  @media (max-width: 768px) {
    font-size: 1.2rem;
    gap: 0.4rem;
  }

  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

export const StepNumber = styled.span`
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) =>
    props.$active ? "var(--color-brand-600)" : "var(--color-grey-300)"};
  color: white;
  font-size: 1.2rem;
  font-weight: 600;

  @media (max-width: 768px) {
    width: 2rem;
    height: 2rem;
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    width: 1.8rem;
    height: 1.8rem;
    font-size: 0.9rem;
  }
`;
