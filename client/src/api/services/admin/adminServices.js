import { http } from "../../../common/https";

export const userRegistrationRequest = async () => {
  try {
    const response = await http.get("/api/users/registration-request");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const userRegistrationRequestUpdate = async (id, status) => {
  try {
    const response = await http.put(`/api/users/users/${id}`, status);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
