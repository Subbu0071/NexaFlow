import { Menu, Bell } from "lucide-react";

const DashboardHeader = ({ user, onMenuClick, title }) => {
  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="text-slate-600 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu size={24} />
        </button>

        <div>
          <h1 className="text-xl font-bold text-slate-900">{title}</h1>
          <p className="hidden text-xs text-slate-500 sm:block">
            Manage your business workspace
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Bell size={20} className="text-slate-400" />

        <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
            {user?.name?.charAt(0)?.toUpperCase() || "A"}
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-800">
              {user?.name || "Admin"}
            </p>
            <p className="text-xs capitalize text-slate-500">
              {user?.role || "Admin"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
