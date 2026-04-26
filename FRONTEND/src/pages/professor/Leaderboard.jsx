import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStudentsByBatchWithProfiles } from "../../services/professorService";

// ✅ FIX: use env variable instead of hardcoded localhost
const API_URL = import.meta.env.VITE_API_URL;

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

            if (s.profile?.github) {
              const username = s.profile.github?.split("github.com/")[1]?.replace("/", "");
              if (username) {
                const g = await fetch(`https://api.github.com/users/${username}`);
                githubData = await g.json().catch(() => ({}));
              }
            }

            if (s.profile?.leetcode) {
              const username = s.profile.leetcode?.split("leetcode.com/")[1]?.replace("/", "");
              if (username) {
                // ✅ FIX: use env variable
                const l = await fetch(`${API_URL}/api/leetcode/${username}`);
                lcData = await l.json().catch(() => ({}));
              }
            }

            const score =
              (lcData.totalSolved || 0) * 2 +
              (githubData.public_repos || 0) * 3 +
              (githubData.followers || 0);

            return { ...s, githubData, lcData, score };
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
      <h2 className="text-3xl font-bold mb-6">🏆 Leaderboard — Batch {batch}</h2>

      {students.length === 0 ? (
        <p className="text-gray-500">No students found for this batch.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full bg-base-100 shadow rounded-xl">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Student</th>
                <th>LeetCode Solved</th>
                <th>GitHub Repos</th>
                <th>GitHub Followers</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={s.student._id} className="hover">
                  <td>
                    {i === 0 && "🥇"}
                    {i === 1 && "🥈"}
                    {i === 2 && "🥉"}
                    {i > 2 && i + 1}
                  </td>
                  <td className="flex items-center gap-3">
                    <img
                      src={s.profile?.profilePhoto || "https://i.pravatar.cc/150"}
                      className="w-10 h-10 rounded-full"
                      alt="profile"
                    />
                    {s.student.name}
                  </td>
                  <td>{s.lcData.totalSolved || 0}</td>
                  <td>{s.githubData.public_repos || 0}</td>
                  <td>{s.githubData.followers || 0}</td>
                  <td className="font-bold text-green-500">{s.score}</td>
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