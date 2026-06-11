import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getStudentsByBatchWithProfiles } from "../../services/professorService";

const DEFAULT_AVATAR = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23dfe5e7'/%3E%3Ccircle cx='100' cy='75' r='38' fill='%23b0bec5'/%3E%3Cellipse cx='100' cy='185' rx='65' ry='50' fill='%23b0bec5'/%3E%3C/svg%3E`;

function StudentsList() {
  const { year } = useParams();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudentsByBatchWithProfiles(year)
      .then(setStudents)
      .catch(console.log)
      .finally(() => setLoading(false));
  }, [year]);

  const filtered = students.filter(({ student, profile }) => {
    const q = search.toLowerCase();
    return (
      student.name.toLowerCase().includes(q) ||
      student.email.toLowerCase().includes(q) ||
      (profile?.rollNo && profile.rollNo.toLowerCase().includes(q))
    );
  });

  if (loading) return (
    <div className="animate-pulse space-y-3">
      <div className="h-6 bg-base-300 rounded w-32"></div>
      <div className="h-11 bg-base-300 rounded-xl"></div>
      {[1,2,3,4].map(i => <div key={i} className="h-20 bg-base-300 rounded-2xl"></div>)}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto pb-8">
      {/* Header */}
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Batch {year}</h2>
            <p className="text-xs text-base-content/50">{students.length} students</p>
          </div>
          <Link to={`/professor/leaderboard/${year}`}>
            <button className="btn btn-primary btn-sm">🏆 Leaderboard</button>
          </Link>
        </div>

        {/* Search */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search name, email or roll no..."
            className="input input-bordered w-full pl-9 text-sm"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center py-10 text-base-content/40">No students found</p>
      ) : (
        <div className="space-y-2">
          {filtered.map(({ student, profile }) => (
            <Link to={`/professor/student/${student._id}`} key={student._id}>
              <div className="bg-base-100 rounded-2xl p-3 flex items-center gap-3 shadow-sm hover:shadow-md active:scale-[0.98] transition-all">
                <img
                  src={profile?.profilePhoto || DEFAULT_AVATAR}
                  onError={e => { e.target.src = DEFAULT_AVATAR; }}
                  className="w-12 h-12 rounded-full object-cover shrink-0 border border-base-200"
                  alt={student.name}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{student.name}</p>
                  <p className="text-xs text-base-content/50 truncate">{student.email}</p>
                  {profile?.rollNo && <p className="text-xs text-primary font-medium">{profile.rollNo}</p>}
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-base-content/30 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentsList;
