import {
  getAllApprovedTeachersService,
  getTeacherWithAvailableHoursService,
} from "../services/student.service.js";

export const getAllApprovedTeachersController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const result = await getAllApprovedTeachersService(page, limit);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getTeacherWithAvailableHoursController = async (req, res) => {
  try {
    const { teacher, availableHours, notFound } =
      await getTeacherWithAvailableHoursService(req.params.id);
    if (notFound) {
      return res.status(404).json({ message: "Teacher Not found" });
    }
    res.status(200).json({ teacher, availableHours });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
