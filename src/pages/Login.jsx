import styled from "styled-components";
import LoginForm from "../features/authentication/LoginForm";
import Logo from "../ui/Logo";
import Heading from "../ui/Heading";

const LoginLayout = styled.main`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 48rem;
  align-content: center;
  justify-content: center;
  gap: 3.2rem;
  background-color: var(--color-grey-50);
  padding: 2.4rem;

  /* Tablet */
  @media (max-width: 768px) {
    grid-template-columns: minmax(30rem, 40rem);
    gap: 2.8rem;
    padding: 2rem;
  }

  /* Mobile */
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 2.4rem;
    padding: 1.6rem;
    align-content: flex-start;
    padding-top: 6rem;

    /* Allow scrolling on very small screens */
    min-height: 100dvh; /* Dynamic viewport height for mobile */
    overflow-y: auto;
  }

  /* Small Mobile */
  @media (max-width: 360px) {
    gap: 2rem;
    padding: 1.2rem;
    padding-top: 4rem;
  }

  /* Landscape mode on mobile */
  @media (max-width: 480px) and (max-height: 500px) and (orientation: landscape) {
    align-content: center;
    padding-top: 2rem;
    gap: 1.6rem;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;

  @media (max-width: 480px) {
    & img {
      height: 7.2rem !important;
      width: auto !important;
    }
  }

  @media (max-width: 360px) {
    & img {
      height: 6.4rem !important;
    }
  }
`;

const LoginHeading = styled(Heading)`
  text-align: center;
  color: var(--color-grey-800);
  margin-bottom: 0;

  /* Tablet */
  @media (max-width: 768px) {
    font-size: 2.2rem;
    line-height: 1.3;
  }

  /* Mobile */
  @media (max-width: 480px) {
    font-size: 2rem;
    line-height: 1.2;
    margin-bottom: 0.5rem;
  }

  /* Small Mobile */
  @media (max-width: 360px) {
    font-size: 1.8rem;
  }

  /* Landscape mode */
  @media (max-width: 480px) and (max-height: 500px) and (orientation: landscape) {
    font-size: 1.6rem;
    margin-bottom: 0;
  }
`;

const FormContainer = styled.div`
  width: 100%;

  @media (max-width: 480px) {
    /* Ensure form doesn't get too squeezed */
    min-width: 0;
  }
`;

function Login() {
  return (
    <LoginLayout>
      <LogoContainer>
        <Logo />
      </LogoContainer>
      <LoginHeading as="h4">Log in to your account !!</LoginHeading>
      <FormContainer>
        <LoginForm />
      </FormContainer>
    </LoginLayout>
  );
}

export default Login;
