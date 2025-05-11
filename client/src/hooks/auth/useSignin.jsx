import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authServices } from "../../auth";

export const useSignin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState({
    description: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      type: "email",
      email: formData.email,
      password: formData.password,
    };

    try {
      const authUser = await authServices.login(payload);
      if (!authUser || !authUser.user) {
        throw new Error("Invalid response from server");
      }

      const user = authUser.user;
      if (user.status === "pending") {
        setAlertMessage({
          description: "Your registration is pending approval from the admin.",
          variant: "default",
        });
        setAlertOpen(true);
        return;
      }
      if (user.status === "rejected") {
        setAlertMessage({
          description: "Your registration has been rejected by the admin.",
          variant: "destructive",
        });
        setAlertOpen(true);
        return;
      }

      if (user.role === "teacher") {
        navigate("/teacher-dashboard");
      } else if (user.role === "student") {
        navigate("/student-dashboard");
      } else if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        setAlertMessage({
          title: "Login Successful",
          description: "Login successful!",
          variant: "success",
        });
        setAlertOpen(true);
      }
    } catch (error) {
      console.error(
        "Login error:",
        error.response?.data?.message || error.message
      );

      setAlertMessage({
        description: error.response?.data?.message || "Unable to log in",
        variant: "destructive",
      });
      setAlertOpen(true);
    }
  };

  return {
    formData,
    setFormData,
    showPassword,
    setShowPassword,
    alertOpen,
    setAlertOpen,
    alertMessage,
    setAlertMessage,
    handleChange,
    handleSubmit,
  };
};
