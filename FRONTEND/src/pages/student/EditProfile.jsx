import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  getProfile,
  createProfile,
  updateProfile,
} from "../../services/studentService";

function EditProfile() {
  const [form, setForm] = useState({
    linkedin: "",
    github: "",
    leetcode: "",
    name:"",
    batch:""
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profileExists, setProfileExists] = useState(false); // ⭐
  const [photo, setPhoto] = useState(null);

  const navigate = useNavigate();

  // ✅ FETCH PROFILE ON LOAD
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
          });
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchProfile();
  }, []);

  const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const formData = new FormData();

      if (!form.linkedin.includes("linkedin.com")) {
  return toast.error("Enter valid LinkedIn link ❌");
}

      if (!form.github.includes("github.com")) {
  return toast.error("Enter valid GitHub link ❌");
}

      if (!form.leetcode.includes("leetcode.com")) {
  return toast.error("Enter valid LeetCode link ❌");
}

      formData.append("linkedin", form.linkedin);
      formData.append("github", form.github);
      formData.append("leetcode", form.leetcode);
      if (photo) {
        formData.append("profilePhoto", photo);
      }

      if (file) {
        formData.append("resume", file);
      }

      // 🔥 CORRECT LOGIC
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

     {/* 🔥 Profile Photo */}
<div className="flex items-center gap-3 mb-3">
  <label className="w-32 font-medium">Profile_Photo:-</label>
  <input
    type="file"
    accept="image/*"
    className="file-input file-input-bordered w-full"
    onChange={(e) => setPhoto(e.target.files[0])}
  />
</div>

{/* 🔥 LinkedIn */}
<div className="flex items-center gap-3 mb-3">
  <label className="w-32 font-medium">LinkedIn :-</label>
  <input
    name="linkedin"
    value={form.linkedin}
    className="input input-bordered w-full"
    onChange={handleChange}
  />
</div>

{/* 🔥 GitHub */}
<div className="flex items-center gap-3 mb-3">
  <label className="w-32 font-medium">GitHub :-</label>
  <input
    name="github"
    value={form.github}
    className="input input-bordered w-full"
    onChange={handleChange}
  />
</div>

{/* 🔥 LeetCode */}
<div className="flex items-center gap-3 mb-3">
  <label className="w-32 font-medium">LeetCode :-</label>
  <input
    name="leetcode"
    value={form.leetcode}
    className="input input-bordered w-full"
    onChange={handleChange}
  />
</div>

{/* 🔥 Resume */}
<div className="flex items-center gap-3 mb-4">
  <label className="w-32 font-medium">Resume :-</label>
  <input
    type="file"
    accept=".pdf"
    className="file-input file-input-bordered w-full"
    onChange={handleFileChange}
  />
</div>

      <button
        onClick={handleSubmit}
        className="btn btn-success w-full"
        disabled={loading}
      >
        {loading ? (
          <span className="loading loading-spinner"></span>
        ) : (
          "Save"
        )}
      </button>
    </div>
  );
}

export default EditProfile;