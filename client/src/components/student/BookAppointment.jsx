import { useBookAppointment } from "../../hooks/student";
import { CustomAlert } from "../../common/components";

const BookAppointment = () => {
  const {
    teachers,
    selectedTeacher,
    availableDates,
    selectedDate,
    timeSlots,
    selectedSlot,
    setSelectedSlot,
    course,
    setCourse,
    agenda,
    setAgenda,
    alertOpen,
    setAlertOpen,
    alertMessage,
    handleTeacherChange,
    handleDateChange,
    handleBookAppointment,
  } = useBookAppointment();

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
          className="w-full bg-blue-500 text-white py-2 rounded cursor-pointer"
        >
          Book Appointment
        </button>
      </form>
      <CustomAlert open={alertOpen} setOpen={setAlertOpen} {...alertMessage} />
    </div>
  );
};

export default BookAppointment;
