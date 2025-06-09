import { http } from "../../common/https";

export const getAllTeachersList = async (page = 1, limit = 5) => {
  try {
    const response = await http.get(
      `/api/student/all-teachers?page=${page}&limit=${limit}`
    );
    console.log("All Teacher List:", response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getTeacherProfile = async (teacherId) => {
  try {
    const response = await http.get(
      `/api/student/teacher/${teacherId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching teacher profile:", error);
    return null;
  }
};

export const searchTeachers = async (query) => {
  try {
    const response = await http.get(
      `/api/student/search-teachers`,
      {
        params: { query },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error searching teachers:", error);
    return [];
  }
};

export const checkTeacherBookedSlots = async (teacherId) => {
  try {
    const response = await http.get(
      `/api/student/teacher/${teacherId}/upcoming-booked-slots`
    );
    console.log("Teacher Booked Slots:", response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const bookAppointment = async (appointmentData) => {
  try {
    console.log("Attempting to book appointment:", appointmentData);

    const response = await http.post(
      "/api/student/appointment",
      appointmentData
    );

    console.log("Response after booking:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error booking appointment:", error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

export const checkAppointmentStatus = async (page=1, limit=5) => {
  try {
    const response = await http.get(
      `/api/student/appointment-status?page=${page}&limit=${limit}`
    );
    console.log("Appointment Status:", response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const todaysAppointmentList = async (page=1, limit=5) => {
  try {
    const response = await http.get(
      `/api/student/appointment-today?page=${page}&limit=${limit}`
    );
    console.log("Todays Appointments List:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in API call:", error);
    return { error: true, message: "Failed to fetch appointments" };
  }
};

export const pastAppointmentList = async (page=1, limit=5) => {
  try {
    const response = await http.get(
      `/api/student/past-appointment-history?page=${page}&limit=${limit}`
    );
    console.log("Past Appointments List:", response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const upcomingAppointmentList = async (page=1, limit=5) => {
  try {
    const response = await http.get(
      `/api/student/appointment-upcoming?page=${page}&limit=${limit}`
    );
    console.log("Past Appointments List:", response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
