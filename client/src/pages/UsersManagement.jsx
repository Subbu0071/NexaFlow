import { useCallback, useContext, useEffect, useState } from "react";
import {
  Search,
  RefreshCw,
  ShieldCheck,
  User,
  UserCog,
  UserX,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Users,
  Plus,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import api from "../services/api";
import AuthContext from "../context/AuthContext";

// Initial values for the Create User form
const INITIAL_FORM = {
  name: "",
  email: "",
  mobile: "",
  password: "",
};

const UsersManagement = () => {
  // --------------------------------------------------
  // AUTHENTICATED ADMIN
  // --------------------------------------------------

  const { user: currentUser } = useContext(AuthContext);

  // --------------------------------------------------
  // COMPONENT STATE
  // --------------------------------------------------

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search and filters
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");

  // Pagination
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalRecords: 0,
    totalPages: 1,
    currentPage: 1,
  });

  // Create User modal and form
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);
  const [createForm, setCreateForm] = useState(INITIAL_FORM);

  // --------------------------------------------------
  // FETCH USERS
  // GET /api/admin/users
  // Supports search, filters, sorting and pagination.
  // --------------------------------------------------

  const fetchUsers = useCallback(
    async (pageToFetch = page) => {
      try {
        setLoading(true);

        const response = await api.get("/admin/users", {
          params: {
            search,
            role,
            status,
            page: pageToFetch,
            limit: 10,
            sortBy: "createdAt",
            sortOrder: "desc",
          },
        });

        setUsers(response.data.data || []);

        const pageData = response.data.pagination || {};

        setPagination({
          totalRecords: pageData.totalRecords || 0,
          totalPages: pageData.totalPages || 1,
          currentPage: pageData.currentPage || 1,
        });
      } catch (error) {
        toast.error(error.response?.data?.message || "Unable to load users.");
      } finally {
        setLoading(false);
      }
    },
    [search, role, status, page],
  );

  // Fetch users whenever search, filters or page changes.
  // setTimeout avoids calling state updates directly inside
  // the effect during the initial render.
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 0);

    return () => clearTimeout(timer);
  }, [fetchUsers]);

  // --------------------------------------------------
  // CREATE USER
  // POST /api/admin/users
  //
  // Admin creates a user with a default password.
  // Backend sends the login credentials by email.
  // --------------------------------------------------

  const handleCreateUser = async (event) => {
    event.preventDefault();

    const name = createForm.name.trim();
    const email = createForm.email.trim();
    const mobile = createForm.mobile.trim();
    const password = createForm.password;

    // Basic frontend validation
    if (!name || !email || !mobile || !password) {
      toast.error("Please complete all fields.");
      return;
    }

    if (!/^\d{10}$/.test(mobile)) {
      toast.error("Enter a valid 10-digit mobile number.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must contain at least 8 characters.");
      return;
    }

    try {
      setCreatingUser(true);

      const response = await api.post("/admin/users", {
        name,
        email,
        mobile,
        password,
      });

      // The backend creates the account and reports
      // whether the credentials email was delivered.
      if (response.data.emailSent) {
        toast.success("User created and credentials emailed successfully.");
      } else {
        toast.error(
          "User created, but the credentials email could not be sent.",
        );
      }

      // Reset form and close modal
      setCreateForm(INITIAL_FORM);
      setShowCreateModal(false);

      // Return to the first page and refresh the user list.
      setPage(1);
      await fetchUsers(1);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to create user.");
    } finally {
      setCreatingUser(false);
    }
  };

  // --------------------------------------------------
  // UPDATE USER ROLE
  // PATCH /api/admin/users/:id/role
  // --------------------------------------------------

  const handleRoleChange = async (targetUser, newRole) => {
    // Prevent the logged-in admin from changing their own role.
    if (targetUser.id === currentUser?.id) {
      toast.error("You cannot change your own role.");
      return;
    }

    const confirmed = window.confirm(
      `Change ${targetUser.name}'s role to ${newRole}? They will need to log in again.`,
    );

    if (!confirmed) return;

    try {
      const response = await api.patch(`/admin/users/${targetUser.id}/role`, {
        role: newRole,
      });

      toast.success(response.data.message || "User role updated.");

      fetchUsers();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to update user role.",
      );
    }
  };

  // --------------------------------------------------
  // ACTIVATE / DEACTIVATE USER
  // PATCH /api/admin/users/:id/status
  // --------------------------------------------------

  const handleStatusChange = async (targetUser) => {
    // Prevent an admin from deactivating their own account.
    if (targetUser.id === currentUser?.id) {
      toast.error("You cannot deactivate your own account.");
      return;
    }

    const nextStatus = !targetUser.isActive;
    const action = nextStatus ? "activate" : "deactivate";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${targetUser.name}?`,
    );

    if (!confirmed) return;

    try {
      const response = await api.patch(`/admin/users/${targetUser.id}/status`, {
        isActive: nextStatus,
      });

      toast.success(response.data.message || "Account status updated.");

      fetchUsers();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to update account status.",
      );
    }
  };

  // --------------------------------------------------
  // DELETE USER
  // DELETE /api/admin/users/:id
  // --------------------------------------------------

  const handleDelete = async (targetUser) => {
    // Prevent an admin from deleting their own account.
    if (targetUser.id === currentUser?.id) {
      toast.error("You cannot delete your own account.");
      return;
    }

    const confirmed = window.confirm(
      `Permanently delete ${targetUser.name}? This action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      const response = await api.delete(`/admin/users/${targetUser.id}`);

      toast.success(response.data.message || "User deleted successfully.");

      // If the last user on a page is deleted,
      // move to the previous page.
      if (users.length === 1 && page > 1) {
        setPage((previous) => previous - 1);
      } else {
        fetchUsers();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete user.");
    }
  };

  // --------------------------------------------------
  // SEARCH AND FILTER HANDLERS
  // --------------------------------------------------

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleRoleFilter = (value) => {
    setRole(value);
    setPage(1);
  };

  const handleStatusFilter = (value) => {
    setStatus(value);
    setPage(1);
  };

  // --------------------------------------------------
  // MODAL HANDLERS
  // --------------------------------------------------

  const openCreateModal = () => {
    setCreateForm(INITIAL_FORM);
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    if (creatingUser) return;

    setShowCreateModal(false);
    setCreateForm(INITIAL_FORM);
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="space-y-6">
      {/* ==============================================
          PAGE HEADER
      ============================================== */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-indigo-600">
            Workspace / Administration
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            User Management
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage registered users, roles and account access.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Open Create User modal */}
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            <Plus size={17} />
            Create User
          </button>

          {/* Refresh user list */}
          <button
            type="button"
            onClick={() => fetchUsers()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* ==============================================
          USER STATISTICS
      ============================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Total users */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Users found</p>
            <Users size={21} className="text-indigo-600" />
          </div>

          <p className="mt-3 text-2xl font-bold text-slate-900">
            {pagination.totalRecords}
          </p>
        </div>

        {/* Admins on current page */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Admins on this page</p>
            <ShieldCheck size={21} className="text-violet-600" />
          </div>

          <p className="mt-3 text-2xl font-bold text-slate-900">
            {users.filter((item) => item.role === "admin").length}
          </p>
        </div>

        {/* Active users on current page */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Active on this page</p>
            <User size={21} className="text-emerald-600" />
          </div>

          <p className="mt-3 text-2xl font-bold text-slate-900">
            {users.filter((item) => item.isActive).length}
          </p>
        </div>
      </div>

      {/* ==============================================
          SEARCH AND FILTERS
      ============================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {/* Search by name, email or mobile */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Search name, email or mobile..."
              className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* Filter by role */}
          <select
            value={role}
            onChange={(event) => handleRoleFilter(event.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
          >
            <option value="all">All roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>

          {/* Filter by account status */}
          <select
            value={status}
            onChange={(event) => handleStatusFilter(event.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
          >
            <option value="all">All account statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* ==============================================
          USERS TABLE
      ============================================== */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="font-semibold text-slate-900">Registered users</h2>

          <span className="text-xs text-slate-500">
            {pagination.totalRecords} total records
          </span>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="flex items-center justify-center py-16 text-sm text-slate-500">
            <RefreshCw size={18} className="mr-2 animate-spin" />
            Loading users...
          </div>
        ) : users.length === 0 ? (
          /* Empty state */
          <div className="py-16 text-center">
            <Users size={35} className="mx-auto text-slate-300" />

            <p className="mt-3 font-medium text-slate-700">No users found</p>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          /* Users table */
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4">User</th>
                  <th className="px-5 py-4">Mobile</th>
                  <th className="px-5 py-4">Role</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Joined</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {users.map((item) => {
                  // Identify the currently logged-in admin.
                  const isSelf = item.id === currentUser?.id;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70">
                      {/* User name and email */}
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900">
                          {item.name}

                          {isSelf && (
                            <span className="ml-2 text-xs font-normal text-indigo-600">
                              (You)
                            </span>
                          )}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {item.email}
                        </p>
                      </td>

                      {/* Mobile number */}
                      <td className="px-5 py-4 text-slate-600">
                        {item.mobile}
                      </td>

                      {/* Role selector */}
                      <td className="px-5 py-4">
                        <select
                          value={item.role}
                          disabled={isSelf}
                          onChange={(event) =>
                            handleRoleChange(item, event.target.value)
                          }
                          className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                          aria-label={`Change role for ${item.name}`}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>

                      {/* Account status */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            item.isActive
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {item.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* Account creation date */}
                      <td className="px-5 py-4 text-xs text-slate-500">
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString()
                          : "—"}
                      </td>

                      {/* User actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {/* Activate / Deactivate */}
                          <button
                            type="button"
                            onClick={() => handleStatusChange(item)}
                            disabled={isSelf}
                            title={
                              item.isActive
                                ? "Deactivate user"
                                : "Activate user"
                            }
                            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {item.isActive ? (
                              <UserX size={17} />
                            ) : (
                              <UserCog size={17} />
                            )}
                          </button>

                          {/* Delete user */}
                          <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            disabled={isSelf}
                            title="Delete user"
                            className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ============================================
            PAGINATION
        ============================================ */}

        {!loading && users.length > 0 && (
          <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row">
            <p className="text-xs text-slate-500">
              Page {pagination.currentPage} of {pagination.totalPages}
            </p>

            <div className="flex items-center gap-2">
              {/* Previous page */}
              <button
                type="button"
                onClick={() => setPage((previous) => Math.max(1, previous - 1))}
                disabled={page <= 1 || loading}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              {/* Next page */}
              <button
                type="button"
                onClick={() =>
                  setPage((previous) =>
                    Math.min(pagination.totalPages, previous + 1),
                  )
                }
                disabled={page >= pagination.totalPages || loading}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ==============================================
          CREATE USER MODAL
          
          This modal must remain INSIDE the root return JSX.
          It sends the form data to the backend, which creates
          the user and sends the credentials email.
      ============================================== */}

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            {/* Modal header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Create New User
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Create an account and email its login credentials.
                </p>
              </div>

              {/* Close modal */}
              <button
                type="button"
                onClick={closeCreateModal}
                disabled={creatingUser}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
                aria-label="Close modal"
              >
                <X size={19} />
              </button>
            </div>

            {/* Create User form */}
            <form onSubmit={handleCreateUser} className="space-y-4">
              {/* Full name */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Full Name
                </label>

                <input
                  type="text"
                  required
                  maxLength={100}
                  value={createForm.name}
                  onChange={(event) =>
                    setCreateForm((previous) => ({
                      ...previous,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Enter full name"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* Email address */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Email Address
                </label>

                <input
                  type="email"
                  required
                  value={createForm.email}
                  onChange={(event) =>
                    setCreateForm((previous) => ({
                      ...previous,
                      email: event.target.value,
                    }))
                  }
                  placeholder="user@example.com"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* Mobile number */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Mobile Number
                </label>

                <input
                  type="tel"
                  required
                  inputMode="numeric"
                  maxLength={10}
                  value={createForm.mobile}
                  onChange={(event) =>
                    setCreateForm((previous) => ({
                      ...previous,
                      mobile: event.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10),
                    }))
                  }
                  placeholder="10-digit mobile number"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* Default password */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Default Password
                </label>

                <input
                  type="password"
                  required
                  minLength={8}
                  value={createForm.password}
                  onChange={(event) =>
                    setCreateForm((previous) => ({
                      ...previous,
                      password: event.target.value,
                    }))
                  }
                  placeholder="Minimum 8 characters"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* Credentials email information */}
              <div className="rounded-xl bg-indigo-50 p-3 text-sm text-indigo-800">
                The user will receive their login credentials by email. They
                should use Forgot Password after logging in to set their
                personal password.
              </div>

              {/* Modal actions */}
              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  disabled={creatingUser}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creatingUser}
                  className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {creatingUser ? "Creating..." : "Create User & Send Email"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
