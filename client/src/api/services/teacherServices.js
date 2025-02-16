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
