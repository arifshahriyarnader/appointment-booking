import { useEffect, useState } from "react";
import {
  getAllAvailhours,
  deleteAvailhours,
  updateAvailhours,
} from "../../api/services/teacherServices";
import { Pencil, Trash2 } from "lucide-react";

const GetAllSlots = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [formData, setFormData] = useState({
    date: "",
    day: "",
    startTime: "",
    endTime: "",
  });

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const data = await getAllAvailhours();
        setSlots(data?.availableHours || []);
      } catch (error) {
        setError("Failed to load slots", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, []);

  // Handle Edit Button Click (Open Modal)
  const handleEdit = (slot) => {
    setSelectedSlot(slot);

    setFormData({
      date: slot.date ? new Date(slot.date).toISOString().split("T")[0] : "",
      day: slot.day || "",
      startTime: slot.slots.length > 0 ? slot.slots[0].startTime : "",
      endTime:
        slot.slots.length > 0 ? slot.slots[slot.slots.length - 1].endTime : "",
    });

    setIsModalOpen(true);
  };

  // Handle Form Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateTimeSlots = (startTime, endTime) => {
    const slots = [];
    let start = new Date(`1970-01-01T${startTime}:00`);
    let end = new Date(`1970-01-01T${endTime}:00`);

    while (start < end) {
      let nextSlot = new Date(start.getTime() + 20 * 60000); // Add 20 minutes

      slots.push({
        startTime: formatAMPM(start),
        endTime: formatAMPM(nextSlot),
      });

      start = nextSlot;
    }

    return slots;
  };

  // Helper function to format time in 12-hour AM/PM format
  const formatAMPM = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert 0-hour (midnight) to 12
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return `${hours}:${minutes} ${ampm}`;
  };

  // Handle Update Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.startTime >= formData.endTime) {
      return alert("Start time must be earlier than end time.");
    }

    try {
      await updateAvailhours(selectedSlot._id, {
        date: formData.date,
        day: formData.day,
        startTime: formData.startTime,
        endTime: formData.endTime,
      });

      setSlots((prev) =>
        prev.map((s) =>
          s._id === selectedSlot._id
            ? {
                ...s,
                date: formData.date,
                day: formData.day,
                slots: generateTimeSlots(formData.startTime, formData.endTime),
              }
            : s
        )
      );

      setIsModalOpen(false);
      alert("Available hour updated successfully!");
    } catch (error) {
      alert(
        "Failed to update. " + (error.response?.data?.message || "Try again.")
      );
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this available hour?"))
      return;
    try {
      await deleteAvailhours(id);
      setSlots((prev) => prev.filter((slot) => slot._id !== id));
      alert("Available hour deleted successfully!");
    } catch (error) {
      alert(
        "Failed to delete. " + (error.response?.data?.message || "Try again.")
      );
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Teacher Available Hours</h2>
      {slots.length === 0 ? (
        <p className="text-center text-gray-600 text-base">No slots found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Department</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Day</th>
                <th className="border px-4 py-2">Slots</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {slots.map((slot) => (
                <tr key={slot._id} className="text-center">
                  <td className="border px-4 py-2">{slot.teacher.name}</td>
                  <td className="border px-4 py-2">
                    {slot.teacher.department}
                  </td>
                  <td className="border px-4 py-2">
                    {new Date(slot.date).toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2">{slot.day}</td>
                  <td className="border px-4 py-2">
                    {slot.slots
                      .map((s) => `${s.startTime}-${s.endTime}`)
                      .join(", ")}
                  </td>
                  <td className="border px-4 py-2 flex justify-center gap-3">
                    <button
                      onClick={() => handleEdit(slot)}
                      className="p-1.5 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(slot._id)}
                      className="p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold">Edit Available Hour</h2>
            <form onSubmit={handleSubmit}>
              <label className="block mt-2">Date:</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />

              <label className="block mt-2">Day:</label>
              <input
                type="text"
                name="day"
                value={formData.day}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />

              <label className="block mt-2">Start Time:</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />

              <label className="block mt-2">End Time:</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mr-2 bg-gray-300 px-3 py-1 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetAllSlots;
