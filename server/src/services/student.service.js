import { AvailableHour, User } from "../models/index.js";

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

export const getTeacherWithAvailableHoursService = async (teacherId) => {
  const teacher = await User.findById(teacherId).select(
    "name email department course role"
  );
  if (!teacher || teacher.role !== "teacher") {
    return { notFound: true };
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const availableHours = await AvailableHour.find({
    teacher: teacherId,
    date: { $gte: today },
  });
  return {
    teacher,
    availableHours,
  };
};
