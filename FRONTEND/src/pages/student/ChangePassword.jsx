import { useState } from "react";
import toast from "react-hot-toast";
import { changePassword } from "../../services/authService";

function ChangePassword() {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword)
      return toast.error("All fields are required ❌");
    if (form.newPassword.length < 6)
      return toast.error("New password must be at least 6 characters ❌");
    if (form.newPassword !== form.confirmPassword)
      return toast.error("Passwords do not match ❌");
    try {
      setLoading(true);
      const res = await changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      toast.success(res.message || "Password changed ✅");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto pb-8">
      <h2 className="text-xl font-bold mb-5">🔒 Change Password</h2>

      <div className="bg-base-100 rounded-2xl p-5 shadow-sm space-y-4">
        {[
          { name: "currentPassword", label: "Current Password", placeholder: "Enter current password" },
          { name: "newPassword",     label: "New Password",     placeholder: "Min 6 characters" },
          { name: "confirmPassword", label: "Confirm Password", placeholder: "Re-enter new password" },
        ].map(({ name, label, placeholder }) => (
          <div key={name}>
            <label className="text-xs text-base-content/60 mb-1 block">{label}</label>
            <input
              type="password"
              name={name}
              value={form[name]}
              onChange={handleChange}
              placeholder={placeholder}
              className="input input-bordered w-full"
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
            />
          </div>
        ))}

        <button onClick={handleSubmit} className="btn btn-primary w-full mt-2" disabled={loading}>
          {loading ? <span className="loading loading-spinner"></span> : "Update Password"}
        </button>
      </div>
    </div>
  );
}

export default ChangePassword;
