import { useEffect, useState } from "react";
import { pastAppointmentList } from "../../api/services/studentServices";

export const usePastAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await pastAppointmentList();
        if (data.pastAppointments && data.pastAppointments.length > 0) {
          setAppointments(data.pastAppointments);
        } else {
          setMessage("You have no past appointments.");
        }
      } catch (error) {
        setMessage("Error fetching past appointments.", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);
  return { appointments, loading, message };
};
