import { useEffect, useState } from "react";
import {
  deleteUser,
  getAllStudent,
} from "../../api/services/admin/adminServices";

export const useGetAllStudent =() => {
  const [students, setStudents] = useState([]);
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
    fetchStudents(currentPage);
  }, [currentPage]);

  const fetchStudents = async (page) => {
    try {
      const data = await getAllStudent(page, 5);
      setStudents(data.students || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.log(error);
      setAlertMessage({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to fetch students",
        variant: "destructive",
      });
      setAlertOpen(true);
    }
  };
  const showConfirmation = (id) => {
    setCurrentAction({ id });
    setAlertMessage({
      title: "Confirm Action",
      description: "Are you sure you want to delete this student?",
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
        description: "Student deleted successfully",
        variant: "success",
      });
      setAlertOpen(true);
      fetchStudents(currentPage);
    } catch (error) {
      console.log(error);
      setAlertMessage({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to delete student!",
        variant: "destructive",
      });
      setAlertOpen(true);
    } finally {
      setConfirmOpen(false);
    }
  };

  return {
    students,
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
