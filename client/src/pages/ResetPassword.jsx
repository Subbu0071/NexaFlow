import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { LockKeyhole, ArrowLeft, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

import api from "../services/api";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!token) {
      toast.error("Invalid or missing password reset link.");
      return;
    }

    if (formData.newPassword.length < 8) {
      toast.error("Password must contain at least 8 characters.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await api.post("/auth/reset-password", {
        token,
        newPassword: formData.newPassword,
      });

      toast.success(response.data.message || "Password reset successfully!");

      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Password reset failed. The link may have expired.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl sm:p-10">
        <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
          <LockKeyhole size={27} />
        </div>

        <h1 className="text-3xl font-bold text-slate-900">Reset password</h1>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          Create a new password for your Mini ERP account.
        </p>

        {!token ? (
          <div className="mt-7 rounded-lg bg-red-50 p-4 text-sm text-red-700">
            This reset link is invalid or missing its token. Please request a
            new password reset link.
            <Link
              to="/forgot-password"
              className="mt-3 block font-semibold underline"
            >
              Request a new link
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="newPassword"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                New password
              </label>

              <div className="relative">
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Minimum 8 characters"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-12 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Confirm new password
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Re-enter your new password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Updating password..." : "Update password"}
            </button>
          </form>
        )}

        <div className="mt-8 border-t border-slate-100 pt-6">
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"
          >
            <ArrowLeft size={17} />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
