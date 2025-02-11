import { Route, Routes } from "react-router-dom"; // Use Routes instead of Switch
import { SigninPage, SignupPage } from "../pages"; // Fix the typo "SiginPage" → "SigninPage"

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<SignupPage />} />
      <Route path="/login" element={<SigninPage />} />
    </Routes>
  );
};

export default AppRouter;
