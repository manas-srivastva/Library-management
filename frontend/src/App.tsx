import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { FullPageLoader } from "@/components/ui/Loader";
import { queryClient } from "@/lib/queryClient";
import ProtectedRoute from "@/routes/ProtectedRoute";

function ThemedToast() {
  const { theme } = useTheme();

  return (
    <ToastContainer
      position="bottom-right"
      autoClose={3000}
      theme={theme}
      hideProgressBar
      newestOnTop
    />
  );
}

const LandingPage = lazy(() => import("@/pages/LandingPage"));

const LoginPage = lazy(() => import("@/pages/LoginPage"));

const RegisterPage = lazy(() => import("@/pages/RegisterPage"));

const DashboardPage = lazy(() => import("@/pages/DashboardPage"));

const BooksPage = lazy(() => import("@/pages/BooksPage"));

const BookCopiesPage = lazy(
  () => import("@/pages/BookCopiesPage")
);

const BorrowManagementPage = lazy(
  () => import("@/pages/BorrowManagementPage")
);

const ReservationsPage = lazy(
  () => import("@/pages/ReservationsPage")
);

const FinesPage = lazy(
  () => import("@/pages/FinesPage")
);

const NotificationsPage = lazy(
  () => import("@/pages/NotificationsPage")
);

const AnalyticsPage = lazy(
  () => import("@/pages/AnalyticsPage")
);

const ProfilePage = lazy(
  () => import("@/pages/ProfilePage")
);

const SettingsPage = lazy(
  () => import("@/pages/SettingsPage")
);

const NotFoundPage = lazy(
  () => import("@/pages/NotFoundPage")
);

const MyBorrowsPage = lazy(
  () => import("@/pages/MyBorrowsPage")
);

const UsersPage = lazy(
  () => import("@/pages/UsersPage")
);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <Suspense fallback={<FullPageLoader />}>
            <Routes>

              {/* ========================= */}
              {/* PUBLIC ROUTES */}
              {/* ========================= */}

              <Route
                path="/"
                element={<LandingPage />}
              />

              <Route
                path="/login"
                element={<LoginPage />}
              />

              <Route
                path="/register"
                element={<RegisterPage />}
              />

              {/* ========================= */}
              {/* AUTHENTICATED ROUTES */}
              {/* ========================= */}

              <Route element={<ProtectedRoute />}>

                <Route
                  path="/app"
                  element={<DashboardLayout />}
                >

                  {/* ========================= */}
                  {/* ALL AUTHENTICATED USERS */}
                  {/* ========================= */}

                  <Route
                    index
                    element={
                      <Navigate
                        to="/app/dashboard"
                        replace
                      />
                    }
                  />

                  <Route
                    element={
                      <ProtectedRoute
                        allowedRoles={[
                          "ADMIN",
                          "LIBRARIAN",
                          "MEMBER",
                        ]}
                      />
                    }
                  >

                    <Route
                      path="dashboard"
                      element={<DashboardPage />}
                    />

                    <Route
                      path="books"
                      element={<BooksPage />}
                    />

                    <Route
                      path="my-borrows"
                      element={<MyBorrowsPage />}
                    />

                    <Route
                      path="reservations"
                      element={<ReservationsPage />}
                    />

                    <Route
                      path="fines"
                      element={<FinesPage />}
                    />

                    <Route
                      path="notifications"
                      element={<NotificationsPage />}
                    />

                    <Route
                      path="profile"
                      element={<ProfilePage />}
                    />

                    <Route
                      path="settings"
                      element={<SettingsPage />}
                    />

                  </Route>

                  {/* ========================= */}
                  {/* ADMIN + LIBRARIAN */}
                  {/* ========================= */}

                  <Route
                    element={
                      <ProtectedRoute
                        allowedRoles={[
                          "ADMIN",
                          "LIBRARIAN",
                        ]}
                      />
                    }
                  >

                    <Route
                      path="copies"
                      element={<BookCopiesPage />}
                    />

                    <Route
                      path="borrows"
                      element={<BorrowManagementPage />}
                    />

                    <Route
                      path="analytics"
                      element={<AnalyticsPage />}
                    />

                  </Route>

                  {/* ========================= */}
                  {/* ADMIN ONLY */}
                  {/* ========================= */}

                  <Route
                    element={
                      <ProtectedRoute
                        allowedRoles={["ADMIN"]}
                      />
                    }
                  >

                    <Route
                      path="users"
                      element={<UsersPage />}
                    />

                  </Route>

                </Route>

              </Route>

              {/* ========================= */}
              {/* 404 */}
              {/* ========================= */}

              <Route
                path="*"
                element={<NotFoundPage />}
              />

            </Routes>
          </Suspense>

          <ThemedToast />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}