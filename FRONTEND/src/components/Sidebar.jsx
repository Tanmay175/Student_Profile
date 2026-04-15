import { Link } from "react-router-dom";

function Sidebar({ role }) {
  return (
    <div className="w-64 bg-base-100 shadow-md p-4 hidden md:block">
      <ul className="menu">
        {role === "student" && (
          <>
            <li><Link to="/student/dashboard">Dashboard</Link></li>
            <li><Link to="/student/profile">Profile</Link></li>
          </>
        )}

        {role === "professor" && (
          <>
            <li><Link to="/professor/dashboard">Batches</Link></li>
          </>
        )}
      </ul>
    </div>
  );
}

export default Sidebar;