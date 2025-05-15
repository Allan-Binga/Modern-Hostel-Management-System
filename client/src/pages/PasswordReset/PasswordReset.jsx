import authImage from "../../assets/authImage.jpg";
import Logo from "../../assets/prestigeLogo.png";

function PasswordReset() {
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
