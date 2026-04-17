import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getStudentsByBatch } from "../../services/professorService";

function StudentsList() {
  const { year } = useParams();

  const [students, setStudents] = useState([]);
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

  if (loading) {
    return (
      <div className="flex justify-center mt-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl mb-4">Batch {year}</h2>

      <div className="space-y-2">
        {students.map((stu) => (
          <Link to={`/professor/student/${stu._id}`} key={stu._id}>
            <div className="card p-3 bg-base-100 shadow hover:bg-base-200">
              {stu.name} ({stu.email})
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default StudentsList;