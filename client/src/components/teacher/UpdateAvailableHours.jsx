import PropTypes from "prop-types";

import { Pencil } from "lucide-react";
import { useUpdateAvailable } from "../../hooks/teacher";

const UpdateAvailableHours = ({ availableHours }) => {
  const {
    isModalOpen,
    setIsModalOpen,
    formData,
    handleEdit,
    handleChange,
    handleSubmit,
  } = useUpdateAvailable();

  return (
    <div>
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
              />

              <label className="block mt-2">Day:</label>
              <input
                type="text"
                name="day"
                value={formData.day}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />

              <label className="block mt-2">Start Time:</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                step="900"
              />

              <label className="block mt-2">End Time:</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                step="900"
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
