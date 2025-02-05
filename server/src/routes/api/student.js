import express from "express";
import { authenticateToken } from "../../middleware/index.js";
import { User, AvailableHour } from "../../models/index.js";
const router = express.Router();

//get teacher profile with available hours
router.get("/teacher/:id", async (req, res) => {
  try {
    const teacher = await User.findById(req.params.id).select(
      "name email department course role"
    );
    if(!teacher || teacher.role !== "teacher"){
        return res.status(404).json({message:"Teacher Not found"})
    }
    const availableHours=await AvailableHour.find({teacher:req.params.id});
    res.status(200).json({teacher, availableHours})
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
