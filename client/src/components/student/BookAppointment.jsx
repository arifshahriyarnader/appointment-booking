import { useState, useEffect } from "react";
import {
  checkTeacherBookedSlots,
  bookAppointment,
  getAllTeachersList,
} from "../../api/services/studentServices";
import { CustomAlert } from "../../common/components";

const BookAppointment = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [course, setCourse] = useState("");
  const [agenda, setAgenda] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await getAllTeachersList();
      console.log("Fetched Teachers:", response);
      if (response && response.teacher) {
        setTeachers(response.teacher);
      } else {
        console.log("No teachers found.");
      }
    } catch (error) {
      console.log("Error fetching teachers:", error);
    }
  };

  const fetchAvailableSlots = async (teacherId) => {
    if (!teacherId) return;
    try {
      const response = await checkTeacherBookedSlots(teacherId);
      setAvailableDates(response.teacherUpcomingBookedSlots);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTeacherChange = (e) => {
    const teacherId = e.target.value;
    setSelectedTeacher(teacherId);
    setSelectedDate("");
    setTimeSlots([]);
    fetchAvailableSlots(teacherId);
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    const slotsForDate = availableDates.find((d) => d.date === date);
    setTimeSlots(slotsForDate ? slotsForDate.slots : []);
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (
      !selectedTeacher ||
      !selectedDate ||
      !selectedSlot ||
      !course ||
      !agenda
    ) {
      setAlertMessage({
        title: "Error",
        description: "Please fill all fields!",
      });
      setAlertOpen(true);
      return;
    }

    const appointmentData = {
      teacher: selectedTeacher,
      date: selectedDate,
      slots: selectedSlot,
      course,
      agenda,
    };
    console.log("Sending appointment data:", appointmentData);
    try {
      const response = await bookAppointment(appointmentData);
      console.log("Response after booking:", response);

      if (response?.message) {
        setAlertMessage({
          title: "Success",
          description: response.message,
        });
        setAlertOpen(true);
        setSelectedTeacher("");
        setAvailableDates([]);
        setSelectedDate("");
        setTimeSlots([]);
        setSelectedSlot(null);
        setCourse("");
        setAgenda("");
      }
    } catch (error) {
      setAlertMessage({
        title: "Error",
        description:
          error.response?.data?.message ||
          "Failed to book appointment. Please try again.",
      });
      setAlertOpen(true);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Book an Appointment</h2>
      <form onSubmit={handleBookAppointment}>
        <label className="block font-medium">Select Teacher:</label>
        <select
          className="w-full p-2 border rounded mb-3"
          value={selectedTeacher}
          onChange={handleTeacherChange}
        >
          <option value="">Select Teacher</option>
          {teachers.map((teacher) => (
            <option key={teacher._id} value={teacher._id}>
              {teacher.name}
            </option>
          ))}
        </select>

        <label className="block font-medium">Select Date:</label>
        <select
          className="w-full p-2 border rounded mb-3"
          value={selectedDate}
          onChange={handleDateChange}
          disabled={!selectedTeacher}
        >
          <option value="">Select Date</option>
          {availableDates.map((date) => (
            <option key={date.date} value={date.date}>
              {date.date} ({date.day})
            </option>
          ))}
        </select>

        <label className="block font-medium">Select Time Slot:</label>
        <select
          className="w-full p-2 border rounded mb-3"
          value={selectedSlot ? selectedSlot.startTime : ""}
          onChange={(e) => {
            const slot = timeSlots.find((s) => s.startTime === e.target.value);
            setSelectedSlot(slot);
          }}
          disabled={!selectedDate}
        >
          <option value="">Select Time Slot</option>
          {timeSlots.map((slot) => (
            <option
              key={slot.startTime}
              value={slot.startTime}
              disabled={slot.isBooked}
            >
              {slot.startTime} - {slot.endTime}{" "}
              {slot.isBooked ? "(Booked)" : ""}
            </option>
          ))}
        </select>

        <label className="block font-medium">Course:</label>
        <input
          type="text"
          className="w-full p-2 border rounded mb-3"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
        />

        <label className="block font-medium">Agenda:</label>
        <textarea
          className="w-full p-2 border rounded mb-3"
          value={agenda}
          onChange={(e) => setAgenda(e.target.value)}
        />

        {/* Book Appointment Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          Book Appointment
        </button>
      </form>
      <CustomAlert open={alertOpen} setOpen={setAlertOpen} {...alertMessage} />
    </div>
  );
};

export default BookAppointment;
