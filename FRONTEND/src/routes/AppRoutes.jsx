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

// Layout
import Layout from "../components/Layout";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student */}
        <Route element={<Layout role="student" />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/profile" element={<StudentProfile />} />
          <Route path="/student/edit" element={<EditProfile />} />
        </Route>

        {/* Professor */}
        <Route element={<Layout role="professor" />}>
          <Route path="/professor/dashboard" element={<ProfessorDashboard />} />
          <Route path="/professor/batch/:year" element={<StudentsList />} />
          <Route path="/professor/student/:id" element={<StudentDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;