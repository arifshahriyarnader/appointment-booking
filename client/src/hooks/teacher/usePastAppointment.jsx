import { useEffect, useState } from "react";
import { pastAppointmentSchedule } from "../../api/services/teacherServices";

export const usePastAppointment = () => {
  const [pastAppointments, setPastAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAppointments(currentPage);
  }, [currentPage]);

  const fetchAppointments = async (page) => {
    try {
      const data = await pastAppointmentSchedule(page, 5);
      setPastAppointments(data?.pastAppointments || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      setError("Failed to daily appointments schedule", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    pastAppointments,
    currentPage,
    setCurrentPage,
    totalPages,
    loading,
    error,
  };
};
