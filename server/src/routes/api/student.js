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

export default router;
