import React, { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";


const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const resetMessages = () => {
    setError("");
    setSuccessMsg("");
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    resetMessages();

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    try {
      setLoading(true);
      // TODO: Call your API to send reset code to email
      // await api.sendResetCode(email);
      setSuccessMsg("Verification code sent to your email.");
      setStep(2);
    } catch (err) {
      setError("Failed to send verification code. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    resetMessages();

    if (!code) {
      setError("Please enter the verification code.");
      return;
    }

    try {
      setLoading(true);
      // TODO: Call your API to verify code
      // await api.verifyCode({ email, code });
      setSuccessMsg("Code verified. Now set a new password.");
      setStep(3);
    } catch (err) {
      setError("Invalid verification code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    resetMessages();

    if (!password || !confirmPassword) {
      setError("Please fill all password fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      // TODO: Call your API to reset password
      // await api.resetPassword({ email, code, password });
      setSuccessMsg("Password reset successfully. You can now log in.");
      // Optionally close after a short delay
      // setTimeout(onClose, 1500);
    } catch (err) {
      setError("Failed to reset password. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setEmail("");
    setCode("");
    setPassword("");
    setConfirmPassword("");
    resetMessages();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg relative">
        {/* Header */}
        <button
          onClick={handleClose}
          className="absolute right-4 cursor-pointer top-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <h2 className="mb-1 text-xl font-semibold text-gray-900">
          Forgot Password
        </h2>
        <p className="mb-4 text-sm text-gray-500">
          Step {step} of 3
        </p>

        {/* Progress bar */}
        <div className="mb-4 flex gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full ${
                step >= s ? "bg-indigo-500" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="mb-3 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {successMsg}
          </div>
        )}

        {/* Step 1: Email */}
        {step === 1 && (
          <form onSubmit={handleSendEmail} className="space-y-4 mt-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                type="email"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Sending..." : "Send Verification Code"}
            </button>
          </form>
        )}

        {/* Step 2: Code */}
        {step === 2 && (
          <form onSubmit={handleVerifyCode} className="space-y-4 mt-2">
            <div className="text-xs text-gray-500">
              We have sent a verification code to{" "}
              <span className="font-semibold text-gray-700">{email}</span>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Verification Code
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 tracking-[0.3em]"
                placeholder="Enter code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="rounded-lg cursor-pointer border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4 mt-2">

  <div>
    <label className="mb-1 block text-sm font-medium text-gray-700">
      New Password
    </label>

    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        placeholder="Enter new password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
      >
        {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
      </button>
    </div>
  </div>

  {/* Confirm Password */}
  <div>
    <label className="mb-1 block text-sm font-medium text-gray-700">
      Confirm New Password
    </label>

    <div className="relative">
      <input
        type={showConfirmPassword ? "text" : "password"}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        placeholder="Re-enter new password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button
        type="button"
        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
      >
        {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
      </button>
    </div>
  </div>

  {/* Buttons */}
  <div className="flex items-center justify-between space-x-2">
    <button
      type="button"
      onClick={() => setStep(2)}
      className="rounded-lg cursor-pointer border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
    >
      Back
    </button>

    <button
      type="submit"
      disabled={loading}
      className="flex-1 cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {loading ? "Saving..." : "Reset Password"}
    </button>
  </div>
</form>

        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
