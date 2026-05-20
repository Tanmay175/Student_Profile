// FRONTEND/src/pages/professor/Dashboard.jsx
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
      <h1 className="text-2xl md:text-3xl font-bold mb-4">Batches</h1>

      {batches.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-4xl mb-3">📭</p>
          <p>No batches found. Students need to register first.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {batches.map((batch) => (
            <Link to={`/professor/batch/${batch}`} key={batch}>
              <div className="card bg-base-100 shadow p-4 md:p-6 hover:bg-base-200 hover:shadow-md transition-all text-center">
                <p className="text-sm text-gray-500 mb-1">Batch</p>
                <p className="text-xl md:text-2xl font-bold">{batch}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProfessorDashboard;
