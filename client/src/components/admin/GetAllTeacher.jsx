import { Trash2 } from "lucide-react";
import { CustomAlert, CustomPagination } from "../../common/components";
import { useGetAllTeacher } from "../../hooks/admin";

const GetAllTeacher = () => {
  const {
    teachers,
    currentPage,
    totalPages,
    setCurrentPage,
    alertOpen,
    setAlertOpen,
    alertMessage,
    confirmOpen,
    setConfirmOpen,
    showConfirmation,
    handleDelete,
  } = useGetAllTeacher();

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">All Teachers</h2>
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
                    onClick={() => showConfirmation(teacher._id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold
                     cursor-pointer px-4 py-1.5 rounded-md transition-all duration-200 shadow-md"
                  >
                    <Trash2 size={18} />
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
      <CustomPagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default GetAllTeacher;
