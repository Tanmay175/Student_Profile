import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../services/authService";
import toast from "react-hot-toast";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    batch: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
  try {
    setLoading(true);

    await registerUser(form);

    toast.success("Registration successful ✅");

    navigate("/");

  } catch (error) {
    toast.error(error.response?.data?.message || "Register failed ❌");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-4">Register</h2>

        <input
          name="name"
          placeholder="Name"
          className="input input-bordered w-full mb-3"
          onChange={handleChange}
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="input input-bordered w-full mb-3"
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="input input-bordered w-full mb-3"
          onChange={handleChange}
        />

        <select
          name="role"
          className="select select-bordered w-full mb-3"
          onChange={handleChange}
        >
          <option value="student">Student</option>
          <option value="professor">Professor</option>
        </select>

        {/* Show batch only if student */}
        {form.role === "student" && (
          <input
            name="batch"
            placeholder="Batch (e.g. 2026)"
            className="input input-bordered w-full mb-3"
            onChange={handleChange}
          />
        )}

        <button onClick={handleSubmit} className="btn btn-primary w-full">
          Register
        </button>

        <p className="mt-3 text-sm">
          Already have an account?{" "}
          <Link to="/" className="text-blue-500">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;