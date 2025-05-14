import {
  AllTeacher,
  AppointmentStatus,
  BookAppointment,
  DailyAppointmentList,
  PastAppointmentList,
  UpcomingAppointmentList,
} from "./index";
import { Header } from "../index";
import { CustomAlert } from "../../common/components";
import { useStudentDashboard } from "../../hooks/student";

export const StudentDashboard = () => {
  const {
    selectedOption,
    setSelectedOption,
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    logoutAlertOpen,
    setLogoutAlertOpen,
    showLogoutConfirmation,
    alertMessage,
    handleLogout,
    handleSearch,
  } = useStudentDashboard();

  return (
    <div className="flex flex-col h-screen w-full">
      <Header title="Student Dashboard" showLogoutConfirmation={showLogoutConfirmation}  />
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
                className="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded cursor-pointer"
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
                className="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded cursor-pointer"
                onClick={() => setSelectedOption("bookAppointment")}
              >
                Book an Appointment
              </button>
            </li>

            <li>
              <button
                className="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded cursor-pointer"
                onClick={() => setSelectedOption("appointmentStatus")}
              >
                Appointment Status
              </button>
            </li>
            <li>
              <button
                className="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded cursor-pointer"
                onClick={() => setSelectedOption("dailyAppointmentSchedule")}
              >
                Daily Appointment List
              </button>
            </li>

            <li>
              <button
                className="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded cursor-pointer"
                onClick={() => setSelectedOption("pastAppointmentHistory")}
              >
                Past Appointment History
              </button>
            </li>

            <li>
              <button
                className="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded cursor-pointer"
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
