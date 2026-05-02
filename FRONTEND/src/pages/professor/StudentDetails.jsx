import CertificatesSection from "../../components/CertificatesSection";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStudentDetails } from "../../services/professorService";
import { GitHubCalendar } from "react-github-calendar";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function StudentDetails() {
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [githubData, setGithubData] = useState(null);
  const [lcData, setLcData] = useState(null);

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

  // Fetch GitHub
  useEffect(() => {
    if (!data?.profile?.github) return;
    const username = data.profile.github.split("github.com/")[1]?.replace("/", "");
    if (!username) return;

    fetch(`https://api.github.com/users/${username}`)
      .then((r) => r.json())
      .then(setGithubData)
      .catch(console.log);
  }, [data]);

  // Fetch LeetCode
  useEffect(() => {
    if (!data?.profile?.leetcode) return;
    const username = data.profile.leetcode.split("leetcode.com/")[1]?.replace("/", "");
    if (!username) return;

    fetch(`${API_URL}/api/leetcode/${username}`)
      .then((r) => r.json())
      .then((json) => {
        console.log("LeetCode raw response:", json); // see what fields come back
        setLcData(json);
      })
      .catch(console.log);
  }, [data]);

  if (loading) {
    return (
      <div className="flex justify-center mt-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!data) return <p>No data found</p>;

  const { student, profile } = data;

  return (
    <div className="max-w-5xl mx-auto">

      {/* STUDENT HEADER */}
      <div className="flex items-center gap-6 bg-base-100 shadow p-6 rounded-xl">
        <img
          src={profile?.profilePhoto || "https://i.pravatar.cc/150"}
          className="w-24 h-24 rounded-full border object-cover"
        />
        <div>
          <h2 className="text-2xl font-bold">{student.name}</h2>
          <p className="opacity-70">{student.email}</p>
          <p className="text-sm">Batch: {student.batch}</p>

          {/* ✅ Roll No */}
          {profile?.rollNo && (
            <p className="text-sm">Roll No: <span className="font-semibold">{profile.rollNo}</span></p>
          )}

          {/* ✅ Bio */}
          {profile?.bio && (
            <p className="mt-2 text-sm italic text-gray-400">"{profile.bio}"</p>
          )}
        </div>
      </div>

      {/* QUICK LINKS */}
      <div className="flex gap-3 mt-6">
        {profile?.github && (
          <a href={profile.github} target="_blank" rel="noreferrer" className="btn btn-neutral">GitHub</a>
        )}
        {profile?.linkedin && (
          <a href={profile.linkedin} target="_blank" rel="noreferrer" className="btn btn-info">LinkedIn</a>
        )}
        {profile?.leetcode && (
          <a href={profile.leetcode} target="_blank" rel="noreferrer" className="btn btn-warning">LeetCode</a>
        )}
      </div>

      {/* GITHUB STATS */}
      {githubData && (
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <div className="card bg-base-100 shadow p-4">
            <p className="font-bold">Repositories</p>
            <p className="text-2xl">{githubData.public_repos}</p>
          </div>
          <div className="card bg-base-100 shadow p-4">
            <p className="font-bold">Followers</p>
            <p className="text-2xl">{githubData.followers}</p>
          </div>
          <div className="card bg-base-100 shadow p-4">
            <p className="font-bold">Following</p>
            <p className="text-2xl">{githubData.following}</p>
          </div>
        </div>
      )}

      {/* GITHUB ACTIVITY */}
      {profile?.github && (
        <div className="mt-8 bg-base-100 shadow p-6 rounded-xl">
          <h3 className="font-bold mb-3">GitHub Activity</h3>
          <GitHubCalendar
            username={profile.github.split("github.com/")[1]?.replace("/", "")}
          />
        </div>
      )}

      {/* LEETCODE STATS */}
      {lcData && (
        <div className="mt-6">
          <h3 className="font-bold mb-3">LeetCode Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card bg-base-100 shadow p-4 text-center">
              <p className="font-bold text-gray-500">Total Solved</p>
              <p className="text-2xl font-bold">{lcData.totalSolved ?? lcData.solvedProblem ?? 0}</p>
            </div>
            <div className="card bg-base-100 shadow p-4 text-center border-t-4 border-green-400">
              <p className="font-bold text-green-500">Easy</p>
              <p className="text-2xl font-bold">{lcData.easySolved ?? lcData.totalEasy ?? 0}</p>
            </div>
            <div className="card bg-base-100 shadow p-4 text-center border-t-4 border-yellow-400">
              <p className="font-bold text-yellow-500">Medium</p>
              <p className="text-2xl font-bold">{lcData.mediumSolved ?? lcData.totalMedium ?? 0}</p>
            </div>
            <div className="card bg-base-100 shadow p-4 text-center border-t-4 border-red-400">
              <p className="font-bold text-red-500">Hard</p>
              <p className="text-2xl font-bold">{lcData.hardSolved ?? lcData.totalHard ?? 0}</p>
            </div>
          </div>
        </div>
      )}

      {/* RESUME */}
      {profile?.resume && (
        <div className="mt-8 bg-base-100 shadow p-6 rounded-xl">
          <h3 className="font-bold mb-3">Resume</h3>
          <iframe
            src={`https://docs.google.com/gview?url=${profile.resume}&embedded=true`}
            className="w-full h-[500px] rounded"
          />
          <a href={profile.resume} target="_blank" rel="noreferrer" className="btn btn-primary mt-4">
            Download Resume
          </a>
        </div>
      )}
      <CertificatesSection studentId={student?._id} isOwner={false} />

    </div>
  );
}

export default StudentDetails;