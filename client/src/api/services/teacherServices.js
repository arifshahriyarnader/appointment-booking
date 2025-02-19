import { http } from "../../common/https";

export const addAvailableHours = async (availhoursPayload) => {
  const response = await http.post("/api/teacher/add", availhoursPayload);
  return response.data;
};

export const getAllAvailhours = async () => {
  try {
    const response = await http.get("/api/teacher/all");
    console.log("Teacher:", response.data);
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

export const getAppointmentRequests = async () => {
  try {
    const response = await http.get(`api/teacher/appointment-status`);
    console.log("Appointment Request:", response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateAppointmentStatus = async (id, updatedData) => {
  try {
    const response = await http.put(
      `/api/teacher/appointment/${id}/status`,
      updatedData
    );
    return response.data;
  } catch (error) {
    console.error("API Update Error:", error);
    throw error;
  }
};

export const dailyAppointmentSchedule = async () => {
  try {
    const response = await http.get(`/api/teacher/schedule/today`);
    console.log("Daily Appointmnets Schedule:", response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const upcomingAppointmentSchedule = async () => {
  try {
    const response = await http.get(`/api/teacher/appointment/upcoming`);
    console.log("Upcoming Appointment Schedule", response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const pastAppointmentSchedule = async () => {
  try {
    const response = await http.get(`/api/teacher/past-schedule/history`);
    console.log("Past Appointments list:", response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
