import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

function Navbar({ role, onMenuClick }) {
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (role !== "student") return;
    const fetchUnread = async () => {
      try {
        const res = await api.get("/api/notifications/unread-count");
        setUnread(res.data.count);
      } catch { }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [role]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div className="navbar bg-base-100 border-b border-base-200 px-3 sticky top-0 z-30 min-h-[56px]">
      {/* Hamburger — mobile only */}
      <button
        className="btn btn-ghost btn-sm btn-square md:hidden"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Brand */}
      <div className="flex-1 px-2">
        <span className="text-lg font-bold text-primary">StuTrack</span>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-1">
        {role === "student" && (
          <Link to="/student/notifications" className="btn btn-ghost btn-sm btn-square relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unread > 0 && (
              <span className="absolute top-0 right-0 bg-error text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold leading-none">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </Link>
        )}

        <button onClick={handleLogout} className="btn btn-error btn-sm gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="hidden sm:inline text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
}

export default Navbar;
