// FRONTEND/src/pages/auth/Register.jsx
// Students only — professor registration is disabled from public UI
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../services/authService";
import toast from "react-hot-toast";

const currentYear = new Date().getFullYear();
const batchYears = Array.from(
  { length: currentYear + 4 - 2000 + 1 },
  (_, i) => 2000 + i
);

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student", // always student — hardcoded
    batch: "",
    rollNo: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) return toast.error("Name is required");
    if (!form.email.trim()) return toast.error("Email is required");
    if (!form.password || form.password.length < 6)
      return toast.error("Password must be at least 6 characters");
    if (!form.rollNo.trim()) return toast.error("Roll number is required");
    if (!form.batch) return toast.error("Please select your batch");

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
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-sm bg-base-100 shadow-xl p-6 md:p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-primary">StuTrack</h1>
          <p className="text-sm text-gray-500 mt-1">Student Registration</p>
        </div>

        <h2 className="text-xl font-bold mb-4">Create Account</h2>

        <input
          name="name"
          placeholder="Full Name"
          className="input input-bordered w-full mb-3"
          onChange={handleChange}
          value={form.name}
        />

        <input
          name="email"
          type="email"
          placeholder="College Email"
          className="input input-bordered w-full mb-3"
          onChange={handleChange}
          value={form.email}
          autoComplete="email"
        />

        <input
          name="password"
          type="password"
          placeholder="Password (min 6 characters)"
          className="input input-bordered w-full mb-3"
          onChange={handleChange}
          value={form.password}
          autoComplete="new-password"
        />

        <input
          name="rollNo"
          placeholder="Roll Number (e.g. 22CS001)"
          className="input input-bordered w-full mb-3"
          onChange={handleChange}
          value={form.rollNo}
        />

        <select
          name="batch"
          className="select select-bordered w-full mb-4"
          onChange={handleChange}
          value={form.batch}
        >
          <option value="" disabled>Select Batch (Year of Passout)</option>
          {batchYears.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <button
          onClick={handleSubmit}
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? <span className="loading loading-spinner loading-sm"></span> : "Register"}
        </button>

        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <Link to="/" className="text-primary hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
