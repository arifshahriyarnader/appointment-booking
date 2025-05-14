import { useNavigate } from "react-router-dom";
import { useTeacherProfile } from "../../hooks/student";

const TeacherProfile = () => {
  const navigate = useNavigate();
  const { teacher, availableHours, loading } = useTeacherProfile();

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <div className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
        <h1
          className="text-xl font-bold cursor-pointer"
          onClick={() => navigate("/student-dashboard")}
        >
          Student Dashboard
        </h1>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : !teacher ? (
        <p className="text-red-500">Teacher not found</p>
      ) : (
        <div className="pt-4">
          <h2 className="text-xl font-bold">
            <strong>Teacher: </strong>
            {teacher.name}
          </h2>
          <p>
            <strong>Email:</strong> {teacher.email}
          </p>
          <p>
            <strong>Department:</strong> {teacher.department}
          </p>
          <p>
            <strong>Course:</strong> {teacher.course}
          </p>

          <h3 className="text-lg font-semibold mt-4">Available Hours</h3>
          {availableHours.length === 0 ? (
            <p className="text-red-500">No available hours</p>
          ) : (
            <table className="min-w-full border-collapse border border-gray-300 mt-3">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Date</th>
                  <th className="border p-2">Day</th>
                  <th className="border p-2">Start Time</th>
                  <th className="border p-2">End Time</th>
                </tr>
              </thead>
              <tbody>
                {availableHours.map((hour) =>
                  hour.slots.map((slot) => (
                    <tr key={slot._id} className="border">
                      <td className="border p-2">
                        {new Date(hour.date).toLocaleDateString()}
                      </td>
                      <td className="border p-2">{hour.day}</td>
                      <td className="border p-2">{slot.startTime}</td>
                      <td className="border p-2">{slot.endTime}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default TeacherProfile;
