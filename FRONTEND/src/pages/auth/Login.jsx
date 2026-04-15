import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-4">Login</h2>

        <input type="email" placeholder="Email" className="input input-bordered w-full mb-3" />
        <input type="password" placeholder="Password" className="input input-bordered w-full mb-3" />

        <button className="btn btn-primary w-full">Login</button>

        <p className="mt-3 text-sm">
          Don't have an account? <Link to="/register" className="text-blue-500">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;