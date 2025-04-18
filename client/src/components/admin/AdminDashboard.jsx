import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authServices } from "../../auth";
import { appConfig } from "../../common/config";
import {
  AddStudent,
  AddTeacher,
  GetAllStudent,
  GetAllTeacher,
  ViewRegistrationRequest,
} from "./index";
import { CustomAlert } from "../../common/components";

export const AdminDashboard = () => {
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
  return (
    <div className="flex flex-col h-screen w-full">
      {/* Header */}
      <header className="flex justify-between items-center bg-gray-800 text-white p-4 w-full">
        <h2 className="text-xl font-bold">Admin Dashboard</h2>
        <button
          onClick={showLogoutConfirmation}
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded cursor-pointer"
        >
          Logout
        </button>
      </header>

      {/* Logout Confirmation Alert */}
      <CustomAlert
        open={logoutAlertOpen}
        setOpen={setLogoutAlertOpen}
        title="Confirm Logout"
        description="Are you sure you want to logout?"
        showCancel={true}
        onConfirm={handleLogout}
      />

      <div className="flex flex-grow w-full">
        {/* Left Sidebar */}
        <div className="w-1/4 bg-gray-800 text-white p-4 min-h-screen">
          <ul className="space-y-2">
            <li>
              <button
                className="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded"
                onClick={() => setSelectedOption("viewRegistrationRequest")}
              >
                View Registration Request
              </button>
            </li>
            <li>
              <button
                className="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded"
                onClick={() => setSelectedOption("addTeacher")}
              >
                Add Teacher
              </button>
            </li>
            <li>
              <button
                className="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded"
                onClick={() => setSelectedOption("addStudent")}
              >
                Add Student
              </button>
            </li>
            <li>
              <button
                className="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded"
                onClick={() => setSelectedOption("getAllTeacher")}
              >
                Get All Teacher
              </button>
            </li>
            <li>
              <button
                className="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded"
                onClick={() => setSelectedOption("getAllStudent")}
              >
                Get All Student
              </button>
            </li>
          </ul>
        </div>

        {/* Right Content Area */}
        <div className="w-4/5 p-6 bg-gray-100 min-h-screen">
          {selectedOption === "viewRegistrationRequest" && (
            <ViewRegistrationRequest />
          )}
          {selectedOption === "addTeacher" && <AddTeacher />}
          {selectedOption === "addStudent" && <AddStudent />}
          {selectedOption === "getAllTeacher" && <GetAllTeacher />}
          {selectedOption === "getAllStudent" && <GetAllStudent />}
        </div>
      </div>
    </div>
  );
};
