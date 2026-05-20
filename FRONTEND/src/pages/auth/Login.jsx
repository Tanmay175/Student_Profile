// FRONTEND/src/pages/auth/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../services/authService";
import toast from "react-hot-toast";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const data = await loginUser(form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      toast.success("Login successful 🎉");
      if (data.role === "student") {
        navigate("/student/dashboard");
      } else {
        navigate("/professor/dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-sm bg-base-100 shadow-xl p-6 md:p-8">
        {/* Logo / Title */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-primary">StuTrack</h1>
          <p className="text-sm text-gray-500 mt-1">Student Profile Management</p>
        </div>

        <h2 className="text-xl font-bold mb-4">Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="input input-bordered w-full mb-3"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          autoComplete="email"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="input input-bordered w-full mb-4"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          autoComplete="current-password"
        />

        <button
          onClick={handleSubmit}
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? <span className="loading loading-spinner loading-sm"></span> : "Login"}
        </button>

        <div className="mt-4 flex justify-between text-sm">
          <Link to="/forgot-password" className="text-gray-500 hover:text-primary">
            Forgot password?
          </Link>
          <Link to="/register" className="text-primary hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
