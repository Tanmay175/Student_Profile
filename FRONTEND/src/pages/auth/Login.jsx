import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../services/authService";
import toast from "react-hot-toast";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const data = await loginUser(form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      toast.success("Welcome back! 🎉");
      navigate(data.role === "student" ? "/student/dashboard" : "/professor/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4 py-8">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary">StuTrack</h1>
          <p className="text-sm text-base-content/50 mt-1">Student Profile Management</p>
        </div>

        <div className="bg-base-100 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-xl font-bold">Login</h2>

          <div>
            <label className="text-xs text-base-content/60 mb-1 block">Email</label>
            <input
              type="email" name="email"
              placeholder="your@email.com"
              className="input input-bordered w-full"
              onChange={handleChange}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              autoComplete="email"
            />
          </div>

          <div>
            <label className="text-xs text-base-content/60 mb-1 block">Password</label>
            <input
              type="password" name="password"
              placeholder="Enter password"
              className="input input-bordered w-full"
              onChange={handleChange}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              autoComplete="current-password"
            />
          </div>

          <button onClick={handleSubmit} className="btn btn-primary w-full" disabled={loading}>
            {loading ? <span className="loading loading-spinner loading-sm"></span> : "Login"}
          </button>

          <div className="flex justify-between text-sm pt-1">
            <Link to="/forgot-password" className="text-base-content/50 hover:text-primary">Forgot password?</Link>
            <Link to="/register" className="text-primary font-medium">Register →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
