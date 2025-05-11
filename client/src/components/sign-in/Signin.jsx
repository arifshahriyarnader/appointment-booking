import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { CustomAlert } from "../../common/components";
import { useSignin } from "../../hooks/auth";
export const Signin = () => {
  const {
    formData,
    showPassword,
    setShowPassword,
    alertOpen,
    setAlertOpen,
    alertMessage,
    handleChange,
    handleSubmit,
  } = useSignin();

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
            className="w-full cursor-pointer bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
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
