import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";

function ForgotPassword() {
  const [step, setStep] = useState(1); // 1 = enter email, 2 = enter OTP + new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    if (!email.trim()) return toast.error("Enter your email");
    try {
      setLoading(true);
      await api.post("/api/auth/forgot-password", { email });
      toast.success("OTP sent to your email 📧");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!otp.trim() || !newPassword.trim()) return toast.error("Fill all fields");
    try {
      setLoading(true);
      await api.post("/api/auth/reset-password", { email, otp, newPassword });
      toast.success("Password reset successful ✅");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl p-6">

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-5">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? "bg-primary text-primary-content" : "bg-base-300"}`}>1</div>
          <div className={`flex-1 h-1 rounded ${step >= 2 ? "bg-primary" : "bg-base-300"}`}></div>
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? "bg-primary text-primary-content" : "bg-base-300"}`}>2</div>
        </div>

        {step === 1 ? (
          <>
            <h2 className="text-2xl font-bold mb-1">Forgot Password</h2>
            <p className="text-sm text-gray-500 mb-4">We'll send a 6-digit OTP to your email.</p>

            <input
              type="email"
              placeholder="Your registered email"
              className="input input-bordered w-full mb-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendOTP()}
            />

            <button onClick={handleSendOTP} className="btn btn-primary w-full" disabled={loading}>
              {loading ? <span className="loading loading-spinner loading-sm"></span> : "Send OTP"}
            </button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-1">Reset Password</h2>
            <p className="text-sm text-gray-500 mb-4">
              OTP sent to <span className="font-semibold text-base-content">{email}</span>
            </p>

            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              className="input input-bordered w-full mb-3"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            />

            <input
              type="password"
              placeholder="New Password (min 6 chars)"
              className="input input-bordered w-full mb-3"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleResetPassword()}
            />

            <button onClick={handleResetPassword} className="btn btn-primary w-full mb-2" disabled={loading}>
              {loading ? <span className="loading loading-spinner loading-sm"></span> : "Reset Password"}
            </button>

            <button
              className="btn btn-ghost btn-sm w-full"
              onClick={() => { setStep(1); setOtp(""); setNewPassword(""); }}
            >
              ← Change email
            </button>
          </>
        )}

        <p className="mt-4 text-sm text-center">
          <Link to="/" className="text-blue-500">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;