import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, UserCog, X, LogOut, Zap } from "lucide-react";

const Sidebar = ({ open, onClose, onLogout, loggingOut }) => {
  const links = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Leads",
      path: "/admin/leads",
      icon: Users,
    },
    {
      label: "User Management",
      path: "/admin/users",
      icon: UserCog,
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Fixed sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col overflow-y-auto bg-slate-950 text-white transition-transform duration-300 md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-white/10 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600">
              <Zap size={22} />
            </div>

            <div>
              <h2 className="text-lg font-bold">NexaFlow</h2>
              <p className="text-xs text-slate-400">Business Suite</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="md:hidden"
            aria-label="Close menu"
          >
            <X size={21} />
          </button>
        </div>

        {/* Navigation */}
        <div className="px-5 pb-2 pt-7 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Workspace
        </div>

        <nav className="flex-1 space-y-2 px-4 py-3">
          {links.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-950/30"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon size={19} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="shrink-0 border-t border-white/10 p-4">
          <button
            onClick={onLogout}
            disabled={loggingOut}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-300 hover:bg-red-500/10 disabled:opacity-50"
          >
            <LogOut size={19} />
            {loggingOut ? "Signing out..." : "Logout"}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
