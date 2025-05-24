import authImage from "../../assets/authImage.jpg";
import Logo from "../../assets/prestigeLogo.png";
import Spinner from "../../components/Spinner";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { endpoint } from "../../backendAPI";
import LandingNavbar from "../../components/LandingNavbar";

function TenantLogin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${endpoint}/auth/tenant/sign-in`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed, please try again.");
      }

      localStorage.setItem("tenantId", data.tenant.id);

      toast.success("Login successful.");
      setTimeout(() => {
        navigate("/home");
      }, 4000);
    } catch (error) {
      const errorMessage = error.message?.toLowerCase?.();

      if (errorMessage?.includes("already logged in")) {
        toast.info("You are already logged in.", {
          className:
            "bg-blue-100 text-blue-800 font-medium rounded-md p-3 shadow",
        });
        navigate("/home");
      } else {
        toast.error(error.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <LandingNavbar />
      {/* Left Section - Image */}
      <div className="lg:w-1/2 w-full h-[50vh] lg:h-screen bg-gray-900 flex items-center justify-center">
        <img
          src={authImage}
          alt="Auth Background"
          className="w-full h-full object-cover lg:object-contain"
        />
      </div>

      {/* Right Section - Login Form */}
      <div className="lg:w-1/2 w-full flex items-center justify-center p-6 lg:p-12 bg-white">
        <div className="max-w-md w-full space-y-6 flex flex-col items-center">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-50">
              <Spinner />
            </div>
          )}
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
          <form onSubmit={handleSubmit} className="space-y-6 w-full">
            <div>
              <label className="block text-md font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
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
                name="password"
                value={formData.password}
                onChange={handleChange}
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

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-burgundy-500 text-white rounded-full hover:bg-burgundy-400 transition duration-200 cursor-pointer"
            >
              SIGN IN
            </button>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-md text-gray-600">
            Forgot Password?{" "}
            <Link
              to="/forgot-password"
              className="text-burgundy-500 hover:underline font-semibold hover:text-pink-900"
            >
              Reset Here
            </Link>
          </p>

          <p className="text-center text-md text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-burgundy-500 font-semibold hover:underline hover:text-pink-900"
            >
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
              className="text-burgundy-500 hover:underline font-semibold hover:text-pink-900"
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
