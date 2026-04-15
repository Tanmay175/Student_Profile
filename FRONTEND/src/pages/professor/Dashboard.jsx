import { Link } from "react-router-dom";

function ProfessorDashboard() {
  const batches = ["2024", "2025", "2026"];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Batches</h1>

      <div className="grid md:grid-cols-3 gap-4">
        {batches.map((batch) => (
          <Link to={`/professor/batch/${batch}`} key={batch}>
            <div className="card bg-base-100 shadow p-4 hover:bg-base-200">
              Batch {batch}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ProfessorDashboard;