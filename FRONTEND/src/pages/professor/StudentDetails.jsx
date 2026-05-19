import CertificatesSection from "../../components/CertificatesSection";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStudentDetails } from "../../services/professorService";
import {GitHubCalendar} from "react-github-calendar";
import {
  getLeetcodeUsername,
  getGithubUsername,
  DEFAULT_AVATAR,
} from "../../utils/profileUtils";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

function StudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [githubData, setGithubData] = useState(null);
  const [lcData, setLcData] = useState({});
  const [deleting, setDeleting] = useState(false);

  // DELETE STUDENT
  const handleDelete = async () => {
    if (
      !window.confirm(
        `Delete student "${data?.student?.name}"? This cannot be undone.`
      )
    )
      return;

    try {
      setDeleting(true);

      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API_URL}/api/professor/student/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

  // FETCH STUDENT DETAILS
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

  // FETCH GITHUB DATA
  useEffect(() => {
    if (!data?.profile?.github) return;

    const username = getGithubUsername(data.profile.github);

    if (!username) return;

    fetch(`${API_URL}/api/github/${username}`)
      .then((r) => r.json())
      .then((json) => {
        if (!json || typeof json !== "object") {
          setGithubData(null);
          return;
        }

        setGithubData(json);
      })
      .catch(console.log);
  }, [data]);

  // FETCH LEETCODE DATA
  useEffect(() => {
    if (!data?.profile?.leetcode) return;

    const username = getLeetcodeUsername(data.profile.leetcode);

    if (!username) return;

    fetch(`${API_URL}/api/leetcode/${username}`)
      .then((r) => r.json())
      .then((json) => {
        console.log("LeetCode raw response:", json);

        if (!json || typeof json !== "object") {
          setLcData({});
          return;
        }

        setLcData(json);
      })
      .catch((err) => {
        console.log(err);
        setLcData({});
      });
  }, [data]);

  // LOADING
  if (loading) {
    return (
      <div className="flex justify-center mt-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // NO DATA
  if (!data) {
    return (
      <div className="text-center mt-10">
        <p>No student data found</p>
      </div>
    );
  }

  const { student, profile } = data;

  return (
    <div className="max-w-5xl mx-auto p-4">

      {/* HEADER */}
      <div className="flex items-center gap-6 bg-base-100 shadow p-6 rounded-xl">

        <img
          src={profile?.profilePhoto || DEFAULT_AVATAR}
          alt="Profile"
          className="w-24 h-24 rounded-full border object-cover"
          onError={(e) => {
            e.target.src = DEFAULT_AVATAR;
          }}
        />

        <div className="flex-1">
          <h2 className="text-2xl font-bold">
            {student?.name}
          </h2>

          <p className="opacity-70">
            {student?.email}
          </p>

          <p className="text-sm">
            Batch: {student?.batch}
          </p>

          {profile?.rollNo && (
            <p className="text-sm">
              Roll No:
              <span className="font-semibold ml-1">
                {profile.rollNo}
              </span>
            </p>
          )}

          {profile?.bio && (
            <p className="mt-2 text-sm italic text-gray-400">
              "{profile.bio}"
            </p>
          )}
        </div>

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="btn btn-error btn-sm ml-auto self-start"
        >
          {deleting ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            "🗑️ Delete"
          )}
        </button>
      </div>

      {/* QUICK LINKS */}
      <div className="flex flex-wrap gap-3 mt-6">

        {profile?.github && (
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="btn btn-neutral"
          >
            GitHub
          </a>
        )}

        {profile?.linkedin && (
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="btn btn-info"
          >
            LinkedIn
          </a>
        )}

        {profile?.leetcode && (
          <a
            href={profile.leetcode}
            target="_blank"
            rel="noreferrer"
            className="btn btn-warning"
          >
            LeetCode
          </a>
        )}
      </div>

      {/* GITHUB STATS */}
      {githubData && (
        <div className="grid md:grid-cols-3 gap-4 mt-6">

          <div className="card bg-base-100 shadow p-4">
            <p className="font-bold">Repositories</p>
            <p className="text-2xl">
              {githubData?.public_repos ?? 0}
            </p>
          </div>

          <div className="card bg-base-100 shadow p-4">
            <p className="font-bold">Followers</p>
            <p className="text-2xl">
              {githubData?.followers ?? 0}
            </p>
          </div>

          <div className="card bg-base-100 shadow p-4">
            <p className="font-bold">Following</p>
            <p className="text-2xl">
              {githubData?.following ?? 0}
            </p>
          </div>

        </div>
      )}

      {/* GITHUB ACTIVITY */}
      {profile?.github &&
        getGithubUsername(profile.github) && (
          <div className="mt-8 bg-base-100 shadow p-6 rounded-xl">

            <h3 className="font-bold mb-3">
              GitHub Activity
            </h3>

            <GitHubCalendar
              username={getGithubUsername(profile.github)}
            />
          </div>
        )}

      {/* LEETCODE STATS */}
      {profile?.leetcode &&
        lcData &&
        typeof lcData === "object" && (
          <div className="mt-6">

            <h3 className="font-bold mb-3">
              LeetCode Stats
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

              <div className="card bg-base-100 shadow p-4 text-center">
                <p className="font-bold text-gray-500">
                  Total Solved
                </p>

                <p className="text-2xl font-bold">
                  {lcData?.totalSolved ??
                    lcData?.solvedProblem ??
                    0}
                </p>
              </div>

              <div className="card bg-base-100 shadow p-4 text-center border-t-4 border-green-400">
                <p className="font-bold text-green-500">
                  Easy
                </p>

                <p className="text-2xl font-bold">
                  {lcData?.easySolved ??
                    lcData?.totalEasy ??
                    0}
                </p>
              </div>

              <div className="card bg-base-100 shadow p-4 text-center border-t-4 border-yellow-400">
                <p className="font-bold text-yellow-500">
                  Medium
                </p>

                <p className="text-2xl font-bold">
                  {lcData?.mediumSolved ??
                    lcData?.totalMedium ??
                    0}
                </p>
              </div>

              <div className="card bg-base-100 shadow p-4 text-center border-t-4 border-red-400">
                <p className="font-bold text-red-500">
                  Hard
                </p>

                <p className="text-2xl font-bold">
                  {lcData?.hardSolved ??
                    lcData?.totalHard ??
                    0}
                </p>
              </div>

            </div>
          </div>
        )}

      {/* RESUME */}
      {profile?.resume && (
        <div className="mt-8 bg-base-100 shadow p-6 rounded-xl">

          <h3 className="font-bold mb-3">
            Resume
          </h3>

          <iframe
            src={profile.resume}
            className="w-full h-[500px] rounded"
            title="Resume"
            allow="autoplay"
          ></iframe>

          <a
            href={profile.resume}
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline btn-sm mt-3"
          >
            📄 Open in Drive
          </a>

        </div>
      )}

      {/* CERTIFICATES */}
      <CertificatesSection
        studentId={student?._id}
        isOwner={false}
      />

    </div>
  );
}

export default StudentDetails;