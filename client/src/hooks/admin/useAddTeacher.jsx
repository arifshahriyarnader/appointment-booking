import { useState } from "react";
import { addTeacher } from "../../api/services/admin/adminServices";

export function useAddTeacher() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "teacher",
    department: "",
    course: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState({
    title: "",
    description: "",
    variant: "default",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await addTeacher(formData);
      console.log("Teacher added response:", response);

      if (response?.user) {
        setAlertMessage({
          title: "Success",
          description: "Teacher added successfully",
          variant: "success",
        });
        setFormData({
          name: "",
          email: "",
          password: "",
          role: "teacher",
          department: "",
          course: "",
        });
      } else {
        setAlertMessage({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding teacher:", error);
      setAlertMessage({
        title: "Error",
        description: `Failed to add teacher! ${
          error.response?.data?.message || error.message
        }`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setAlertOpen(true);
    }
  };

  return {
    loading,
    showPassword,
    setShowPassword,
    alertOpen,
    setAlertOpen,
    formData,
    alertMessage,
    handleChange,
    handleSubmit,
  };
}
