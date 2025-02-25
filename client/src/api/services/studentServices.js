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
    const response = await http.get(
      `/api/student-appointment/teacher/${teacherId}`
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
      `/api/student-appointment/search-teachers`,
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
      `/api/student-appointment/teacher/${teacherId}/upcoming-booked-slots`
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
      "/api/student-appointment/appointment",
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

export const checkAppointmentStatus=async() =>{
  try{
    const response=await http.get("/api/student-appointment/appointment-status");
    console.log("Appointment Status:",response.data)
    return response.data
  }
  catch(error){
    console.log(error)
  }
}

export const todaysAppointmentList=async()=>{
  try{
    const response=await http.get("/api/student-appointment/appointment/today");
    console.log("Todays Appointments List:", response.data);
    return response.data
  }
  catch(error){
    console.log(error)
  }
}