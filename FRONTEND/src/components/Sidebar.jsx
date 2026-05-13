// FRONTEND/src/components/Sidebar.jsx
import { Link } from "react-router-dom";

function Sidebar({ role }) {
  return (
    <div className="w-64 bg-base-100 shadow-md p-4 hidden md:block">
      <ul className="menu">
        {role === "student" && (
          <>
            <li><Link to="/student/dashboard">Dashboard</Link></li>
            <li><Link to="/student/profile">Profile</Link></li>
            <li><Link to="/student/change-password">🔒 Change Password</Link></li>
          </>
        )}

        {role === "professor" && (
          <>
            <li><Link to="/professor/dashboard">Batches</Link></li>
            {/* ✅ FIXED: was commented out */}
            {/* Note: leaderboard is per-batch, so link goes to dashboard 
                where professor picks a batch, then clicks the leaderboard button */}
          </>
        )}
      </ul>
    </div>
  );
}

export default Sidebar;