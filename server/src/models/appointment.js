import mongoose from "mongoose";

const TimeSlotSchema = new mongoose.Schema({
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
});

const AppointmentSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    slots: { type: TimeSlotSchema, required: true }, // Example: "10:00 AM - 10:20 AM"
    course: { type: String, required: true },
    agenda: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Appointment = mongoose.model("Appointment", AppointmentSchema);
