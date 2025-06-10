import { addTeacherAvailableHoursService } from "../services/teacher.service.js";

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
    res
      .status(201)
      .json({
        message: "Available hours added successfully",
        availableHour: saveHour,
      });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
