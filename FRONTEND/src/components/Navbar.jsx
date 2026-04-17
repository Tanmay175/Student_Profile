import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    navigate("/");
  };

  return (
    <div className="navbar bg-base-200 px-4">
      <div className="flex-1">
        <h1 className="text-xl font-bold">StuTrack</h1>
      </div>
      <button onClick={handleLogout} className="btn btn-error btn-sm">
        Logout
      </button>
    </div>
  );
}

export default Navbar;