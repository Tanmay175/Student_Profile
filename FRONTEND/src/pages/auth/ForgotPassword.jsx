import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendOTP = async () => {
    if (!email.trim()) return toast.error("Enter your email");
    try {
      setLoading(true);
      await api.post("/api/auth/forgot-password", { email });
      toast.success("OTP sent to your email 📧");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP ❌");
    } finally { setLoading(false); }
  };

  const resetPassword = async () => {
    if (!otp || !newPassword) return toast.error("Fill all fields");
    if (newPassword.length < 6) return toast.error("Password must be at least 6 characters");
    try {
      setLoading(true);
      await api.post("/api/auth/reset-password", { email, otp, newPassword });
      toast.success("Password reset ✅");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed ❌");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary">StuTrack</h1>
        </div>

        <div className="bg-base-100 rounded-2xl p-6 shadow-sm">
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-6">
            {[1,2].map(s => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                  ${step >= s ? "bg-primary text-primary-content" : "bg-base-300 text-base-content/50"}`}>{s}</div>
                {s < 2 && <div className={`flex-1 h-1 rounded ${step >= 2 ? "bg-primary" : "bg-base-300"}`}></div>}
              </div>
            ))}
          </div>

          {step === 1 ? (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Forgot Password</h2>
              <p className="text-sm text-base-content/50">Enter your registered email to receive an OTP.</p>
              <div>
                <label className="text-xs text-base-content/60 mb-1 block">Email</label>
                <input
                  type="email" placeholder="your@email.com"
                  className="input input-bordered w-full"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendOTP()}
                />
              </div>
              <button onClick={sendOTP} className="btn btn-primary w-full" disabled={loading}>
                {loading ? <span className="loading loading-spinner loading-sm"></span> : "Send OTP"}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Reset Password</h2>
              <p className="text-sm text-base-content/50">OTP sent to <strong>{email}</strong></p>
              <div>
                <label className="text-xs text-base-content/60 mb-1 block">6-digit OTP</label>
                <input
                  type="text" placeholder="123456" maxLength={6}
                  className="input input-bordered w-full tracking-widest text-center text-lg"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
                />
              </div>
              <div>
                <label className="text-xs text-base-content/60 mb-1 block">New Password</label>
                <input
                  type="password" placeholder="Min 6 characters"
                  className="input input-bordered w-full"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && resetPassword()}
                />
              </div>
              <button onClick={resetPassword} className="btn btn-primary w-full" disabled={loading}>
                {loading ? <span className="loading loading-spinner loading-sm"></span> : "Reset Password"}
              </button>
              <button
                className="btn btn-ghost btn-sm w-full"
                onClick={() => { setStep(1); setOtp(""); setNewPassword(""); }}
              >← Change email</button>
            </div>
          )}

          <p className="mt-5 text-sm text-center">
            <Link to="/" className="text-primary">← Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
