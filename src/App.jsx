import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  Outlet,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { lazy, Suspense } from "react";

import GlobalStyles from "./styles/GlobalStyles";
import ProtectedRoute from "./ui/ProtectedRoute";
import { DarkModeProvider } from "./context/DarkModeContext";
import { MobileProvider } from "./context/MobileContext";
import Spinner from "./ui/Spinner";
import Guests from "./pages/Guests";

// Lazy load all page components
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Bookings = lazy(() => import("./pages/Bookings"));
const Booking = lazy(() => import("./pages/Booking"));
const Users = lazy(() => import("./pages/Users"));
const Settings = lazy(() => import("./pages/Settings"));
const Account = lazy(() => import("./pages/Account"));
const Login = lazy(() => import("./pages/Login"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const AppLayout = lazy(() => import("./ui/AppLayout"));
const Rooms = lazy(() => import("./pages/Rooms"));
const Cabins = lazy(() => import("./pages/Cabins"));
const Checkin = lazy(() => import("./pages/Checkin"));
const Menu = lazy(() => import("./pages/Menu"));
const Orders = lazy(() => import("./pages/Orders"));
const GuestMenu = lazy(() => import("./pages/GuestMenu"));
const Calendar = lazy(() => import("./pages/Calendar"));
const Receipts = lazy(() => import("./pages/Receipts"));
const Receipt = lazy(() => import("./pages/Receipt"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

// Loading fallback component
const PageLoader = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
  >
    <Spinner />
  </div>
);

function App() {
  return (
    <DarkModeProvider>
      <MobileProvider>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <GlobalStyles />
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<PageLoader />}>
                        <AppLayout />
                      </Suspense>
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate replace to="dashboard" />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="account" element={<Account />} />

                  {/* Admin, Staff, and Guests can access most things */}
                  <Route
                    element={
                      <ProtectedRoute
                        allowedRoles={["admin", "staff", "guest"]}
                      >
                        <Outlet />
                      </ProtectedRoute>
                    }
                  >
                    <Route path="guests" element={<Guests />} />
                    <Route path="bookings" element={<Bookings />} />
                    <Route path="bookings/:bookingId" element={<Booking />} />
                    <Route path="checkin/:bookingId" element={<Checkin />} />
                    <Route path="rooms" element={<Rooms />} />
                    <Route path="cabins" element={<Cabins />} />
                    <Route path="receipts" element={<Receipts />} />
                    <Route path="receipts/:bookingId" element={<Receipt />} />
                  </Route>

                  {/* Cook has access to the Menu/Orders, guests can look at it too */}
                  <Route
                    element={
                      <ProtectedRoute
                        allowedRoles={["admin", "staff", "cook", "guest"]}
                      >
                        <Outlet />
                      </ProtectedRoute>
                    }
                  >
                    <Route path="menu" element={<Menu />} />
                    <Route path="orders" element={<Orders />} />
                  </Route>

                  {/* Only Admin can manage users and settings */}
                  <Route
                    element={
                      <ProtectedRoute allowedRoles={["admin"]}>
                        <Outlet />
                      </ProtectedRoute>
                    }
                  >
                    <Route path="users" element={<Users />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="calendar" element={<Calendar />} />
                  </Route>
                </Route>
                <Route path="login" element={<Login />} />
                <Route path="guest-menu" element={<GuestMenu />} />
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
          <Toaster
            position="top-center"
            gutter={12}
            containerStyle={{ margin: "8px" }}
            toastOptions={{
              success: {
                duration: 3000,
              },
              error: {
                duration: 5000,
              },
              style: {
                fontSize: "16px",
                padding: "16px 24px",
                maxWidth: "500px",
                backgroundColor: "var(--color-grey-0)",
                color: "var(--color-grey-700)",
              },
            }}
          />
        </QueryClientProvider>
      </MobileProvider>
    </DarkModeProvider>
  );
}

export default App;
