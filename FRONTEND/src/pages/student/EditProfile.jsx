import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getProfile, createProfile, updateProfile } from "../../services/studentService";

function EditProfile() {
  const [form, setForm] = useState({
    linkedin: "",
    github: "",
    leetcode: "",
    bio: "",
    rollNo: "",
    resumeLink: "",   // ✅ Drive link instead of file
  });

  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profileExists, setProfileExists] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        if (data) {
          setProfileExists(true);
          setForm({
            linkedin: data.linkedin || "",
            github: data.github || "",
            leetcode: data.leetcode || "",
            bio: data.bio || "",
            rollNo: data.rollNo || "",
            resumeLink: data.resume || "",   // pre-fill existing drive link
          });
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (!form.linkedin.includes("linkedin.com"))
        return toast.error("Enter valid LinkedIn link ❌");
      if (!form.github.includes("github.com"))
        return toast.error("Enter valid GitHub link ❌");
      if (!form.leetcode.includes("leetcode.com"))
        return toast.error("Enter valid LeetCode link ❌");

      // ✅ Validate Drive link if provided
      if (form.resumeLink && !form.resumeLink.includes("drive.google.com"))
        return toast.error("Enter a valid Google Drive link for resume ❌");

      const formData = new FormData();
      formData.append("linkedin", form.linkedin);
      formData.append("github", form.github);
      formData.append("leetcode", form.leetcode);
      formData.append("bio", form.bio);
      formData.append("rollNo", form.rollNo);
      formData.append("resumeLink", form.resumeLink);  // ✅ send as text

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
      toast.error(error.response?.data?.message || "Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl">
      <h2 className="text-2xl font-bold mb-4">
        {profileExists ? "Edit Profile" : "Create Profile"}
      </h2>

      {/* Profile Photo */}
      <div className="flex items-center gap-3 mb-3">
        <label className="w-32 font-medium">Photo</label>
        <input
          type="file"
          accept="image/*"
          className="file-input file-input-bordered w-full"
          onChange={(e) => setPhoto(e.target.files[0])}
        />
      </div>

      {/* Roll Number */}
      <div className="flex items-center gap-3 mb-3">
        <label className="w-32 font-medium">Roll No</label>
        <input
          name="rollNo"
          value={form.rollNo}
          placeholder="e.g. 21CS045"
          className="input input-bordered w-full"
          onChange={handleChange}
        />
      </div>

      {/* Bio */}
      <div className="flex items-center gap-3 mb-3">
        <label className="w-32 font-medium">Bio</label>
        <textarea
          name="bio"
          value={form.bio}
          placeholder="Write a short bio about yourself..."
          className="textarea textarea-bordered w-full"
          rows={3}
          onChange={handleChange}
        />
      </div>

      {/* LinkedIn */}
      <div className="flex items-center gap-3 mb-3">
        <label className="w-32 font-medium">LinkedIn</label>
        <input
          name="linkedin"
          value={form.linkedin}
          placeholder="https://linkedin.com/in/..."
          className="input input-bordered w-full"
          onChange={handleChange}
        />
      </div>

      {/* GitHub */}
      <div className="flex items-center gap-3 mb-3">
        <label className="w-32 font-medium">GitHub</label>
        <input
          name="github"
          value={form.github}
          placeholder="https://github.com/..."
          className="input input-bordered w-full"
          onChange={handleChange}
        />
      </div>

      {/* LeetCode */}
      <div className="flex items-center gap-3 mb-3">
        <label className="w-32 font-medium">LeetCode</label>
        <input
          name="leetcode"
          value={form.leetcode}
          placeholder="https://leetcode.com/u/..."
          className="input input-bordered w-full"
          onChange={handleChange}
        />
      </div>

      {/* Resume — Google Drive Link */}
      <div className="flex flex-col gap-1 mb-4">
        <div className="flex items-center gap-3">
          <label className="w-32 font-medium">Resume</label>
          <input
            name="resumeLink"
            value={form.resumeLink}
            placeholder="https://drive.google.com/file/d/..."
            className="input input-bordered w-full"
            onChange={handleChange}
          />
        </div>
        <p className="text-xs text-gray-400 ml-32 pl-3">
          In Google Drive: right-click PDF → Share → Anyone with the link → Copy link
        </p>
      </div>

      <button
        onClick={handleSubmit}
        className="btn btn-success w-full"
        disabled={loading}
      >
        {loading ? <span className="loading loading-spinner"></span> : "Save"}
      </button>
    </div>
  );
}

export default EditProfile;