import { useState } from "react";
import { Link } from "react-router-dom";
import { authServices } from "../../auth";

export const SignupForm = () => {
  const [role, setRole] = useState("teacher");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    course: "",
    studentId: "",
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role,
      department: formData.department,
      course: role === "teacher" ? formData.course : undefined,
      studentId: role === "student" ? formData.studentId : undefined,
    };
    authServices
      .signup(payload)
      .then(() =>
        alert("User Registration Successful. Awaiting admin approval")
      ).catch(() => alert("Failed to sign up"));
    console.log("Form is submitted", payload);
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
