import { EyeIcon, EyeOffIcon } from "lucide-react";
import { CustomAlert } from "../../common/components";
import { useAddTeacher } from "../../hooks/admin";

const AddTeacher = () => {
  const {
    loading,
    showPassword,
    setShowPassword,
    alertOpen,
    setAlertOpen,
    formData,
    alertMessage,
    handleChange,
    handleSubmit,
  } = useAddTeacher();

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center">Add Teacher</h2>
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
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 cursor-pointer flex items-center text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
          </span>
        </div>

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
          name="course"
          value={formData.course}
          onChange={handleChange}
          placeholder="Course"
          className="w-full p-2 border border-gray-300 rounded-md"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition-all duration-200"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Teacher"}
        </button>
      </form>
      <CustomAlert open={alertOpen} setOpen={setAlertOpen} {...alertMessage} />
    </div>
  );
};

export default AddTeacher;
