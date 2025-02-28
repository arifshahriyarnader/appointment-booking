import { useState } from "react";
import { addStudent } from "../../api/services/admin/adminServices";

const AddStudent = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    department: "",
    studentId: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addStudent(formData);
      if (response?.user) {
        alert("Student added successfully");
        setFormData({
          name: "",
          email: "",
          password: "",
          role: "student",
          department: "",
          studentId: "",
        });
      } else {
        alert("Something went wrong. Please try agaain");
      }
    } catch (error) {
      console.error("Error adding student", error);
      alert(`Failed to add student`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center">Add Student</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full p-2 border border-gray-300 rounded-md"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-2 border border-gray-300 rounded-md"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full p-2 border border-gray-300 rounded-md"
          required
        />
        <input
          type="text"
          name="department"
          value={formData.department}
          onChange={handleChange}
          placeholder="Department"
          className="w-full p-2 border border-gray-300 rounded-md"
          required
        />
        <input
          type="text"
          name="studentId"
          value={formData.course}
          onChange={handleChange}
          placeholder="Student ID"
          className="w-full p-2 border border-gray-300 rounded-md"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition-all duration-200"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Student"}
        </button>
      </form>
    </div>
  );
};

export default AddStudent;
