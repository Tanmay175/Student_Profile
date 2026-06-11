import { NavLink, useNavigate } from "react-router-dom";

function Sidebar({ role, onNavigate, mobile }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
     ${isActive
       ? "bg-primary text-primary-content shadow-sm"
       : "hover:bg-base-200 text-base-content"
     }`;

  const links = role === "student" ? [
    { to: "/student/dashboard",     label: "Dashboard",       icon: "🏠" },
    { to: "/student/profile",       label: "My Profile",      icon: "👤" },
    { to: "/student/edit",          label: "Edit Profile",    icon: "✏️" },
    { to: "/student/notifications", label: "Notifications",   icon: "🔔" },
    { to: "/student/change-password", label: "Change Password", icon: "🔒" },
  ] : [
    { to: "/professor/dashboard",     label: "Batches",           icon: "📚" },
    { to: "/professor/notifications", label: "Send Notification", icon: "🔔" },
  ];

  return (
    <aside className={`bg-base-100 p-4 flex flex-col shrink-0
      ${mobile ? "w-full h-full" : "w-64 hidden md:flex shadow-sm border-r border-base-200"}`}
    >
      <nav className="flex-1">
        <ul className="space-y-1">
          {links.map(({ to, label, icon }) => (
            <li key={to}>
              <NavLink to={to} className={linkClass} onClick={onNavigate}>
                <span className="text-base">{icon}</span>
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <button
        onClick={handleLogout}
        className="btn btn-error btn-outline w-full mt-4 gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;
