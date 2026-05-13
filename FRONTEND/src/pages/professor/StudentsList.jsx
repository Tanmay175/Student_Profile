// FRONTEND/src/pages/professor/StudentsList.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getStudentsByBatchWithProfiles } from "../../services/professorService";

function StudentsList() {
  const { year } = useParams();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // ✅ FIXED: use getStudentsByBatchWithProfiles so rollNo is available
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

  // ✅ Now correctly searches name OR rollNo from profile
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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Batch {year}</h2>
        <Link to={`/professor/leaderboard/${year}`}>
          <button className="btn btn-primary">🏆 Batch Leaderboard</button>
        </Link>
      </div>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search by name, email or roll number..."
        className="input input-bordered w-full mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filtered.length === 0 ? (
        <p className="text-gray-500">No student found.</p>
      ) : (
        <div className="space-y-2">
          {filtered.map(({ student, profile }) => (
            <Link to={`/professor/student/${student._id}`} key={student._id}>
              <div className="card p-3 bg-base-100 shadow hover:bg-base-200 flex justify-between items-center">
                <div>
                  <p className="font-medium">{student.name}</p>
                  <p className="text-sm text-gray-500">{student.email}</p>
                </div>
                {/* ✅ Now correctly shows rollNo from profile */}
                {profile?.rollNo && (
                  <span className="badge badge-outline">{profile.rollNo}</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentsList;