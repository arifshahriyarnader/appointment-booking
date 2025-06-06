import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { appConfig } from "../../config/index.js";
import { authenticateToken } from "../../middleware/index.js";
import { User } from "../../models/index.js";

const router = express.Router();

// registration
router.post("/registration", async (req, res) => {
  try {
    const { name, email, password, role, department, studentId, course } =
      req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Set status based on role
    const status = role === "admin" ? "approved" : "pending";

    // Create new user"
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      department,
      studentId: role === "student" ? studentId : undefined,
      course: role === "teacher" ? course : undefined,
      status, // Admin status is "approved", others are "pending"
    });

    await newUser.save();

    // Customize response message based on role
    const responseMessage =
      role === "admin"
        ? "Admin registered successfully."
        : "User registered successfully. Awaiting admin approval.";

    const responseUser = newUser.toObject();

    res.status(201).json({ message: responseMessage, user: responseUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

//login a user
router.post("/login", async (req, res) => {
  try {
    const { type, email, password, refreshToken } = req.body;
    if (type === "email") {
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(500).json({ message: "User not found" });
      }

      // Check user approval status
      if (user.status === "pending") {
        return res.status(403).json({
          message: "Your registration is pending approval from the admin.",
        });
      }
      if (user.status === "rejected") {
        return res.status(403).json({
          message: "Your registration has been rejected by the admin.",
        });
      }

      await handleEmailLogin({ password, user, res });
    } else if (type === "refresh") {
      if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token not found" });
      } else {
        await handleRefreshToken({ refreshToken, res });
      }
    } else {
      return res.status(400).json({ message: "Invalid login type" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

//get user profile
router.get("/user-profile", authenticateToken, async (req, res) => {
  try {
    const id = req.user._id;
    const user = await User.findById(id);
    if (user) {
      return res.json(user);
    } else {
      return res.status(500).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});



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

async function handleEmailLogin({ password, user, res }) {
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (isValidPassword) {
    const userObj = await generateUserObject(user);
    return res.json(userObj);
  } else {
    return res.status(401).json({ message: "Unable to login" });
  }
}

function generateUserObject(user) {
  const { accessToken, refreshToken } = generateToken(user);
  const userObj = user.toJSON();
  delete userObj.password;

  userObj["accessToken"] = accessToken;
  userObj["refreshToken"] = refreshToken;
  return userObj;
}

function generateToken(user) {
  const accessToken = jwt.sign(
    {
      email: user.email,
      _id: user._id,
      role: user.role,
    },
    appConfig.AUTH.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
  const refreshToken = jwt.sign(
    {
      email: user.email,
      _id: user._id,
      role: user.role,
    },
    appConfig.AUTH.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
  return { accessToken, refreshToken };
}

function handleRefreshToken({ refreshToken, res }) {
  jwt.verify(refreshToken, appConfig.AUTH.JWT_SECRET, async (err, payload) => {
    if (err) {
      return res.status(404).json({ message: "Unauthorized" });
    } else {
      const user = await User.findById(payload._id);
      if (user) {
        const userObj = generateUserObject(user);
        return res.status(200).json(userObj);
      } else {
        return res.status(404).json({ message: "Unauthorized" });
      }
    }
  });
}
