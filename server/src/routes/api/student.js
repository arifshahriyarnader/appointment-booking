import express from "express";
import { authenticateToken } from "../../middleware/index.js";

import {
  bookAppointmentController,
  cancelStudentAppointmentController,
  checkAppointmentStatusController,
  getAllApprovedTeachersController,
  getTeacherWithAvailableHoursController,
  getUpcomingBookedSlotsController,
  pastAppointmentHistoryController,
  searchApprovedTeachersController,
  todayAppointmentListController,
} from "../../controllers/student.controller.js";
const router = express.Router();

router.get("/all-teachers", getAllApprovedTeachersController);

router.get("/teacher/:id", getTeacherWithAvailableHoursController);

router.get("/search-teachers", searchApprovedTeachersController);

router.get(
  "/teacher/:id/upcoming-booked-slots",
  getUpcomingBookedSlotsController
);

router.post("/appointment", authenticateToken, bookAppointmentController);

router.get(
  "/appointment-status",
  authenticateToken,
  checkAppointmentStatusController
);

router.put(
  "/appointment/cancel/:id",
  authenticateToken,
  cancelStudentAppointmentController
);

router.get(
  "/past-appointment-history",
  authenticateToken,
  pastAppointmentHistoryController
);

router.get(
  "/appointment-today",
  authenticateToken,
  todayAppointmentListController
);

router.get(
  "/appointment-upcoming",
  authenticateToken,
  todayAppointmentListController
);

export default router;
