import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import { useAuth } from "../hooks/useAuth";
import LoginPage from "../pages/auth/LoginPage";
import SignupPage from "../pages/auth/SignupPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import CreateIssuePage from "../pages/issues/CreateIssuePage";
import FeedPage from "../pages/issues/FeedPage";
import IssueDetailPage from "../pages/issues/IssueDetailPage";
import NotFoundPage from "../pages/NotFoundPage";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function PublicOnlyRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : children;
}

export default function AppRouter() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<FeedPage />} />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateIssuePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/issues/:issueId" element={<IssueDetailPage />} />
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicOnlyRoute>
              <SignupPage />
            </PublicOnlyRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppShell>
  );
}
