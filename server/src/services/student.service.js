import moment from "moment";
import { AvailableHour, User, Appointment } from "../models/index.js";

export const getAllApprovedTeachersService = async (page = 1, limit = 5) => {
  const skip = (page - 1) * limit;
  const teacher = await User.find({
    role: "teacher",
    status: "approved",
  })
    .select("-password")
    .skip(skip)
    .limit(limit);
  const total = await User.countDocuments({
    role: "teacher",
    status: "approved",
  });
  return {
    teacher,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalTeachers: total,
  };
};

export const getTeacherWithAvailableHoursService = async (teacherId) => {
  const teacher = await User.findById(teacherId).select(
    "name email department course role"
  );
  if (!teacher || teacher.role !== "teacher") {
    return { notFound: true };
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const availableHours = await AvailableHour.find({
    teacher: teacherId,
    date: { $gte: today },
  });
  return {
    teacher,
    availableHours,
  };
};

export const searchApprovedTeachersService = async (query) => {
  if (!query) {
    throw new Error("Search query is required");
  }
  const teachers = await User.find({
    role: "teacher",
    status: "approved",
    $or: [
      { name: { $regex: query, $options: "i" } },
      { department: { $regex: query, $options: "i" } },
    ],
  });
  return teachers;
};

export const getUpcomingBookedSlotsService = async (teacherId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const availableHours = await AvailableHour.find({
    teacher: teacherId,
    date: { $gte: today },
  }).lean();

  const bookedAppointments = await Appointment.find({
    teacher: teacherId,
    date: { $gte: today },
  })
    .select("date slots")
    .lean();

  const bookedSlotsSet = new Set(
    bookedAppointments.map(
      (appt) =>
        `${appt.date.toISOString().split("T")[0]} ${appt.slots.startTime}`
    )
  );

  const formattedSlots = availableHours
    .filter((day) => new Date(day.date) >= today)
    .map((day) => ({
      date: day.date.toISOString().split("T")[0],
      day: moment(day.date).format("dddd"),
      slots: day.slots.map((slot) => ({
        startTime: slot.startTime,
        endTime: slot.endTime,
        isBooked: bookedSlotsSet.has(
          `${day.date.toISOString().split("T")[0]} ${slot.startTime}`
        ),
      })),
    }));
  return formattedSlots;
};

export const bookAppointmentService = async ({
  studentId,
  teacher,
  date,
  slots,
  course,
  agenda,
}) => {
  const existingAppointment = await Appointment.findOne({
    teacher,
    date: date,
    "slots.startTime": slots.startTime,
    "slots.endTime": slots.endTime,
  });
  if (existingAppointment) {
    throw new Error("This slot is already booked");
  }
  const appointment = new Appointment({
    student: studentId,
    teacher,
    course,
    date,
    slots,
    agenda,
    status: "pending",
  });
  await appointment.save();
  return appointment;
};

export const checkAppointmentStatusService = async (studentId, page, limit) => {
  const skip = (page - 1) * limit;
  const total = await Appointment.countDocuments({ student: studentId });
  const appointments = await Appointment.find({ student: studentId })
    .populate("teacher", "name email course")
    .populate("student", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // Formatting response for better readability
  const formattedAppointments = appointments.map((appointment) => ({
    _id: appointment._id,
    date: appointment.date,
    timeSlot: `${appointment.slots.startTime} - ${appointment.slots.endTime}`,
    status: appointment.status,
    teacher: {
      name: appointment.teacher.name,
      email: appointment.teacher.email,
      course: appointment.teacher.course,
    },
    student: {
      name: appointment.student.name,
      email: appointment.student.email,
    },
    agenda: appointment.agenda,
  }));
  return {
    appointments: formattedAppointments,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalAppointments: total,
  };
};

export const cancelStudentAppointmentService = async (
  studentId,
  appointmentId
) => {
  const appointment = await Appointment.findOne({
    _id: appointmentId,
    student: studentId,
  });

  if (!appointment) {
    return {
      status: 404,
      message: "Appointment not found or not owned by the student",
    };
  }

  if (appointment.status === "approved" || appointment.status === "completed") {
    return {
      status: 400,
      message: "You cannot cancel an approved or completed appointment",
    };
  }
  appointment.status = "canceled";
  await appointment.save();
  return {
    status: 200,
    appointment,
    message: "Appointment canceled successfully",
  };
};

export const pastAppointmentHistoryService = async (studentId, page, limit) => {
  const today = new Date();
  const skip = (page - 1) * limit;
  const total = await Appointment.countDocuments({
    student: studentId,
    date: { $lt: today },
  });
  const pastAppointments = await Appointment.find({
    student: studentId,
    date: { $lt: today },
  })
    .populate("teacher", "name email course")
    .sort({ date: -1 })
    .skip(skip)
    .limit(limit);
  const formattedAppointments = pastAppointments.map((appointment) => ({
    _id: appointment._id,
    teacher: appointment.teacher,
    date: appointment.date,
    agenda: appointment.agenda,
    slots: appointment.slots,
    status:
      appointment.status === "approved" ? "Completed" : appointment.status,
  }));
  return {
    pastAppointments: formattedAppointments,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalAppointments: total,
  };
};
