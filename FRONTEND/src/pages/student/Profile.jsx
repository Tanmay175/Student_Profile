import { useEffect, useState } from "react";
import { getProfile } from "../../services/studentService";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaCode } from "react-icons/fa";
import { GitHubCalendar } from "react-github-calendar";
import CertificatesSection from "../../components/CertificatesSection";
import { getGithubUsername, getLeetcodeUsername, DEFAULT_AVATAR } from "../../utils/profileUtils";

function Skeleton() {
  return (
    <div className="animate-pulse space-y-4 max-w-3xl mx-auto">
      <div className="bg-base-100 rounded-2xl p-4 flex gap-4 items-center">
        <div className="w-20 h-20 rounded-full bg-base-300 shrink-0"></div>
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-base-300 rounded w-40"></div>
          <div className="h-3 bg-base-300 rounded w-28"></div>
          <div className="h-3 bg-base-300 rounded w-52"></div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[1,2,3].map(i => <div key={i} className="h-24 bg-base-300 rounded-2xl"></div>)}
      </div>
    </div>
  );
}

function SocialCard({ icon, label, url, username, color, editLink }) {
  return (
    <div className="bg-base-100 rounded-2xl p-4 shadow-sm flex flex-col gap-2">
      <div className={`text-xl ${color}`}>{icon}</div>
      <p className="font-semibold text-sm">{label}</p>
      {url && username ? (
        <>
          <p className="text-xs text-base-content/50 font-mono">@{username}</p>
          <a href={url} target="_blank" rel="noreferrer"
            className="btn btn-xs btn-outline w-full mt-auto">Open →</a>
        </>
      ) : (
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xs text-base-content/40">Not added</span>
          <Link to="/student/edit" className="text-xs text-primary hover:underline">+ Add</Link>
        </div>
      )}
    </div>
  );
}

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile()
      .then(setProfile)
      .catch(console.log)
      .finally(() => setLoading(false));
  }, []);

  const githubUsername   = getGithubUsername(profile?.github);
  const leetcodeUsername = getLeetcodeUsername(profile?.leetcode);
  const linkedinUsername = profile?.linkedin
    ? profile.linkedin.replace(/\/$/, "").split("linkedin.com/in/")[1]?.split("/")[0] || ""
    : "";

  const completion = (() => {
    if (!profile) return 0;
    const fields = [profile.linkedin, profile.github, profile.leetcode, profile.resume, profile.bio, profile.rollNo];
    return Math.round(fields.filter(Boolean).length / fields.length * 100);
  })();

  if (loading) return <Skeleton />;

  if (!profile) {
    return (
      <div className="text-center py-16 px-4">
        <p className="text-error text-lg mb-4">No Profile Found ❗</p>
        <Link to="/student/edit"><button className="btn btn-primary">Create Profile</button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4 pb-6">

      {/* Header card */}
      <div className="bg-base-100 rounded-2xl p-4 shadow-sm">
        <div className="flex items-start gap-4">
          <img
            src={profile.profilePhoto || DEFAULT_AVATAR}
            onError={e => { e.target.src = DEFAULT_AVATAR; }}
            className="w-20 h-20 rounded-full object-cover border-2 border-primary/30 shrink-0"
            alt="Profile"
          />
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold truncate">{profile.name}</h2>
            <p className="text-sm text-base-content/60">Batch: {profile.batch}</p>
            {profile.rollNo && <p className="text-sm text-base-content/60">Roll: {profile.rollNo}</p>}
            {profile.bio && <p className="text-sm italic text-base-content/40 mt-1 line-clamp-2">"{profile.bio}"</p>}
            <div className="mt-3 flex items-center gap-2">
              <progress className="progress progress-success flex-1" value={completion} max="100"></progress>
              <span className="text-xs font-semibold shrink-0">{completion}%</span>
            </div>
          </div>
        </div>
        <Link to="/student/edit" className="btn btn-primary btn-sm w-full mt-4">✏️ Edit Profile</Link>
      </div>

      {/* Social cards */}
      <div className="grid grid-cols-3 gap-3">
        <SocialCard icon={<FaLinkedin />} label="LinkedIn" url={profile.linkedin} username={linkedinUsername} color="text-blue-500" />
        <SocialCard icon={<FaGithub />}   label="GitHub"   url={profile.github}   username={githubUsername}   color="text-base-content" />
        <SocialCard icon={<FaCode />}     label="LeetCode" url={profile.leetcode} username={leetcodeUsername} color="text-orange-500" />
      </div>

      {/* GitHub activity */}
      {githubUsername && (
        <div className="bg-base-100 rounded-2xl p-4 shadow-sm overflow-x-auto">
          <h3 className="font-bold mb-3">GitHub Activity</h3>
          <div className="min-w-0">
            <GitHubCalendar username={githubUsername} fontSize={10} blockSize={10} blockMargin={2} />
          </div>
        </div>
      )}

      {/* Resume */}
      {profile.resume && (
        <div className="bg-base-100 rounded-2xl p-4 shadow-sm">
          <h3 className="font-bold mb-3">Resume</h3>
          <div className="relative w-full rounded-xl overflow-hidden" style={{ paddingTop: "56.25%" }}>
            <iframe src={profile.resume} className="absolute inset-0 w-full h-full" title="Resume" allow="autoplay" />
          </div>
          <a href={profile.resume} target="_blank" rel="noreferrer"
            className="btn btn-outline btn-sm w-full mt-3">📄 Open in Drive</a>
        </div>
      )}

      {/* Certificates */}
      <CertificatesSection studentId={profile?.userId} isOwner={true} />
    </div>
  );
}

export default Profile;
