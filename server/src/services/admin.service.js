import bcrypt from "bcrypt";
import { User } from "../models/index.js";

export const registerUser = async ({
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
    throw new Error("User already exists");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const status = "approved";
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
  return newUser;
};
