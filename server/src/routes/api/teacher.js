import express from "express";
import moment from "moment";
import { authenticateToken } from "../../middleware/index.js";
import { Appointment, AvailableHour } from "../../models/index.js";

const router = express.Router();

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

//add available hours
router.post("/add", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res
        .status(403)
        .json({ message: "Only teachers can add available hours" });
    }

    const { day, date, startTime, endTime } = req.body;

    if (!day || !date || !startTime || !endTime) {
      return res.status(400).json({
        message: "All fields (day, date, startTime, endTime) are required.",
      });
    }

    const newAvailableHour = new AvailableHour({
      teacher: req.user._id,
      day,
      date: new Date(date),
      slots: generateTimeSlots(startTime, endTime),
    });

    const savedAvailableHour = await newAvailableHour.save();

    res.status(201).json({
      message: "Available hour added successfully",
      availableHour: savedAvailableHour,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

//update available hours
router.put("/update/:id", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res
        .status(403)
        .json({ message: "Only teachers can update available hours" });
    }

    const { id } = req.params;
    const { day, startTime, endTime } = req.body;

    if (!day || !startTime || !endTime) {
      return res.status(400).json({
        message: "All fields (day, startTime, endTime) are required.",
      });
    }

    const slots = generateTimeSlots(startTime, endTime);

    const updatedAvailableHour = await AvailableHour.findOneAndUpdate(
      { _id: id, teacher: req.user._id },
      { day, slots },
      { new: true }
    );

    if (!updatedAvailableHour) {
      return res.status(404).json({ message: "Available hour not found" });
    }

    res.status(200).json({
      message: "Available hour updated successfully",
      availableHour: updatedAvailableHour,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

//get all available hours
router.get("/all", async (req, res) => {
  try {
    let current = parseInt(req.query.current) || 1;
    let pageSize = parseInt(req.query.pageSize) || 10;
    let sort = req.query.sort || "asc";
    let teacherId = req.query.teacherId;
    let day = req.query.day;

    const pipeline = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Optional filters (Teacher & Day)
    const matchQuery = {
      date: { $gte: today }, // 🔹 Only include upcoming or today's slots
    };
    if (teacherId) matchQuery.teacher = new mongoose.Types.ObjectId(teacherId);
    if (day) matchQuery.day = day;

    pipeline.push({ $match: matchQuery });

    // Sorting (ascending or descending)
    pipeline.push({
      $sort: { createdAt: sort === "asc" ? 1 : -1 },
    });

    // Pagination
    pipeline.push({ $skip: (current - 1) * pageSize });
    pipeline.push({ $limit: pageSize });

    // Populate teacher details (name, department)
    pipeline.push({
      $lookup: {
        from: "users",
        localField: "teacher",
        foreignField: "_id",
        as: "teacher",
      },
    });

    pipeline.push({
      $unwind: "$teacher",
    });

    // Selecting required fields
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

    res.status(200).json({
      current,
      pageSize,
      totalRecords: availableHours.length,
      availableHours,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

//delete available hours
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const availableHour = await AvailableHour.findById(id);
    if (!availableHour) {
      return res.status(404).json({ message: "Available hours not found" });
    }
    if (availableHour.teacher.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ message: "You can delete your own available hours" });
    }
    await AvailableHour.findByIdAndDelete(id);
    res.status(200).json({ message: "Available hours deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

//teacher view who can sent the appointments request
router.get("/appointment-status", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res
        .status(401)
        .json({ message: "Only teacher can view appointments request" });
    }
    const appointments = await Appointment.find({ teacher: req.user._id })
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ message: appointments });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

//teacher approve or reject appointments request
router.put("/appointment/:id/status", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res
        .status(403)
        .json({ message: "Only Teacher can update appointment status" });
    }
    const { id } = req.params;
    const { status } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    const appointment = await Appointment.findOne({
      _id: id,
      teacher: req.user._id,
    });
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    appointment.status = status;
    await appointment.save();
    res
      .status(200)
      .json({ message: `Appointment ${status} successfully`, appointment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

//daily appointment schedules
router.get("/schedule/today", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res
        .status(403)
        .json({ message: "Only Teacher can view daily appointment schedule" });
    }
    const today = new Date().toISOString().split("T")[0];
    const appointments = await Appointment.find({
      teacher: req.user._id,
      date: today,
      status: "approved",
    })
      .populate("student", "name email")
      .populate("teacher", "course");
    if (appointments.length === 0) {
      return res
        .status(403)
        .json({ message: "You have no appointment schedule for today" });
    }
    res.status(200).json({ appointments });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

//upcoming appointment schedule
router.get("/appointment/upcoming", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({
        message: "Only Teacher can view upcoming appointment schedule",
      });
    }
    const today = new Date();

    const appointments = await Appointment.find({
      teacher: req.user._id,
      date: { $gte: today.toISOString().split("T")[0] },
      status: "approved",
    })
      .sort({ date: 1, slots: 1 })
      .populate("student", "name email")
      .populate("teacher", "course");
    res.status(200).json({ message: appointments });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
