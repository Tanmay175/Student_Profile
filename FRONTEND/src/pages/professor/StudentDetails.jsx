import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStudentDetails } from "../../services/professorService";
import { GitHubCalendar } from "react-github-calendar";

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

  // 🔥 FETCH GITHUB DATA
  useEffect(() => {
    if (!data?.profile?.github) return;

    const username = data.profile.github.split("github.com/")[1];

    const fetchGithub = async () => {
      try {
        const res = await fetch(`https://api.github.com/users/${username}`);
        const json = await res.json();
        setGithubData(json);
      } catch (err) {
        console.log(err);
      }
    };

    fetchGithub();
  }, [data]);

  // 🔥 FETCH LEETCODE DATA
  useEffect(() => {
    if (!data?.profile?.leetcode) return;

    const username = data.profile.leetcode.split("leetcode.com/")[1];

    const fetchLC = async () => {
      try {
        const res = await fetch(
          `https://leetcode-stats-api.herokuapp.com/${username}`
        );
        const json = await res.json();
        setLcData(json);
      } catch (err) {
        console.log(err);
      }
    };

    fetchLC();
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

      {/* 🔥 STUDENT HEADER */}
      <div className="flex items-center gap-6 bg-base-100 shadow p-6 rounded-xl">
        <img
          src={profile?.profilePhoto || "https://i.pravatar.cc/150"}
          className="w-24 h-24 rounded-full border"
        />

        <div>
          <h2 className="text-2xl font-bold">{student.name}</h2>
          <p className="opacity-70">{student.email}</p>
          <p className="text-sm">Batch: {student.batch}</p>
        </div>
      </div>

      {/* 🔥 QUICK ACTIONS */}
      <div className="flex gap-3 mt-6">
        {profile?.github && (
          <a href={profile.github} target="_blank" className="btn btn-neutral">
            GitHub
          </a>
        )}

        {profile?.linkedin && (
          <a href={profile.linkedin} target="_blank" className="btn btn-info">
            LinkedIn
          </a>
        )}

        {profile?.leetcode && (
          <a href={profile.leetcode} target="_blank" className="btn btn-warning">
            LeetCode
          </a>
        )}
      </div>

      {/* 🔥 GITHUB STATS */}
      {githubData && (
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <div className="card bg-base-100 shadow p-4">
            <p className="font-bold">Repositories</p>
            <p className="text-xl">{githubData.public_repos}</p>
          </div>

          <div className="card bg-base-100 shadow p-4">
            <p className="font-bold">Followers</p>
            <p className="text-xl">{githubData.followers}</p>
          </div>

          <div className="card bg-base-100 shadow p-4">
            <p className="font-bold">Following</p>
            <p className="text-xl">{githubData.following}</p>
          </div>
        </div>
      )}

      {/* 🔥 GITHUB GRAPH */}
      {profile?.github && (
        <div className="mt-8 bg-base-100 shadow p-6 rounded-xl">
          <h3 className="font-bold mb-3">GitHub Activity</h3>
          <GitHubCalendar
            username={profile.github.split("github.com/")[1]}
          />
        </div>
      )}

      {/* 🔥 LEETCODE STATS */}
      {lcData && (
        <div className="grid md:grid-cols-4 gap-4 mt-6">
          <div className="card bg-base-100 shadow p-4">
            <p className="font-bold">Solved</p>
            <p>{lcData.totalSolved}</p>
          </div>

          <div className="card bg-base-100 shadow p-4">
            <p className="font-bold">Easy</p>
            <p>{lcData.easySolved}</p>
          </div>

          <div className="card bg-base-100 shadow p-4">
            <p className="font-bold">Medium</p>
            <p>{lcData.mediumSolved}</p>
          </div>

          <div className="card bg-base-100 shadow p-4">
            <p className="font-bold">Hard</p>
            <p>{lcData.hardSolved}</p>
          </div>
        </div>
      )}

      {/* 🔥 RESUME */}
      {profile?.resume && (
        <div className="mt-8 bg-base-100 shadow p-6 rounded-xl">
          <h3 className="font-bold mb-3">Resume</h3>

          <iframe
            src={`https://docs.google.com/gview?url=${profile.resume}&embedded=true`}
            className="w-full h-[500px] rounded"
          />

          <a
            href={profile.resume}
            target="_blank"
            className="btn btn-primary mt-4"
          >
            Download Resume
          </a>
        </div>
      )}

    </div>
  );
}

export default StudentDetails;