import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Send } from "lucide-react";
import toast from "react-hot-toast";

import api from "../services/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await api.post("/auth/forgot-password", {
        email: email.trim(),
      });

      toast.success(
        response.data.message ||
          "If your account exists, a reset link has been sent.",
      );

      setSubmitted(true);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to process your request. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl sm:p-10">
        <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
          <Mail size={27} />
        </div>

        {!submitted ? (
          <>
            <h1 className="text-3xl font-bold text-slate-900">
              Forgot password?
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              No worries! Enter your registered email address and we'll send you
              instructions to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  maxLength={150}
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send size={18} />
                {submitting ? "Sending..." : "Send reset link"}
              </button>
            </form>
          </>
        ) : (
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Check your email
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              If an account exists for this email address, you'll receive
              instructions to reset your password.
            </p>

            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="mt-6 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Try another email
            </button>
          </div>
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

export default ForgotPassword;
