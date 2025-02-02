import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../../models/index.js";

const router = express.Router();

// registration
router.post("/registration", async (req, res) => {
  try {
    const { name, email, password, role, department, studentId, course, availableHours } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

     // Set status based on role
     const status = role === "admin" ? "approved" : "pending";

    // Create new user with status "pending"
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      department,
      studentId: role === "student" ? studentId : undefined,
      course: role === "teacher" ? course : undefined,
      availableHours: role === "teacher" ? availableHours : undefined,
      status, // Admin status is "approved", others are "pending"
    });

    await newUser.save();

    // Customize response message based on role
    const responseMessage =
      role === "admin"
        ? "Admin registered successfully."
        : "User registered successfully. Awaiting admin approval.";

    // Remove `availableHours` from the response if the user is not a teacher
    const responseUser = newUser.toObject();
    if (role !== "teacher") {
      delete responseUser.availableHours;
    }

    res.status(201).json({ message: responseMessage, user: responseUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;