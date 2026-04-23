import { useEffect, useState } from "react";
import { getAllStudents } from "../../services/professorService";

function Leaderboard() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await getAllStudents();

        const enriched = await Promise.all(
          res.map(async (s) => {
            let githubData = {};
            let lcData = {};

            // 🔹 GitHub
            if (s.profile?.github) {
              const username = s.profile.github.split("github.com/")[1];
              const g = await fetch(
                `https://api.github.com/users/${username}`
              );
              githubData = await g.json();
            }

            // 🔹 LeetCode
            if (s.profile?.leetcode) {
              const username = s.profile.leetcode.split("leetcode.com/")[1];
              const l = await fetch(
                `https://leetcode-stats-api.herokuapp.com/${username}`
              );
              lcData = await l.json();
            }

            // 🔥 SCORE CALCULATION
            const score =
              (lcData.totalSolved || 0) * 2 +
              (githubData.public_repos || 0) * 3 +
              (githubData.followers || 0);

            return {
              ...s,
              githubData,
              lcData,
              score,
            };
          })
        );

        // 🔥 SORT DESC
        enriched.sort((a, b) => b.score - a.score);

        setStudents(enriched);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAll();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">🏆 Leaderboard</h2>

      <div className="overflow-x-auto">
        <table className="table w-full bg-base-100 shadow rounded-xl">

          <thead>
            <tr>
              <th>Rank</th>
              <th>Student</th>
              <th>Batch</th>
              <th>LeetCode</th>
              <th>GitHub Repos</th>
              <th>Followers</th>
              <th>Score</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s, i) => (
              <tr key={s._id} className="hover">

                <td>
                  {i === 0 && "🥇"}
                  {i === 1 && "🥈"}
                  {i === 2 && "🥉"}
                  {i > 2 && i + 1}
                </td>

                <td className="flex items-center gap-3">
                  <img
                    src={
                      s.profile?.profilePhoto ||
                      "https://i.pravatar.cc/150"
                    }
                    className="w-10 h-10 rounded-full"
                  />
                  {s.student.name}
                </td>

                <td>{s.student.batch}</td>

                <td>{s.lcData.totalSolved || 0}</td>

                <td>{s.githubData.public_repos || 0}</td>

                <td>{s.githubData.followers || 0}</td>

                <td className="font-bold text-green-500">
                  {s.score}
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}

export default Leaderboard;