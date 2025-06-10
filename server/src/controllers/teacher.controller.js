import {
  addTeacherAvailableHoursService,
  updateTeacherAvailableHoursService,
} from "../services/teacher.service.js";

export const addTeacherAvailableHoursController = async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res
        .status(403)
        .json({ message: "Only teachers can add available hours" });
    }

    const { day, date, startTime, endTime } = req.body;

    if (!day || !date || !startTime || !endTime) {
      return res.status(400).json({
        message: "All fields (day, date, startTime, endTime) are required.",
      });
    }

    const saveHour = await addTeacherAvailableHoursService(
      req.user._id,
      day,
      date,
      startTime,
      endTime
    );
    res.status(201).json({
      message: "Available hours added successfully",
      availableHour: saveHour,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateTeacherAvailableHoursController = async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res
        .status(403)
        .json({ message: "Only teachers can update available hours" });
    }
    const { id } = req.params;
    const { day, date, startTime, endTime } = req.body;
    if (!day || !date || !startTime || !endTime) {
      return res.status(400).json({
        message: "All fields (day, startTime, endTime) are required.",
      });
    }

    const updatedAvailableHour = await updateTeacherAvailableHoursService(
      req.user._id,
      id,
      day,
      date,
      startTime,
      endTime
    );

    if (!updatedAvailableHour) {
      return res.status(404).json({ message: "Available hour not found" });
    }
    res.status(200).json({
      message: "Available hour updated successfully",
      availableHour: updatedAvailableHour,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
