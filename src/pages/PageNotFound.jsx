import styled from "styled-components";
import { useMoveBack } from "../hooks/useMoveBack";
import Heading from "../ui/Heading";
import Button from "../ui/Button";

const StyledPageNotFound = styled.main`
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    var(--color-grey-50) 0%,
    var(--color-grey-100) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.4rem;

  @media (max-width: 768px) {
    padding: 1.6rem;
  }
`;

const Box = styled.div`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 6.4rem 4.8rem;
  flex: 0 1 96rem;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(
      90deg,
      var(--color-brand-500),
      var(--color-red-500),
      var(--color-yellow-500),
      var(--color-green-500)
    );
  }

  @media (max-width: 768px) {
    padding: 4.8rem 3.2rem;
  }

  @media (max-width: 480px) {
    padding: 3.2rem 2.4rem;
  }
`;

const ErrorCode = styled.div`
  font-size: 8rem;
  font-weight: 700;
  color: var(--color-grey-300);
  margin-bottom: 1.6rem;
  line-height: 1;

  @media (max-width: 768px) {
    font-size: 6rem;
  }

  @media (max-width: 480px) {
    font-size: 4.8rem;
  }
`;

const ErrorEmoji = styled.div`
  font-size: 4.8rem;
  margin-bottom: 2.4rem;

  @media (max-width: 480px) {
    font-size: 3.6rem;
  }
`;

const Message = styled.p`
  font-size: 1.8rem;
  color: var(--color-grey-600);
  line-height: 1.6;
  margin-bottom: 3.2rem;
  max-width: 60rem;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    font-size: 1.6rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1.6rem;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
  }
`;

const StyledButton = styled(Button)`
  padding: 1.2rem 2.4rem;
  font-size: 1.6rem;
  border-radius: var(--border-radius-md);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  @media (max-width: 480px) {
    width: 100%;
    max-width: 28rem;
  }
`;

const PrimaryButton = styled(StyledButton)`
  background-color: var(--color-brand-600);
  color: var(--color-grey-0);

  &:hover {
    background-color: var(--color-brand-700);
  }
`;

const SecondaryButton = styled(StyledButton)`
  background-color: var(--color-grey-100);
  color: var(--color-grey-700);
  border: 1px solid var(--color-grey-300);

  &:hover {
    background-color: var(--color-grey-200);
    border-color: var(--color-grey-400);
  }
`;

// If you don't have a Button component, use this fallback:
const FallbackButton = styled.button`
  background-color: var(--color-brand-600);
  color: var(--color-grey-0);
  border: none;
  border-radius: var(--border-radius-md);
  padding: 1.2rem 2.4rem;
  font-size: 1.6rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: var(--color-brand-700);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  @media (max-width: 480px) {
    width: 100%;
    max-width: 28rem;
  }
`;

function PageNotFound() {
  const moveBack = useMoveBack();

  const handleGoHome = () => {
    window.location.href = "/dashboard";
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <StyledPageNotFound>
      <Box>
        <ErrorCode>404</ErrorCode>
        <ErrorEmoji>😢</ErrorEmoji>

        <Heading as="h1" style={{ marginBottom: "1.6rem" }}>
          Page Not Found
        </Heading>

        <Message>
          The page you're looking for seems to have wandered off into the
          digital wilderness. It might have been moved, deleted, or you may have
          entered an incorrect URL.
        </Message>

        <ButtonGroup>
          {/* Use FallbackButton if Button component doesn't exist */}
          <PrimaryButton onClick={moveBack}>← Go Back</PrimaryButton>

          <SecondaryButton onClick={handleGoHome}>🏠 Go Home</SecondaryButton>

          <SecondaryButton onClick={handleReload}>
            🔄 Reload Page
          </SecondaryButton>
        </ButtonGroup>
      </Box>
    </StyledPageNotFound>
  );
}

export default PageNotFound;
