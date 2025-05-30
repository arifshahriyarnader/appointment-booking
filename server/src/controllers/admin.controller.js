import {
  approveOrRejectUserService,
  deleteUserService,
  getAllStudentsService,
  getAllTeachersService,
  registerUser,
  viewRegistrationRequestService,
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

export const deleteUserController = async (req, res) => {
  try {
    const user = await deleteUserService(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const viewRegistrationRequestController = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can view who sent the registration request",
      });
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const userRequest = await viewRegistrationRequestService(page, limit);
    res.status(200).json(userRequest);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const approveOrRejectUserController = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    const updatedUser = await approveOrRejectUserService(id, status);
    res
      .status(200)
      .json({ message: `User ${status} successfully`, updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
