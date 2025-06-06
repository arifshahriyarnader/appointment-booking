import {
  AddSlot,
  GetAllSlots,
  ViewAppointmentRequest,
  DailyAppointmentSehedules,
  UpcomingAppointmentSchedule,
  PastAppointmentSchedule,
} from "./index";
import { CustomAlert } from "../../common/components";
import { useTeacherDashboard } from "../../hooks/teacher";
import { Header } from "../index";

export const TeacherDashboard = () => {
  const {
    selectedOption,
    setSelectedOption,
    logoutAlertOpen,
    setLogoutAlertOpen,
    alertMessage,
    showLogooutConfirmation,
    handleLogout,
  } = useTeacherDashboard();

  return (
    <div className="flex flex-col h-screen w-full">
      <Header
        title="Teacher Dashboard"
        showLogoutConfirmation={showLogooutConfirmation}
      />
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
                className="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded cursor-pointer"
                onClick={() => setSelectedOption("addSlot")}
              >
                Add Slots
              </button>
            </li>
            <li>
              <button
                className="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded cursor-pointer"
                onClick={() => setSelectedOption("getAllSlots")}
              >
                Get All Slots
              </button>
            </li>
            <li>
              <button
                className="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded cursor-pointer"
                onClick={() => setSelectedOption("viewAppointmentRequest")}
              >
                View Appointment Request
              </button>
            </li>
            <li>
              <button
                className="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded cursor-pointer"
                onClick={() => setSelectedOption("dailyAppointmentSchedule")}
              >
                Daily Appointment Schedule
              </button>
            </li>
            <li>
              <button
                className="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded cursor-pointer"
                onClick={() => setSelectedOption("upcomingAppointmentSchedule")}
              >
                Upcoming Appointment Schedule
              </button>
            </li>
            <li>
              <button
                className="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded cursor-pointer"
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
