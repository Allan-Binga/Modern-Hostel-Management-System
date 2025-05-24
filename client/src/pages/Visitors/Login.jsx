import authImage from "../../assets/authImage.jpg";
import Logo from "../../assets/prestigeLogo.png";
import Spinner from "../../components/Spinner";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { toast } from "react-toastify";
import axios from "axios";
import { endpoint } from "../../backendAPI";

function VisitorsLogin() {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    visitedRoomId: "",
    plannedExitTime: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (value) => {
    setFormData((prev) => ({ ...prev, phoneNumber: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      entryTime: new Date().toISOString(),
    };

    try {
      const response = await axios.post(
        `${endpoint}/visitors/sign-in`,
        payload
      );
      toast.success("Visitor sign-in successful!");
      setTimeout(() => navigate("/visitors/home"), 4000);
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left: Auth Image */}
      <div className="lg:w-1/2 w-full h-[50vh] lg:h-screen bg-gray-900">
        <img
          src={authImage}
          alt="Authentication background"
          className="w-full h-full object-cover lg:object-contain"
        />
      </div>

      {/* Right: Form */}
      <div className="lg:w-1/2 w-full flex items-center justify-center p-6 lg:p-12 bg-white relative">
        {loading && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-white/50 z-50"
            aria-busy="true"
          >
            <Spinner />
          </div>
        )}

        <div className="max-w-md w-full space-y-6">
          <div className="flex justify-center">
            <img src={Logo} alt="Prestige Logo" className="w-40 h-40" />
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Hello Visitor! 👋
            </h2>
            <p className="text-lg text-gray-700">Please sign in to proceed</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-md font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-pink-100 focus:outline-none"
                required
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-md font-medium text-gray-700">
                Phone Number
              </label>
              <PhoneInput
                country={"ke"}
                value={formData.phoneNumber}
                onChange={handlePhoneChange}
                inputClass="w-full rounded-full px-4 py-2 border border-gray-300"
                inputStyle={{ width: "100%" }}
              />
            </div>

            {/* Visited Room */}
            <div>
              <label
                htmlFor="visitedRoomId"
                className="block text-md font-medium text-gray-700"
              >
                Visited Room
              </label>
              <select
                name="visitedRoomId"
                id="visitedRoomId"
                value={formData.visitedRoomId}
                onChange={handleChange}
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-pink-100 focus:outline-none"
              >
                <option value="">-- Select Room --</option>
                {Array.from({ length: 20 }, (_, i) => i + 1).map((room) => (
                  <option key={room} value={room}>
                    Room {room}
                  </option>
                ))}
              </select>
            </div>

            {/* Planned Exit Time */}
            <div>
              <label
                htmlFor="plannedExitTime"
                className="block text-md font-medium text-gray-700"
              >
                Planned Exit Time (24hr format e.g. 20:00)
              </label>
              <input
                type="time"
                id="plannedExitTime"
                name="plannedExitTime"
                value={formData.plannedExitTime}
                onChange={handleChange}
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-pink-100 focus:outline-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-burgundy-500 text-white rounded-full hover:bg-burgundy-400 transition duration-200"
            >
              {loading ? "Signing In..." : "SIGN IN"}
            </button>
          </form>

          <div className="flex items-center justify-center space-x-2">
            <hr className="w-1/4 border-gray-300" />
            <span className="text-md text-gray-500">Or</span>
            <hr className="w-1/4 border-gray-300" />
          </div>

          <p className="text-center text-md text-gray-600">
            Are you an administrator?{" "}
            <Link
              to="/administrator/login"
              className="text-burgundy-500 hover:underline font-semibold hover:text-pink-900"
            >
              Click Here
            </Link>
          </p>
          <div className="flex items-center justify-center space-x-2">
            <hr className="w-1/4 border-gray-300" />
            <span className="text-md text-gray-500">Or</span>
            <hr className="w-1/4 border-gray-300" />
          </div>
          <p className="text-center text-md text-gray-600">
            Tenant?{" "}
            <Link
              to="/login"
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

export default VisitorsLogin;
