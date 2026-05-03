import { useState } from "react";
import toast from "react-hot-toast";
import { changePassword } from "../../services/authService";

function ChangePassword() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword)
      return toast.error("All fields are required ❌");

    if (form.newPassword.length < 6)
      return toast.error("New password must be at least 6 characters ❌");

    if (form.newPassword !== form.confirmPassword)
      return toast.error("New passwords do not match ❌");

    try {
      setLoading(true);
      const res = await changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      toast.success(res.message || "Password changed ✅");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md">
      <h2 className="text-2xl font-bold mb-6">🔒 Change Password</h2>

      <div className="bg-base-100 shadow rounded-xl p-6 flex flex-col gap-4">
        <div>
          <label className="label font-medium">Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            placeholder="Enter current password"
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="label font-medium">New Password</label>
          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            placeholder="Enter new password (min 6 chars)"
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="label font-medium">Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter new password"
            className="input input-bordered w-full"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="btn btn-primary w-full mt-2"
          disabled={loading}
        >
          {loading ? <span className="loading loading-spinner"></span> : "Update Password"}
        </button>
      </div>
    </div>
  );
}

export default ChangePassword;