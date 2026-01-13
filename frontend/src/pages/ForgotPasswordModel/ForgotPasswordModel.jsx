import React, { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { sendResetCode, verifyAndReset } from "../../features/studentSlice";
import { useDispatch } from "react-redux";


const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
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

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    const emailRegex = /^[^\s@]+@usq\.edu\.au$/;

    if (!emailRegex.test(email.trim().toLowerCase())) {
      setError("Only @usq.edu.au email is allowed.");
      return;
    }

    try {
      setLoading(true);

      const res = await dispatch(sendResetCode(email.trim().toLowerCase())).unwrap();
      setSuccessMsg(res.message);
      setStep(2);


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
      setSuccessMsg("Code verified. Set your new password.");
    } catch (err) {
      setError("Invalid verification code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    resetMessages();

    if (!code || code.length !== 6) {
      setError("Please enter a valid 6-digit verification code.");
      return;
    }

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
      const res = await dispatch(
        verifyAndReset({
          email: email.trim().toLowerCase(),
          code,
          newPassword: password
        })
      ).unwrap();
      setSuccessMsg("Password reset successfully. You can now log in.");
      setTimeout(() => {
        handleClose();
      }, 1200);
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
        <p className="mb-4 text-sm text-gray-500">Step {step} of 2</p>

        {/* Progress bar */}
        <div className="mb-4 flex gap-2">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full ${step >= s ? "bg-purple-500" : "bg-gray-200"
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
                type="text"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="stansmith@usq.edu.au"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Sending..." : "Send Verification Code"}
            </button>
          </form>
        )}

        {/* Step 2: Code */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4 mt-2">
            <div className="text-xs text-gray-500">
              We have sent a verification code to{" "}
              <span className="font-semibold text-gray-700">{email}</span>
            </div>
            {/* OTP 6 Boxes */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Verification Code
              </label>

              <div className="flex justify-between gap-2">
                {[...Array(6)].map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    className="w-10 h-12 text-center text-lg rounded-lg border border-gray-300
                   focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                    value={code[index] || ""}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, ""); // allow digits only
                      let codeArr = code.split("");

                      // update digit
                      codeArr[index] = val;
                      const newCode = codeArr.join("");
                      setCode(newCode);

                      // focus next box
                      if (val && index < 5) {
                        document.getElementById(`otp-${index + 1}`).focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      // backspace handling
                      if (e.key === "Backspace") {
                        if (!code[index] && index > 0) {
                          document.getElementById(`otp-${index - 1}`).focus();
                        }
                      }
                    }}
                    id={`otp-${index}`}
                  />
                ))}
              </div>
            </div>

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
                  {showPassword ? <Eye className="cursor-pointer" size={18} /> : <EyeOff className="cursor-pointer" size={18} />}
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
                  {showConfirmPassword ? (
                    <Eye className="cursor-pointer" size={18} />
                  ) : (
                    <EyeOff className="cursor-pointer" size={18} />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between space-x-2">
              {/* <button
                type="button"
                onClick={() => setStep(1)}
                className="rounded-lg cursor-pointer border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Back
              </button> */}

              {/* <button
                type="submit"
                disabled={loading}
                className="flex-1 cursor-pointer rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button> */}

              <button
                type="submit"
                disabled={loading}
                className="flex-1 cursor-pointer rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Saving..." : "Reset Password"}
              </button>

            </div>
          </form>
        )}

        {/* {step === 3 && (
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
                  {showPassword ? <Eye className="cursor-pointer" size={18} /> : <EyeOff className="cursor-pointer" size={18} />}
                </button>
              </div>
            </div>
 
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
                  {showConfirmPassword ? (
                    <Eye className="cursor-pointer" size={18} />
                  ) : (
                    <EyeOff className="cursor-pointer" size={18} />
                  )}
                </button>
              </div>
            </div>
 
            <div className="flex items-center justify-between space-x-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 cursor-pointer rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Saving..." : "Reset Password"}
              </button>
            </div>
          </form>
        )} */}

      </div>
    </div>
  );
};

export default ForgotPasswordModal;