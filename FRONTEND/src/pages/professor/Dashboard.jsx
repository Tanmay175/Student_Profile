import { useEffect, useState } from "react";
import { getBatches } from "../../services/professorService";
import { Link } from "react-router-dom";

function ProfessorDashboard() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const data = await getBatches();
        setBatches(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center mt-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

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