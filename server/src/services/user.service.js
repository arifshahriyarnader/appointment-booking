import bcrypt from "bcrypt";
import { User } from "../models/index.js";

export const registrationService = async ({
  name,
  email,
  password,
  role,
  department,
  studentId,
  course,
}) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
     return {
      success: false,
      status: 400,
      message: "User already exists",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const status = role === "admin" ? "approved" : "pending";
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    role,
    department,
    studentId: role === "student" ? studentId : undefined,
    course: role === "teacher" ? course : undefined,
    status,
  });
  
  await newUser.save();
  const responseMessage =
    role === "admin"
      ? "Admin registered successfully."
      : "User registered successfully. Awaiting admin approval.";
  const responseUser = newUser.toObject();
  delete responseUser.password;
  return {
    success: true,
    status: 201,
    message: responseMessage,
    user: responseUser,
  };
};
