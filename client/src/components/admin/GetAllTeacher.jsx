import { useEffect, useState } from "react";
import { getAllTeacher, deleteUser } from "../../api/services/admin/adminServices";
import { Trash2 } from "lucide-react";

const GetAllTeacher = () => {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const data = await getAllTeacher();
      setTeachers(data.teachers || []);
    } catch (error) {
      console.log("Error fetching teachers:", error);
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this teacher?");
    if (isConfirmed) {
      try {
        await deleteUser(id);
        alert("Teacher deleted successfully!");
        fetchTeachers();
      } catch (error) {
        alert("Failed to delete teacher.",error);
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">All Teachers</h2>
      <table className="w-full border-collapse border border-gray-300 shadow-md">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Department</th>
            <th className="border p-2">Course</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {teachers.length > 0 ? (
            teachers.map((teacher) => (
              <tr key={teacher._id} className="text-center border-t">
                <td className="border p-2">{teacher.name}</td>
                <td className="border p-2">{teacher.email}</td>
                <td className="border p-2">{teacher.department}</td>
                <td className="border p-2">{teacher.course}</td>
                <td className="border p-2">
                  <button
                    onClick={() => handleDelete(teacher._id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold cursor-pointer px-4 py-1.5 rounded-md transition-all duration-200 shadow-md"
                  >
                     <Trash2 size={18} /> Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="p-4 text-center text-gray-500">
                No teachers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GetAllTeacher;
