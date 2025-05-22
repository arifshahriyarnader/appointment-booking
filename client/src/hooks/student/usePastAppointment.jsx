import { useEffect, useState } from "react";
import { pastAppointmentList } from "../../api/services/studentServices";

export const usePastAppointment = () => {
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
      const data = await pastAppointmentList(page, 5);
      if (data.pastAppointments && data.pastAppointments.length > 0) {
        setAppointments(data.pastAppointments);
        setTotalPages(data.totalPages || 1);
      } else {
        setMessage("You have no past appointments.");
      }
    } catch (error) {
      setMessage("Error fetching past appointments.", error);
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
