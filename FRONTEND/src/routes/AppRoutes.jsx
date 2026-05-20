// FRONTEND/src/routes/AppRoutes.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Auth
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ProfessorLogin from "../pages/auth/ProfessorLogin";

// Student
import StudentDashboard from "../pages/student/Dashboard";
import StudentProfile from "../pages/student/Profile";
import EditProfile from "../pages/student/EditProfile";
import ChangePassword from "../pages/student/ChangePassword";

// Professor
import ProfessorDashboard from "../pages/professor/Dashboard";
import StudentsList from "../pages/professor/StudentsList";
import StudentDetails from "../pages/professor/StudentDetails";
import Leaderboard from "../pages/professor/Leaderboard";

// Layout + Protection
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public — student facing */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Hidden professor login — share this URL only with professors */}
        {/* URL: /prof-access-9x2k */}
        <Route path="/prof-access-9x2k" element={<ProfessorLogin />} />

        {/* Student routes */}
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
          <Route path="change-password" element={<ChangePassword />} />
        </Route>

        {/* Professor routes */}
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
          <Route path="leaderboard/:batch" element={<Leaderboard />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
