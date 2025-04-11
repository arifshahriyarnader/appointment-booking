import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  deleteUser,
  getAllStudent,
} from "../../api/services/admin/adminServices";
import { CustomAlert } from "../../common/components";

const GetAllStudent = () => {
  const [students, setStudents] = useState([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState({
    title: "",
    description: "",
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState({ id: null });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const data = await getAllStudent();
      setStudents(data.students || []);
    } catch (error) {
      console.log(error);
      setAlertMessage({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to fetch students",
        variant: "destructive",
      });
      setAlertOpen(true);
    }
  };
  const showConfirmation = (id) => {
    setCurrentAction({ id });
    setAlertMessage({
      title: "Confirm Action",
      description: "Are you sure you want to delete this student?",
      variant: "default",
      showCancel: true,
    });
    setConfirmOpen(true);
  };
  const handleDelete = async () => {
    try {
      const { id } = currentAction;
      await deleteUser(id);
      setAlertMessage({
        title: "Success",
        description: "Student deleted successfully",
        variant: "success",
      });
      setAlertOpen(true);
      fetchStudents();
    } catch (error) {
      console.log(error);
      setAlertMessage({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to delete student!",
        variant: "destructive",
      });
      setAlertOpen(true);
    } finally {
      setConfirmOpen(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">All Students</h2>
      {/* confirmation alert */}
      <CustomAlert
        open={confirmOpen}
        setOpen={setConfirmOpen}
        onConfirm={handleDelete}
        {...alertMessage}
      />
      {/* result alert */}
      <CustomAlert open={alertOpen} setOpen={setAlertOpen} {...alertMessage} />
      <table className="w-full border-collapse border border-gray-300 shadow-md">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Department</th>
            <th className="border p-2">Student ID</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((student) => (
              <tr key={students._id} className="text-center border-t">
                <td className="border p-2">{student.name}</td>
                <td className="border p-2">{student.email}</td>
                <td className="border p-2">{student.department}</td>
                <td className="border p-2">{student.studentId}</td>
                <td className="border p-2">
                  <button
                    onClick={() => showConfirmation(student._id)}
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

export default GetAllStudent;
