import styled from "styled-components";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { HiShieldExclamation } from "react-icons/hi2";

const StyledNoPermission = styled.div`
  height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding: 4rem;
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  text-align: center;
`;

const IconWrapper = styled.div`
  font-size: 8rem;
  color: var(--color-red-700);
  background-color: var(--color-red-100);
  padding: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Message = styled.div`
  & h2 {
    font-size: 3rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--color-grey-800);
  }

  & p {
    font-size: 1.8rem;
    color: var(--color-grey-500);
    max-width: 50rem;
    margin: 0 auto;
  }
`;

function NoPermission({ resourceName = "this page" }) {
  const navigate = useNavigate();

  return (
    <StyledNoPermission>
      <IconWrapper>
        <HiShieldExclamation />
      </IconWrapper>
      <Message>
        <h2>Permission Denied</h2>
        <p>
          You do not have the necessary permissions to view the{" "}
          <strong>{resourceName}</strong> list. This area is reserved for Staff
          and Administrators.
        </p>
      </Message>
      <Button $variation="secondary" onClick={() => navigate(-1)}>
        &larr; Go Back
      </Button>
    </StyledNoPermission>
  );
}

export default NoPermission;
