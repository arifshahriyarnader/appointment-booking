import {
  AddStudent,
  AddTeacher,
  GetAllStudent,
  GetAllTeacher,
  ViewRegistrationRequest,
} from "./index";
import { Header } from "../index";
import { CustomAlert } from "../../common/components";
import { useAdminDashboard } from "../../hooks/admin";

export const AdminDashboard = () => {
  const {
    selectedOption,
    setSelectedOption,
    logoutAlertOpen,
    setLogoutAlertOpen,
    handleLogout,
    showLogoutConfirmation,
  } = useAdminDashboard();

  return (
    <div className="flex flex-col h-screen w-full">
      <Header
        title="Admin Dashboard"
        showLogoutConfirmation={showLogoutConfirmation}
      />

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

        {/* Right Sidebar */}
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
