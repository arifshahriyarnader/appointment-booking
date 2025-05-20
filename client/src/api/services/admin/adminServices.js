import { http } from "../../../common/https";

export const userRegistrationRequest = async () => {
  try {
    const response = await http.get("/api/admin/registration-request");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const userRegistrationRequestUpdate = async (id, status) => {
  try {
    const response = await http.put(`/api/admin/users/${id}`, status);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllTeacher = async () => {
  try {
    const response = await http.get("/api/admin/all-teachers");
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllStudent = async () => {
  try {
    const response = await http.get("/api/admin/all-students");
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await http.delete(`/api/admin/users/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const addTeacher = async (teacherAdd) => {
  try {
    const response = await http.post(
      "/api/admin/admin/register-user",
      teacherAdd
    );
    console.log("Added Teacher:", response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const addStudent = async (studentAdd) => {
  try {
    const response = await http.post(
      "/api/admin/admin/register-user",
      studentAdd
    );
    console.log("Added Student:", response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
