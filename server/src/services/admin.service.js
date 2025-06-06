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

export const getAllStudentsService = async (page = 1, limit = 5) => {
  const skip = (page - 1) * limit;
  const students = await User.find({ role: "student" })
    .select("-password")
    .skip(skip)
    .limit(limit);
  const total = await User.countDocuments({ role: "student" });
  return {
    students,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalStudents: total,
  };
};

export const getAllTeachersService = async (page = 1, limit = 5) => {
  const skip = (page - 1) * limit;
  const teachers = await User.find({ role: "teacher" })
    .select("-password")
    .skip(skip)
    .limit(limit);
  const total = await User.countDocuments({ role: "teacher" });
  return {
    teachers,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalStudents: total,
  };
};

export const deleteUserService = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  return user;
};

export const viewRegistrationRequestService = async (page = 1, limit = 5) => {
  const skip = (page - 1) * limit;
  const userRequest = await User.find({ status: "pending" })
    .select("name email role department course studentId status createdAt")
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments({ status: "pending" });
  return {
    userRequest,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalRequests: total,
  };
};

export const approveOrRejectUserService = async (id, status) => {
  if (!["approved", "rejected"].includes(status)) {
    throw new Error("Invalid Status");
  }

  const user = await User.findByIdAndUpdate(id, { status }, { new: true });
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  return user;
};
