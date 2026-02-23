import styled from "styled-components";
import Button from "./Button";
import Heading from "./Heading";

const StyledConfirmAction = styled.div`
  width: 40rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;

  & p {
    color: var(--color-grey-500);
    margin-bottom: 1.2rem;
  }

  & div {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
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
        {actionName.charAt(0).toUpperCase() + actionName.slice(1)}{" "}
        {resourceName}
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
