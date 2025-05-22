import { useEffect, useState } from "react";
import { todaysAppointmentList } from "../../api/services/studentServices";

export const useDailyAppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [currentPage, setCurrentPage] =useState(1);
 const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAppointments(currentPage);
  }, [currentPage]);

  const fetchAppointments = async (page) => {
    try {
      const data = await todaysAppointmentList(page, 5);
      if (data.todayAppointments && data.todayAppointments.length > 0) {
        setAppointments(data.todayAppointments);
        setTotalPages(data.totalPages || 1)
      } else {
        setMessage("You have no appointment schedule for today");
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setMessage("Error fetching appointments");
    } finally {
      setLoading(false);
    }
  };
  return { appointments, currentPage, totalPages,setCurrentPage, loading, message };
};
