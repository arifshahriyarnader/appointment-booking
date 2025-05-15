import { addAvailableHours } from "../../api/services/teacherServices";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useAddSlot = () => {
  const [date, setDate] = useState("");
  const [day, setDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState({
    title: "",
    description: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    console.log({ date, day, startTime, endTime });
    const payload = { date, day, startTime, endTime };

    if (startTime >= endTime) {
      setAlertMessage({
        title: "Error",
        description: "Start time must be before end time.",
      });
      setAlertOpen(true);
      setLoading(false);
      return;
    }
    try {
      await addAvailableHours(payload);
      setDate("");
      setDay("");
      setStartTime("");
      setEndTime("");
      setAlertMessage({
        title: "Success",
        description: "Slot added successfully!",
      });
      setAlertOpen(true);
      navigate("/teacher-dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add slot");
    } finally {
      setLoading(false);
    }
  };
  return {
    date,
    setDate,
    day,
    setDay,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    loading,
    error,
    alertOpen,
    setAlertOpen,
    alertMessage,
    handleSubmit,
  };
};
