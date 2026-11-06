import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);

  // Wait until session restoration is complete.
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-sm font-medium text-slate-600">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  // Redirect unauthenticated users to login.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check whether the authenticated user's role is permitted.
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    const correctDashboard =
      user?.role === "admin" ? "/admin/dashboard" : "/portal";

    return <Navigate to={correctDashboard} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
