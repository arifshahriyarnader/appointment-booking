import express from "express";
import moment from "moment";
import { authenticateToken } from "../../middleware/index.js";
import { AvailableHour } from "../../models/index.js";

const router = express.Router();

// Function to generate 20-minute slots
function generateTimeSlots(startTime, endTime) {
  const slots = [];
  let start = moment(startTime, "hh:mm A");
  const end = moment(endTime, "hh:mm A");

  while (start < end) {
    let nextSlot = start.clone().add(20, "minutes");
    slots.push({
      startTime: start.format("hh:mm A"),
      endTime: nextSlot.format("hh:mm A"),
    });
    start = nextSlot;
  }

  return slots;
}

//add available hours
router.post("/add", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res
        .status(403)
        .json({ message: "Only teachers can add available hours" });
    }
    const availableHoursData = req.body.availableHours;

    const availableHours = availableHoursData.map(
      ({ day, startTime, endTime }) => {
        const slots = generateTimeSlots(startTime, endTime);
        return {
          teacher: req.user._id,
          day,
          slots,
        };
      }
    );

    await AvailableHour.insertMany(availableHours);

    res
      .status(201)
      .json({ message: "Available hours added successfully", availableHours });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

export default router;
