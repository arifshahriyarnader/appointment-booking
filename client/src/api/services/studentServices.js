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

export const getTeacherProfile = async (teacherId) => {
  try {
    const response = await http.get(`/api/student-appointment/teacher/${teacherId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching teacher profile:", error);
    return null;
  }
};

export const searchTeachers = async (query) => {
  try {
    const response = await http.get(`/api/student-appointment/search-teachers`, {
      params: { query },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching teachers:", error);
    return [];
  }
};
