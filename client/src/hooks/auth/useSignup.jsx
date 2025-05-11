import { useState } from "react";
import { authServices } from "../../auth";

export const useSignup = () => {
  const [role, setRole] = useState("teacher");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    course: "",
    studentId: "",
    honeypot: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState({
    title: "",
    description: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle role change
  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setFormData({
      ...formData,
      course: newRole === "teacher" ? "" : undefined,
      studentId: newRole === "student" ? "" : undefined,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.honeypot) {
      console.warn("Bot detected, form submission blocked.");
      return;
    }
    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role,
      department: formData.department,
      course: role === "teacher" ? formData.course : undefined,
      studentId: role === "student" ? formData.studentId : undefined,
    };

    try {
      await authServices.signup(payload);
      setAlertMessage({
        title: "User Registration Successful",
        description: "Awaiting admin approval",
      });
      setAlertOpen(true);
      // Reset form fields
      setFormData({
        name: "",
        email: "",
        password: "",
        department: "",
        course: role === "teacher" ? "" : undefined,
        studentId: role === "student" ? "" : undefined,
        honeypot: "",
      });
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message);
      setAlertMessage({
        title: "Failed to sign up",
        description: error.response?.data?.message || error.message,
      });
      setAlertOpen(true);
    }
  };

  return {
    role,
    formData,
    showPassword,
    setShowPassword,
    alertOpen,
    setAlertOpen,
    alertMessage,
    handleChange,
    handleRoleChange,
    handleSubmit,
  };
};
