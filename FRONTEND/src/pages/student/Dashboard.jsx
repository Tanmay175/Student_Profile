import { useEffect, useState } from "react";
import { getProfile } from "../../services/studentService";
import { Link } from "react-router-dom";
import { DEFAULT_AVATAR } from "../../utils/profileUtils";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function DashboardSkeleton() {
  return (
    <div className="max-w-2xl mx-auto w-full animate-pulse px-2">
      <div className="h-7 bg-base-300 rounded w-48 mb-5"></div>
      <div className="bg-base-100 shadow rounded-xl p-4 flex gap-4 items-center">
        <div className="w-14 h-14 rounded-full bg-base-300 shrink-0"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-base-300 rounded w-36"></div>
          <div className="h-3 bg-base-300 rounded w-24"></div>
          <div className="h-3 bg-base-300 rounded w-32"></div>
        </div>
        <div className="w-14 h-14 bg-base-300 rounded-xl shrink-0"></div>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-4">
        <div className="h-10 bg-base-300 rounded-xl"></div>
        <div className="h-10 bg-base-300 rounded-xl"></div>
      </div>
    </div>
  );
}

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

  if (loading) return <DashboardSkeleton />;

  if (!profile) {
    return (
      <div className="max-w-md mx-auto text-center px-4 mt-6">
        <div className="text-5xl mb-4">👋</div>
        <h1 className="text-2xl font-bold mb-2">Welcome to StuTrack!</h1>
        <p className="text-gray-500 mb-6">You haven't created your profile yet.</p>
        <Link to="/student/edit">
          <button className="btn btn-primary w-full">Create My Profile</button>
        </Link>
      </div>
    );
  }

  const hasLinks = profile.linkedin || profile.github || profile.leetcode;

  return (
    <div className="max-w-2xl mx-auto w-full px-2 pb-8">
      <h1 className="text-lg md:text-2xl font-bold mb-4">Welcome back, {profile.name} 👋</h1>

      <div className="bg-base-100 shadow rounded-xl p-3 md:p-5 flex gap-3 md:gap-5 items-center">
        <img
          src={profile.profilePhoto || DEFAULT_AVATAR}
          className="w-14 h-14 md:w-20 md:h-20 rounded-full border object-cover shrink-0"
          onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
          alt="profile"
        />
        <div className="flex-1 min-w-0">
          <h2 className="text-base md:text-xl font-bold truncate">{profile.name}</h2>
          <p className="text-xs md:text-sm text-gray-500">Batch: {profile.batch}</p>
          {profile.rollNo && (
            <p className="text-xs md:text-sm text-gray-500">Roll: <span className="font-semibold">{profile.rollNo}</span></p>
          )}
          {profile.bio && (
            <p className="mt-1 text-xs italic text-gray-400 line-clamp-2">"{profile.bio}"</p>
          )}
        </div>

        {rank !== null && (
          <div className="flex flex-col items-center bg-primary text-primary-content rounded-xl px-2 py-2 md:px-4 md:py-3 min-w-[52px] md:min-w-[76px] shrink-0 text-center">
            <span className="text-xs font-semibold opacity-80">RANK</span>
            <span className="text-lg md:text-3xl font-bold leading-none">#{rank}</span>
            {batchSize && <span className="text-xs opacity-70">of {batchSize}</span>}
          </div>
        )}
      </div>

      {hasLinks && (
        <div className="grid grid-cols-3 gap-2 mt-3">
          {profile.linkedin && (
            <a href={profile.linkedin} target="_blank" rel="noreferrer"
              className="card bg-base-100 shadow p-2 text-center hover:bg-base-200 text-xs md:text-sm">
              🔗 <span className="hidden sm:inline">LinkedIn</span>
            </a>
          )}
          {profile.github && (
            <a href={profile.github} target="_blank" rel="noreferrer"
              className="card bg-base-100 shadow p-2 text-center hover:bg-base-200 text-xs md:text-sm">
              🐙 <span className="hidden sm:inline">GitHub</span>
            </a>
          )}
          {profile.leetcode && (
            <a href={profile.leetcode} target="_blank" rel="noreferrer"
              className="card bg-base-100 shadow p-2 text-center hover:bg-base-200 text-xs md:text-sm">
              💻 <span className="hidden sm:inline">LeetCode</span>
            </a>
          )}
        </div>
      )}

      {profile.resume && (
        <div className="mt-3">
          <a href={profile.resume} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm w-full">
            📄 View Resume
          </a>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 mt-3">
        <Link to="/student/profile">
          <button className="btn btn-outline btn-sm md:btn-md w-full">👤 View Profile</button>
        </Link>
        <Link to="/student/edit">
          <button className="btn btn-primary btn-sm md:btn-md w-full">✏️ Edit Profile</button>
        </Link>
      </div>
    </div>
  );
}

export default StudentDashboard;
