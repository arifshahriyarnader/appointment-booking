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
