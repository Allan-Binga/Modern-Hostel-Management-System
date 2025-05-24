import authImage from "../../assets/authImage.jpg";
import Logo from "../../assets/prestigeLogo.png";
import axios from "axios";
import { toast } from "react-toastify";
import { endpoint } from "../../backendAPI";
import Spinner from "../../components/Spinner";
import { useState } from "react";

function PasswordReset() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  //API CALL that resets passwords
  const resetPassword = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${endpoint}/password/send-email`, {
        email,
      });
      toast.success(response.data.message);
    } catch (error) {
      toast.info(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await resetPassword(); // Call resetPassword when form is submitted
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Section - Image */}
      <div className="lg:w-1/2 w-full h-[50vh] lg:h-screen bg-gray-900 flex items-center justify-center">
        <img
          src={authImage}
          alt="Auth Background"
          className="w-full h-full object-cover lg:object-cover"
        />
      </div>

      {/* Right Section - Password Reset Form */}
      {loading && <Spinner/>}
      <div className="lg:w-1/2 w-full flex items-center justify-center p-6 lg:p-12 bg-white">
        <div className="max-w-md w-full flex flex-col items-center justify-center h-full space-y-6">
          {/* Logo */}
          <div className="flex items-center justify-center mb-4">
            <img src={Logo} alt="Wealth Wave Logo" className="w-32 h-32" />
          </div>

          {/* Welcome Text */}
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Please enter your email below
            </h2>
          </div>

          {/* Form */}
          <form className="space-y-6 w-full" onSubmit={handleSubmit}>
            <div>
              <label className="block text-md font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                 id="email"
                placeholder="johndoe@gmail.com"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-pink-100 focus:outline-none"
              />
            </div>

            {/* Reset Button */}
            <button
              type="submit"
              className="w-full py-3 bg-burgundy-500 text-white rounded-full hover:bg-burgundy-400 transition duration-200 cursor-pointer"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PasswordReset;
