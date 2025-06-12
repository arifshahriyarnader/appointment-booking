import { registrationService } from "../services/user.service.js";

export const registrationController = async (req, res) => {
  try {
    const result = await registrationService(req.body);
    if (!result.success) {
      return res.status(result.status).json({ message: result.message });
    }
    res.status(result.status).json({
      message: result.message,
      user: result.user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
