import { useViewAppointmentRequest } from "../../hooks/teacher";
import { CustomAlert, CustomPagination } from "../../common/components";

const ViewAppointmentRequest = () => {
  const {
    appointments,
    currentPage,
    totalPages,
    setCurrentPage,
    loading,
    error,
    alertOpen,
    setAlertOpen,
    alertMessage,
    confirmOpen,
    setConfirmOpen,
    showConfirmation,
    handleStatusUpdate,
  } = useViewAppointmentRequest();

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (appointments.length === 0)
    return (
      <p className="text-center text-gray-500">No appointment requests.</p>
    );
  const hasPending = appointments.some(
    (appointment) => appointment.status === "pending"
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Appointment Requests</h2>
      <CustomAlert
        open={confirmOpen}
        setOpen={setConfirmOpen}
        onConfirm={handleStatusUpdate}
        {...alertMessage}
      />
      <CustomAlert open={alertOpen} setOpen={setAlertOpen} {...alertMessage} />
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Student Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Course</th>
              <th className="border px-4 py-2">Agenda</th>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Slots</th>
              <th className="border px-4 py-2">Status</th>
              {hasPending && <th className="border px-4 py-2">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment._id} className="text-center">
                <td className="border px-4 py-2">
                  {appointment.student?.name || "N/A"}
                </td>
                <td className="border px-4 py-2">
                  {appointment.student?.email || "N/A"}
                </td>
                <td className="border px-4 py-2">
                  {appointment.course || "N/A"}
                </td>
                <td className="border px-4 py-2">
                  {appointment.agenda || "N/A"}
                </td>
                <td className="border px-4 py-2">
                  {appointment.date
                    ? new Date(appointment.date).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="border px-4 py-2">
                  {appointment.slots
                    ? `${appointment.slots.startTime} - ${appointment.slots.endTime}`
                    : "N/A"}
                </td>

                <td className="border px-4 py-2 font-bold">
                  {appointment.status === "approved" ? (
                    <span className="text-green-600">Approved</span>
                  ) : appointment.status === "rejected" ? (
                    <span className="text-red-600">Rejected</span>
                  ) : (
                    <span className="text-yellow-500">Pending</span>
                  )}
                </td>
                {hasPending && (
                  <td className="border px-4 py-2 flex justify-center gap-3">
                    {appointment.status === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            showConfirmation(appointment._id, "approved")
                          }
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            showConfirmation(appointment._id, "rejected")
                          }
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition cursor-pointer"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CustomPagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default ViewAppointmentRequest;
