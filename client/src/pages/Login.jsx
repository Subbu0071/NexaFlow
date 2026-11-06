import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ArrowRight,
  ShieldCheck,
  ChartNoAxesCombined,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";

import AuthContext from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
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

    if (!formData.identifier.trim() || !formData.password) {
      toast.error("Please enter your email/mobile number and password.");
      return;
    }

    try {
      setSubmitting(true);

      const loginResponse = await login({
        identifier: formData.identifier.trim(),
        password: formData.password,
      });

      toast.success("Login successful!");

      // Redirect according to the authenticated user's role.
      const destination =
        loginResponse.user.role === "admin" ? "/admin/dashboard" : "/portal";

      navigate(destination, { replace: true });
    } catch (error) {
      const message =
        error.response?.data?.message || "Unable to login. Please try again.";

      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f5f7fc] px-4 py-8 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl" />

      <div className="relative grid w-full max-w-6xl overflow-hidden rounded-3xl border border-white bg-white shadow-[0_25px_80px_-25px_rgba(30,41,59,0.18)] lg:min-h-[650px] lg:grid-cols-[1.05fr_0.95fr]">
        {/* Left branding panel */}
        <section className="relative hidden flex-col justify-between overflow-hidden bg-[#101a35] p-12 text-white lg:flex xl:p-16">
          {/* Decorative shapes */}
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border border-white/10" />
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-white/10" />
          <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />

          <div className="relative z-10">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg shadow-indigo-900/40">
                <span className="text-2xl font-extrabold">M</span>
              </div>

              <div>
                <h1 className="text-xl font-bold tracking-wide">Mini ERP</h1>
                <p className="text-xs tracking-[0.2em] text-slate-400">
                  BUSINESS MANAGEMENT
                </p>
              </div>
            </div>

            {/* Main message */}
            <div className="mt-24 max-w-lg">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-400/10 px-4 py-2 text-xs font-medium text-indigo-200">
                <span className="h-2 w-2 rounded-full bg-green-400" />
                Your business, organized
              </div>

              <h2 className="text-4xl font-bold leading-[1.2] xl:text-5xl">
                Take control of your business.
                <span className="mt-2 block bg-gradient-to-r from-indigo-300 to-blue-300 bg-clip-text text-transparent">
                  Grow with clarity.
                </span>
              </h2>

              <p className="mt-6 max-w-md text-base leading-8 text-slate-300">
                One centralized workspace to manage leads, organize customer
                information, and stay on top of your business activities.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="mt-12 space-y-5">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-indigo-300">
                  <ChartNoAxesCombined size={21} />
                </div>
                <div>
                  <p className="font-semibold">Smarter management</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Keep your business information organized.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-indigo-300">
                  <ShieldCheck size={21} />
                </div>
                <div>
                  <p className="font-semibold">Secure access</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Your account and sessions stay protected.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-indigo-300">
                  <Zap size={21} />
                </div>
                <div>
                  <p className="font-semibold">Simplified workflow</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Spend less time managing and more time growing.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="relative z-10 text-xs text-slate-500">
            © {new Date().getFullYear()} Mini ERP. All rights reserved.
          </p>
        </section>

        {/* Right login panel */}
        <section className="flex items-center justify-center px-6 py-12 sm:px-12 lg:px-14 xl:px-20">
          <div className="w-full max-w-md">
            {/* Mobile brand */}
            <div className="mb-12 flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-blue-600 text-xl font-bold text-white">
                M
              </div>
              <span className="text-xl font-bold text-slate-900">Mini ERP</span>
            </div>

            <div className="mb-10">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
                Welcome back
              </p>

              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Sign in to your account
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Enter your credentials to access your workspace.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email or Mobile Number */}
<div>
  <label
    htmlFor="identifier"
    className="mb-2 block text-sm font-semibold text-slate-700"
  >
    Email address or mobile number
  </label>

  <div className="group relative">
    <Mail
      size={19}
      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition group-focus-within:text-indigo-600"
    />

    <input
      id="identifier"
      name="identifier"
      type="text"
      autoComplete="username"
      placeholder="Enter email or mobile number"
      value={formData.identifier}
      onChange={handleChange}
      required
      className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-3.5 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
    />
  </div>
</div>
                  

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-sm font-semibold text-indigo-600 transition hover:text-indigo-800"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="group relative">
                  <LockKeyhole
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition group-focus-within:text-indigo-600"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-3.5 pl-12 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((previous) => !previous)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-indigo-600"
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={submitting}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-600/25 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {submitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in to workspace
                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>

            {/* Register link */}
            <div className="mt-9 border-t border-slate-100 pt-7 text-center">
              <p className="text-sm text-slate-500">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-bold text-indigo-600 transition hover:text-indigo-800"
                >
                  Create an account
                </Link>
              </p>
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck size={15} />
              Secure authentication powered by Mini ERP
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Login;
