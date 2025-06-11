import mongoose from "mongoose";
import moment from "moment";
import { AvailableHour } from "../models/index.js";

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
