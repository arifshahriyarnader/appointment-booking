import { http } from "../../common/https";

export const getAllTeachersList = async () => {
  try {
    const response = await http.get("/api/student-appointment/all-teachers");
    console.log("All Teacher List:", response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
