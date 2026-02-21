import Spinner from "./Spinner";
import { useUser } from "../features/authentication/useUser";
import styled from "styled-components";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const FullPage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: var(--color-grey-50);
`;

// Default fallback role is strictly enforced if allowedRoles is provided
function ProtectedRoute({ children, allowedRoles }) {
  const { isLoading, isAuthenticated, user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading)
    return (
      <FullPage>
        <Spinner />
      </FullPage>
    );

  if (isAuthenticated) {
    if (allowedRoles && allowedRoles.length > 0) {
      const userRole = user?.user_metadata?.role || "guest";
      if (!allowedRoles.includes(userRole)) {
        toast.error(`You do not have permission to view this page.`);
        // Redirect to dashboard or a safe page
        return <Navigate to="/dashboard" replace />;
      }
    }
    return children;
  }
}

export default ProtectedRoute;
