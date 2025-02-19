import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authServices } from "../../auth";
export const Signin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
        alert("Your registration is pending approval from the admin.");
        return;
      }
      if (user.status === "rejected") {
        alert("Your registration has been rejected by the admin.");
        return;
      }

      if (user.role === "teacher") {
        navigate("/teacher-dashboard");
      } else if (user.role === "student") {
        navigate("/student-dashboard");
      } else {
        alert("Login successful!");
      }
    } catch (error) {
      console.error(
        "Login error:",
        error.response?.data?.message || error.message
      );
      alert(error.response?.data?.message || "Unable to log in");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
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
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
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
