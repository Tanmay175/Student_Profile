import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStudentDetails } from "../../services/professorService";
import { GitHubCalendar } from "react-github-calendar";
import CertificatesSection from "../../components/CertificatesSection";
import { getLeetcodeUsername, getGithubUsername, DEFAULT_AVATAR } from "../../utils/profileUtils";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function StatCard({ label, value, color }) {
  return (
    <div className={`bg-base-100 rounded-2xl p-3 text-center shadow-sm ${color ? `border-t-4 ${color}` : ""}`}>
      <p className="text-xs text-base-content/50 mb-1">{label}</p>
      <p className="text-xl font-bold">{value ?? 0}</p>
    </div>
  );
}

function StudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [githubData, setGithubData] = useState(null);
  const [lcData, setLcData] = useState({});
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getStudentDetails(id)
      .then(setData)
      .catch(console.log)
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!data?.profile?.github) return;
    const u = getGithubUsername(data.profile.github);
    if (!u) return;
    fetch(`${API_URL}/api/github/${u}`)
      .then(r => r.json())
      .then(j => typeof j === "object" && setGithubData(j))
      .catch(console.log);
  }, [data]);

  useEffect(() => {
    if (!data?.profile?.leetcode) return;
    const u = getLeetcodeUsername(data.profile.leetcode);
    if (!u) return;
    fetch(`${API_URL}/api/leetcode/${u}`)
      .then(r => r.json())
      .then(j => typeof j === "object" && setLcData(j))
      .catch(() => setLcData({}));
  }, [data]);

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${data?.student?.name}"? This cannot be undone.`)) return;
    try {
      setDeleting(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/professor/student/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) navigate(-1);
      else alert("Failed to delete");
    } catch { alert("Error deleting"); }
    finally { setDeleting(false); }
  };

  if (loading) return (
    <div className="flex justify-center mt-16">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );

  if (!data) return <div className="text-center mt-10 text-base-content/50">Student not found</div>;

  const { student, profile } = data;
  const ghUsername = getGithubUsername(profile?.github);

  return (
    <div className="max-w-3xl mx-auto pb-10 space-y-4">

      {/* Header */}
      <div className="bg-base-100 rounded-2xl p-4 shadow-sm">
        <div className="flex items-start gap-4">
          <img
            src={profile?.profilePhoto || DEFAULT_AVATAR}
            onError={e => { e.target.src = DEFAULT_AVATAR; }}
            className="w-18 h-18 w-[72px] h-[72px] rounded-full object-cover border-2 border-base-200 shrink-0"
            alt="profile"
          />
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold truncate">{student?.name}</h2>
            <p className="text-sm text-base-content/50 truncate">{student?.email}</p>
            <p className="text-sm text-base-content/60">Batch: {student?.batch}</p>
            {profile?.rollNo && <p className="text-sm text-base-content/60">Roll: {profile.rollNo}</p>}
            {profile?.bio && <p className="text-xs italic text-base-content/40 mt-1 line-clamp-2">"{profile.bio}"</p>}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-4">
          {profile?.github   && <a href={profile.github}   target="_blank" rel="noreferrer" className="btn btn-neutral btn-sm flex-1">GitHub</a>}
          {profile?.linkedin && <a href={profile.linkedin} target="_blank" rel="noreferrer" className="btn btn-info btn-sm flex-1">LinkedIn</a>}
          {profile?.leetcode && <a href={profile.leetcode} target="_blank" rel="noreferrer" className="btn btn-warning btn-sm flex-1">LeetCode</a>}
          <button onClick={handleDelete} disabled={deleting} className="btn btn-error btn-sm flex-1">
            {deleting ? <span className="loading loading-spinner loading-xs"></span> : "🗑️ Delete"}
          </button>
        </div>
      </div>

      {/* GitHub stats */}
      {githubData && (
        <div>
          <p className="text-sm font-semibold mb-2 px-1">GitHub Stats</p>
          <div className="grid grid-cols-3 gap-2">
            <StatCard label="Repos"     value={githubData.public_repos} />
            <StatCard label="Followers" value={githubData.followers} />
            <StatCard label="Following" value={githubData.following} />
          </div>
        </div>
      )}

      {/* GitHub calendar */}
      {ghUsername && (
        <div className="bg-base-100 rounded-2xl p-4 shadow-sm overflow-x-auto">
          <p className="text-sm font-semibold mb-3">GitHub Activity</p>
          <GitHubCalendar username={ghUsername} fontSize={10} blockSize={10} blockMargin={2} />
        </div>
      )}

      {/* LeetCode stats */}
      {lcData && Object.keys(lcData).length > 0 && (
        <div>
          <p className="text-sm font-semibold mb-2 px-1">LeetCode Stats</p>
          <div className="grid grid-cols-2 gap-2">
            <StatCard label="Total Solved" value={lcData.totalSolved ?? lcData.solvedProblem} />
            <StatCard label="Easy"   value={lcData.easySolved   ?? lcData.totalEasy}   color="border-green-400" />
            <StatCard label="Medium" value={lcData.mediumSolved ?? lcData.totalMedium} color="border-yellow-400" />
            <StatCard label="Hard"   value={lcData.hardSolved   ?? lcData.totalHard}   color="border-red-400" />
          </div>
        </div>
      )}

      {/* Resume */}
      {profile?.resume && (
        <div className="bg-base-100 rounded-2xl p-4 shadow-sm">
          <p className="text-sm font-semibold mb-3">Resume</p>
          <div className="relative w-full rounded-xl overflow-hidden" style={{ paddingTop: "56.25%" }}>
            <iframe src={profile.resume} className="absolute inset-0 w-full h-full" title="Resume" allow="autoplay" />
          </div>
          <a href={profile.resume} target="_blank" rel="noreferrer"
            className="btn btn-outline btn-sm w-full mt-3">📄 Open in Drive</a>
        </div>
      )}

      {/* Certificates */}
      <CertificatesSection studentId={student?._id} isOwner={false} />
    </div>
  );
}

export default StudentDetails;
