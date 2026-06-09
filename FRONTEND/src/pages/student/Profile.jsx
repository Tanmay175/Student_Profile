import { useEffect, useState } from "react";
import { getProfile } from "../../services/studentService";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaCode } from "react-icons/fa";
import { GitHubCalendar } from "react-github-calendar";
import CertificatesSection from "../../components/CertificatesSection";
import { getGithubUsername, DEFAULT_AVATAR } from "../../utils/profileUtils";

function SkeletonLoader() {
  return (
    <div className="max-w-4xl mx-auto animate-pulse px-2">
      <div className="flex items-center gap-4 bg-base-100 shadow p-4 md:p-6 rounded-xl">
        <div className="w-20 h-20 rounded-full bg-base-300 shrink-0"></div>
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-base-300 rounded w-48"></div>
          <div className="h-4 bg-base-300 rounded w-32"></div>
          <div className="h-4 bg-base-300 rounded w-64"></div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-6">
        {[1,2,3].map(i => <div key={i} className="h-24 bg-base-300 rounded-xl"></div>)}
      </div>
    </div>
  );
}

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const githubUsername = getGithubUsername(profile?.github);

  const calculateCompletion = () => {
    if (!profile) return 0;
    const fields = [profile.linkedin, profile.github, profile.leetcode, profile.resume, profile.bio, profile.rollNo];
    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
  };

  if (loading) return <SkeletonLoader />;

  if (!profile) {
    return (
      <div className="text-center mt-10 px-4">
        <p className="text-red-500 text-lg mb-4">No Profile Found ❗</p>
        <Link to="/student/edit">
          <button className="btn btn-primary">Create Profile</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-2 pb-8">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 bg-base-100 shadow p-4 md:p-6 rounded-xl">
        <img
          src={profile.profilePhoto || DEFAULT_AVATAR}
          onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
          className="w-24 h-24 rounded-full border object-cover shrink-0"
          alt="Profile"
        />
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-xl md:text-2xl font-bold">{profile.name}</h2>
          <p className="text-sm opacity-70">Batch: {profile.batch}</p>
          {profile.rollNo && (
            <p className="text-sm opacity-70">Roll No: <span className="font-semibold">{profile.rollNo}</span></p>
          )}
          {profile.bio && (
            <p className="mt-2 text-sm italic text-gray-400">"{profile.bio}"</p>
          )}
          <div className="mt-3">
            <progress className="progress progress-success w-full max-w-xs" value={calculateCompletion()} max="100"></progress>
            <p className="text-sm mt-1">{calculateCompletion()}% profile completed</p>
          </div>
        </div>
        <Link to="/student/edit" className="btn btn-primary btn-sm shrink-0">✏️ Edit</Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mt-4 md:mt-6">
        <div className="card bg-base-100 shadow p-4">
          <FaLinkedin size={24} className="text-blue-500 mb-2" />
          <p className="font-bold mb-1">LinkedIn</p>
          {profile.linkedin ? (
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-blue-500 text-sm hover:underline">View Profile →</a>
          ) : (
            <p className="text-gray-400 text-sm">No LinkedIn profile</p>
          )}
        </div>
        <div className="card bg-base-100 shadow p-4">
          <FaGithub size={24} className="mb-2" />
          <p className="font-bold mb-1">GitHub</p>
          {profile.github ? (
            <a href={profile.github} target="_blank" rel="noreferrer" className="text-blue-500 text-sm hover:underline">View Profile →</a>
          ) : (
            <p className="text-gray-400 text-sm">No GitHub profile</p>
          )}
        </div>
        <div className="card bg-base-100 shadow p-4">
          <FaCode size={24} className="text-orange-500 mb-2" />
          <p className="font-bold mb-1">LeetCode</p>
          {profile.leetcode ? (
            <a href={profile.leetcode} target="_blank" rel="noreferrer" className="text-blue-500 text-sm hover:underline">View Profile →</a>
          ) : (
            <p className="text-gray-400 text-sm">No LeetCode profile</p>
          )}
        </div>
      </div>

      {githubUsername && (
        <div className="mt-6 bg-base-100 shadow p-4 md:p-6 rounded-xl overflow-x-auto">
          <h3 className="font-bold mb-3">GitHub Activity</h3>
          <GitHubCalendar username={githubUsername} />
        </div>
      )}

      {profile.resume && (
        <div className="mt-6 bg-base-100 shadow p-4 md:p-6 rounded-xl">
          <h3 className="font-bold mb-3">Resume</h3>
          <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
            <iframe src={profile.resume} className="absolute inset-0 w-full h-full rounded" title="Resume" allow="autoplay"></iframe>
          </div>
          <a href={profile.resume} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm mt-3">📄 Open in Drive</a>
        </div>
      )}

      <CertificatesSection studentId={profile?.userId} isOwner={true} />
    </div>
  );
}

export default Profile;
