import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStudentsByBatchWithProfiles } from "../../services/professorService";

const API_URL = import.meta.env.VITE_API_URL;

// ✅ Improved scoring:
// LeetCode: easy=1, medium=3, hard=5 points
// GitHub repos: 3pts each, followers: 1pt each
// Certificates fetched from backend (2pts each)
const calcScore = (lcData, githubData, certCount = 0) => {
  const lc =
    (lcData.easySolved || 0) * 1 +
    (lcData.mediumSolved || 0) * 3 +
    (lcData.hardSolved || 0) * 5;
  const gh =
    (githubData.public_repos || 0) * 3 +
    (githubData.followers || 0) * 1;
  const certs = certCount * 2;
  return lc + gh + certs;
};

function Leaderboard() {
  const { batch } = useParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await getStudentsByBatchWithProfiles(batch);

        const enriched = await Promise.all(
          res.map(async (s) => {
            let githubData = {};
            let lcData = {};
            let certCount = 0;

            // ✅ Use backend proxy for GitHub (cached, avoids rate limits)
            if (s.profile?.github) {
              const username = s.profile.github?.split("github.com/")[1]?.replace("/", "");
              if (username) {
                try {
                  const g = await fetch(`${API_URL}/api/github/${username}`);
                  githubData = await g.json();
                } catch {
                  githubData = {};
                }
              }
            }

            // ✅ Use backend proxy for LeetCode (cached + difficulty breakdown)
            if (s.profile?.leetcode) {
              const username = s.profile.leetcode?.split("leetcode.com/u/")[1]?.replace("/", "")
                || s.profile.leetcode?.split("leetcode.com/")[1]?.replace("/", "");
              if (username) {
                try {
                  const l = await fetch(`${API_URL}/api/leetcode/${username}`);
                  lcData = await l.json();
                } catch {
                  lcData = {};
                }
              }
            }

            // ✅ Fetch certificate count
            try {
              const c = await fetch(`${API_URL}/api/certificates/count/${s.student._id}`);
              const cData = await c.json();
              certCount = cData.count || 0;
            } catch {
              certCount = 0;
            }

            const score = calcScore(lcData, githubData, certCount);

            return { ...s, githubData, lcData, certCount, score };
          })
        );

        enriched.sort((a, b) => b.score - a.score);
        setStudents(enriched);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [batch]);

  if (loading) {
    return (
      <div className="flex justify-center mt-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-2">🏆 Leaderboard — Batch {batch}</h2>

      {/* Scoring legend */}
      <div className="flex flex-wrap gap-3 mb-6 text-sm text-gray-500">
        <span className="badge badge-outline">Easy LC = 1pt</span>
        <span className="badge badge-outline">Medium LC = 3pts</span>
        <span className="badge badge-outline">Hard LC = 5pts</span>
        <span className="badge badge-outline">GitHub Repo = 3pts</span>
        <span className="badge badge-outline">Follower = 1pt</span>
        <span className="badge badge-outline">Certificate = 2pts</span>
      </div>

      {students.length === 0 ? (
        <p className="text-gray-500">No students found for this batch.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full bg-base-100 shadow rounded-xl">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Student</th>
                <th>LC Easy</th>
                <th>LC Medium</th>
                <th>LC Hard</th>
                <th>GH Repos</th>
                <th>Followers</th>
                <th>Certs</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={s.student._id} className="hover">
                  <td className="text-xl">
                    {i === 0 && "🥇"}
                    {i === 1 && "🥈"}
                    {i === 2 && "🥉"}
                    {i > 2 && i + 1}
                  </td>
                  <td className="flex items-center gap-3">
                    <img
                      src={s.profile?.profilePhoto || "https://i.pravatar.cc/150"}
                      className="w-10 h-10 rounded-full object-cover"
                      alt="profile"
                    />
                    <div>
                      <p className="font-semibold">{s.student.name}</p>
                      {s.profile?.rollNo && (
                        <p className="text-xs text-gray-400">{s.profile.rollNo}</p>
                      )}
                    </div>
                  </td>
                  <td className="text-green-500">{s.lcData.easySolved || 0}</td>
                  <td className="text-yellow-500">{s.lcData.mediumSolved || 0}</td>
                  <td className="text-red-500">{s.lcData.hardSolved || 0}</td>
                  <td>{s.githubData.public_repos || 0}</td>
                  <td>{s.githubData.followers || 0}</td>
                  <td>{s.certCount}</td>
                  <td className="font-bold text-green-500 text-lg">{s.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Leaderboard;