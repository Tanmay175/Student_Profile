import { Link } from "react-router-dom";

function Sidebar({ role }) {
  return (
    <div className="w-64 bg-base-100 shadow-md p-4 hidden md:block">
      <ul className="menu">
        {role === "student" && (
          <>
            <li><Link to="/student/dashboard">Dashboard</Link></li>
            <li><Link to="/student/profile">Profile</Link></li>
            <li><Link to="/student/change-password">🔒 Change Password</Link></li> {/* ✅ NEW */}
          </>
        )}

        {role === "professor" && (
          <>
            <li><Link to="/professor/dashboard">Batches</Link></li>
            {/* <li><Link to="/professor/leaderboard">🏆 Leaderboard</Link></li>  ✅ ADD THIS LINE */}
          </>
        )}
      </ul>
    </div>
  );
}

export default Sidebar;