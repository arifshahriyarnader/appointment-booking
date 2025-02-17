import { useState } from "react";
import PropTypes from "prop-types";
import { updateAvailhours } from "../../api/services/teacherServices";
import { Pencil } from "lucide-react";

const UpdateAvailableHours = ({ availableHours, fetchAvailableHours }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState(null);
  const [formData, setFormData] = useState({
    date: "",
    day: "",
    startTime: "",
    endTime: "",
  });

  // Open Modal & Pre-fill Form Data
  const handleEdit = (hour) => {
    setSelectedHour(hour);

    // Ensure slots exist before extracting times
    const firstSlot =
      hour.slots.length > 0 ? hour.slots[0] : { startTime: "", endTime: "" };
    const lastSlot =
      hour.slots.length > 0
        ? hour.slots[hour.slots.length - 1]
        : { startTime: "", endTime: "" };

    // Convert date to YYYY-MM-DD format
    const formattedDate = hour.date
      ? new Date(hour.date).toISOString().split("T")[0]
      : "";

    setFormData({
      date: formattedDate,
      day: hour.day || "",
      startTime: firstSlot.startTime,
      endTime: lastSlot.endTime,
    });

    setIsModalOpen(true);
  };

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.startTime >= formData.endTime) {
      return alert("Start time must be earlier than end time.");
    }

    try {
      const updatedData = {
        date: formData.date,
        day: formData.day,
        startTime: formData.startTime,
        endTime: formData.endTime,
      };

      await updateAvailhours(selectedHour._id, updatedData);

      fetchAvailableHours();

      setIsModalOpen(false);
      alert("Available hour updated successfully!");
    } catch (error) {
      console.error("Update failed:", error);
      alert(
        "Failed to update. " + (error.response?.data?.message || "Try again.")
      );
    }
  };

  return (
    <div>
      {/* Available Hours List */}
      {availableHours.map((hour) => (
        <div
          key={hour._id}
          className="flex items-center justify-between p-2 border rounded"
        >
          <p>
            {hour.date ? `📅 ${hour.date}, ` : ""} 🗓 {hour.day} -{" "}
            {hour.slots.length} slots
          </p>
          <button
            onClick={() => handleEdit(hour)}
            className="p-1.5 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition"
          >
            <Pencil size={18} />
          </button>
        </div>
      ))}

      {/* Modal for Editing */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg shadow-lg w-full max-w-md">
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

// Define PropTypes to fix missing prop validation warnings
UpdateAvailableHours.propTypes = {
  availableHours: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      date: PropTypes.string,
      day: PropTypes.string.isRequired,
      slots: PropTypes.arrayOf(
        PropTypes.shape({
          startTime: PropTypes.string.isRequired,
          endTime: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
  fetchAvailableHours: PropTypes.func.isRequired,
};

export default UpdateAvailableHours;
