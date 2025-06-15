import express from "express";
import { authenticateToken } from "../../middleware/index.js";
import { User } from "../../models/index.js";
import {
  emailLoginController,
  getUserProfileController,
  registrationController,
} from "../../controllers/user.controller.js";

const router = express.Router();

router.post("/registration", registrationController);

router.post("/login", emailLoginController);

router.get("/user-profile", authenticateToken, getUserProfileController);

//update user
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const userBody = req.body;
    const updateUser = await User.findByIdAndUpdate(id, userBody, {
      new: true,
    });
    if (updateUser) {
      return res.status(200).json(updateUser);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
