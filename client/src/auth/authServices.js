import axios from "axios";
import { appConfig } from "../common/config";

const saveAuthUser = (authUser) =>
  localStorage.setItem(appConfig.CURRENT_USER_KEY, JSON.stringify(authUser));

const getAuthUser = (authUser) =>
  JSON.parse(localStorage.getItem(appConfig.CURRENT_USER_KEY));

export const isUserLoggedIn = () => {
  if (getAuthUser()) {
    return true;
  }
  return false;
};

export const getAccessToken=() =>getAuthUser().accessToken;
export const getRefreshToken=() =>getAuthUser().refreshToken;

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

export const login = async ({ type, email, password, refreshToken }) => {
  try {
    const response = await axios.post(`${appConfig.BASE_URL}/api/users/login`, {
      type,
      email,
      password,
      refreshToken,
    });

    const authUser = {
      user: {
        _id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role,
        status: response.data.status,
      },
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
    };

    saveAuthUser(authUser);
    return authUser;
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem(appConfig.CURRENT_USER_KEY);
};
