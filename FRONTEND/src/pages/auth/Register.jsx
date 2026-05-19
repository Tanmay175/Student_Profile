import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../services/authService";
import toast from "react-hot-toast";

// Generate batch years: 2000 to current year + 4
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
    role: "student",
    batch: "",
    rollNo: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      // Clear student fields when switching away from student role
      ...(name === "role" && value !== "student"
        ? { batch: "", rollNo: "" }
        : {}),
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Client-side validation for student fields
      if (form.role === "student") {
        if (!form.rollNo.trim()) {
          toast.error("Roll number is required");
          return;
        }
        if (!form.batch) {
          toast.error("Please select your batch (year of passout)");
          return;
        }
      }

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
          value={form.name}
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="input input-bordered w-full mb-3"
          onChange={handleChange}
          value={form.email}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="input input-bordered w-full mb-3"
          onChange={handleChange}
          value={form.password}
        />

        <select
          name="role"
          className="select select-bordered w-full mb-3"
          onChange={handleChange}
          value={form.role}
        >
          <option value="student">Student</option>
          <option value="professor">Professor</option>
        </select>

        {/* Student-only fields */}
        {form.role === "student" && (
          <>
            <input
              name="rollNo"
              placeholder="Roll Number (e.g. 22CS001)"
              className="input input-bordered w-full mb-3"
              onChange={handleChange}
              value={form.rollNo}
            />

            <select
              name="batch"
              className="select select-bordered w-full mb-3"
              onChange={handleChange}
              value={form.batch}
            >
              <option value="" disabled>
                Select Batch (Year of Passout)
              </option>
              {batchYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </>
        )}

        <button
          onClick={handleSubmit}
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            "Register"
          )}
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