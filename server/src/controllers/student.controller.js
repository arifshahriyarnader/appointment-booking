import { getAllApprovedTeachersService } from "../services/student.service.js";

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
