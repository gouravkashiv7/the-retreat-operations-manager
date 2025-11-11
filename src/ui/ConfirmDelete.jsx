import styled from "styled-components";
import Button from "./Button";
import Heading from "./Heading";

const StyledConfirmDelete = styled.div`
  width: 40rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;

  /* Tablet */
  @media (max-width: 1024px) {
    width: 36rem;
    gap: 1.1rem;
  }

  /* Mobile */
  @media (max-width: 768px) {
    width: 100%;
    max-width: 32rem;
    gap: 1rem;
    margin: 0 auto;
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    max-width: 100%;
    gap: 0.9rem;
    padding: 0 0.5rem;
  }

  /* Very Small Mobile */
  @media (max-width: 360px) {
    gap: 0.8rem;
    padding: 0 0.3rem;
  }

  & p {
    color: var(--color-grey-500);
    margin-bottom: 1.2rem;
    font-size: 1.5rem;
    line-height: 1.5;

    /* Tablet */
    @media (max-width: 1024px) {
      font-size: 1.4rem;
      margin-bottom: 1.1rem;
    }

    /* Mobile */
    @media (max-width: 768px) {
      font-size: 1.4rem;
      margin-bottom: 1rem;
      line-height: 1.4;
    }

    /* Small Mobile */
    @media (max-width: 480px) {
      font-size: 1.3rem;
      margin-bottom: 0.9rem;
    }

    /* Very Small Mobile */
    @media (max-width: 360px) {
      font-size: 1.2rem;
      margin-bottom: 0.8rem;
    }
  }

  & div {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;

    /* Tablet */
    @media (max-width: 1024px) {
      gap: 1rem;
    }

    /* Mobile */
    @media (max-width: 768px) {
      gap: 0.9rem;
    }

    /* Small Mobile */
    @media (max-width: 480px) {
      flex-direction: column-reverse;
      gap: 0.8rem;
    }

    /* Very Small Mobile */
    @media (max-width: 360px) {
      gap: 0.7rem;
    }
  }
`;

const StyledHeading = styled(Heading)`
  font-size: 2.2rem;
  text-align: center;
  color: var(--color-red-700);

  /* Tablet */
  @media (max-width: 1024px) {
    font-size: 2rem;
  }

  /* Mobile */
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    font-size: 1.6rem;
  }

  /* Very Small Mobile */
  @media (max-width: 360px) {
    font-size: 1.5rem;
  }
`;

const WarningIcon = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;

  &::before {
    content: "⚠️";
    font-size: 3rem;

    /* Tablet */
    @media (max-width: 1024px) {
      font-size: 2.8rem;
    }

    /* Mobile */
    @media (max-width: 768px) {
      font-size: 2.5rem;
    }

    /* Small Mobile */
    @media (max-width: 480px) {
      font-size: 2.2rem;
    }
  }
`;

function ConfirmDelete({ resourceName, onConfirm, disabled, onCloseModal }) {
  return (
    <StyledConfirmDelete>
      <WarningIcon />
      <StyledHeading as="h3">Delete {resourceName}</StyledHeading>
      <p>
        Are you sure you want to delete this {resourceName} permanently? This
        action cannot be undone.
      </p>

      <div>
        <Button
          $variation="secondary"
          disabled={disabled}
          onClick={onCloseModal}
          $size="medium"
        >
          Cancel
        </Button>
        <Button
          $variation="danger"
          disabled={disabled}
          onClick={onConfirm}
          $size="medium"
        >
          Delete
        </Button>
      </div>
    </StyledConfirmDelete>
  );
}

export default ConfirmDelete;
