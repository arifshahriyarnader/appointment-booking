import express from "express";
import { authenticateToken } from "../../middleware/index.js";
import {
  emailLoginController,
  getUserProfileController,
  registrationController,
  updateUserProfileController,
} from "../../controllers/user.controller.js";

const router = express.Router();

router.post("/registration", registrationController);

router.post("/login", emailLoginController);

router.get("/user-profile", authenticateToken, getUserProfileController);

router.put("/:id", authenticateToken, updateUserProfileController);

export default router;
