import express from "express";
import { authenticateToken } from "../../middleware/index.js";
import { Appointment } from "../../models/index.js";
import {
  bookAppointmentController,
  cancelStudentAppointmentController,
  checkAppointmentStatusController,
  getAllApprovedTeachersController,
  getTeacherWithAvailableHoursController,
  getUpcomingBookedSlotsController,
  pastAppointmentHistoryController,
  searchApprovedTeachersController,
} from "../../controllers/student.controller.js";
const router = express.Router();

router.get("/all-teachers", getAllApprovedTeachersController);

router.get("/teacher/:id", getTeacherWithAvailableHoursController);

router.get("/search-teachers", searchApprovedTeachersController);

router.get(
  "/teacher/:id/upcoming-booked-slots",
  getUpcomingBookedSlotsController
);

router.post("/appointment", authenticateToken, bookAppointmentController);

router.get(
  "/appointment-status",
  authenticateToken,
  checkAppointmentStatusController
);

router.put(
  "/appointment/cancel/:id",
  authenticateToken,
  cancelStudentAppointmentController
);

//past appointments history
router.get(
  "/appointment-history",
  authenticateToken,
  pastAppointmentHistoryController
);

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
