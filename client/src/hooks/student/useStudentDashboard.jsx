import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { appConfig } from "../../common/config";
import { authServices } from "../../auth";
import { searchTeachers } from "../../api/services/studentServices";

export const useStudentDashboard = () => {
  const [selectedOption, setSelectedOption] = useState("allTeacher");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [logoutAlertOpen, setLogoutAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState({
    title: "",
    description: "",
  });
  const navigate = useNavigate();

  const handleLogout = () => {
    const user = JSON.parse(localStorage.getItem(appConfig.CURRENT_USER_KEY));
    authServices.logout();
    localStorage.removeItem(user);
    navigate("/login");
  };
  const showLogoutConfirmation = () => {
    setAlertMessage({
      title: "Confirm Logout",
      description: "Are you sure you want to logout?",
      showCancel: true,
    });
    setLogoutAlertOpen(true);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const results = await searchTeachers(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error("Error during search:", error);
    }
    console.log("Searching for:", searchQuery);
  };

  return {
    selectedOption,
    setSelectedOption,
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    logoutAlertOpen,
    setLogoutAlertOpen,
    alertMessage,
    handleLogout,
    showLogoutConfirmation,
    handleSearch,
  };
};
