import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getStudentsByBatch } from "../../services/professorService";

function StudentsList() {
  const { year } = useParams();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await getStudentsByBatch(year);
        setStudents(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [year]);

  // ✅ Filter by name OR roll number
  const filtered = students.filter((stu) => {
    const q = search.toLowerCase();
    return (
      stu.name.toLowerCase().includes(q) ||
      (stu.rollNo && stu.rollNo.toLowerCase().includes(q))
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
        placeholder="Search by name or roll number..."
        className="input input-bordered w-full mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filtered.length === 0 ? (
        <p className="text-gray-500">No student found.</p>
      ) : (
        <div className="space-y-2">
          {filtered.map((stu) => (
            <Link to={`/professor/student/${stu._id}`} key={stu._id}>
              <div className="card p-3 bg-base-100 shadow hover:bg-base-200 flex justify-between items-center">
                <span>{stu.name} ({stu.email})</span>
                {/* ✅ Show roll number if exists */}
                {stu.rollNo && (
                  <span className="badge badge-outline">{stu.rollNo}</span>
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