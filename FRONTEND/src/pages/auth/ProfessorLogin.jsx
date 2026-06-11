import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import toast from "react-hot-toast";

const SECRET = import.meta.env.VITE_PROF_SECRET || "prof@stutrack";

function ProfessorLogin() {
  const [form, setForm] = useState({ email: "", password: "", code: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (form.code !== SECRET) return toast.error("Invalid access code ❌");
    try {
      setLoading(true);
      const data = await loginUser({ email: form.email, password: form.password });
      if (data.role !== "professor") return toast.error("Not a professor account ❌");
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      toast.success("Welcome, Professor 👋");
      navigate("/professor/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed ❌");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-2">🔐</div>
          <h1 className="text-2xl font-bold">Professor Access</h1>
          <p className="text-sm text-base-content/50 mt-1">Restricted — faculty only</p>
        </div>

        <div className="bg-base-100 rounded-2xl p-6 shadow-sm space-y-4">
          {[
            { name: "email",    type: "email",    label: "Email",       placeholder: "your@email.com" },
            { name: "password", type: "password", label: "Password",    placeholder: "Enter password" },
            { name: "code",     type: "password", label: "Access Code", placeholder: "Secret access code" },
          ].map(({ name, type, label, placeholder }) => (
            <div key={name}>
              <label className="text-xs text-base-content/60 mb-1 block">{label}</label>
              <input
                type={type} name={name}
                placeholder={placeholder}
                className="input input-bordered w-full"
                onChange={handleChange}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                autoComplete={name === "email" ? "email" : "off"}
              />
            </div>
          ))}

          <button onClick={handleSubmit} className="btn btn-primary w-full" disabled={loading}>
            {loading ? <span className="loading loading-spinner loading-sm"></span> : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfessorLogin;
