import { Link } from "react-router-dom";

function Profile() {
  return (
    <div className="max-w-xl">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>

      <div className="card bg-base-100 shadow p-4">
        <p><b>Name:</b> Rahul</p>
        <p><b>Email:</b> rahul@gmail.com</p>
        <p><b>Batch:</b> 2026</p>

        <div className="mt-3">
          <p><b>LinkedIn:</b> link</p>
          <p><b>GitHub:</b> link</p>
          <p><b>LeetCode:</b> link</p>
        </div>

        <button className="btn btn-primary mt-4">
          <Link to="/student/edit">Edit Profile</Link>
        </button>
      </div>
    </div>
  );
}

export default Profile;