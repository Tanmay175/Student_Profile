function Navbar() {
  return (
    <div className="navbar bg-base-200 px-4">
      <div className="flex-1">
        <h1 className="text-xl font-bold">StuTrack</h1>
      </div>
      <button className="btn btn-error btn-sm">Logout</button>
    </div>
  );
}

export default Navbar;