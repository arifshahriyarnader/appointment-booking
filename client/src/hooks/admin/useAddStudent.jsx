import { addStudent } from "../../api/services/admin/adminServices";
import { useState } from "react";

export function useAddStudent() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    department: "",
    studentId: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState({
    title: "",
    description: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await addStudent(formData);
      if (response?.user) {
        setAlertMessage({
          title: "Success",
          description: "Student added successfully",
          variant: "success",
        });
        setFormData({
          name: "",
          email: "",
          password: "",
          role: "student",
          department: "",
          studentId: "",
        });
      } else {
        setAlertMessage({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding student", error);

      setAlertMessage({
        title: "Error",
        description: error.response?.data?.message || "Failed to add student",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setAlertOpen(true);
    }
  };
  return {
    formData,
    loading,
    showPassword,
    setShowPassword,
    alertOpen,
    setAlertOpen,
    alertMessage,
    handleChange,
    handleSubmit,
  };
}
