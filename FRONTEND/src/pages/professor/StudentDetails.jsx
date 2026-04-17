import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStudentDetails } from "../../services/professorService";

function StudentDetails() {
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await getStudentDetails(id);
        setData(res);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center mt-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!data) return <p>No data found</p>;

  const { student, profile } = data;

  return (
    <div className="max-w-xl">
      <h2 className="text-2xl mb-4">Student Details</h2>

      <div className="card p-4 bg-base-100 shadow">
        <p><b>Name:</b> {student.name}</p>
        <p><b>Email:</b> {student.email}</p>
        <p><b>Batch:</b> {student.batch}</p>

        {profile && (
          <>
            <div className="mt-3">
              <p><b>LinkedIn:</b> {profile.linkedin}</p>
              <p><b>GitHub:</b> {profile.github}</p>
              <p><b>LeetCode:</b> {profile.leetcode}</p>
            </div>

            {profile.resume && (
              <a
                href={`http://localhost:5000/${profile.resume}`}
                target="_blank"
                className="text-blue-500 block mt-3"
              >
                View Resume
              </a>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default StudentDetails;