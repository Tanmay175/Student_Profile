// FRONTEND/src/pages/professor/StudentsList.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getStudentsByBatchWithProfiles } from "../../services/professorService";

const DEFAULT_AVATAR = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23dfe5e7'/%3E%3Ccircle cx='100' cy='75' r='38' fill='%23b0bec5'/%3E%3Cellipse cx='100' cy='185' rx='65' ry='50' fill='%23b0bec5'/%3E%3C/svg%3E`;

function StudentCard({ student, profile }) {
  const photo = profile?.profilePhoto || DEFAULT_AVATAR;

  return (
    <Link to={`/professor/student/${student._id}`}>
      <div className="card bg-base-100 shadow hover:shadow-md hover:bg-base-200 transition-all duration-200 p-3 md:p-4 flex flex-row items-center gap-3 md:gap-4">
        <div className="avatar flex-shrink-0">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
            <img
              src={photo}
              alt={student.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm md:text-base truncate">{student.name}</p>
          <p className="text-xs md:text-sm text-gray-500 truncate">{student.email}</p>
          {profile?.rollNo && (
            <p className="text-xs text-primary font-medium mt-0.5">{profile.rollNo}</p>
          )}
        </div>

        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}

function StudentsList() {
  const { year } = useParams();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await getStudentsByBatchWithProfiles(year);
        setStudents(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [year]);

  const filtered = students.filter(({ student, profile }) => {
    const q = search.toLowerCase();
    return (
      student.name.toLowerCase().includes(q) ||
      student.email.toLowerCase().includes(q) ||
      (profile?.rollNo && profile.rollNo.toLowerCase().includes(q))
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center mt-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">Batch {year}</h2>
          <p className="text-sm text-gray-500">{students.length} student{students.length !== 1 ? "s" : ""}</p>
        </div>
        <Link to={`/professor/leaderboard/${year}`}>
          <button className="btn btn-primary btn-sm md:btn-md w-full sm:w-auto">
            🏆 Batch Leaderboard
          </button>
        </Link>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name, email or roll number..."
        className="input input-bordered w-full mb-4 text-sm"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {search && (
        <p className="text-sm text-gray-500 mb-3">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "{search}"
        </p>
      )}

      {filtered.length === 0 ? (
        <p className="text-gray-500">No student found.</p>
      ) : (
        <div className="space-y-2 md:space-y-3">
          {filtered.map(({ student, profile }) => (
            <StudentCard key={student._id} student={student} profile={profile} />
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentsList;
