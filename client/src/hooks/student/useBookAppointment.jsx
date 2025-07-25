import { useEffect, useState } from "react";
import {
  bookAppointment,
  checkTeacherBookedSlots,
  generateAIAgenda,
  getAllTeachersList,
} from "../../api/services/studentServices";

export const useBookAppointment = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [course, setCourse] = useState("");
  const [agenda, setAgenda] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await getAllTeachersList();
      console.log("Fetched Teachers:", response);
      if (response && response.teacher) {
        setTeachers(response.teacher);
      } else {
        console.log("No teachers found.");
      }
    } catch (error) {
      console.log("Error fetching teachers:", error);
    }
  };

  const fetchAvailableSlots = async (teacherId) => {
    if (!teacherId) return;
    try {
      const response = await checkTeacherBookedSlots(teacherId);
      setAvailableDates(response || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTeacherChange = (e) => {
    const teacherId = e.target.value;
    setSelectedTeacher(teacherId);
    setSelectedDate("");
    setTimeSlots([]);
    fetchAvailableSlots(teacherId);
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    const slotsForDate = availableDates.find((d) => d.date === date);
    setTimeSlots(slotsForDate ? slotsForDate.slots : []);
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (
      !selectedTeacher ||
      !selectedDate ||
      !selectedSlot ||
      !course ||
      !agenda
    ) {
      setAlertMessage({
        title: "Error",
        description: "Please fill all fields!",
      });
      setAlertOpen(true);
      return;
    }

    const appointmentData = {
      teacher: selectedTeacher,
      date: selectedDate,
      slots: selectedSlot,
      course,
      agenda,
    };
    console.log("Sending appointment data:", appointmentData);
    try {
      const response = await bookAppointment(appointmentData);
      console.log("Response after booking:", response);

      if (response?.message) {
        setAlertMessage({
          title: "Success",
          description: response.message,
        });
        setAlertOpen(true);
        setSelectedTeacher("");
        setAvailableDates([]);
        setSelectedDate("");
        setTimeSlots([]);
        setSelectedSlot(null);
        setCourse("");
        setAgenda("");
      }
    } catch (error) {
      setAlertMessage({
        title: "Error",
        description:
          error.response?.data?.message ||
          "Failed to book appointment. Please try again.",
      });
      setAlertOpen(true);
    }
  };

  const handleGenerateWithAI = async () => {
    if (!agenda) {
      setAlertMessage({
        title: "Missing Prompt",
        description: "Please type a short prompt or agenda idea first.",
      });
      setAlertOpen(true);
      return;
    }

    try {
      const response = await generateAIAgenda(agenda);
      const generated = response.generatedText;
      const cleanedAgenda = generated
        .replace(/^Here is.*?:\s*/i, "")
        .replace(/^Agenda:\s*/i, "")
        .replace(/Let me know.*$/i, "")
        .trim();
      setAgenda(cleanedAgenda);
      setAlertMessage({
        title: "AI Agenda Generated",
        description: "The agenda has been generated successfully.",
      });
      setAlertOpen(true);
    } catch (error) {
      console.error("Error generating agenda with AI:", error);
      setAlertMessage({
        title: "AI Generation Error",
        description: "Failed to generate agenda. Please try again.",
      });
      setAlertOpen(true);
    }
  };

  return {
    teachers,
    selectedTeacher,
    availableDates,
    selectedDate,
    timeSlots,
    selectedSlot,
    setSelectedSlot,
    course,
    setCourse,
    agenda,
    setAgenda,
    alertOpen,
    setAlertOpen,
    alertMessage,
    handleTeacherChange,
    handleDateChange,
    handleBookAppointment,
    handleGenerateWithAI,
  };
};
