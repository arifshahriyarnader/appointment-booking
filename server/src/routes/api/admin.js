import express from "express";
import bcrypt from "bcrypt";
import { authenticateToken } from "../../middleware/index.js";
import { User } from "../../models/index.js";
import { registerUserController } from "../../controllers/admin.controller.js";

const router = express.Router();

//admin create teacher or student
router.post("/admin/register-user", authenticateToken, registerUserController);

//get all students
router.get("/all-students", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admin can view all students list" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const students = await User.find({ role: "student" })
      .select("-password")
      .skip(skip)
      .limit(limit);
    const total = await User.countDocuments({ role: "student" });
    res.status(200).json({
      students,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalStudents: total,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

//get all teachers
router.get("/all-teachers", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admin can view all teachers list" });
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const teachers = await User.find({ role: "teacher" })
      .select("-password")
      .skip(skip)
      .limit(limit);
    const total = await User.countDocuments({ role: "teacher" });
    res.status(200).json({
      teachers,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalStudents: total,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

//delete user
router.delete("/users/:id", authenticateToken, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

//view registration request (admin only)
router.get("/registration-request", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can view who sent the registration request",
      });
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const userRequest = await User.find({ status: "pending" })
      .select("name email role department course studentId status createdAt")
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments({ status: "pending" });

    res.status(200).json({
      userRequest,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalRequests: total,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
});

//approve or reject user (only admin)
router.put("/users/:id", authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid Status" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: `User ${status} successfully`, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
