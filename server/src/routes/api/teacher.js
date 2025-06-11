import express from "express";
import { authenticateToken } from "../../middleware/index.js";
import { Appointment } from "../../models/index.js";
import {
  addTeacherAvailableHoursController,
  deleteTeacherAvailableHoursController,
  getAllTeacherAvailableHoursController,
  getAppointmentRequestController,
  getTodayAppointmentController,
  updateAppointmentStatusController,
  updateTeacherAvailableHoursController,
} from "../../controllers/teacher.controller.js";

const router = express.Router();

router.post("/add", authenticateToken, addTeacherAvailableHoursController);

router.put(
  "/update/:id",
  authenticateToken,
  updateTeacherAvailableHoursController
);

router.get("/all", authenticateToken, getAllTeacherAvailableHoursController);

router.delete("/:id", authenticateToken, deleteTeacherAvailableHoursController);

router.get(
  "/appointment-status",
  authenticateToken,
  getAppointmentRequestController
);

router.put(
  "/appointment/:id/status",
  authenticateToken,
  updateAppointmentStatusController
);

router.get("/schedule-today", authenticateToken, getTodayAppointmentController);

//upcoming appointment schedule
router.get("/appointment-upcoming", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({
        message: "Only Teacher can view upcoming appointment schedule",
      });
    }
    const today = new Date();

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const total = await Appointment.countDocuments({ teacher: req.user._id });

    const appointments = await Appointment.find({
      teacher: req.user._id,
      date: { $gte: today.toISOString().split("T")[0] },
      status: "approved",
    })
      .sort({ date: 1, slots: 1 })
      .populate("student", "name email")
      .populate("teacher", "course")
      .skip(skip)
      .limit(limit);
    res.status(200).json({
      appointments,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalAppointments: total,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

//past appointment history
router.get("/past-schedule-history", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res
        .status(403)
        .json({ message: "Only teachers can view past appointments." });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const total = await Appointment.countDocuments({ teacher: req.user._id });

    const pastAppointments = await Appointment.find({
      teacher: req.user._id,
      date: { $lt: today },
      status: "approved",
    })
      .populate("student", "name email")
      .populate("teacher", "course")
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const formattedAppointments = pastAppointments.map((appointment) => ({
      _id: appointment._id,
      student: appointment.student,
      course: appointment.teacher.course,
      agenda: appointment.agenda,
      date: appointment.date,
      slots: appointment.slots,
      status: "Completed",
    }));

    res.status(200).json({
      pastAppointments: formattedAppointments,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalAppointments: total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
