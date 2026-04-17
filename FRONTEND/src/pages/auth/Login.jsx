import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../services/authService";
import toast from "react-hot-toast";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
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

    toast.success("Login successful 🎉"); // ✅

    if (data.role === "student") {
      navigate("/student/dashboard");
    } else {
      navigate("/professor/dashboard");
    }

  } catch (error) {
    toast.error(error.response?.data?.message || "Login failed ❌"); // ❌
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-4">Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="input input-bordered w-full mb-3"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="input input-bordered w-full mb-3"
          onChange={handleChange}
        />

        <button onClick={handleSubmit} className="btn btn-primary w-full">
          Login
        </button>

        <p className="mt-3 text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;