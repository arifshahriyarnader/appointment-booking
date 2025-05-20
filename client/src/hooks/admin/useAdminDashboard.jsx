import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { appConfig } from "../../common/config";
import { authServices } from "../../auth";

export const useAdminDashboard =() => {
  const [selectedOption, setSelectedOption] = useState(
    "viewRegistrationRequest"
  );
  const [logoutAlertOpen, setLogoutAlertOpen] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => {
    const user = JSON.parse(localStorage.getItem(appConfig.CURRENT_USER_KEY));
    authServices.logout();
    localStorage.removeItem(user);
    navigate("/login");
  };
  const showLogoutConfirmation = () => {
    setLogoutAlertOpen(true);
  };
  return {
    selectedOption,
    setSelectedOption,
    logoutAlertOpen,
    setLogoutAlertOpen,
    handleLogout,
    showLogoutConfirmation,
  };
}
