import {
  getAllStudentsService,
  getAllTeachersService,
  registerUser,
} from "../services/admin.service.js";

export const registerUserController = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can create users" });
    }
    const newUser = await registerUser(req.body);
    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    if (error.message === "User already exists") {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getAllStudentsController = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admin can view all students list" });
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const students = await getAllStudentsService(page, limit);
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getAllTeachersController = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admin can view all teachers list" });
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const teachers = await getAllTeachersService(page, limit);
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
