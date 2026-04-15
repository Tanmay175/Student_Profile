import { useParams } from "react-router-dom";

function StudentDetails() {
  const { id } = useParams();

  return (
    <div className="max-w-xl">
      <h2 className="text-2xl mb-4">Student Details</h2>

      <div className="card p-4 bg-base-100 shadow">
        <p><b>ID:</b> {id}</p>
        <p><b>Name:</b> Rahul</p>
        <p><b>Email:</b> rahul@gmail.com</p>

        <div className="mt-3">
          <p><b>LinkedIn:</b> link</p>
          <p><b>GitHub:</b> link</p>
          <p><b>LeetCode:</b> link</p>
        </div>

        <button className="btn btn-primary mt-3">
          Download Resume
        </button>
      </div>
    </div>
  );
}

export default StudentDetails;