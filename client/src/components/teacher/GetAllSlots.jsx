import { Pencil, Trash2 } from "lucide-react";
import { CustomAlert } from "../../common/components";
import { useGetAllSlot } from "../../hooks/teacher";

const GetAllSlots = () => {
  const {
    slots,
    loading,
    error,
    isModalOpen,
    setIsModalOpen,
    formData,
    alertOpen,
    setAlertOpen,
    alertMessage,
    confirmOpen,
    setConfirmOpen,
    showConfirmation,
    handleChange,
    handleEdit,
    handleDelete,
    handleSubmit,
  } = useGetAllSlot();
  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Teacher Available Hours</h2>
      <CustomAlert
        open={confirmOpen}
        setOpen={setConfirmOpen}
        onConfirm={handleDelete}
        {...alertMessage}
      />
      <CustomAlert open={alertOpen} setOpen={setAlertOpen} {...alertMessage} />
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
                      className="p-1.5 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition cursor-pointer"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => showConfirmation(slot._id)}
                      className="p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition cursor-pointer"
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
