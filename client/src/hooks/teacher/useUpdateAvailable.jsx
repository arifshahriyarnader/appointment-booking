import { useState } from "react";
import { updateAvailhours } from "../../api/services/teacherServices";

export const useUpdateAvailable = ({ fetchAvailableHours }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState(null);
  const [formData, setFormData] = useState({
    date: "",
    day: "",
    startTime: "",
    endTime: "",
  });

  const convertTo24HourFormat = (timeStr) => {
    if (!timeStr) return "";

    // Case 1: Already in 24-hour format (HH:mm)
    if (/^\d{2}:\d{2}$/.test(timeStr)) return timeStr;

    // Case 2: Convert 12-hour format like "2:00 PM"
    const regex = /(\d{1,2}):(\d{2})\s?(AM|PM)/i;
    const match = timeStr.match(regex);

    if (!match) return "";

    let [hours, minutes, period] = match;
    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);

    if (period.toUpperCase() === "PM" && hours < 12) hours += 12;
    if (period.toUpperCase() === "AM" && hours === 12) hours = 0;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}`;
  };

  // Open Modal & Pre-fill Form Data
  const handleEdit = (hour) => {
    setSelectedHour(hour);

    const firstSlot = hour.slots[0] || { startTime: "", endTime: "" };
    const lastSlot = hour.slots[hour.slots.length - 1] || {
      startTime: "",
      endTime: "",
    };

    const formattedDate = hour.date
      ? new Date(hour.date).toISOString().split("T")[0]
      : "";

    setFormData({
      date: formattedDate,
      day: hour.day || "",
      startTime: convertTo24HourFormat(firstSlot.startTime),
      endTime: convertTo24HourFormat(lastSlot.endTime),
    });

    setIsModalOpen(true);
  };

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");

    const { startTime, endTime } = formData;

    if (!startTime || !endTime) {
      alert("Please select both start and end time.");
      return;
    }

    console.log("Start Time:", startTime, "End Time:", endTime);

    const [sh, sm] = startTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);

    const startTotal = sh * 60 + sm;
    const endTotal = eh * 60 + em;

    console.log("Total Minutes:", startTotal, endTotal);

    if (startTotal >= endTotal) {
      alert("Start time must be earlier than end time.");
      return;
    }

    // If valid, continue
    try {
      const updatedData = {
        date: formData.date,
        day: formData.day,
        startTime,
        endTime,
      };
      await updateAvailhours(selectedHour._id, updatedData);
      fetchAvailableHours();
      setIsModalOpen(false);
      alert("Available hour updated successfully!");
    } catch (error) {
      console.error("Update failed:", error);
      alert(
        "Failed to update. " + (error.response?.data?.message || "Try again.")
      );
    }
  };

  return {
   isModalOpen,
    setIsModalOpen,
    formData,
    handleEdit,
    handleChange,
    handleSubmit,
  };
};
