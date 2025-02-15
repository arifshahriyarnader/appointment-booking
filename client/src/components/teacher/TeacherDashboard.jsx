import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { appConfig } from "../../common/config";
import { authServices } from "../../auth";
import AddSlot from "./AddSlot";
import GetAllSlots from "./GetAllSlots";
import ViewAppointmentRequest from "./ViewAppointmentRequest";
import DailyAppointmentSehedules from "./DailyAppointmentSehedules";
import UpcomingAppointmentSchedule from "./UpcomingAppointmentSchedule";

export const TeacherDashboard = () => {
  const [selectedOption, setSelectedOption] = useState("addSlot");
  const navigate = useNavigate();

  
  const handleLogout = () => {
    const user=JSON.parse(localStorage.getItem(appConfig.CURRENT_USER_KEY))
    authServices.logout();
    localStorage.removeItem(user);
    alert("Logged out successfully!");
    navigate("/login");
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold">Teacher Dashboard</h2>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
        >
          Logout
        </button>
      </header>

      <div className="flex flex-grow">
        {/* Left Sidebar */}
        <div className="w-1/4 bg-gray-800 text-white p-4">
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
          </ul>
        </div>

        {/* Right Content Area */}
        <div className="w-3/4 p-6 bg-gray-100">
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
        </div>
      </div>
    </div>
  );
};
