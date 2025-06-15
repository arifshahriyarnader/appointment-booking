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

router.post("/admin/register-user", authenticateToken, registerUserController);

router.get("/all-students", authenticateToken, getAllStudentsController);

router.get("/all-teachers", authenticateToken, getAllTeachersController);

router.delete("/users/:id", authenticateToken, deleteUserController);

router.get(
  "/registration-request",
  authenticateToken,
  viewRegistrationRequestController
);

router.put("/users/:id", authenticateToken, approveOrRejectUserController);

export default router;
