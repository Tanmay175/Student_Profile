// FRONTEND/src/pages/professor/StudentDetails.jsx
import CertificatesSection from "../../components/CertificatesSection";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStudentDetails } from "../../services/professorService";
import { GitHubCalendar } from "react-github-calendar";
import {
  getLeetcodeUsername,
  getGithubUsername,
  DEFAULT_AVATAR,
} from "../../utils/profileUtils";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function StatCard({ label, value, color }) {
  return (
    <div className={`card bg-base-100 shadow p-3 md:p-4 text-center ${color ? `border-t-4 ${color}` : ""}`}>
      <p className="font-bold text-gray-500 text-xs md:text-sm">{label}</p>
      <p className="text-xl md:text-2xl font-bold">{value}</p>
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

  const handleDelete = async () => {
    if (!window.confirm(`Delete student "${data?.student?.name}"? This cannot be undone.`)) return;
    try {
      setDeleting(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/professor/student/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        navigate(-1);
      } else {
        alert("Failed to delete student");
      }
    } catch (error) {
      console.log(error);
      alert("Error deleting student");
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await getStudentDetails(id);
        setData(res);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  useEffect(() => {
    if (!data?.profile?.github) return;
    const username = getGithubUsername(data.profile.github);
    if (!username) return;
    fetch(`${API_URL}/api/github/${username}`)
      .then((r) => r.json())
      .then((json) => {
        if (!json || typeof json !== "object") { setGithubData(null); return; }
        setGithubData(json);
      })
      .catch(console.log);
  }, [data]);

  useEffect(() => {
    if (!data?.profile?.leetcode) return;
    const username = getLeetcodeUsername(data.profile.leetcode);
    if (!username) return;
    fetch(`${API_URL}/api/leetcode/${username}`)
      .then((r) => r.json())
      .then((json) => {
        if (!json || typeof json !== "object") { setLcData({}); return; }
        setLcData(json);
      })
      .catch(() => setLcData({}));
  }, [data]);

  if (loading) {
    return (
      <div className="flex justify-center mt-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center mt-10">
        <p>No student data found</p>
      </div>
    );
  }

  const { student, profile } = data;

  return (
    <div className="max-w-5xl mx-auto w-full">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-base-100 shadow p-4 md:p-6 rounded-xl">
        <img
          src={profile?.profilePhoto || DEFAULT_AVATAR}
          alt="Profile"
          className="w-20 h-20 md:w-24 md:h-24 rounded-full border object-cover shrink-0"
          onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
        />

        <div className="flex-1 min-w-0">
          <h2 className="text-xl md:text-2xl font-bold">{student?.name}</h2>
          <p className="opacity-70 text-sm md:text-base truncate">{student?.email}</p>
          <p className="text-sm">Batch: {student?.batch}</p>
          {profile?.rollNo && (
            <p className="text-sm">
              Roll No: <span className="font-semibold ml-1">{profile.rollNo}</span>
            </p>
          )}
          {profile?.bio && (
            <p className="mt-1 text-sm italic text-gray-400">"{profile.bio}"</p>
          )}
        </div>

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="btn btn-error btn-sm self-start sm:self-auto"
        >
          {deleting ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            "🗑️ Delete"
          )}
        </button>
      </div>

      {/* QUICK LINKS */}
      <div className="flex flex-wrap gap-2 md:gap-3 mt-4 md:mt-6">
        {profile?.github && (
          <a href={profile.github} target="_blank" rel="noreferrer" className="btn btn-neutral btn-sm md:btn-md">
            GitHub
          </a>
        )}
        {profile?.linkedin && (
          <a href={profile.linkedin} target="_blank" rel="noreferrer" className="btn btn-info btn-sm md:btn-md">
            LinkedIn
          </a>
        )}
        {profile?.leetcode && (
          <a href={profile.leetcode} target="_blank" rel="noreferrer" className="btn btn-warning btn-sm md:btn-md">
            LeetCode
          </a>
        )}
      </div>

      {/* GITHUB STATS */}
      {githubData && (
        <div className="grid grid-cols-3 gap-2 md:gap-4 mt-4 md:mt-6">
          <StatCard label="Repositories" value={githubData?.public_repos ?? 0} />
          <StatCard label="Followers" value={githubData?.followers ?? 0} />
          <StatCard label="Following" value={githubData?.following ?? 0} />
        </div>
      )}

      {/* GITHUB CALENDAR */}
      {profile?.github && getGithubUsername(profile.github) && (
        <div className="mt-6 md:mt-8 bg-base-100 shadow p-4 md:p-6 rounded-xl overflow-x-auto">
          <h3 className="font-bold mb-3">GitHub Activity</h3>
          <GitHubCalendar username={getGithubUsername(profile.github)} />
        </div>
      )}

      {/* LEETCODE STATS */}
      {profile?.leetcode && lcData && typeof lcData === "object" && (
        <div className="mt-4 md:mt-6">
          <h3 className="font-bold mb-3">LeetCode Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            <StatCard label="Total Solved" value={lcData?.totalSolved ?? lcData?.solvedProblem ?? 0} />
            <StatCard label="Easy" value={lcData?.easySolved ?? lcData?.totalEasy ?? 0} color="border-green-400" />
            <StatCard label="Medium" value={lcData?.mediumSolved ?? lcData?.totalMedium ?? 0} color="border-yellow-400" />
            <StatCard label="Hard" value={lcData?.hardSolved ?? lcData?.totalHard ?? 0} color="border-red-400" />
          </div>
        </div>
      )}

      {/* RESUME */}
      {profile?.resume && (
        <div className="mt-6 md:mt-8 bg-base-100 shadow p-4 md:p-6 rounded-xl">
          <h3 className="font-bold mb-3">Resume</h3>
          <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
            <iframe
              src={profile.resume}
              className="absolute inset-0 w-full h-full rounded"
              title="Resume"
              allow="autoplay"
            ></iframe>
          </div>
          <a href={profile.resume} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm mt-3">
            📄 Open in Drive
          </a>
        </div>
      )}

      {/* CERTIFICATES */}
      <CertificatesSection studentId={student?._id} isOwner={false} />
    </div>
  );
}

export default StudentDetails;
