import { Link } from "react-router-dom";

function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-4">Register</h2>

        <input type="text" placeholder="Name" className="input input-bordered w-full mb-3" />
        <input type="email" placeholder="Email" className="input input-bordered w-full mb-3" />
        <input type="password" placeholder="Password" className="input input-bordered w-full mb-3" />

        <select className="select select-bordered w-full mb-3">
          <option>Student</option>
          <option>Professor</option>
        </select>

        <input type="text" placeholder="Batch (if student)" className="input input-bordered w-full mb-3" />

        <button className="btn btn-primary w-full">Register</button>

        <p className="mt-3 text-sm">
          Already have an account? <Link to="/" className="text-blue-500">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;