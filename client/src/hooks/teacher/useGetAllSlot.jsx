import { useEffect, useState } from "react";
import {
  getAllAvailhours,
  deleteAvailhours,
  updateAvailhours,
} from "../../api/services/teacherServices";

export const useGetAllSlot = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [formData, setFormData] = useState({
    date: "",
    day: "",
    startTime: "",
    endTime: "",
  });
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState({
    title: "",
    description: "",
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState({ id: null });

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      const data = await getAllAvailhours();
      setSlots(data?.availableHours || []);
    } catch (error) {
      setError("Failed to load slots", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Edit Button Click (Open Modal)
  const handleEdit = (slot) => {
    setSelectedSlot(slot);

    setFormData({
      date: slot.date ? new Date(slot.date).toISOString().split("T")[0] : "",
      day: slot.day || "",
      startTime: slot.slots.length > 0 ? slot.slots[0].startTime : "",
      endTime:
        slot.slots.length > 0 ? slot.slots[slot.slots.length - 1].endTime : "",
    });

    setIsModalOpen(true);
  };

  // Handle Form Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateTimeSlots = (startTime, endTime) => {
    const slots = [];
    let start = new Date(`1970-01-01T${startTime}:00`);
    let end = new Date(`1970-01-01T${endTime}:00`);

    while (start < end) {
      let nextSlot = new Date(start.getTime() + 20 * 60000); // Add 20 minutes

      slots.push({
        startTime: formatAMPM(start),
        endTime: formatAMPM(nextSlot),
      });

      start = nextSlot;
    }

    return slots;
  };

  // Helper function to format time in 12-hour AM/PM format
  const formatAMPM = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert 0-hour (midnight) to 12
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return `${hours}:${minutes} ${ampm}`;
  };

  // Handle Update Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.startTime >= formData.endTime) {
      return setAlertMessage({
        title: "Invalid Time",
        description: "Start time must be earlier than end time.",
      });
    }
    try {
      await updateAvailhours(selectedSlot._id, {
        date: formData.date,
        day: formData.day,
        startTime: formData.startTime,
        endTime: formData.endTime,
      });

      setSlots((prev) =>
        prev.map((s) =>
          s._id === selectedSlot._id
            ? {
                ...s,
                date: formData.date,
                day: formData.day,
                slots: generateTimeSlots(formData.startTime, formData.endTime),
              }
            : s
        )
      );
      setIsModalOpen(false);
      setAlertMessage({
        title: "Success",
        description: "Available hour updated successfully!",
      });
      setAlertOpen(true);
    } catch (error) {
      setAlertMessage({
        title: "Error",
        description:
          "Failed to update. " +
          (error.response?.data?.message || "Try again."),
      });
      setAlertOpen(true);
    }
  };

  // Handle Delete
  const showConfirmation = (id) => {
    setCurrentAction({ id });
    setAlertMessage({
      title: "Delete Confirmation",
      description: "Are you sure you want to delete this available hour?",
      showCancel: true,
    });
    setConfirmOpen(true);
  };
  const handleDelete = async () => {
    try {
      const { id } = currentAction;
      await deleteAvailhours(id);
      setSlots((prev) => prev.filter((slot) => slot._id !== id));
      setAlertMessage({
        title: "Success",
        description: "Available hour deleted successfully!",
      });
      setAlertOpen(true);
    } catch (error) {
      setAlertMessage({
        title: "Error",
        description:
          "Failed to delete. " +
          (error.response?.data?.message || "Try again."),
      });
      setAlertOpen(true);
    } finally {
      setConfirmOpen(false);
    }
  };

  return {
    slots,
    loading,
    error,
    isModalOpen,
    setIsModalOpen,
    formData,
    alertOpen,
    setAlertOpen,
    alertMessage,
    confirmOpen,
    setConfirmOpen,
    showConfirmation,
    handleChange,
    handleEdit,
    handleDelete,
    handleSubmit,
  };
};
