import { useEffect, useState } from "react";
import { dailyAppointmentSchedule } from "../../api/services/teacherServices";

export const useDailyAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAppointments(currentPage);
  }, [currentPage]);
  const fetchAppointments = async (page) => {
    try {
      const data = await dailyAppointmentSchedule(page, 5);
      setAppointments(data?.appointments || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch appointments");
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
    error,
  };
};
