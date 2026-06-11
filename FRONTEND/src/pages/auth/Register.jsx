import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../services/authService";
import toast from "react-hot-toast";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear + 4 - 2020 + 1 }, (_, i) => 2020 + i);

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", rollNo: "", batch: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name.trim())    return toast.error("Name is required");
    if (!form.email.trim())   return toast.error("Email is required");
    if (!form.password || form.password.length < 6) return toast.error("Password must be at least 6 characters");
    if (!form.rollNo.trim())  return toast.error("Roll number is required");
    if (!form.batch)          return toast.error("Select your batch");

    try {
      setLoading(true);
      await registerUser({ ...form, role: "student" });
      toast.success("Registered successfully ✅");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary">StuTrack</h1>
          <p className="text-sm text-base-content/50 mt-1">Student Registration</p>
        </div>

        <div className="bg-base-100 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-xl font-bold">Create Account</h2>

          {[
            { name: "name",     type: "text",     label: "Full Name",    placeholder: "Your full name" },
            { name: "email",    type: "email",    label: "College Email", placeholder: "your@email.com" },
            { name: "password", type: "password", label: "Password",     placeholder: "Min 6 characters" },
            { name: "rollNo",   type: "text",     label: "Roll Number",  placeholder: "e.g. 21CS045" },
          ].map(({ name, type, label, placeholder }) => (
            <div key={name}>
              <label className="text-xs text-base-content/60 mb-1 block">{label}</label>
              <input
                type={type} name={name} value={form[name]}
                placeholder={placeholder}
                className="input input-bordered w-full"
                onChange={handleChange}
                autoComplete={name === "email" ? "email" : name === "password" ? "new-password" : "off"}
              />
            </div>
          ))}

          <div>
            <label className="text-xs text-base-content/60 mb-1 block">Batch (Year of Passout)</label>
            <select name="batch" className="select select-bordered w-full" onChange={handleChange} value={form.batch}>
              <option value="" disabled>Select year...</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          <button onClick={handleSubmit} className="btn btn-primary w-full" disabled={loading}>
            {loading ? <span className="loading loading-spinner loading-sm"></span> : "Register"}
          </button>

          <p className="text-sm text-center">
            Already have an account?{" "}
            <Link to="/" className="text-primary font-medium">Login →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
