import styled from "styled-components";
import Button from "./Button";
import Heading from "./Heading";

import { HiOutlineQuestionMarkCircle } from "react-icons/hi2";

const StyledConfirmAction = styled.div`
  width: 40rem;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;

  @media (max-width: 600px) {
    width: 30rem;
  }

  & h3 {
    display: flex;
    align-items: center;
    gap: 1.2rem;
    font-size: 2rem;
    color: var(--color-grey-800);
  }

  & p {
    color: var(--color-grey-500);
    margin-bottom: 2rem;
    line-height: 1.6;
    font-size: 1.5rem;
  }

  & div {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
    padding-top: 1.2rem;
    border-top: 1px solid var(--color-grey-100);
  }
`;

function ConfirmAction({
  resourceName,
  onConfirm,
  disabled,
  onCloseModal,
  actionName = "confirm",
  actionDescription,
}) {
  return (
    <StyledConfirmAction>
      <Heading as="h3">
        <HiOutlineQuestionMarkCircle
          style={{
            width: "2.8rem",
            height: "2.8rem",
            color: "var(--color-brand-600)",
          }}
        />
        <span>
          {actionName.charAt(0).toUpperCase() + actionName.slice(1)}{" "}
          {resourceName}
        </span>
      </Heading>
      <p>
        {actionDescription ||
          `Are you sure you want to ${actionName} this ${resourceName}?`}
      </p>

      <div>
        <Button
          $variation="secondary"
          disabled={disabled}
          onClick={onCloseModal}
        >
          Cancel
        </Button>
        <Button $variation="primary" disabled={disabled} onClick={onConfirm}>
          {actionName.charAt(0).toUpperCase() + actionName.slice(1)}
        </Button>
      </div>
    </StyledConfirmAction>
  );
}

export default ConfirmAction;
