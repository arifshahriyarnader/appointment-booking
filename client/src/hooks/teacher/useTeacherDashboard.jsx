import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { appConfig } from "../../common/config";
import { authServices } from "../../auth";

export const useTeacherDashboard = () => {
  const [selectedOption, setSelectedOption] = useState("addSlot");
  const [logoutAlertOpen, setLogoutAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState({
    title: "",
    description: "",
  });
  const navigate = useNavigate();
  const showLogooutConfirmation = () => {
    setAlertMessage({
      title: "Confirm Logout",
      description: "Are you sure you want to Logout?",
      showCancel: true,
    });
    setLogoutAlertOpen(true);
  };
  const handleLogout = () => {
    const user = JSON.parse(localStorage.getItem(appConfig.CURRENT_USER_KEY));
    authServices.logout();
    localStorage.removeItem(user);
    navigate("/login");
  };

  return {
    selectedOption,
    setSelectedOption,
    logoutAlertOpen,
    setLogoutAlertOpen,
    alertMessage,
    showLogooutConfirmation,
    handleLogout,
  };
};
