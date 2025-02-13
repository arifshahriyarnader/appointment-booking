import axios from "axios";
import { appConfig } from "../common/config";

const saveAuthUser = (authUser) =>
  localStorage.setItem(appConfig.CURRENT_USER_KEY, JSON.stringify(authUser));

const getAuthUser = (authUser) =>
  JSON.parse(localStorage.getItem(appConfig.CURRENT_USER_KEY));

export const signup = ({
  name,
  email,
  password,
  role,
  department,
  course,
  studentId,
}) =>
  axios.post(`${appConfig.BASE_URL}/api/users/registration`, {
    name,
    email,
    password,
    role,
    department,
    course: role === "teacher" ? course : undefined,
    studentId: role === "student" ? studentId : undefined,
  });

export const login = async ({ type, email, password }) => {
  try {
    const response = await axios.post(`${appConfig.BASE_URL}/api/users/login`, {
      type,
      email,
      password,
    });

    const authUser = {
      user: {
        _id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role,
        status: response.data.status,
      },
      token: response.data.accessToken,
      refreshToken: response.data.refreshToken,
    };

    saveAuthUser(authUser);
    return authUser;
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    throw error;
  }
};
