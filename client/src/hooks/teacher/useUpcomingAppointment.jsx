import { useState, useEffect } from "react";
import { upcomingAppointmentSchedule } from "../../api/services/teacherServices";
export const useUpcomingAppointment = () => {
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
      const data = await upcomingAppointmentSchedule(page, 5);
      setAppointments(data?.appointments || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      setError("Failed to upcoming appointments schedule", error);
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
