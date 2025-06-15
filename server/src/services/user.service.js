import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { appConfig } from "../config/index.js";
import { User } from "../models/index.js";

export const registrationService = async ({
  name,
  email,
  password,
  role,
  department,
  studentId,
  course,
}) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return {
      success: false,
      status: 400,
      message: "User already exists",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const status = role === "admin" ? "approved" : "pending";
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    role,
    department,
    studentId: role === "student" ? studentId : undefined,
    course: role === "teacher" ? course : undefined,
    status,
  });

  await newUser.save();
  const responseMessage =
    role === "admin"
      ? "Admin registered successfully."
      : "User registered successfully. Awaiting admin approval.";
  const responseUser = newUser.toObject();
  delete responseUser.password;
  return {
    success: true,
    status: 201,
    message: responseMessage,
    user: responseUser,
  };
};

export const emailLoginService = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    return { success: false, status: 404, message: "User not found" };
  }
  if (user.status === "pending") {
    return {
      success: false,
      status: 403,
      message: "Your registration is pending approval from the admin.",
    };
  }

  if (user.status === "rejected") {
    return {
      success: false,
      status: 403,
      message: "Your registration has been rejected by the admin.",
    };
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return { success: false, status: 401, message: "Unable to login" };
  }
  const tokens = generateToken(user);
  const userObj = user.toObject();
  delete userObj.password;
  return {
    success: true,
    status: 200,
    user: { ...userObj, ...tokens },
  };
};

export const getUserProfileService = async (id) => {
  const user = await User.findById(id).select("-password");
  if (!user) {
    return {
      success: false,
      status: 404,
      message: "User not found",
    };
  }
  return { success: true, user, status: 200 };
};

export const refreshTokenService = async (refreshToken) => {
  return new Promise((resolve) => {
    jwt.verify(
      refreshToken,
      appConfig.AUTH.JWT_SECRET,
      async (err, payload) => {
        if (err) {
          return resolve({
            success: false,
            status: 401,
            message: "Unauthorized",
          });
        }

        const user = await User.findById(payload._id);
        if (!user) {
          return resolve({
            success: false,
            status: 401,
            message: "Unauthorized",
          });
        }

        const tokens = generateToken(user);
        const userObj = user.toObject();
        delete userObj.password;

        return resolve({
          success: true,
          status: 200,
          user: { ...userObj, ...tokens },
        });
      }
    );
  });
};

function generateToken(user) {
  const accessToken = jwt.sign(
    {
      _id: user._id,
      email: user.email,
      role: user.role,
    },
    appConfig.AUTH.JWT_SECRET,
    { expiresIn: "1d" }
  );

  const refreshToken = jwt.sign(
    {
      _id: user._id,
      email: user.email,
      role: user.role,
    },
    appConfig.AUTH.JWT_SECRET,
    { expiresIn: "30d" }
  );

  return { accessToken, refreshToken };
}
