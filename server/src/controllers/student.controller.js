import {
  bookAppointmentService,
  cancelStudentAppointmentService,
  checkAppointmentStatusService,
  getAllApprovedTeachersService,
  getTeacherWithAvailableHoursService,
  getUpcomingBookedSlotsService,
  pastAppointmentHistoryService,
  searchApprovedTeachersService,
  todaysAppointmentListService,
} from "../services/student.service.js";

export const getAllApprovedTeachersController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const result = await getAllApprovedTeachersService(page, limit);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getTeacherWithAvailableHoursController = async (req, res) => {
  try {
    const { teacher, availableHours, notFound } =
      await getTeacherWithAvailableHoursService(req.params.id);
    if (notFound) {
      return res.status(404).json({ message: "Teacher Not found" });
    }
    res.status(200).json({ teacher, availableHours });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const searchApprovedTeachersController = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }
    const teachers = await searchApprovedTeachersService(query);
    res.status(200).json(teachers);
  } catch (error) {
    console.error("Error fetching teachers:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUpcomingBookedSlotsController = async (req, res) => {
  try {
    const teacherId = req.params.id;
    const slots = await getUpcomingBookedSlotsService(teacherId);
    res.status(200).json(slots);
  } catch (error) {
    console.error("Error fetching upcoming booked slots:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const bookAppointmentController = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res
        .status(403)
        .json({ message: "Only students can books an appointment" });
    }
    const { teacher, date, slots, course, agenda } = req.body;
    await bookAppointmentService({
      studentId: req.user._id,
      teacher,
      date,
      slots,
      course,
      agenda,
    });
    res.status(201).json({
      message: "Appointment request sent! Waiting for teacher's approval",
    });
  } catch (error) {
    if (error.message === "This slot is already booked") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error", error });
  }
};

export const checkAppointmentStatusController = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res
        .status(401)
        .json({ message: "Only students can view their appointment status" });
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const result = await checkAppointmentStatusService(
      req.user._id,
      page,
      limit
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const cancelStudentAppointmentController = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res
        .status(403)
        .json({ message: "Only students can cancel appointments" });
    }
    const result = await cancelStudentAppointmentService(
      req.user._id,
      req.params.id
    );
    return res
      .status(result.status)
      .json(
        result.status === 200
          ? { message: result.message, appointment: result.appointment }
          : { message: result.message }
      );
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const pastAppointmentHistoryController = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res
        .status(403)
        .json({ message: "Only students can view their past appointments" });
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const result = await pastAppointmentHistoryService(
      req.user._id,
      page,
      limit
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const todayAppointmentListController = async(req,res) => {
  try{
 if (req.user.role !== "student") {
      return res.status(403).json({
        message: "Only students can view their todays appointment list",
      });
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const result= await todaysAppointmentListService(req.user._id, page, limit);
    res.status(200).json(result);
  }
  catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}