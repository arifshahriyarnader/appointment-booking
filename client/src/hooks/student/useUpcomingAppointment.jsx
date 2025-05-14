import { useEffect, useState } from "react";
import { upcomingAppointmentList } from "../../api/services/studentServices";

export const useUpcomingAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await upcomingAppointmentList();
        if (data.upcomingAppointments && data.upcomingAppointments.length > 0) {
          setAppointments(data.upcomingAppointments);
        } else {
          setMessage("You have no upcoming appointments.");
        }
      } catch (error) {
        setMessage("Error fetching upcoming appointments.", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);
  return { appointments, loading, message };
};
