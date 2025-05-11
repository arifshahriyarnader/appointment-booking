import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { authServices } from "../../auth";
import { CustomAlert } from "../../common/components";
export const Signin = () => {
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

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <CustomAlert
          open={alertOpen}
          setOpen={setAlertOpen}
          {...alertMessage}
        />
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4 relative">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3  mt-[25px] cursor-pointer flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
            </span>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            Login
          </button>
          <p className="text-center mt-4 text-gray-600">
            I have no account. Please Sign UP{" "}
            <Link to="/" className="text-blue-500 font-bold hover:underline">
              Sign UP
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
