import { useEffect, useState } from "react";
import { upcomingAppointmentList } from "../../api/services/studentServices";

export const useUpcomingAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAppointments(currentPage);
  }, [currentPage]);

  const fetchAppointments = async (page) => {
    try {
      const data = await upcomingAppointmentList(page, 5);
      if (data.upcomingAppointments && data.upcomingAppointments.length > 0) {
        setAppointments(data.upcomingAppointments);
        setTotalPages(data.totalPages || 1);
      } else {
        setMessage("You have no upcoming appointments.");
      }
    } catch (error) {
      setMessage("Error fetching upcoming appointments.", error);
    } finally {
      setLoading(false);
    }
  };
  return {
    appointments,
    currentPage,
    totalPages,
    setCurrentPage,
    loading,
    message,
  };
};
