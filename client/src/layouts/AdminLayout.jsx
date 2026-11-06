import { useContext, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import AuthContext from "../context/AuthContext";
import Sidebar from "../components/dashboard/Sidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";

const AdminLayout = () => {
  const { user, logout } = useContext(AuthContext);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const title = location.pathname.includes("/leads")
    ? "Lead Management"
    : location.pathname.includes("/users")
      ? "User Management"
      : "Dashboard";

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
      toast.success("Logged out successfully");
      navigate("/login", { replace: true });
    } catch {
      toast.error("Logout failed. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
        loggingOut={loggingOut}
      />

      {/* Main content area */}
      <div className="min-w-0 min-h-screen md:ml-64">
        <DashboardHeader
          user={user}
          title={title}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="p-5 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
