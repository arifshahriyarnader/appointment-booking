import { useEffect, useState } from "react";
import { pastAppointmentSchedule } from "../../api/services/teacherServices";

export const usePastAppointment = () => {
  const [pastAppointments, setPastAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await pastAppointmentSchedule();
        setPastAppointments(data?.pastAppointments || []);
      } catch (error) {
        setError("Failed to daily appointments schedule", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return { pastAppointments, loading, error };
};
