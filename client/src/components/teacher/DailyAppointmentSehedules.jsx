import { useDailyAppointment } from "../../hooks/teacher";

const DailyAppointmentSchedules = () => {
  const { appointments, loading, error } = useDailyAppointment();
  if (loading) return <p>Loading daily appointments...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Daily Appointment Schedule</h2>
      {appointments.length === 0 ? (
        <p className="text-gray-500">
          You have no appointment schedule for today
        </p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Student Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Course</th>
              <th className="border p-2">Agenda</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Time Slot</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment._id} className="text-center">
                <td className="border p-2">{appointment.student.name}</td>
                <td className="border p-2">{appointment.student.email}</td>
                <td className="border p-2">{appointment.teacher.course}</td>
                <td className="border p-2">{appointment.agenda}</td>
                <td className="border p-2">
                  {" "}
                  {appointment.date
                    ? new Date(appointment.date).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="border p-2 whitespace-nowrap">
                  {appointment.slots.startTime} - {appointment.slots.endTime}
                </td>
                <td className="border p-2 text-green-500 font-bold">
                  {appointment.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DailyAppointmentSchedules;
