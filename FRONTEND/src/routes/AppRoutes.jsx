import { BrowserRouter, Routes, Route } from "react-router-dom";

// Auth
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// Student
import StudentDashboard from "../pages/student/Dashboard";
import StudentProfile from "../pages/student/Profile";
import EditProfile from "../pages/student/EditProfile";

// Professor
import ProfessorDashboard from "../pages/professor/Dashboard";
import StudentsList from "../pages/professor/StudentsList";
import StudentDetails from "../pages/professor/StudentDetails";
import Leaderboard from "../pages/professor/Leaderboard";   // ✅ ADD THIS LINE

// Layout + Protection
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student */}
        <Route
          path="/student/*"
          element={
            <ProtectedRoute role="student">
              <Layout role="student" />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="edit" element={<EditProfile />} />
        </Route>

        {/* Professor */}
        <Route
          path="/professor/*"
          element={
            <ProtectedRoute role="professor">
              <Layout role="professor" />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<ProfessorDashboard />} />
          <Route path="batch/:year" element={<StudentsList />} />
          <Route path="student/:id" element={<StudentDetails />} />
          <Route path="leaderboard/:batch" element={<Leaderboard />} />  {/* ✅ ADD THIS LINE */}
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;