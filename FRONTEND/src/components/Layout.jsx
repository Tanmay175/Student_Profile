import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Layout({ role }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      <Navbar role={role} onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar — hidden on mobile */}
        <Sidebar role={role} />

        {/* Mobile dim overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Mobile slide-in drawer */}
        <div className={`fixed top-0 left-0 h-full w-72 max-w-[85vw] bg-base-100 shadow-2xl z-50
          transition-transform duration-300 ease-in-out md:hidden
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-base-200">
            <span className="text-xl font-bold text-primary">StuTrack</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="btn btn-ghost btn-sm btn-circle"
            >✕</button>
          </div>
          <Sidebar role={role} onNavigate={() => setSidebarOpen(false)} mobile />
        </div>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
