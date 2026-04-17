import { useEffect, useState } from "react";
import { getProfile } from "../../services/studentService";
// import { Link } from "react-router-dom";
  import { Link } from "react-router-dom";

function StudentDashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center mt-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">Student Dashboard</h1>

    

{profile ? (
  <div className="mt-4 card p-4 bg-base-100 shadow">
    <p><b>LinkedIn:</b> {profile.linkedin}</p>
    <p><b>GitHub:</b> {profile.github}</p>
    <p><b>LeetCode:</b> {profile.leetcode}</p>

    {profile.resume && (
      <a
        href={`http://localhost:5000/${profile.resume}`}
        target="_blank"
        className="text-blue-500 mt-2 block"
      >
        View Resume
      </a>
    )}
  </div>
) : (
  <div className="mt-4">
    <p className="text-red-500 mb-3">
      Profile not created yet ❗
    </p>

    <Link to="/student/edit">
      <button className="btn btn-primary">
        Create Profile
      </button>
    </Link>
  </div>
)}
    </div>
  );
}

export default StudentDashboard;