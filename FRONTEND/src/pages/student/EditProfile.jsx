import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getProfile, createProfile, updateProfile } from "../../services/studentService";

const isValidUrl = (val, keyword) => !val || val.trim() === "" || val.includes(keyword);

const extractUsername = {
  github:   v => v?.includes("github.com/")       ? v.replace(/\/$/, "").split("github.com/")[1]?.split("/")[0]       || "" : (v || ""),
  linkedin: v => v?.includes("linkedin.com/in/")  ? v.replace(/\/$/, "").split("linkedin.com/in/")[1]?.split("/")[0]  || "" : (v || ""),
  leetcode: v => v?.includes("leetcode.com/u/")   ? v.replace(/\/$/, "").split("leetcode.com/u/")[1]?.split("/")[0]   || ""
              : v?.includes("leetcode.com/")       ? v.replace(/\/$/, "").split("leetcode.com/")[1]?.split("/")[0]    || "" : (v || ""),
};

const toUrl = {
  github:   u => u ? `https://github.com/${u.trim().replace(/^@/, "")}` : "",
  linkedin: u => u ? `https://linkedin.com/in/${u.trim().replace(/^@/, "")}` : "",
  leetcode: u => u ? `https://leetcode.com/u/${u.trim().replace(/^@/, "")}` : "",
};

function PrefixInput({ prefix, name, value, placeholder, onChange }) {
  return (
    <div className="flex items-center border border-base-300 rounded-xl overflow-hidden bg-base-100 focus-within:border-primary transition-colors">
      <span className="text-base-content/40 text-sm px-3 py-3 bg-base-200 border-r border-base-300 whitespace-nowrap shrink-0">
        {prefix}
      </span>
      <input
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="flex-1 bg-transparent px-3 py-3 text-sm outline-none min-w-0"
        autoCorrect="off"
        autoCapitalize="none"
      />
    </div>
  );
}

function EditProfile() {
  const [form, setForm] = useState({ github: "", linkedin: "", leetcode: "", bio: "", rollNo: "", resumeLink: "" });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [profileExists, setProfileExists] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getProfile()
      .then(data => {
        if (data) {
          setProfileExists(true);
          setForm({
            github:     extractUsername.github(data.github),
            linkedin:   extractUsername.linkedin(data.linkedin),
            leetcode:   extractUsername.leetcode(data.leetcode),
            bio:        data.bio || "",
            rollNo:     data.rollNo || "",
            resumeLink: data.resume || "",
          });
          if (data.profilePhoto) setPhotoPreview(data.profilePhoto);
        }
      })
      .catch(console.log)
      .finally(() => setFetching(false));
  }, []);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handlePhoto = e => {
    const file = e.target.files[0];
    if (file) { setPhoto(file); setPhotoPreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async () => {
    if (form.resumeLink && !form.resumeLink.includes("drive.google.com"))
      return toast.error("Enter a valid Google Drive link ❌");

    try {
      setLoading(true);
      const fd = new FormData();
      fd.append("github",     toUrl.github(form.github));
      fd.append("linkedin",   toUrl.linkedin(form.linkedin));
      fd.append("leetcode",   toUrl.leetcode(form.leetcode));
      fd.append("bio",        form.bio);
      fd.append("rollNo",     form.rollNo);
      fd.append("resumeLink", form.resumeLink);
      if (photo) fd.append("profilePhoto", photo);

      if (profileExists) { await updateProfile(fd); toast.success("Profile updated ✅"); }
      else               { await createProfile(fd); toast.success("Profile created ✅"); }

      navigate("/student/profile");
    } catch (err) {
      const msg = err.response?.data?.message || "";
      toast.error(
        msg.toLowerCase().includes("roll") || msg.toLowerCase().includes("dup")
          ? "A profile with this roll number already exists ❌"
          : msg || "Failed to save profile ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="flex justify-center mt-16"><span className="loading loading-spinner loading-lg"></span></div>;
  }

  return (
    <div className="max-w-lg mx-auto pb-10">
      <h2 className="text-2xl font-bold mb-5">{profileExists ? "Edit Profile" : "Create Profile"}</h2>

      {/* Photo */}
      <div className="bg-base-100 rounded-2xl p-4 mb-4 shadow-sm">
        <p className="text-sm font-semibold mb-3">Profile Photo</p>
        <div className="flex items-center gap-4">
          <img
            src={photoPreview || "https://api.dicebear.com/7.x/initials/svg?seed=U"}
            className="w-16 h-16 rounded-full object-cover border-2 border-base-300 shrink-0"
            alt="preview"
          />
          <label className="flex-1">
            <div className="btn btn-outline btn-sm w-full">📷 Choose Photo</div>
            <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
          </label>
        </div>
      </div>

      {/* Basic info */}
      <div className="bg-base-100 rounded-2xl p-4 mb-4 shadow-sm space-y-4">
        <p className="text-sm font-semibold">Basic Info</p>

        <div>
          <label className="text-xs text-base-content/60 mb-1 block">Roll Number</label>
          <input
            name="rollNo" value={form.rollNo}
            placeholder="e.g. 21CS045"
            className="input input-bordered w-full"
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="text-xs text-base-content/60 mb-1 block">Bio <span className="opacity-50">(optional)</span></label>
          <textarea
            name="bio" value={form.bio}
            placeholder="Tell something about yourself..."
            className="textarea textarea-bordered w-full resize-none"
            rows={3}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Social profiles */}
      <div className="bg-base-100 rounded-2xl p-4 mb-4 shadow-sm space-y-4">
        <p className="text-sm font-semibold">Social Profiles <span className="text-base-content/40 font-normal text-xs">(optional — just your username)</span></p>

        <div>
          <label className="text-xs text-base-content/60 mb-1 block">GitHub</label>
          <PrefixInput prefix="github.com/" name="github" value={form.github} placeholder="yourname" onChange={handleChange} />
          {form.github && (
            <a href={toUrl.github(form.github)} target="_blank" rel="noreferrer"
              className="text-xs text-primary mt-1 inline-block">🔗 {toUrl.github(form.github)}</a>
          )}
        </div>

        <div>
          <label className="text-xs text-base-content/60 mb-1 block">LinkedIn</label>
          <PrefixInput prefix="linkedin.com/in/" name="linkedin" value={form.linkedin} placeholder="yourname" onChange={handleChange} />
          {form.linkedin && (
            <a href={toUrl.linkedin(form.linkedin)} target="_blank" rel="noreferrer"
              className="text-xs text-primary mt-1 inline-block">🔗 {toUrl.linkedin(form.linkedin)}</a>
          )}
        </div>

        <div>
          <label className="text-xs text-base-content/60 mb-1 block">LeetCode</label>
          <PrefixInput prefix="leetcode.com/u/" name="leetcode" value={form.leetcode} placeholder="yourname" onChange={handleChange} />
          {form.leetcode && (
            <a href={toUrl.leetcode(form.leetcode)} target="_blank" rel="noreferrer"
              className="text-xs text-primary mt-1 inline-block">🔗 {toUrl.leetcode(form.leetcode)}</a>
          )}
        </div>
      </div>

      {/* Resume */}
      <div className="bg-base-100 rounded-2xl p-4 mb-6 shadow-sm">
        <label className="text-sm font-semibold mb-1 block">Resume — Google Drive Link <span className="text-base-content/40 font-normal text-xs">(optional)</span></label>
        <input
          name="resumeLink" value={form.resumeLink}
          placeholder="https://drive.google.com/file/d/..."
          className="input input-bordered w-full text-sm"
          onChange={handleChange}
        />
        <p className="text-xs text-base-content/40 mt-1">Drive → right-click PDF → Share → Anyone with link → Copy link</p>
      </div>

      <button onClick={handleSubmit} className="btn btn-success w-full btn-lg" disabled={loading}>
        {loading ? <span className="loading loading-spinner"></span> : "💾 Save Profile"}
      </button>
    </div>
  );
}

export default EditProfile;
