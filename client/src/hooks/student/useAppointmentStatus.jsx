import { useEffect, useState } from "react";
import { checkAppointmentStatus } from "../../api/services/studentServices";

export const useAppointmentStatus = () => {
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const response = await checkAppointmentStatus();
    if (response.appointments?.length) {
      setAppointments(response.appointments);
    } else {
      setMessage(response.message || "You have no booked appointments.");
    }
  };
  return { appointments, message };
};
