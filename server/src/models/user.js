import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "teacher", "student"],
      required: true,
    },
    department: { type: String },
    studentId: { type: String, unique: true, sparse: true }, // only for students
    course: { type: String }, // only for teachers
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    }, // Admin Approval
  },
  { timestamps: true }
);

export const User = mongoose.model("User", UserSchema);
