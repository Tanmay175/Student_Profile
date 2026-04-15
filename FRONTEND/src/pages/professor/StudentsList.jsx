import { Link, useParams } from "react-router-dom";

function StudentsList() {
  const { year } = useParams();

  const students = [
    { id: 1, name: "Rahul" },
    { id: 2, name: "Amit" },
  ];

  return (
    <div>
      <h2 className="text-2xl mb-4">Batch {year}</h2>

      <div className="space-y-2">
        {students.map((stu) => (
          <Link to={`/professor/student/${stu.id}`} key={stu.id}>
            <div className="card p-3 bg-base-100 shadow hover:bg-base-200">
              {stu.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default StudentsList;