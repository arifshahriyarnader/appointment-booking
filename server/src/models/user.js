import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userType: {
      type: String,
      enum: ["admin", "teacher", "student"],
      required: true,
    },
    department: { type: String },
    studentId: { type: String, unique: true, sparse: true }, //only for students
    course: { type: String }, //only for teachers
    availableHours: [
      {
        day: String,
        startTime: String,
        endTime: String,
      },
    ], //only for teachers
  },
  { timestamps: true }
);

export const User = mongoose.model("User", UserSchema);
