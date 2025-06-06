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

export const getAppointmentRequests = async (page = 1, limit = 5) => {
  try {
    const response = await http.get(
      `api/teacher/appointment-status?page=${page}&limit=${limit}`
    );
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

export const dailyAppointmentSchedule = async (page = 1, limit = 5) => {
  const response = await http.get(
    `/api/teacher/schedule-today?page=${page}&limit=${limit}`
  );
  console.log("Daily Appointment Schedule:", response.data);
  return response?.data || { appointments: [] };
};

export const upcomingAppointmentSchedule = async (page = 1, limit = 5) => {
  try {
    const response = await http.get(
      `/api/teacher/appointment-upcoming?page=${page}&limit=${limit}`
    );
    console.log("Upcoming Appointment Schedule", response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const pastAppointmentSchedule = async (page = 1, limit = 5) => {
  try {
    const response = await http.get(
      `/api/teacher/past-schedule-history?page=${page}&limit=${limit}`
    );
    console.log("Past Appointments list:", response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
