import express from "express";
import { authenticateToken } from "../../middleware/index.js";
import {
  approveOrRejectUserController,
  deleteUserController,
  getAllStudentsController,
  getAllTeachersController,
  registerUserController,
  viewRegistrationRequestController,
} from "../../controllers/admin.controller.js";

const router = express.Router();

//admin create teacher or student
router.post("/admin/register-user", authenticateToken, registerUserController);

//get all students
router.get("/all-students", authenticateToken, getAllStudentsController);

//get all teachers
router.get("/all-teachers", authenticateToken, getAllTeachersController);

//delete user
router.delete("/users/:id", authenticateToken, deleteUserController);

//view registration request (admin only)
router.get(
  "/registration-request",
  authenticateToken,
  viewRegistrationRequestController
);

//approve or reject user (only admin)
router.put("/users/:id", authenticateToken, approveOrRejectUserController);

export default router;
