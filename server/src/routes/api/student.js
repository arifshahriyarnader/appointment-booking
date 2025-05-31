import express from "express";
import moment from "moment";
import { authenticateToken } from "../../middleware/index.js";
import { User, AvailableHour, Appointment } from "../../models/index.js";
import { getAllApprovedTeachersController } from "../../controllers/student.controller.js";
const router = express.Router();

//get all teachers
router.get("/all-teachers", getAllApprovedTeachersController);

//get teacher profile with available hours
router.get("/teacher/:id", async (req, res) => {
  try {
    const teacher = await User.findById(req.params.id).select(
      "name email department course role"
    );
    if (!teacher || teacher.role !== "teacher") {
      return res.status(404).json({ message: "Teacher Not found" });
    }

    // Get today's date and filter only future available hours
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const availableHours = await AvailableHour.find({
      teacher: req.params.id,
      date: { $gte: today },
    });

    res.status(200).json({ teacher, availableHours });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Search teachers by name or department
router.get("/search-teachers", async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }
    const teachers = await User.find({
      role: "teacher",
      status: "approved",
      $or: [
        { name: { $regex: query, $options: "i" } },
        { department: { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json(teachers);
  } catch (error) {
    console.error("Error fetching teachers:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//get teacher available hours and booked
router.get("/teacher/:id/upcoming-booked-slots", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const availableHours = await AvailableHour.find({
      teacher: req.params.id,
      date: { $gte: today },
    }).lean();

    const bookedAppointments = await Appointment.find({
      teacher: req.params.id,
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

    res.status(200).json({ teacherUpcomingBookedSlots: formattedSlots });
  } catch (error) {
    console.error("Error fetching upcoming booked slots:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

//students booked an appoinment
router.post("/appointment", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res
        .status(403)
        .json({ message: "Only students can books an appointment" });
    }
    const { teacher, date, slots, course, agenda } = req.body;

    const existingAppointment = await Appointment.findOne({
      teacher: teacher,
      date: date,
      "slots.startTime": slots.startTime,
      "slots.endTime": slots.endTime,
    });
    if (existingAppointment) {
      return res.status(400).json({ message: "This slot is already booked" });
    }
    const appointment = new Appointment({
      student: req.user._id,
      teacher: teacher,
      course,
      date,
      slots,
      agenda,
      status: "pending",
    });
    await appointment.save();
    res.status(201).json({
      message: "Appointment request sent! Waiting for teacher's approval",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

//check appointment status
router.get("/appointment-status", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res
        .status(401)
        .json({ message: "Only students can view their appointment status" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const total = await Appointment.countDocuments({ student: req.user._id });

    // Fetch appointments with populated teacher and student details
    const appointments = await Appointment.find({ student: req.user._id })
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

    res.status(200).json({
      appointments: formattedAppointments,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalAppointments: total,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Student cancels their appointment
router.put("/appointment/cancel/:id", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res
        .status(403)
        .json({ message: "Only students can cancel appointments" });
    }

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      student: req.user._id,
    });

    if (!appointment) {
      return res
        .status(404)
        .json({ message: "Appointment not found or not owned by the student" });
    }

    // Ensure appointment is not already approved or completed
    if (
      appointment.status === "approved" ||
      appointment.status === "completed"
    ) {
      return res.status(400).json({
        message: "You cannot cancel an approved or completed appointment",
      });
    }

    // Update appointment status to "canceled"
    appointment.status = "canceled";
    await appointment.save();

    res
      .status(200)
      .json({ message: "Appointment canceled successfully", appointment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

//past appointments history
router.get("/appointment-history", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res
        .status(403)
        .json({ message: "Only students can view their past appointments" });
    }
    const today = new Date();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const total = await Appointment.countDocuments({ student: req.user._id });
    const pastAppointments = await Appointment.find({
      student: req.user._id,
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
    res.status(200).json({
      pastAppointments: formattedAppointments,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalAppointments: total,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

//get today's appointments
router.get("/appointment-today", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        message: "Only students can view their todays appointment list",
      });
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const total = await Appointment.countDocuments({ student: req.user._id });
    const todayAppointments = await Appointment.find({
      student: req.user._id,
      date: { $gte: today, $lt: tomorrow },
    })
      .populate("teacher", "name email course")
      .sort({ date: 1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      todayAppointments,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalAppointments: total,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

//get upcoming schedule
router.get("/appointment-upcoming", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res
        .status(403)
        .json({ message: "Only students can access upcoming appointments" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const total = await Appointment.countDocuments({ student: req.user._id });

    const upcomingAppointments = await Appointment.find({
      student: req.user._id,
      date: { $gte: today, $lt: nextWeek },
    })
      .populate("teacher", "name email course")
      .sort({ date: 1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      upcomingAppointments,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalAppointments: total,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
