import { Link } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { CustomAlert } from "../../common/components";
import { useSignup } from "../../hooks/auth";

export const SignupForm = () => {
  const {
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
  } = useSignup();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold text-center mb-4">Sign Up</h2>

        {/* Role Toggle Buttons */}
        <div className="flex justify-center mb-4">
          <button
            className={`px-4 py-2 cursor-pointer rounded-l ${
              role === "teacher" ? "bg-blue-500 text-white" : "bg-gray-300"
            }`}
            onClick={() => handleRoleChange("teacher")}
          >
            As a Teacher
          </button>
          <button
            className={`px-4 py-2 cursor-pointer rounded-r ${
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
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3  mt-[5px] cursor-pointer flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
            </span>
          </div>
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
          {/* Honeypot Field (Hidden from users) */}
          <input
            type="text"
            name="honeypot"
            value={formData.honeypot}
            onChange={handleChange}
            className="hidden" // Hide this field
            autoComplete="off"
            tabIndex="-1"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 cursor-pointer rounded hover:bg-blue-600"
          >
            Register
          </button>
          <CustomAlert
            open={alertOpen}
            setOpen={setAlertOpen}
            {...alertMessage}
          />
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
