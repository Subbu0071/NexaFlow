import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const UserPortal = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Welcome, {user?.name}
            </h1>
            <p className="mt-2 text-slate-600">
              Welcome to your NexaFlow User Portal.
            </p>
          </div>

          <button
            onClick={logout}
            className="rounded-lg bg-red-600 px-5 py-2.5 font-medium text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Your Account</h2>

          <div className="mt-4 space-y-2 text-slate-600">
            <p>Name: {user?.name}</p>
            <p>Email: {user?.email}</p>
            <p>Role: {user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPortal;
