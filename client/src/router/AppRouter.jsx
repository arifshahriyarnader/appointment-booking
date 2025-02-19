import { Route, Routes } from "react-router-dom";
import { SigninPage, SignupPage, StudentDashboardPage, TeacherDashboardPage } from "../pages";
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
    </Routes>
  );
};

export default AppRouter;
