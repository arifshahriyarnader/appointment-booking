import { useEffect, useState } from "react";
import { dailyAppointmentSchedule } from "../../api/services/teacherServices";

export const useDailyAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await dailyAppointmentSchedule();
        setAppointments(data?.appointments || []);
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to fetch appointments"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return { appointments, loading, error };
};
