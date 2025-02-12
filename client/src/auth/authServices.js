import axios from "axios";
import { appConfig } from "../common/config";

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
