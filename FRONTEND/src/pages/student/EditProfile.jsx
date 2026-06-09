import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getProfile, createProfile, updateProfile } from "../../services/studentService";

const isValidUrl = (val, keyword) => {
  if (!val || val.trim() === "") return true;
  return val.includes(keyword);
};

function EditProfile() {
  const [form, setForm] = useState({ linkedin: "", github: "", leetcode: "", bio: "", rollNo: "", resumeLink: "" });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [profileExists, setProfileExists] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        if (data) {
          setProfileExists(true);
          setForm({ linkedin: data.linkedin || "", github: data.github || "", leetcode: data.leetcode || "", bio: data.bio || "", rollNo: data.rollNo || "", resumeLink: data.resume || "" });
          if (data.profilePhoto) setPhotoPreview(data.profilePhoto);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) { setPhoto(file); setPhotoPreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async () => {
    if (!isValidUrl(form.linkedin, "linkedin.com")) return toast.error("Enter a valid LinkedIn URL ❌");
    if (!isValidUrl(form.github, "github.com")) return toast.error("Enter a valid GitHub URL ❌");
    if (!isValidUrl(form.leetcode, "leetcode.com")) return toast.error("Enter a valid LeetCode URL ❌");
    if (form.resumeLink && !form.resumeLink.includes("drive.google.com")) return toast.error("Enter a valid Google Drive link ❌");

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("linkedin", form.linkedin);
      formData.append("github", form.github);
      formData.append("leetcode", form.leetcode);
      formData.append("bio", form.bio);
      formData.append("rollNo", form.rollNo);
      formData.append("resumeLink", form.resumeLink);
      if (photo) formData.append("profilePhoto", photo);

      if (profileExists) {
        await updateProfile(formData);
        toast.success("Profile updated ✅");
      } else {
        await createProfile(formData);
        toast.success("Profile created ✅");
      }
      navigate("/student/profile");
    } catch (error) {
      const msg = error.response?.data?.message || "";
      if (msg.toLowerCase().includes("roll") || msg.toLowerCase().includes("dup")) {
        toast.error("A profile with this roll number already exists ❌");
      } else {
        toast.error(msg || "Failed to save profile ❌");
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="flex justify-center mt-10"><span className="loading loading-spinner loading-lg"></span></div>;
  }

  return (
    <div className="max-w-xl mx-auto px-2 pb-8">
      <h2 className="text-2xl font-bold mb-6">{profileExists ? "Edit Profile" : "Create Profile"}</h2>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        {photoPreview && <img src={photoPreview} className="w-16 h-16 rounded-full object-cover border" alt="preview" />}
        <div className="flex-1">
          <label className="text-sm font-medium mb-1 block">Profile Photo</label>
          <input type="file" accept="image/*" className="file-input file-input-bordered w-full text-sm" onChange={handlePhotoChange} />
        </div>
      </div>

      <div className="mb-3">
        <label className="text-sm font-medium mb-1 block">Roll Number</label>
        <input name="rollNo" value={form.rollNo} placeholder="e.g. 21CS045" className="input input-bordered w-full" onChange={handleChange} />
      </div>

      <div className="mb-3">
        <label className="text-sm font-medium mb-1 block">Bio <span className="text-gray-400 font-normal">(optional)</span></label>
        <textarea name="bio" value={form.bio} placeholder="Write a short bio..." className="textarea textarea-bordered w-full" rows={3} onChange={handleChange} />
      </div>

      <div className="mb-3">
        <label className="text-sm font-medium mb-1 block">LinkedIn <span className="text-gray-400 font-normal">(optional)</span></label>
        <input name="linkedin" value={form.linkedin} placeholder="https://linkedin.com/in/yourname" className="input input-bordered w-full" onChange={handleChange} />
      </div>

      <div className="mb-3">
        <label className="text-sm font-medium mb-1 block">GitHub <span className="text-gray-400 font-normal">(optional)</span></label>
        <input name="github" value={form.github} placeholder="https://github.com/yourname" className="input input-bordered w-full" onChange={handleChange} />
      </div>

      <div className="mb-3">
        <label className="text-sm font-medium mb-1 block">LeetCode <span className="text-gray-400 font-normal">(optional)</span></label>
        <input name="leetcode" value={form.leetcode} placeholder="https://leetcode.com/u/yourname" className="input input-bordered w-full" onChange={handleChange} />
      </div>

      <div className="mb-6">
        <label className="text-sm font-medium mb-1 block">Resume — Google Drive Link <span className="text-gray-400 font-normal">(optional)</span></label>
        <input name="resumeLink" value={form.resumeLink} placeholder="https://drive.google.com/file/d/..." className="input input-bordered w-full" onChange={handleChange} />
        <p className="text-xs text-gray-400 mt-1">Google Drive: right-click PDF → Share → Anyone with link → Copy link</p>
      </div>

      <button onClick={handleSubmit} className="btn btn-success w-full" disabled={loading}>
        {loading ? <span className="loading loading-spinner"></span> : "Save Profile"}
      </button>
    </div>
  );
}

export default EditProfile;
