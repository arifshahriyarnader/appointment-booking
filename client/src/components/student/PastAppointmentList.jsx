import { CustomPagination } from "../../common/components";
import { usePastAppointment } from "../../hooks/student";

const PastAppointmentList = () => {
  const {
    appointments,
    currentPage,
    totalPages,
    setCurrentPage,
    loading,
    message,
  } = usePastAppointment();

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Past Appointments</h2>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : appointments.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Teacher Name</th>
              <th className="border border-gray-300 px-4 py-2">
                Teacher Email
              </th>
              <th className="border border-gray-300 px-4 py-2">Course</th>
              <th className="border border-gray-300 px-4 py-2">Agenda</th>
              <th className="border border-gray-300 px-4 py-2">Date</th>
              <th className="border border-gray-300 px-4 py-2">Time Slot</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment._id} className="border border-gray-300">
                <td className="border border-gray-300 px-4 py-2">
                  {appointment.teacher.name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {appointment.teacher.email}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {appointment.teacher.course}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {appointment.agenda}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(appointment.date).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {appointment.slots?.startTime} - {appointment.slots?.endTime}
                </td>
                <td
                  className={`border border-gray-300 px-4 py-2 font-semibold 
                    ${
                      appointment.status === "Completed"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                >
                  {appointment.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-red-500 text-center mt-4">{message}</p>
      )}
      <CustomPagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default PastAppointmentList;
