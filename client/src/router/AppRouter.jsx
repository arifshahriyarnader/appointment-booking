import { Route, Routes } from "react-router-dom";
import {
  AdminDashboardPage,
  SigninPage,
  SignupPage,
  StudentDashboardPage,
  TeacherDashboardPage,
  TeacherProfilePage,
} from "../pages";
import SecureRoute from "./SecureRoute";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<SignupPage />} />
      <Route path="/login" element={<SigninPage />} />
      <Route
        path="/teacher-dashboard"
        element={
          <SecureRoute>
            <TeacherDashboardPage />
          </SecureRoute>
        }
      />
      <Route
        path="/student-dashboard"
        element={
          <SecureRoute>
            <StudentDashboardPage />
          </SecureRoute>
        }
      />
      <Route
        path="/teacher-profile/:teacherId"
        element={
          <SecureRoute>
            <TeacherProfilePage />
          </SecureRoute>
        }
      />
      <Route
        path="/admin-dashboard"
        element={
          <SecureRoute>
            <AdminDashboardPage />
          </SecureRoute>
        }
      />
    </Routes>
  );
};

export default AppRouter;
