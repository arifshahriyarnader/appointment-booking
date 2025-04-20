import { CustomAlert } from "../../common/components";
import { useViewRegistrationRequest } from "../../hooks/admin";

const ViewRegistrationRequest = () => {
  const {
    requests,
    alertOpen,
    setAlertOpen,
    alertMessage,
    confirmOpen,
    setConfirmOpen,
    showConfirmation,
    handleUpdateStatus,
  } = useViewRegistrationRequest();
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">User Registration Requests</h2>
      {/* confirmation alert */}
      <CustomAlert
        open={confirmOpen}
        setOpen={setConfirmOpen}
        onConfirm={handleUpdateStatus}
        {...alertMessage}
      />
      {/* result alert */}
      <CustomAlert open={alertOpen} setOpen={setAlertOpen} {...alertMessage} />
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Department</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">Course/Student ID</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  No pending requests
                </td>
              </tr>
            ) : (
              requests.map((user) => (
                <tr key={user._id} className="border-b">
                  <td className="border p-2">{user.name}</td>
                  <td className="border p-2">{user.email}</td>
                  <td className="border p-2">{user.department}</td>
                  <td className="border p-2">{user.role}</td>
                  <td className="border p-2">
                    {user.role === "teacher" ? user.course : user.studentId}
                  </td>
                  <td className="border p-2">{user.status}</td>
                  <td className="border p-2">
                    {user.status === "pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => showConfirmation(user._id, "approved")}
                          className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => showConfirmation(user._id, "rejected")}
                          className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewRegistrationRequest;
