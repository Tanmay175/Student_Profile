import { useEffect, useState } from "react";
import { getBatches } from "../../services/professorService";
import { Link } from "react-router-dom";

function Skeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-7 bg-base-300 rounded-lg w-32"></div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[1,2,3,4].map(i => <div key={i} className="h-24 bg-base-300 rounded-2xl"></div>)}
      </div>
    </div>
  );
}

function ProfessorDashboard() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBatches()
      .then(setBatches)
      .catch(console.log)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Skeleton />;

  return (
    <div className="max-w-2xl mx-auto pb-8">
      <h1 className="text-xl font-bold mb-5 px-1">📚 Batches</h1>

      {batches.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-base-content/40">
          <span className="text-5xl mb-3">📭</span>
          <p className="font-medium">No batches yet</p>
          <p className="text-sm mt-1">Students need to register first</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {batches.map(batch => (
            <Link to={`/professor/batch/${batch}`} key={batch}>
              <div className="bg-base-100 rounded-2xl p-5 shadow-sm hover:shadow-md active:scale-95 transition-all text-center">
                <p className="text-xs text-base-content/50 mb-1">Batch</p>
                <p className="text-2xl font-bold">{batch}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProfessorDashboard;
