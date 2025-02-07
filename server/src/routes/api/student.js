import express from "express";
import { authenticateToken } from "../../middleware/index.js";
import { User, AvailableHour, Appointment } from "../../models/index.js";
const router = express.Router();

//get teacher profile with available hours
router.get("/teacher/:id", async (req, res) => {
  try {
    const teacher = await User.findById(req.params.id).select(
      "name email department course role"
    );
    if (!teacher || teacher.role !== "teacher") {
      return res.status(404).json({ message: "Teacher Not found" });
    }
    const availableHours = await AvailableHour.find({ teacher: req.params.id });
    res.status(200).json({ teacher, availableHours });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

//get teacher available hours and booked
router.get("/teacher/:id/slots", async (req, res) => {
  try {
    const availableHours = await AvailableHour.find({ teacher: req.params.id });
    const bookedAppointment = await Appointment.find({
      teacher: req.params.id,
    }).select("date day timeSlot");
    const bookedSlotsSet = new Set(
      bookedAppointment.map(
        (appt) => `${appt.date.toISOString().split("T")[0]} ${appt.timeSlot}`
      )
    );
    const formattedSlots = availableHours.map((day) => ({
      day: day.day,
      slots: day.slots.map((slot) => ({
        startTime: slot.startTime,
        endTime: slot.endTime,
        isBooked: bookedSlotsSet.has(`${day.day} ${slot.startTime}`),
      })),
    }));
    res.status(200).json({ availableSlots: formattedSlots });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

//students booked an appoinment
router.post("/appoinment", authenticateToken, async (req, res) => {
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
    const appointments = await Appointment.find({ student: req.user._id })
      .populate("teacher", "name email department course")
      .sort({ createdAt: -1 });
    res.status(200).json({ appointments });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

//past appointments history
router.get("/appointment/history", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res
        .status(403)
        .json({ message: "Only students can view their past appointments" });
    }
    const today = new Date();
    const pastAppointments = await Appointment.find({
      student: req.user._id,
      date: { $lt: today },
    })
      .populate("teacher", "name email course")
      .sort({ date: -1 });
      if (pastAppointments.length === 0) {
        return res.status(200).json({ message: "You have no past appointments." });
      }
      const formattedAppointments = pastAppointments.map((appointment) => ({
        _id: appointment._id,
        teacher: appointment.teacher,
        date: appointment.date,
        status: appointment.status === "approved" ? "Completed" : appointment.status, // Shows "Completed" if approved
      }));
    res
      .status(200)
      .json({pastAppointments : formattedAppointments});
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

//get today's appointments
router.get("/appointment/today", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res
        .status(403)
        .json({
          message: "Only students can view their todays appointment list",
        });
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const todayAppointments = await Appointment.find({
      student: req.user._id,
      date: { $gte: today, $lt: tomorrow },
    })
      .populate("teacher", "name email course")
      .sort({ date: 1 });
      if(todayAppointments.length === 0){
        return res.status(403).json({message:"You have no appointment schedule for today"})
      }
    res.status(200).json({ todayAppointments });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

//get upcoming schedule
router.get("/appointment/upcoming", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can access upcoming appointments" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const upcomingAppointments = await Appointment.find({
      student: req.user._id,
      date: { $gte: today, $lt: nextWeek },
    })
      .populate("teacher", "name email course")
      .sort({ date: 1 });

    res.status(200).json({ upcomingAppointments });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


export default router;
