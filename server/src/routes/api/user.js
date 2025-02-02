import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authenticateToken } from "../../middleware/index.js";
import { User } from "../../models/index.js";

const router = express.Router();

// registration
router.post("/registration", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      department,
      studentId,
      course,
      availableHours,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Set status based on role
    const status = role === "admin" ? "approved" : "pending";

    // Create new user with status "pending"
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      department,
      studentId: role === "student" ? studentId : undefined,
      course: role === "teacher" ? course : undefined,
      availableHours: role === "teacher" ? availableHours : undefined,
      status, // Admin status is "approved", others are "pending"
    });

    await newUser.save();

    // Customize response message based on role
    const responseMessage =
      role === "admin"
        ? "Admin registered successfully."
        : "User registered successfully. Awaiting admin approval.";

    // Remove `availableHours` from the response if the user is not a teacher
    const responseUser = newUser.toObject();
    if (role !== "teacher") {
      delete responseUser.availableHours;
    }

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

//get all users (only admin)
router.get("/users", authenticateToken, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

//approve or reject user (only admin)
router.put("/users/:id", authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid Status" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: `User ${status} successfully`, user });
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

  // Remove availableHours for admin
  if (user.role === "admin") {
    delete userObj.availableHours;
  }
  userObj["accessToken"] = accessToken;
  userObj["refreshToken"] = refreshToken;
  return userObj;
}

function generateToken(user) {
  const accessToken = jwt.sign(
    {
      email: user.email,
      _id: user._id,
      userType: user.userType,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
  const refreshToken = jwt.sign(
    {
      email: user.email,
      _id: user._id,
      userType: user.userType,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
  return { accessToken, refreshToken };
}

function handleRefreshToken({ refreshToken, res }) {
  jwt.verify(refreshToken, process.env.JWT_SECRET, async (err, payload) => {
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
