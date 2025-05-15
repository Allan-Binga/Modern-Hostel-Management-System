import authImage from "../../assets/authImage.jpg";
import Logo from "../../assets/prestigeLogo.png";
import Spinner from "../../components/Spinner";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function TenantLogin() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Section - Image */}
      <div className="lg:w-1/2 w-full h-[50vh] lg:h-screen bg-gray-900 flex items-center justify-center">
        <img
          src={authImage}
          alt="Auth Background"
          className="w-full h-full object-cover lg:object-contain"
        />
      </div>

      {/* Right Section - Signup Form */}
      <div className="lg:w-1/2 w-full flex items-center justify-center p-6 lg:p-12 bg-white">
        <div className="max-w-md w-full space-y-6 flex flex-col items-center">
          {/* Logo */}
          <div className="flex items-center justify-center">
            <img src={Logo} alt="Wealth Wave Logo" className="w-50 h-50" />
          </div>

          {/* Welcome Text */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome back! 👋
            </h2>

            <h2 className="text-2xl font-bold text-gray-900">
              Please login to proceed
            </h2>
          </div>

          {/* Form */}
          <form className="space-y-6 w-full">
            <div>
              <label className="block text-md font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="johndoe@gmail.com"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-pink-100 focus:outline-none"
              />
            </div>

            <div className="relative">
              <label className="block text-md font-medium text-gray-700">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-pink-100 focus:outline-none"
              />
              <span
                className="absolute right-3 top-10 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              className="w-full py-3 bg-burgundy-500 text-white rounded-full hover:bg-burgundy-400 transition duration-200 cursor-pointer"
            >
              SIGN IN
            </button>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-md text-gray-600">
            Forgot Password?{" "}
            <Link to="/forgot-password" className="text-burgundy-500 hover:underline">
              Reset Here
            </Link>
          </p>

          <p className="text-center text-md text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-burgundy-500 hover:underline">
              Sign Up
            </Link>
          </p>

          {/* Divider */}
          <div className="flex items-center justify-center space-x-2">
            <hr className="w-1/4 border-gray-300" />
            <span className="text-md text-gray-500">Or</span>
            <hr className="w-1/4 border-gray-300" />
          </div>

          {/* Administrator Signup */}
          <p className="text-center text-md text-gray-600">
            Are you an administrator?{" "}
            <Link
              to="/administrator/login"
              className="text-burgundy-500 hover:underline"
            >
              Click Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default TenantLogin;
