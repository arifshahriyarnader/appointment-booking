import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { getAllTeachersList } from "../../api/services/studentServices";

const AllTeacher = ({ searchResults }) => {
  const [teachers, setTeachers] = useState([]);

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!searchResults || searchResults.length === 0) {
      const fetchTeachers = async () => {
        setLoading(true);
        try {
          const response = await getAllTeachersList();
          setTeachers(response.teacher || []);
        } catch (error) {
          console.error("Error fetching teachers:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchTeachers();
    } else {
      setTeachers(searchResults);
      setLoading(false);
    }
  }, [searchResults]);

  const handleViewProfile = (teacherId) => {
    navigate(`/teacher-profile/${teacherId}`);
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">All Teachers List</h2>
      {loading ? (
        <p>Loading...</p>
      ) : teachers.length === 0 ? (
        <p className="text-red-500">No teachers available</p>
      ) : (
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Department</th>
              <th className="border p-2">Course</th>
              <th className="border p-2">Actions</th>{" "}
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher._id} className="border">
                <td className="border p-2">{teacher.name}</td>
                <td className="border p-2">{teacher.email}</td>
                <td className="border p-2">{teacher.department || "N/A"}</td>
                <td className="border p-2">{teacher.course || "N/A"}</td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => handleViewProfile(teacher._id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 cursor-pointer"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

AllTeacher.propTypes = {
  searchResults: PropTypes.array,
};

export default AllTeacher;
