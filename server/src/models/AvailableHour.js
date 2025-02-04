import mongoose from "mongoose";


const TimeSlotSchema = new mongoose.Schema({
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
});

const AvailableHourSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    day: { type: String, required: true },
    date: { type: Date, required: true }, 
    slots: [TimeSlotSchema], // Automatically generated slots
  },
  { timestamps: true }
);

export const AvailableHour = mongoose.model(
  "AvailableHour",
  AvailableHourSchema
);
