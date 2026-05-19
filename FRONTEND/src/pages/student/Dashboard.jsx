import { useEffect, useState } from "react";
import { getProfile } from "../../services/studentService";
import { Link } from "react-router-dom";
import { DEFAULT_AVATAR } from "../../utils/profileUtils";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function StudentDashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rank, setRank] = useState(null);
  const [batchSize, setBatchSize] = useState(null);

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

  // Fetch rank once profile is loaded
  useEffect(() => {
    if (!profile?.batch) return;
    const fetchRank = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/student/rank`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setRank(data.rank);
          setBatchSize(data.total);
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchRank();
  }, [profile]);

  if (loading) {
    return (
      <div className="flex justify-center mt-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mt-4">
        <h1 className="text-3xl font-bold mb-4">Welcome 👋</h1>
        <p className="text-red-500 mb-3">Profile not created yet ❗</p>
        <Link to="/student/edit">
          <button className="btn btn-primary">Create Profile</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Welcome, {profile.name} 👋</h1>

      {/* Profile Card */}
      <div className="bg-base-100 shadow rounded-xl p-6 flex gap-5 items-center">
        <img
          src={profile.profilePhoto || DEFAULT_AVATAR}
          className="w-20 h-20 rounded-full border object-cover"
          onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
        />
        <div className="flex-1">
          <h2 className="text-xl font-bold">{profile.name}</h2>
          <p className="text-sm text-gray-500">Batch: {profile.batch}</p>
          {profile.rollNo && (
            <p className="text-sm text-gray-500">
              Roll No: <span className="font-semibold">{profile.rollNo}</span>
            </p>
          )}
          {profile.bio && (
            <p className="mt-2 text-sm italic text-gray-400">"{profile.bio}"</p>
          )}
        </div>

        {/* Rank Badge */}
        {rank !== null && (
          <div className="flex flex-col items-center bg-primary text-primary-content rounded-xl px-4 py-3 min-w-[80px]">
            <span className="text-xs font-semibold opacity-80">RANK</span>
            <span className="text-3xl font-bold leading-none">#{rank}</span>
            {batchSize && (
              <span className="text-xs opacity-70">of {batchSize}</span>
            )}
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        {profile.linkedin && (
          <a href={profile.linkedin} target="_blank" rel="noreferrer"
            className="card bg-base-100 shadow p-4 text-center hover:bg-base-200">
            🔗 LinkedIn
          </a>
        )}
        {profile.github && (
          <a href={profile.github} target="_blank" rel="noreferrer"
            className="card bg-base-100 shadow p-4 text-center hover:bg-base-200">
            🐙 GitHub
          </a>
        )}
        {profile.leetcode && (
          <a href={profile.leetcode} target="_blank" rel="noreferrer"
            className="card bg-base-100 shadow p-4 text-center hover:bg-base-200">
            💻 LeetCode
          </a>
        )}
      </div>

      {/* Resume */}
      {profile.resume && (
        <div className="mt-4">
          <a href={profile.resume} target="_blank" rel="noreferrer"
            className="btn btn-outline w-full">
            📄 View Resume
          </a>
        </div>
      )}

      {/* Edit */}
      <div className="mt-4">
        <Link to="/student/edit">
          <button className="btn btn-primary w-full">✏️ Edit Profile</button>
        </Link>
      </div>
    </div>
  );
}

export default StudentDashboard;