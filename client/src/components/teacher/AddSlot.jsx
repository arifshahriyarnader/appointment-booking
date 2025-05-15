import { CustomAlert } from "../../common/components";
import { useAddSlot } from "../../hooks/teacher";

const AddSlot = () => {
  const {
    date,
    setDate,
    day,
    setDay,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    loading,
    error,
    alertOpen,
    setAlertOpen,
    alertMessage,
    handleSubmit,
  } = useAddSlot();

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Add Slots</h2>
      <CustomAlert open={alertOpen} setOpen={setAlertOpen} {...alertMessage} />
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Day</label>
          <select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          >
            <option value="">Select Day</option>
            {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"].map(
              (d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              )
            )}
          </select>
        </div>
        <div>
          <label className="block text-gray-700">Start Time</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">End Time</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Slot"}
        </button>
      </form>
    </div>
  );
};

export default AddSlot;
