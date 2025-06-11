import mongoose from "mongoose";
import moment from "moment";
import { Appointment, AvailableHour } from "../models/index.js";

// Function to generate 20-minute slots
function generateTimeSlots(startTime, endTime) {
  const slots = [];
  let start = moment(startTime, "hh:mm A");
  const end = moment(endTime, "hh:mm A");

  while (start < end) {
    let nextSlot = start.clone().add(20, "minutes");
    slots.push({
      startTime: start.format("hh:mm A"),
      endTime: nextSlot.format("hh:mm A"),
    });
    start = nextSlot;
  }

  return slots;
}

export const addTeacherAvailableHoursService = async (
  teacherId,
  day,
  date,
  startTime,
  endTime
) => {
  const slots = generateTimeSlots(startTime, endTime);
  const availableHour = new AvailableHour({
    teacher: teacherId,
    day,
    date: new Date(date),
    slots,
  });
  return await availableHour.save();
};

export const updateTeacherAvailableHoursService = async (
  teacherId,
  id,
  day,
  date,
  startTime,
  endTime
) => {
  const slots = generateTimeSlots(startTime, endTime);
  const updateHour = await AvailableHour.findOneAndUpdate(
    { _id: id, teacher: teacherId },
    { day, date: new Date(date), slots },
    { new: true }
  );
  return updateHour;
};

export const getAllTeacherAvailableHoursService = async (
  teacherId,
  current = 1,
  pageSize = 5,
  sort = "asc",
  day
) => {
  const pipeline = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const matchQuery = {
    teacher: new mongoose.Types.ObjectId(teacherId),
    date: { $gte: today },
  };

  if (day) {
    matchQuery.day = day;
  }

  pipeline.push({ $match: matchQuery });

  pipeline.push({
    $sort: { createdAt: sort === "asc" ? 1 : -1 },
  });

  pipeline.push({ $skip: (current - 1) * pageSize });
  pipeline.push({ $limit: pageSize });

  pipeline.push({
    $lookup: {
      from: "users",
      localField: "teacher",
      foreignField: "_id",
      as: "teacher",
    },
  });

  pipeline.push({ $unwind: "$teacher" });

  pipeline.push({
    $project: {
      _id: 1,
      day: 1,
      date: 1,
      slots: 1,
      createdAt: 1,
      teacher: {
        _id: "$teacher._id",
        name: "$teacher.name",
        department: "$teacher.department",
      },
    },
  });

  const availableHours = await AvailableHour.aggregate(pipeline);
  return availableHours;
};

export const deleteTeacherAvailableHoursService = async (id, userId) => {
  const availableHour = await AvailableHour.findById(id);
  if (!availableHour) {
    return {
      success: false,
      status: 404,
      message: "Available hours not found",
    };
  }
  if (availableHour.teacher.toString() !== userId.toString()) {
    return {
      success: false,
      status: 403,
      message: "You can delete your own available hours",
    };
  }
  await AvailableHour.findByIdAndDelete(id);
  return {
    success: true,
    status: 200,
    message: "Available hours deleted successfully",
  };
};

export const getAppointmentRequestService = async (
  teacherId,
  page = 1,
  limit = 5
) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const skip = (page - 1) * limit;
  const total = await Appointment.countDocuments({
    teacher: teacherId,
    date: { $gte: today },
    status: "pending",
  });

  const appointments = await Appointment.find({
    teacher: teacherId,
    date: { $gte: today },
  })
    .populate("student", "name email")
    .sort({ date: 1 })
    .skip(skip)
    .limit(limit);
  return {
    appointments,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalAppointments: total,
  };
};
