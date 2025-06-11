import express from "express";
import { authenticateToken } from "../../middleware/index.js";
import {
  addTeacherAvailableHoursController,
  deleteTeacherAvailableHoursController,
  getAllTeacherAvailableHoursController,
  getAppointmentRequestController,
  getTodayAppointmentController,
  getUpcomingAppointmentController,
  pastAppointmentHistoryController,
  updateAppointmentStatusController,
  updateTeacherAvailableHoursController,
} from "../../controllers/teacher.controller.js";

const router = express.Router();

router.post("/add", authenticateToken, addTeacherAvailableHoursController);

router.put(
  "/update/:id",
  authenticateToken,
  updateTeacherAvailableHoursController
);

router.get("/all", authenticateToken, getAllTeacherAvailableHoursController);

router.delete("/:id", authenticateToken, deleteTeacherAvailableHoursController);

router.get(
  "/appointment-status",
  authenticateToken,
  getAppointmentRequestController
);

router.put(
  "/appointment/:id/status",
  authenticateToken,
  updateAppointmentStatusController
);

router.get("/schedule-today", authenticateToken, getTodayAppointmentController);

router.get(
  "/appointment-upcoming",
  authenticateToken,
  getUpcomingAppointmentController
);

router.get(
  "/past-schedule-history",
  authenticateToken,
  pastAppointmentHistoryController
);

export default router;
