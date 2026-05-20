// FRONTEND/src/pages/professor/Leaderboard.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStudentsByBatchWithProfiles } from "../../services/professorService";
import { getLeetcodeUsername, getGithubUsername } from "../../utils/profileUtils";

const API_URL = import.meta.env.VITE_API_URL;

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

            if (s.profile?.github) {
              const username = getGithubUsername(s.profile.github);
              if (username) {
                try {
                  const g = await fetch(`${API_URL}/api/github/${username}`);
                  githubData = await g.json();
                } catch { githubData = {}; }
              }
            }

            if (s.profile?.leetcode) {
              const username = getLeetcodeUsername(s.profile.leetcode);
              if (username) {
                try {
                  const l = await fetch(`${API_URL}/api/leetcode/${username}`);
                  lcData = await l.json();
                } catch { lcData = {}; }
              }
            }

            try {
              const c = await fetch(`${API_URL}/api/certificates/count/${s.student._id}`);
              const cData = await c.json();
              certCount = cData.count || 0;
            } catch { certCount = 0; }

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
      <div className="flex flex-col items-center justify-center mt-10 gap-3">
        <span className="loading loading-spinner loading-lg"></span>
        <p className="text-sm text-gray-500">Loading leaderboard data…</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl md:text-3xl font-bold mb-2">🏆 Leaderboard — Batch {batch}</h2>

      {/* Scoring legend — wraps on mobile */}
      <div className="flex flex-wrap gap-2 mb-4 text-xs md:text-sm text-gray-500">
        <span className="badge badge-outline badge-sm md:badge-md">Easy LC = 1pt</span>
        <span className="badge badge-outline badge-sm md:badge-md">Medium LC = 3pts</span>
        <span className="badge badge-outline badge-sm md:badge-md">Hard LC = 5pts</span>
        <span className="badge badge-outline badge-sm md:badge-md">GH Repo = 3pts</span>
        <span className="badge badge-outline badge-sm md:badge-md">Follower = 1pt</span>
        <span className="badge badge-outline badge-sm md:badge-md">Certificate = 2pts</span>
      </div>

      {/* Top 3 cards — mobile friendly */}
      {students.length >= 3 && (
        <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6">
          {[1, 0, 2].map((i) => {
            const s = students[i];
            const medals = ["🥇", "🥈", "🥉"];
            return (
              <div
                key={s.student._id}
                className={`card bg-base-100 shadow p-3 md:p-4 text-center
                  ${i === 0 ? "ring-2 ring-yellow-400 order-2 md:order-2" : ""}
                  ${i === 1 ? "order-1 md:order-1" : ""}
                  ${i === 2 ? "order-3 md:order-3" : ""}
                `}
              >
                <div className="text-2xl md:text-3xl">{medals[i]}</div>
                <img
                  src={s.profile?.profilePhoto || "https://i.pravatar.cc/150"}
                  className="w-10 h-10 md:w-14 md:h-14 rounded-full mx-auto my-2 object-cover"
                  alt="profile"
                />
                <p className="font-bold text-xs md:text-sm truncate">{s.student.name}</p>
                <p className="text-primary font-bold text-sm md:text-lg">{s.score}pts</p>
              </div>
            );
          })}
        </div>
      )}

      {students.length === 0 ? (
        <p className="text-gray-500">No students found for this batch.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow">
          <table className="table table-sm md:table-md w-full bg-base-100">
            <thead>
              <tr>
                <th>#</th>
                <th>Student</th>
                <th className="text-green-500">Easy</th>
                <th className="text-yellow-500">Med</th>
                <th className="text-red-500">Hard</th>
                <th className="hidden md:table-cell">Repos</th>
                <th className="hidden md:table-cell">Followers</th>
                <th>Certs</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={s.student._id} className="hover">
                  <td className="text-lg">
                    {i === 0 && "🥇"}
                    {i === 1 && "🥈"}
                    {i === 2 && "🥉"}
                    {i > 2 && <span className="text-sm font-semibold">{i + 1}</span>}
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <img
                        src={s.profile?.profilePhoto || "https://i.pravatar.cc/150"}
                        className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover shrink-0"
                        alt="profile"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-xs md:text-sm truncate max-w-[100px] md:max-w-none">
                          {s.student.name}
                        </p>
                        {s.profile?.rollNo && (
                          <p className="text-xs text-gray-400 hidden md:block">{s.profile.rollNo}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="text-green-500 font-medium">{s.lcData.easySolved || 0}</td>
                  <td className="text-yellow-500 font-medium">{s.lcData.mediumSolved || 0}</td>
                  <td className="text-red-500 font-medium">{s.lcData.hardSolved || 0}</td>
                  <td className="hidden md:table-cell">{s.githubData.public_repos || 0}</td>
                  <td className="hidden md:table-cell">{s.githubData.followers || 0}</td>
                  <td>{s.certCount}</td>
                  <td className="font-bold text-primary text-base md:text-lg">{s.score}</td>
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
