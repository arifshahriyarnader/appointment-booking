import {
  addTeacherAvailableHoursService,
  deleteTeacherAvailableHoursService,
  getAllTeacherAvailableHoursService,
  getAppointmentRequestService,
  updateAppointmentStatusService,
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

export const getAllTeacherAvailableHoursController = async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res
        .status(403)
        .json({ message: "Only teachers can view their available hours" });
    }
    const { current = 1, pageSize = 5, sort = "asc", day } = req.query;
    const availableHours = await getAllTeacherAvailableHoursService(
      req.user._id,
      parseInt(current),
      parseInt(pageSize),
      sort,
      day
    );

    res.status(200).json({
      current: parseInt(current),
      pageSize: parseInt(pageSize),
      totalRecords: availableHours.length,
      availableHours,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const deleteTeacherAvailableHoursController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const result = await deleteTeacherAvailableHoursService(id, userId);
    if (!result.success) {
      return res.status(result.status).json({ message: result.message });
    }

    res.status(result.status).json({ message: result.message });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getAppointmentRequestController = async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res
        .status(401)
        .json({ message: "Only teacher can view appointment requests" });
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const { appointments, total, currentPage, totalPages } =
      await getAppointmentRequestService(req.user._id, page, limit);

    res.status(200).json({
      message: appointments,
      currentPage,
      totalPages,
      totalAppointments: total,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateAppointmentStatusController = async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res
        .status(403)
        .json({ message: "Only Teacher can update appointment status" });
    }
    const { id } = req.params;
    const { status } = req.body;
    const result = await updateAppointmentStatusService(
      id,
      req.user._id,
      status
    );
    if (!result.success) {
      return res.status(result.status).json({ message: result.message });
    }
    res
      .status(result.status)
      .json({
        message: `Appointment ${status} successfully`,
        appointment: result.appointment,
      });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
