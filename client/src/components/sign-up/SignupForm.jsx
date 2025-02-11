import { useState } from "react";
import { Link } from "react-router-dom";

export const SignupForm = () => {
  const [role, setRole] = useState("teacher"); // Default role is "teacher"
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    course: "",
    studentId: "",
  });
  const [message, setMessage] = useState(""); // State for success message
  const [error, setError] = useState(""); // State for error message

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle role change (Teacher <-> Student)
  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setFormData({
      ...formData,
      course: newRole === "teacher" ? "" : undefined,
      studentId: newRole === "student" ? "" : undefined,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/registration",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...formData, role }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("User registration successful! Awaiting admin approval.");
        setFormData({
          name: "",
          email: "",
          password: "",
          department: "",
          course: "",
          studentId: "",
        });
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Server error. Please try again later.", err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold text-center mb-4">Sign Up</h2>

        {/* Role Toggle Buttons */}
        <div className="flex justify-center mb-4">
          <button
            className={`px-4 py-2 rounded-l ${
              role === "teacher" ? "bg-blue-500 text-white" : "bg-gray-300"
            }`}
            onClick={() => handleRoleChange("teacher")}
          >
            As a Teacher
          </button>
          <button
            className={`px-4 py-2 rounded-r ${
              role === "student" ? "bg-blue-500 text-white" : "bg-gray-300"
            }`}
            onClick={() => handleRoleChange("student")}
          >
            As a Student
          </button>
        </div>

        {/* Success Message */}
        {message && (
          <div className="text-green-600 text-center mb-2">{message}</div>
        )}

        {/* Error Message */}
        {error && <div className="text-red-600 text-center mb-2">{error}</div>}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <input
            type="text"
            name="department"
            placeholder="Department"
            value={formData.department}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />

          {/* Show Course for Teachers */}
          {role === "teacher" && (
            <input
              type="text"
              name="course"
              placeholder="Course"
              value={formData.course}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          )}

          {/* Show Student ID for Students */}
          {role === "student" && (
            <input
              type="text"
              name="studentId"
              placeholder="Student ID"
              value={formData.studentId}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Register
          </button>
          <p className="text-center mt-4 text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-500 font-bold hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
