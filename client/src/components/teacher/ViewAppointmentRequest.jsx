import { useEffect, useState } from "react";
import {
  getAppointmentRequests,
  updateAppointmentStatus,
} from "../../api/services/teacherServices";

const ViewAppointmentRequest = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await getAppointmentRequests();
        setAppointments(response?.message || []);
      } catch (error) {
        setError("Failed to fetch appointment requests.", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    if (
      !window.confirm(
        `Are you sure you want to mark this appointment as ${status}?`
      )
    )
      return;

    try {
      await updateAppointmentStatus(id, { status });
      setAppointments((prev) =>
        prev.map((app) => (app._id === id ? { ...app, status } : app))
      );
      alert(`Appointment ${status} successfully!`);
    } catch (error) {
      alert("Failed to update appointment status.", error);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (appointments.length === 0)
    return (
      <p className="text-center text-gray-500">No appointment requests.</p>
    );

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Appointment Requests</h2>
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
              <th className="border px-4 py-2">Actions</th>
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
                <td className="border px-4 py-2 flex justify-center gap-3">
                  {appointment.status === "pending" && (
                    <>
                      <button
                        onClick={() =>
                          handleStatusUpdate(appointment._id, "approved")
                        }
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          handleStatusUpdate(appointment._id, "rejected")
                        }
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewAppointmentRequest;
