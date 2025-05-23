import { useEffect, useState } from "react";
import {
  getAppointmentRequests,
  updateAppointmentStatus,
} from "../../api/services/teacherServices";

export const useViewAppointmentRequest = () => {
  const [appointments, setAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState({
    title: "",
    description: "",
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState({ id: null, status: "" });

  useEffect(() => {
    fetchAppointments(currentPage);
  }, [currentPage]);

  const fetchAppointments = async (page) => {
    try {
      const response = await getAppointmentRequests(page, 5);
      setAppointments(response?.message || []);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      setError("Failed to fetch appointment requests.", error);
    } finally {
      setLoading(false);
    }
  };

  const showConfirmation = (id, status) => {
    setCurrentAction({ id, status });
    setAlertMessage({
      title: "Confirm Action",
      description: `Are you sure you want to mark this appointment as ${status}?`,
      variant: "default",
      showCancel: true,
    });
    setConfirmOpen(true);
  };

  const handleStatusUpdate = async () => {
    try {
      await updateAppointmentStatus(currentAction.id, {
        status: currentAction.status,
      });

      setAppointments((prev) =>
        prev.map((app) =>
          app._id === currentAction.id
            ? { ...app, status: currentAction.status }
            : app
        )
      );
      setAlertMessage({
        title: "Success",
        description: `Appointment ${currentAction.status} successfully!`,
        variant: "success",
      });
      setAlertOpen(true);
    } catch (error) {
      console.log(error);
      setAlertMessage({
        title: "Error",
        description: "Failed to update appointment status.",
        variant: "destructive",
      });
      setAlertOpen(true);
    } finally {
      setConfirmOpen(false);
    }
  };

  return {
    appointments,
    currentPage,
    totalPages,
    setCurrentPage,
    loading,
    error,
    alertOpen,
    setAlertOpen,
    alertMessage,
    confirmOpen,
    setConfirmOpen,
    showConfirmation,
    handleStatusUpdate,
  };
};
