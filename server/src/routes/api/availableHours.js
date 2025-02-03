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
router.post("/add-multiple", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res
        .status(403)
        .json({ message: "Only teachers can add available hours" });
    }

    const availableHoursArray = req.body.availableHours; // Expecting an array of available hours
    if (
      !Array.isArray(availableHoursArray) ||
      availableHoursArray.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Invalid data format. Expected an array." });
    }

    const availableHours = availableHoursArray.map(
      ({ day, startTime, endTime }) => ({
        teacher: req.user._id,
        day,
        slots: generateTimeSlots(startTime, endTime),
      })
    );

    // Save all available hours in bulk
    const savedAvailableHours = await AvailableHour.insertMany(availableHours);

    res.status(201).json({
      message: "Available hours added successfully",
      availableHours: savedAvailableHours,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

//update available hours
router.put("/update-multiple", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res
        .status(403)
        .json({ message: "Only teachers can update available hours" });
    }

    const updatedAvailableHours = req.body.availableHours; // Expecting an array

    if (
      !Array.isArray(updatedAvailableHours) ||
      updatedAvailableHours.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Invalid data format. Expected an array." });
    }

    const updatePromises = updatedAvailableHours.map(
      async ({ _id, day, startTime, endTime }) => {
        const slots = generateTimeSlots(startTime, endTime); // Generate new slots

        return AvailableHour.findOneAndUpdate(
          { _id, teacher: req.user._id }, // Ensure teacher can only update their own data
          { day, slots },
          { new: true }
        );
      }
    );

    const updatedHours = await Promise.all(updatePromises);

    res.status(200).json({
      message: "Available hours updated successfully",
      updatedHours,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
