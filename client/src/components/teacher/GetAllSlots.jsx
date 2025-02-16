import { useEffect, useState } from "react";
import { getAllAvailhours } from "../../api/services/teacherServices";
import { Pencil, Trash2 } from "lucide-react";

const GetAllSlots = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const data = await getAllAvailhours();
        setSlots(data?.availableHours || []);
      } catch (error) {
        setError("Failed to load slots",error);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, []);

  const handleEdit = (id) => {
    console.log("Edit clicked for:", id);
  };

  const handleDelete = (id) => {
    console.log("Delete clicked for:", id);
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
                  <td className="border px-4 py-2">{slot.teacher.department}</td>
                  <td className="border px-4 py-2">
                    {new Date(slot.date).toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2">{slot.day}</td>
                  <td className="border px-4 py-2">
                    {slot.slots.map((s) => `${s.startTime}-${s.endTime}`).join(", ")}
                  </td>
                  <td className="border px-4 py-2 flex justify-center gap-3">
                    {/* Edit Button */}
                    <button
                      onClick={() => handleEdit(slot._id)}
                      className="p-1.5 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition"
                    >
                      <Pencil size={18} />
                    </button>
                    {/* Delete Button */}
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
    </div>
  );
};

export default GetAllSlots;
