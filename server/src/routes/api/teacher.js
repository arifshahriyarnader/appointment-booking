import express from "express";
import { authenticateToken } from "../../middleware/index.js";
import { Appointment, AvailableHour } from "../../models/index.js";
import {
  addTeacherAvailableHoursController,
  getAllTeacherAvailableHoursController,
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

//delete available hours
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const availableHour = await AvailableHour.findById(id);
    if (!availableHour) {
      return res.status(404).json({ message: "Available hours not found" });
    }
    if (availableHour.teacher.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ message: "You can delete your own available hours" });
    }
    await AvailableHour.findByIdAndDelete(id);
    res.status(200).json({ message: "Available hours deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

//teacher view who can sent the appointments request
router.get("/appointment-status", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res
        .status(401)
        .json({ message: "Only teacher can view appointment requests" });
    }

    // Get today's date at midnight (00:00:00)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const total = await Appointment.countDocuments({ teacher: req.user._id });

    // Fetch only appointments with today or future dates
    const appointments = await Appointment.find({
      teacher: req.user._id,
      date: { $gte: today },
    })
      .populate("student", "name email")
      .sort({ date: 1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      message: appointments,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalAppointments: total,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

//teacher approve or reject appointments request
router.put("/appointment/:id/status", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res
        .status(403)
        .json({ message: "Only Teacher can update appointment status" });
    }
    const { id } = req.params;
    const { status } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    const appointment = await Appointment.findOne({
      _id: id,
      teacher: req.user._id,
    });
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    appointment.status = status;
    await appointment.save();
    res
      .status(200)
      .json({ message: `Appointment ${status} successfully`, appointment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

//daily appointment schedules
router.get("/schedule-today", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res
        .status(403)
        .json({ message: "Only Teacher can view daily appointment schedule" });
    }
    const today = new Date().toISOString().split("T")[0];

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const total = await Appointment.countDocuments({ teacher: req.user._id });

    const appointments = await Appointment.find({
      teacher: req.user._id,
      date: today,
      status: "approved",
    })
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
