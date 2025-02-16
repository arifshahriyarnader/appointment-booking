import { http } from "../../common/https";

export const addAvailableHours = async (availhoursPayload) => {
  const response = await http.post("/api/teacher/add", availhoursPayload);
  return response.data;
};

export const getAllAvailhours = async () => {
  try {
    const response = await http.get("/api/teacher/all");
    console.log("Products:", response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateAvailhours = async (id, updatedData) => {
  try {
    const response = await http.put(`/api/teacher/update/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("API Update Error:", error);
    throw error;
  }
};

export const deleteAvailhours = async (id) => {
  const response = await http.delete(`api/teacher/${id}`);
  return response.data;
};
