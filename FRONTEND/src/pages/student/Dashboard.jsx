import { useEffect, useState } from "react";
import { getProfile } from "../../services/studentService";
import { Link } from "react-router-dom";
import { DEFAULT_AVATAR } from "../../utils/profileUtils";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Skeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-7 bg-base-300 rounded-lg w-48"></div>
      <div className="bg-base-100 rounded-2xl p-4 flex gap-3 items-center">
        <div className="w-16 h-16 rounded-full bg-base-300 shrink-0"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-base-300 rounded w-32"></div>
          <div className="h-3 bg-base-300 rounded w-24"></div>
          <div className="h-3 bg-base-300 rounded w-28"></div>
        </div>
        <div className="w-14 h-14 bg-base-300 rounded-xl shrink-0"></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="h-11 bg-base-300 rounded-xl"></div>
        <div className="h-11 bg-base-300 rounded-xl"></div>
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
    getProfile()
      .then(setProfile)
      .catch(console.log)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!profile?.batch) return;
    const token = localStorage.getItem("token");
    fetch(`${API_URL}/api/student/rank`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) { setRank(d.rank); setBatchSize(d.total); } })
      .catch(console.log);
  }, [profile]);

  if (loading) return <Skeleton />;

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="text-6xl mb-4">👋</div>
        <h1 className="text-2xl font-bold mb-2">Welcome to StuTrack!</h1>
        <p className="text-base-content/60 mb-6 max-w-xs">Set up your profile to appear on the leaderboard and connect with your batch.</p>
        <Link to="/student/edit" className="btn btn-primary w-full max-w-xs">Create My Profile</Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-3">
      <h1 className="text-lg font-bold px-1">Welcome back, {profile.name} 👋</h1>

      {/* Profile card */}
      <div className="bg-base-100 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
        <img
          src={profile.profilePhoto || DEFAULT_AVATAR}
          onError={e => { e.target.src = DEFAULT_AVATAR; }}
          className="w-16 h-16 rounded-full object-cover border-2 border-primary/30 shrink-0"
          alt="avatar"
        />
        <div className="flex-1 min-w-0">
          <p className="font-bold truncate">{profile.name}</p>
          <p className="text-sm text-base-content/60">Batch {profile.batch}</p>
          {profile.rollNo && <p className="text-sm text-base-content/60">{profile.rollNo}</p>}
          {profile.bio && <p className="text-xs text-base-content/40 italic truncate mt-0.5">"{profile.bio}"</p>}
        </div>
        {rank !== null && (
          <div className="bg-primary text-primary-content rounded-xl px-3 py-2 text-center shrink-0 min-w-[56px]">
            <p className="text-[10px] font-semibold uppercase opacity-80">Rank</p>
            <p className="text-xl font-bold leading-tight">#{rank}</p>
            {batchSize && <p className="text-[10px] opacity-70">of {batchSize}</p>}
          </div>
        )}
      </div>

      {/* Social quick links */}
      {(profile.linkedin || profile.github || profile.leetcode) && (
        <div className="grid grid-cols-3 gap-2">
          {profile.linkedin && (
            <a href={profile.linkedin} target="_blank" rel="noreferrer"
              className="bg-base-100 rounded-xl p-3 flex flex-col items-center gap-1 shadow-sm hover:bg-base-200 active:scale-95 transition-all">
              <span className="text-xl">🔗</span>
              <span className="text-xs font-medium">LinkedIn</span>
            </a>
          )}
          {profile.github && (
            <a href={profile.github} target="_blank" rel="noreferrer"
              className="bg-base-100 rounded-xl p-3 flex flex-col items-center gap-1 shadow-sm hover:bg-base-200 active:scale-95 transition-all">
              <span className="text-xl">🐙</span>
              <span className="text-xs font-medium">GitHub</span>
            </a>
          )}
          {profile.leetcode && (
            <a href={profile.leetcode} target="_blank" rel="noreferrer"
              className="bg-base-100 rounded-xl p-3 flex flex-col items-center gap-1 shadow-sm hover:bg-base-200 active:scale-95 transition-all">
              <span className="text-xl">💻</span>
              <span className="text-xs font-medium">LeetCode</span>
            </a>
          )}
        </div>
      )}

      {/* Resume */}
      {profile.resume && (
        <a href={profile.resume} target="_blank" rel="noreferrer"
          className="btn btn-outline w-full">📄 View Resume</a>
      )}

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link to="/student/profile" className="btn btn-outline w-full">👤 Profile</Link>
        <Link to="/student/edit" className="btn btn-primary w-full">✏️ Edit</Link>
      </div>
    </div>
  );
}

export default StudentDashboard;
