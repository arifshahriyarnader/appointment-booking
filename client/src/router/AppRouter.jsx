import { Route, Routes } from "react-router-dom";
import { SigninPage, SignupPage, TeacherDashboardPage } from "../pages";
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
    </Routes>
  );
};

export default AppRouter;
