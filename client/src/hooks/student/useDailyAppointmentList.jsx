import { useEffect, useState } from "react";
import { todaysAppointmentList } from "../../api/services/studentServices";

export const useDailyAppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await todaysAppointmentList();
        if (data.todayAppointments && data.todayAppointments.length > 0) {
          setAppointments(data.todayAppointments);
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

    fetchAppointments();
  }, []);
  return { appointments, loading, message };
};
