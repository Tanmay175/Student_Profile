// FRONTEND/src/pages/auth/ProfessorLogin.jsx
// Secret professor login — not linked from anywhere in the public UI
// Access via: /prof-access-9x2k  (keep this URL private)
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import toast from "react-hot-toast";

const SECRET_CODE = import.meta.env.VITE_PROF_SECRET || "prof@stutrack";

function ProfessorLogin() {
  const [form, setForm] = useState({ email: "", password: "", secretCode: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    // Check secret code first — before hitting the server
    if (form.secretCode !== SECRET_CODE) {
      toast.error("Invalid access code ❌");
      return;
    }

    try {
      setLoading(true);
      const data = await loginUser({ email: form.email, password: form.password });

      if (data.role !== "professor") {
        toast.error("This account is not a professor account ❌");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      toast.success("Welcome, Professor 👋");
      navigate("/professor/dashboard");
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
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🔐</div>
          <h1 className="text-2xl font-bold">Professor Access</h1>
          <p className="text-sm text-gray-500 mt-1">Restricted — faculty only</p>
        </div>

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
          className="input input-bordered w-full mb-3"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          autoComplete="current-password"
        />

        <input
          type="password"
          name="secretCode"
          placeholder="Access Code"
          className="input input-bordered w-full mb-4"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />

        <button
          onClick={handleSubmit}
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? <span className="loading loading-spinner loading-sm"></span> : "Login"}
        </button>
      </div>
    </div>
  );
}

export default ProfessorLogin;
