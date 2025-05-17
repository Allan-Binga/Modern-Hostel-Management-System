import authImage from "../../assets/authImage.jpg";
import Logo from "../../assets/prestigeLogo.png";
import Spinner from "../../components/Spinner";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { endpoint } from "../../backendAPI";

function TenantSignup() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    apartmentNumber: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-50">
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
              Hi! Welcome to Prestige Hostels 👋
            </h2>
          </div>

          {error && (
            <p className="text-red-600 text-sm text-center mt-4">{error}</p>
          )}
          {success && (
            <p className="text-green-600 text-sm text-center mt-4">{success}</p>
          )}

          {/* Form */}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setError("");
              setSuccess("");
              setLoading(true);

              try {
                const res = await fetch(`${endpoint}/auth/tenant/sign-up`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(formData),
                });

                const data = await res.json();

                if (!res.ok) {
                  //Handle Password Related Errors
                  if (data.message?.toLowerCase().includes("password")) {
                    setFieldErrors({ password: data.message });
                  } else {
                    setFieldErrors({});
                    toast.error(data.message || "Something went wrong.");
                  }
                  return;
                }

                setFieldErrors({});
                toast.success(data.message);
                setTimeout(() => navigate("/login"), 4000);
              } catch (error) {
                toast.error("Server error. Please try again.");
              } finally {
                setLoading(false);
              }
            }}
            className="space-y-6 w-full"
          >
            <div className="flex space-x-6">
              <div className="w-1/2">
                <label className="block text-md font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-pink-100 focus:outline-none"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-md font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-pink-100 focus:outline-none"
                />
              </div>
            </div>

            <div className="block text-md font-medium text-gray-700">
              <label className="block text-md font-medium text-gray-700">
                Phone
              </label>
              <PhoneInput
                country={"ke"} // Set your default country (Kenya in this case)
                value={formData.phoneNumber}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, phoneNumber: value }))
                }
                placeholder="0712345678"
                inputClass="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-pink-100 focus:outline-none"
              />
            </div>

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
                onChange={(e) => {
                  handleChange(e);
                  setFieldErrors((prev) => ({ ...prev, password: "" })); // Clear error on input
                }}
                placeholder="••••••••"
                className={`mt-1 block w-full border ${
                  fieldErrors.password ? "border-red-500" : "border-gray-300"
                } rounded-full shadow-sm py-2.5 px-4 text-sm focus:outline-none focus:ring-2 ${
                  fieldErrors.password
                    ? "focus:ring-red-500"
                    : "focus:ring-blue-500"
                }`}
              />
              <span
                className="absolute right-3 top-10 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
              {fieldErrors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              className={`w-full py-3 text-white rounded-full transition duration-200 cursor-pointer ${
                loading
                  ? "bg-gray-400"
                  : "bg-burgundy-500 hover:bg-burgundy-400"
              } flex items-center justify-center`}
              disabled={loading}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-gray-300 rounded-full animate-spin border-t-transparent"></div>
              ) : (
                "SIGN UP"
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-md text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-burgundy-500 hover:underline">
              Sign In
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
              to="/administrator/signup"
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

export default TenantSignup;
