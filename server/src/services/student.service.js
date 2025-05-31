import { User } from "../models/index.js";

export const getAllApprovedTeachersService = async (page = 1, limit = 5) => {
  const skip = (page - 1) * limit;
  const teacher = await User.find({
    role: "teacher",
    status: "approved",
  })
    .select("-password")
    .skip(skip)
    .limit(limit);
  const total = await User.countDocuments({
    role: "teacher",
    status: "approved",
  });
  return {
    teacher,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalTeachers: total,
  };
};
