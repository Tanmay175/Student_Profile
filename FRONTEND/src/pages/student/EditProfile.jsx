import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getProfile, createProfile, updateProfile } from "../../services/studentService";

// Extract username from stored URL (for pre-filling the form)
const extractUsername = {
  github: (val) => {
    if (!val) return "";
    if (val.includes("github.com/")) return val.replace(/\/$/, "").split("github.com/")[1]?.split("/")[0] || "";
    return val; // already a username
  },
  linkedin: (val) => {
    if (!val) return "";
    if (val.includes("linkedin.com/in/")) return val.replace(/\/$/, "").split("linkedin.com/in/")[1]?.split("/")[0] || "";
    return val;
  },
  leetcode: (val) => {
    if (!val) return "";
    if (val.includes("leetcode.com/u/")) return val.replace(/\/$/, "").split("leetcode.com/u/")[1]?.split("/")[0] || "";
    if (val.includes("leetcode.com/")) return val.replace(/\/$/, "").split("leetcode.com/")[1]?.split("/")[0] || "";
    return val;
  },
};

// Convert username → full URL before saving
const toFullUrl = {
  github: (u) => u ? `https://github.com/${u.trim().replace(/^@/, "")}` : "",
  linkedin: (u) => u ? `https://linkedin.com/in/${u.trim().replace(/^@/, "")}` : "",
  leetcode: (u) => u ? `https://leetcode.com/u/${u.trim().replace(/^@/, "")}` : "",
};

function EditProfile() {
  const [form, setForm] = useState({
    githubUsername: "",
    linkedinUsername: "",
    leetcodeUsername: "",
    bio: "",
    rollNo: "",
    resumeLink: "",
  });

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
          setForm({
            githubUsername: extractUsername.github(data.github),
            linkedinUsername: extractUsername.linkedin(data.linkedin),
            leetcodeUsername: extractUsername.leetcode(data.leetcode),
            bio: data.bio || "",
            rollNo: data.rollNo || "",
            resumeLink: data.resume || "",
          });
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
    if (form.resumeLink && !form.resumeLink.includes("drive.google.com"))
      return toast.error("Enter a valid Google Drive link for resume ❌");

    try {
      setLoading(true);

      const formData = new FormData();
      // Convert usernames to full URLs before saving
      formData.append("github", toFullUrl.github(form.githubUsername));
      formData.append("linkedin", toFullUrl.linkedin(form.linkedinUsername));
      formData.append("leetcode", toFullUrl.leetcode(form.leetcodeUsername));
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

      {/* Photo */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        {photoPreview && <img src={photoPreview} className="w-16 h-16 rounded-full object-cover border shrink-0" alt="preview" />}
        <div className="flex-1">
          <label className="text-sm font-medium mb-1 block">Profile Photo</label>
          <input type="file" accept="image/*" className="file-input file-input-bordered w-full text-sm" onChange={handlePhotoChange} />
        </div>
      </div>

      {/* Roll No */}
      <div className="mb-4">
        <label className="text-sm font-medium mb-1 block">Roll Number</label>
        <input name="rollNo" value={form.rollNo} placeholder="e.g. 21CS045" className="input input-bordered w-full" onChange={handleChange} />
      </div>

      {/* Bio */}
      <div className="mb-4">
        <label className="text-sm font-medium mb-1 block">Bio <span className="text-gray-400 font-normal">(optional)</span></label>
        <textarea name="bio" value={form.bio} placeholder="Write a short bio about yourself..." className="textarea textarea-bordered w-full" rows={3} onChange={handleChange} />
      </div>

      {/* GitHub */}
      <div className="mb-4">
        <label className="text-sm font-medium mb-1 block">
          GitHub Username <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <div className="flex items-center input input-bordered w-full pr-0 gap-0 overflow-hidden">
          <span className="text-gray-400 text-sm pl-3 pr-1 whitespace-nowrap">github.com/</span>
          <input
            name="githubUsername"
            value={form.githubUsername}
            placeholder="yourname"
            className="flex-1 bg-transparent outline-none text-sm py-2 pr-3"
            onChange={handleChange}
          />
        </div>
        {form.githubUsername && (
          <a href={toFullUrl.github(form.githubUsername)} target="_blank" rel="noreferrer"
            className="text-xs text-blue-500 mt-1 inline-block hover:underline">
            🔗 {toFullUrl.github(form.githubUsername)}
          </a>
        )}
      </div>

      {/* LinkedIn */}
      <div className="mb-4">
        <label className="text-sm font-medium mb-1 block">
          LinkedIn Username <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <div className="flex items-center input input-bordered w-full pr-0 gap-0 overflow-hidden">
          <span className="text-gray-400 text-sm pl-3 pr-1 whitespace-nowrap">linkedin.com/in/</span>
          <input
            name="linkedinUsername"
            value={form.linkedinUsername}
            placeholder="yourname"
            className="flex-1 bg-transparent outline-none text-sm py-2 pr-3"
            onChange={handleChange}
          />
        </div>
        {form.linkedinUsername && (
          <a href={toFullUrl.linkedin(form.linkedinUsername)} target="_blank" rel="noreferrer"
            className="text-xs text-blue-500 mt-1 inline-block hover:underline">
            🔗 {toFullUrl.linkedin(form.linkedinUsername)}
          </a>
        )}
      </div>

      {/* LeetCode */}
      <div className="mb-4">
        <label className="text-sm font-medium mb-1 block">
          LeetCode Username <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <div className="flex items-center input input-bordered w-full pr-0 gap-0 overflow-hidden">
          <span className="text-gray-400 text-sm pl-3 pr-1 whitespace-nowrap">leetcode.com/u/</span>
          <input
            name="leetcodeUsername"
            value={form.leetcodeUsername}
            placeholder="yourname"
            className="flex-1 bg-transparent outline-none text-sm py-2 pr-3"
            onChange={handleChange}
          />
        </div>
        {form.leetcodeUsername && (
          <a href={toFullUrl.leetcode(form.leetcodeUsername)} target="_blank" rel="noreferrer"
            className="text-xs text-blue-500 mt-1 inline-block hover:underline">
            🔗 {toFullUrl.leetcode(form.leetcodeUsername)}
          </a>
        )}
      </div>

      {/* Resume */}
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
