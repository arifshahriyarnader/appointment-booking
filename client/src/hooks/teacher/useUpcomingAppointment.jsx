import { useState, useEffect } from "react";
import { upcomingAppointmentSchedule } from "../../api/services/teacherServices";
export const useUpcomingAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await upcomingAppointmentSchedule();
        setAppointments(data?.appointments || []);
      } catch (error) {
        setError("Failed to upcoming appointments schedule", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return { appointments, loading, error };
};
