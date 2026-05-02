import { useEffect, useState } from "react";
import { getProfile } from "../../services/studentService";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaCode } from "react-icons/fa";
import { GitHubCalendar } from "react-github-calendar";
import CertificatesSection from "../../components/CertificatesSection";

function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchProfile();
  }, []);

  const getGithubUsername = (url) => {
    if (!url) return "";
    return url.split("github.com/")[1]?.replace("/", "");
  };

  const githubUsername = getGithubUsername(profile?.github);

  const calculateCompletion = () => {
    if (!profile) return 0;
    const fields = [profile.linkedin, profile.github, profile.leetcode, profile.resume, profile.bio, profile.rollNo];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  };

  if (!profile) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-500 text-lg">No Profile Found ❗</p>
        <Link to="/student/edit">
          <button className="btn btn-primary mt-4">Create Profile</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">

      {/* PROFILE HEADER */}
      <div className="flex items-center gap-6 bg-base-100 shadow p-6 rounded-xl">
        <img
          src={profile.profilePhoto || "https://i.pravatar.cc/150"}
          className="w-24 h-24 rounded-full border object-cover"
        />
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{profile.name}</h2>
          <p className="text-sm opacity-70">Batch: {profile.batch}</p>

          {/* ✅ Roll No */}
          {profile.rollNo && (
            <p className="text-sm opacity-70">
              Roll No: <span className="font-semibold">{profile.rollNo}</span>
            </p>
          )}

          {/* ✅ Bio */}
          {profile.bio && (
            <p className="mt-2 text-sm italic text-gray-400">"{profile.bio}"</p>
          )}

          {/* Progress */}
          <div className="mt-2">
            <progress
              className="progress progress-success w-64"
              value={calculateCompletion()}
              max="100"
            ></progress>
            <p className="text-sm mt-1">{calculateCompletion()}% profile completed</p>
          </div>
        </div>
      </div>

      {/* SOCIAL CARDS */}
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <div className="card bg-base-100 shadow p-4 hover:scale-105 transition">
          <FaLinkedin size={24} className="text-blue-500 mb-2" />
          <p className="font-bold">LinkedIn</p>
          <a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-blue-500 text-sm">View Profile</a>
        </div>
        <div className="card bg-base-100 shadow p-4 hover:scale-105 transition">
          <FaGithub size={24} className="mb-2" />
          <p className="font-bold">GitHub</p>
          <a href={profile.github} target="_blank" rel="noreferrer" className="text-blue-500 text-sm">View Profile</a>
        </div>
        <div className="card bg-base-100 shadow p-4 hover:scale-105 transition">
          <FaCode size={24} className="text-orange-500 mb-2" />
          <p className="font-bold">LeetCode</p>
          <a href={profile.leetcode} target="_blank" rel="noreferrer" className="text-blue-500 text-sm">View Profile</a>
        </div>
      </div>

      {/* GITHUB CALENDAR */}
      {githubUsername && (
        <div className="mt-8 bg-base-100 shadow p-6 rounded-xl">
          <h3 className="font-bold mb-3">GitHub Activity</h3>
          <GitHubCalendar username={githubUsername} />
        </div>
      )}

      {/* RESUME */}
      {profile.resume && (
        <div className="mt-8 bg-base-100 shadow p-6 rounded-xl">
          <h3 className="font-bold mb-3">Resume</h3>
          <iframe
            src={`https://docs.google.com/gview?url=${profile.resume}&embedded=true`}
            className="w-full h-[500px] rounded"
          ></iframe>
        </div>
      )}

      {/* CERTIFICATES */}
      <CertificatesSection studentId={profile?.userId} isOwner={true} />

      {/* EDIT */}
      <div className="mt-6 text-center">
        <Link to="/student/edit">
          <button className="btn btn-primary">Edit Profile</button>
        </Link>
      </div>

    </div>
  );
}

export default Profile;