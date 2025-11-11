import Spinner from "./Spinner";
import { useUser } from "../features/authentication/useUser";
import styled from "styled-components";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const FullPage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: var(--var-grey-50);
`;

function ProtectedRoute({ children }) {
  const { isLoading, isAuthenticated } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // Added a small delay to avoid race conditions not required anymore . was bugging due to a typo in react query
    // const timer = setTimeout(() => {
    if (!isAuthenticated && !isLoading) {
      navigate("/login", { replace: true });
    }
    // }, 10);

    // return () => clearTimeout(timer);
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading)
    return (
      <FullPage>
        <Spinner />;
      </FullPage>
    );

  if (isAuthenticated) return children;
}

export default ProtectedRoute;
