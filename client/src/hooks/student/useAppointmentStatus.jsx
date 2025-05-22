import { useEffect, useState } from "react";
import { checkAppointmentStatus } from "../../api/services/studentServices";

export const useAppointmentStatus = () => {
  const [appointments, setAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAppointments(currentPage);
  }, [currentPage]);

  const fetchAppointments = async (page) => {
    const response = await checkAppointmentStatus(page, 5);
    if (response.appointments?.length) {
      setAppointments(response.appointments);
      setTotalPages(response.totalPages || 1);
    } else {
      setMessage(response.message || "You have no booked appointments.");
    }
  };
  return { appointments, currentPage, totalPages, setCurrentPage, message };
};
