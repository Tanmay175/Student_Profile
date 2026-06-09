import { NavLink, useNavigate } from "react-router-dom";

function Sidebar({ role, onNavigate }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
     ${isActive ? "bg-primary text-primary-content" : "hover:bg-base-200 text-base-content"}`;

  return (
    <aside className="w-64 bg-base-100 shadow-md p-4 hidden md:flex md:flex-col shrink-0">
      <ul className="menu menu-sm flex-1 gap-1">
        {role === "student" && (
          <>
            <li><NavLink to="/student/dashboard" className={linkClass} onClick={onNavigate}>🏠 Dashboard</NavLink></li>
            <li><NavLink to="/student/profile" className={linkClass} onClick={onNavigate}>👤 Profile</NavLink></li>
            <li><NavLink to="/student/edit" className={linkClass} onClick={onNavigate}>✏️ Edit Profile</NavLink></li>
            <li><NavLink to="/student/notifications" className={linkClass} onClick={onNavigate}>🔔 Notifications</NavLink></li>
            <li><NavLink to="/student/change-password" className={linkClass} onClick={onNavigate}>🔒 Change Password</NavLink></li>
          </>
        )}
        {role === "professor" && (
          <>
            <li><NavLink to="/professor/dashboard" className={linkClass} onClick={onNavigate}>📚 Batches</NavLink></li>
            <li><NavLink to="/professor/notifications" className={linkClass} onClick={onNavigate}>🔔 Send Notification</NavLink></li>
          </>
        )}
      </ul>
      <button onClick={handleLogout} className="btn btn-error btn-sm btn-outline w-full mt-4">Logout</button>
    </aside>
  );
}

export default Sidebar;
