import { useEffect, useState } from "react";
import {
  deleteUser,
  getAllTeacher,
} from "../../api/services/admin/adminServices";

export function useGetAllTeacher() {
  const [teachers, setTeachers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState({
    title: "",
    description: "",
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState({ id: null });

  useEffect(() => {
    fetchTeachers(currentPage);
  }, [currentPage]);

  const fetchTeachers = async (page) => {
    try {
      const data = await getAllTeacher(page, 5);
      setTeachers(data.teachers || []);
         setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.log("Error fetching teachers:", error);
      setAlertMessage({
        title: "Error",
        description: "Failed to fetch teachers",
      });
      setAlertOpen(true);
    }
  };

  const showConfirmation = (id) => {
    setCurrentAction({ id });
    setAlertMessage({
      title: "Confirm Action",
      description: "Are you sure you want to delete this teacher?",
      variant: "default",
      showCancel: true,
    });
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    try {
      const { id } = currentAction;
      await deleteUser(id);
      setAlertMessage({
        title: "Success",
        description: "Teacher deleted successfully",
        variant: "success",
      });
      setAlertOpen(true);
      fetchTeachers(currentPage);
    } catch (error) {
      setAlertMessage({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to delete teacher!",
        variant: "destructive",
      });
      setAlertOpen(true);
    } finally {
      setConfirmOpen(false);
    }
  };
  return {
    teachers,
    currentPage,
    totalPages,
    setCurrentPage,
    alertOpen,
    setAlertOpen,
    alertMessage,
    confirmOpen,
    setConfirmOpen,
    showConfirmation,
    handleDelete,
  };
}
