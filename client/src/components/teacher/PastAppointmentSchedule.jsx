import { useEffect, useState } from "react";
import { pastAppointmentSchedule } from "../../api/services/teacherServices";

const PastAppointmentSchedule = () => {
  const [pastAppointments, setPastAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await pastAppointmentSchedule();
        setPastAppointments(data?.pastAppointments || []);
      } catch (error) {
        setError("Failed to daily appointments schedule", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) return <p>Loading past appointments history...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Past Appointment History</h2>
      {pastAppointments.length === 0 ? (
        <p className="text-gray-500">You have no past appointment histroy</p>
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
            {pastAppointments.map((pastAppointment) => (
              <tr key={pastAppointment._id} className="text-center">
                <td className="border p-2">{pastAppointment.student.name}</td>
                <td className="border p-2">{pastAppointment.student.email}</td>
                <td className="border p-2">{pastAppointment.course}</td>
                <td className="border p-2">{pastAppointment.agenda}</td>
                <td className="border p-2">
                  {" "}
                  {pastAppointment.date
                    ? new Date(pastAppointment.date).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="border p-2 whitespace-nowrap">
                  {pastAppointment.slots.startTime} -{" "}
                  {pastAppointment.slots.endTime}
                </td>
                <td className="border p-2 text-green-500 font-bold">
                  {pastAppointment.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PastAppointmentSchedule;
