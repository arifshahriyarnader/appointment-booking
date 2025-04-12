import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { appConfig } from "../../common/config";
import { authServices } from "../../auth";
import {
  AllTeacher,
  AppointmentStatus,
  BookAppointment,
  DailyAppointmentList,
  PastAppointmentList,
  UpcomingAppointmentList,
} from "./index";
import { searchTeachers } from "../../api/services/studentServices";
import { CustomAlert } from "../../common/components";

export const StudentDashboard = () => {
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

  return (
    <div className="flex flex-col h-screen w-full">
      <header className="flex justify-between items-center bg-gray-800 text-white p-4 w-full">
        <h2 className="text-xl font-bold">Student Dashboard</h2>
        <button
          onClick={showLogoutConfirmation}
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded cursor-pointer"
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

      <div className="flex justify-end items-center p-4 bg-gray-100 w-full">
        <input
          type="text"
          placeholder="Search..."
          className="p-2 border border-gray-300 rounded-l-md w-1/3"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md"
        >
          Search
        </button>
      </div>

      <div className="flex flex-grow w-full">
        {/* Left Sidebar */}
        <div className="w-1/4 bg-gray-800 text-white p-4 min-h-screen">
          <ul className="space-y-2">
            <li>
              <button
                className="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded"
                onClick={() => {
                  setSelectedOption("allTeacher");
                  setSearchResults([]);
                }}
              >
                All Teacher
              </button>
            </li>

            <li>
              <button
                className="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded"
                onClick={() => setSelectedOption("bookAppointment")}
              >
                Book an Appointment
              </button>
            </li>

            <li>
              <button
                className="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded"
                onClick={() => setSelectedOption("appointmentStatus")}
              >
                Appointment Status
              </button>
            </li>
            <li>
              <button
                className="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded"
                onClick={() => setSelectedOption("dailyAppointmentSchedule")}
              >
                Daily Appointment List
              </button>
            </li>

            <li>
              <button
                className="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded"
                onClick={() => setSelectedOption("pastAppointmentHistory")}
              >
                Past Appointment History
              </button>
            </li>

            <li>
              <button
                className="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded"
                onClick={() => setSelectedOption("upcomingAppointmentSchedule")}
              >
                Upcoming Appointment List
              </button>
            </li>
          </ul>
        </div>

        {/* Right Content Area */}
        <div className="w-4/5 p-6 bg-gray-100 min-h-screen">
          {selectedOption === "allTeacher" && (
            <AllTeacher searchResults={searchResults} />
          )}
          {selectedOption === "bookAppointment" && <BookAppointment />}
          {selectedOption === "appointmentStatus" && <AppointmentStatus />}
          {selectedOption === "dailyAppointmentSchedule" && (
            <DailyAppointmentList />
          )}
          {selectedOption === "pastAppointmentHistory" && (
            <PastAppointmentList />
          )}
          {selectedOption === "upcomingAppointmentSchedule" && (
            <UpcomingAppointmentList />
          )}
        </div>
      </div>
    </div>
  );
};
