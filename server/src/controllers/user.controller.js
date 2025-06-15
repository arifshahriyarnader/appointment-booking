import {
  emailLoginService,
  getUserProfileService,
  registrationService,
} from "../services/user.service.js";

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

export const emailLoginController = async (req, res) => {
  try {
    const { type, email, password, refreshToken } = req.body;
    if (type === "email") {
      const result = await emailLoginService({ email, password });
      return res
        .status(result.status)
        .json(result.success ? result.user : { message: result.message });
    }
    if (type === "refresh") {
      if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token not found" });
      }
      const result = await refreshTokenService(refreshToken);
      return res
        .status(result.status)
        .json(result.success ? result.user : { message: result.message });
    }
    return res.status(400).json({ message: "Invalid login type" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getUserProfileController = async (req, res) => {
  try {
    const id = req.user._id;
    const result = await getUserProfileService(id);
    if (!result.success) {
      return res.status(result.status).json({ message: result.message });
    }
    res.status(200).json(result.user);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
