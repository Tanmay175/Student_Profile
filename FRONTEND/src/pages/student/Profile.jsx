import { useEffect, useState } from "react";
import { getProfile } from "../../services/studentService";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaCode } from "react-icons/fa";
import { GitHubCalendar } from "react-github-calendar";
import CertificatesSection from "../../components/CertificatesSection";
import { getGithubUsername, getLeetcodeUsername, DEFAULT_AVATAR } from "../../utils/profileUtils";

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
        {[1,2,3].map(i => <div key={i} className="h-28 bg-base-300 rounded-xl"></div>)}
      </div>
    </div>
  );
}

// Social card — clickable to open profile, shows username
function SocialCard({ icon, label, url, username, color }) {
  return (
    <div className="card bg-base-100 shadow p-4 hover:shadow-md transition-shadow">
      <div className={`mb-2 ${color}`}>{icon}</div>
      <p className="font-bold mb-1">{label}</p>
      {url && username ? (
        <>
          <p className="text-xs text-gray-400 mb-2 font-mono truncate">@{username}</p>
          <a href={url} target="_blank" rel="noreferrer"
            className="btn btn-xs btn-outline w-full">
            View Profile →
          </a>
        </>
      ) : (
        <div className="flex items-center justify-between">
          <p className="text-gray-400 text-sm">Not added</p>
          <Link to="/student/edit" className="text-xs text-primary hover:underline">Add</Link>
        </div>
      )}
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
  const leetcodeUsername = getLeetcodeUsername(profile?.leetcode);
  const linkedinUsername = profile?.linkedin
    ? profile.linkedin.replace(/\/$/, "").split("linkedin.com/in/")[1]?.split("/")[0] || ""
    : "";

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
        <Link to="/student/edit"><button className="btn btn-primary">Create Profile</button></Link>
      </div>
    );
  }

  const completion = calculateCompletion();

  return (
    <div className="max-w-4xl mx-auto px-2 pb-8">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 bg-base-100 shadow p-4 md:p-6 rounded-xl">
        <img
          src={profile.profilePhoto || DEFAULT_AVATAR}
          onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
          className="w-24 h-24 rounded-full border-2 border-primary object-cover shrink-0"
          alt="Profile"
        />
        <div className="flex-1 text-center sm:text-left min-w-0">
          <h2 className="text-xl md:text-2xl font-bold">{profile.name}</h2>
          <p className="text-sm opacity-70">Batch: {profile.batch}</p>
          {profile.rollNo && (
            <p className="text-sm opacity-70">Roll No: <span className="font-semibold">{profile.rollNo}</span></p>
          )}
          {profile.bio && (
            <p className="mt-2 text-sm italic text-gray-400">"{profile.bio}"</p>
          )}
          <div className="mt-3">
            <div className="flex items-center gap-2">
              <progress className="progress progress-success flex-1 max-w-xs" value={completion} max="100"></progress>
              <span className="text-sm font-medium">{completion}%</span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">Profile completed</p>
          </div>
        </div>
        <Link to="/student/edit" className="btn btn-primary btn-sm shrink-0">✏️ Edit Profile</Link>
      </div>

      {/* SOCIAL CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
        <SocialCard
          icon={<FaLinkedin size={22} />}
          label="LinkedIn"
          url={profile.linkedin}
          username={linkedinUsername}
          color="text-blue-500"
        />
        <SocialCard
          icon={<FaGithub size={22} />}
          label="GitHub"
          url={profile.github}
          username={githubUsername}
          color="text-gray-800"
        />
        <SocialCard
          icon={<FaCode size={22} />}
          label="LeetCode"
          url={profile.leetcode}
          username={leetcodeUsername}
          color="text-orange-500"
        />
      </div>

      {/* GITHUB CALENDAR */}
      {githubUsername && (
        <div className="mt-5 bg-base-100 shadow p-4 md:p-6 rounded-xl overflow-x-auto">
          <h3 className="font-bold mb-3">GitHub Activity</h3>
          <GitHubCalendar username={githubUsername} />
        </div>
      )}

      {/* RESUME */}
      {profile.resume && (
        <div className="mt-5 bg-base-100 shadow p-4 md:p-6 rounded-xl">
          <h3 className="font-bold mb-3">Resume</h3>
          <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
            <iframe src={profile.resume} className="absolute inset-0 w-full h-full rounded" title="Resume" allow="autoplay"></iframe>
          </div>
          <a href={profile.resume} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm mt-3">📄 Open in Drive</a>
        </div>
      )}

      {/* CERTIFICATES */}
      <CertificatesSection studentId={profile?.userId} isOwner={true} />

    </div>
  );
}

export default Profile;
