import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStudentsByBatchWithProfiles } from "../../services/professorService";
import { getLeetcodeUsername, getGithubUsername } from "../../utils/profileUtils";

const API_URL = import.meta.env.VITE_API_URL;

const calcScore = (lc, gh, certs) =>
  (lc.easySolved||0)*1 + (lc.mediumSolved||0)*3 + (lc.hardSolved||0)*5 +
  (gh.public_repos||0)*3 + (gh.followers||0)*1 + (certs||0)*2;

const MEDALS = ["🥇","🥈","🥉"];

function Leaderboard() {
  const { batch } = useParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const list = await getStudentsByBatchWithProfiles(batch);
        const enriched = await Promise.all(list.map(async s => {
          let gh = {}, lc = {}, certs = 0;
          const ghU = getGithubUsername(s.profile?.github);
          const lcU = getLeetcodeUsername(s.profile?.leetcode);
          if (ghU) { try { gh = await (await fetch(`${API_URL}/api/github/${ghU}`)).json(); } catch {} }
          if (lcU) { try { lc = await (await fetch(`${API_URL}/api/leetcode/${lcU}`)).json(); } catch {} }
          try { const r = await fetch(`${API_URL}/api/certificates/count/${s.student._id}`); certs = (await r.json()).count||0; } catch {}
          return { ...s, gh, lc, certs, score: calcScore(lc, gh, certs) };
        }));
        enriched.sort((a,b) => b.score - a.score);
        setStudents(enriched);
      } catch (e) { console.log(e); }
      finally { setLoading(false); }
    };
    run();
  }, [batch]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center mt-16 gap-3">
      <span className="loading loading-spinner loading-lg"></span>
      <p className="text-sm text-base-content/50">Loading leaderboard...</p>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto pb-8">
      <h2 className="text-xl font-bold mb-1 px-1">🏆 Leaderboard — Batch {batch}</h2>

      {/* Scoring legend */}
      <div className="flex flex-wrap gap-1.5 mb-4 px-1">
        {["Easy=1pt","Med=3pts","Hard=5pts","Repo=3pts","Follow=1pt","Cert=2pts"].map(t => (
          <span key={t} className="badge badge-outline badge-xs text-base-content/50">{t}</span>
        ))}
      </div>

      {/* Top 3 podium */}
      {students.length >= 3 && (
        <div className="grid grid-cols-3 gap-2 mb-5">
          {[1,0,2].map(i => (
            <div key={i} className={`bg-base-100 rounded-2xl p-3 text-center shadow-sm
              ${i===0 ? "ring-2 ring-yellow-400 -mt-2" : ""}`}>
              <p className="text-2xl mb-1">{MEDALS[i]}</p>
              <img
                src={students[i].profile?.profilePhoto || "https://api.dicebear.com/7.x/initials/svg?seed=S"}
                className="w-10 h-10 rounded-full mx-auto mb-1 object-cover"
                alt="avatar"
              />
              <p className="text-xs font-bold truncate">{students[i].student.name}</p>
              <p className="text-primary font-bold text-sm">{students[i].score}pts</p>
            </div>
          ))}
        </div>
      )}

      {/* Full table — horizontally scrollable on mobile */}
      <div className="overflow-x-auto rounded-2xl shadow-sm">
        <table className="table table-sm bg-base-100 w-full">
          <thead>
            <tr className="text-xs">
              <th>#</th>
              <th>Student</th>
              <th className="text-green-500">E</th>
              <th className="text-yellow-500">M</th>
              <th className="text-red-500">H</th>
              <th className="hidden sm:table-cell">Repos</th>
              <th>Certs</th>
              <th className="text-primary">Pts</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, i) => (
              <tr key={s.student._id} className="hover text-sm">
                <td className="font-bold">
                  {i < 3 ? MEDALS[i] : <span className="text-base-content/50">{i+1}</span>}
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <img
                      src={s.profile?.profilePhoto || "https://api.dicebear.com/7.x/initials/svg?seed=S"}
                      className="w-8 h-8 rounded-full object-cover shrink-0"
                      alt="avatar"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-xs truncate max-w-[80px] sm:max-w-none">{s.student.name}</p>
                      {s.profile?.rollNo && <p className="text-xs text-base-content/40 hidden sm:block">{s.profile.rollNo}</p>}
                    </div>
                  </div>
                </td>
                <td className="text-green-500  font-medium">{s.lc.easySolved   || 0}</td>
                <td className="text-yellow-500 font-medium">{s.lc.mediumSolved || 0}</td>
                <td className="text-red-500    font-medium">{s.lc.hardSolved   || 0}</td>
                <td className="hidden sm:table-cell">{s.gh.public_repos || 0}</td>
                <td>{s.certs}</td>
                <td className="font-bold text-primary">{s.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Leaderboard;
