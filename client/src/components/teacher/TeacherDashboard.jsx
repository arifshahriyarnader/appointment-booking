import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { appConfig } from "../../common/config";
import { authServices } from "../../auth";
import {
  AddSlot,
  GetAllSlots,
  ViewAppointmentRequest,
  DailyAppointmentSehedules,
  UpcomingAppointmentSchedule,
  PastAppointmentSchedule,
} from "./index";
import { CustomAlert } from "../../common/components";

export const TeacherDashboard = () => {
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

  return (
    <div className="flex flex-col h-screen w-full">
      {/* Header */}
      <header className="flex justify-between items-center bg-gray-800 text-white p-4 w-full">
        <h2 className="text-xl font-bold">Teacher Dashboard</h2>
        <button
          onClick={showLogooutConfirmation}
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
        >
          Logout
        </button>
      </header>
      <CustomAlert
        open={logoutAlertOpen}
        setOpen={setLogoutAlertOpen}
        onConfirm={handleLogout}
        {...alertMessage}
      />

      <div className="flex flex-grow w-full">
        {/* Left Sidebar */}
        <div className="w-1/4 bg-gray-800 text-white p-4 min-h-screen">
          <ul className="space-y-2">
            <li>
              <button
                className="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded"
                onClick={() => setSelectedOption("addSlot")}
              >
                Add Slots
              </button>
            </li>
            <li>
              <button
                className="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded"
                onClick={() => setSelectedOption("getAllSlots")}
              >
                Get All Slots
              </button>
            </li>
            <li>
              <button
                className="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded"
                onClick={() => setSelectedOption("viewAppointmentRequest")}
              >
                View Appointment Request
              </button>
            </li>
            <li>
              <button
                className="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded"
                onClick={() => setSelectedOption("dailyAppointmentSchedule")}
              >
                Daily Appointment Schedule
              </button>
            </li>
            <li>
              <button
                className="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded"
                onClick={() => setSelectedOption("upcomingAppointmentSchedule")}
              >
                Upcoming Appointment Schedule
              </button>
            </li>
            <li>
              <button
                className="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded"
                onClick={() => setSelectedOption("pastAppointmentSchedule")}
              >
                Past Appointments List
              </button>
            </li>
          </ul>
        </div>

        {/* Right Content Area */}
        <div className="w-4/5 p-6 bg-gray-100 min-h-screen">
          {selectedOption === "addSlot" && <AddSlot />}
          {selectedOption === "getAllSlots" && <GetAllSlots />}
          {selectedOption === "viewAppointmentRequest" && (
            <ViewAppointmentRequest />
          )}
          {selectedOption === "dailyAppointmentSchedule" && (
            <DailyAppointmentSehedules />
          )}
          {selectedOption === "upcomingAppointmentSchedule" && (
            <UpcomingAppointmentSchedule />
          )}
          {selectedOption === "pastAppointmentSchedule" && (
            <PastAppointmentSchedule />
          )}
        </div>
      </div>
    </div>
  );
};
