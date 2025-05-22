import { endpoint } from "../../backendAPI";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, AlertCircle, Eye, EyeOff, ArrowLeft } from "lucide-react";
import axios from "axios";

function PasswordChange() {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showResend, setShowResend] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  // Run Token Verification
  useEffect(() => {
    if (token) {
      const verifyToken = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `${endpoint}/verify/password-token?token=${token}`
          );
          setMessage(response.data.message);
          setStatus("success");
          toast.success("Token verified successfully!");
        } catch (error) {
          setMessage(
            error.response?.data?.message || "Token verification failed."
          );
          setStatus("error");
          setShowResend(true);
          toast.error("Invalid or expired token.");
        } finally {
          setLoading(false);
        }
      };
      verifyToken();
    } else {
      setMessage("No token provided.");
      setStatus("error");
      setShowResend(true);
      toast.error("No token provided.");
    }
  }, [token]);

  // Resend Password Reset Email
  const resendPasswordResetEmail = async () => {
    if (!email) {
      setMessage("Please enter your email.");
      setStatus("error");
      toast.error("Email is required.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${endpoint}/verify/resend/password-reset`,
        { email }
      );
      setMessage(response.data.message);
      setStatus("success");
      toast.success("Password reset email sent!");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to resend email.");
      setStatus("error");
      toast.error("Failed to resend email.");
    } finally {
      setLoading(false);
    }
  };

  // Password Reset Submission
  const resetPasswordToken = async () => {
    try {
      const response = await axios.put(
        `${endpoint}/password/reset/password/token`,
        { token, newPassword, confirmPassword }
      );
      setMessage(response.data.message);
      setStatus("success");
      toast.success("Password updated successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to reset password.");
      setStatus("error");
      toast.error("Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    // Client-side validation
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      setStatus("error");
      toast.error("Passwords do not match.");
      setLoading(false);
      return;
    }

    // Password strength validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setMessage(
        "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character."
      );
      setStatus("error");
      toast.error("Password does not meet requirements.");
      setLoading(false);
      return;
    }

    resetPasswordToken();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-burgundy-100 to-burgundy-200 animate-fadeIn">
      <div className="flex-grow flex items-center justify-center px-6 sm:px-8 lg:px-10">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 animate-slideUp">
          <h2 className="text-3xl md:text-4xl font-extrabold text-burgundy-800 mb-6 text-center">
            Reset Your Password
          </h2>
          <p className="text-gray-600 text-center mb-6">
            {showResend
              ? "Request a new password reset link below."
              : "Enter your new password to regain access."}
          </p>

          {/* Status Message */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-lg flex items-center gap-3 animate-slideUp ${
                status === "success"
                  ? "bg-burgundy-100 text-burgundy-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {status === "success" ? (
                <CheckCircle size={20} />
              ) : (
                <AlertCircle size={20} />
              )}
              <span>{message}</span>
            </div>
          )}

          {/* Loading State */}
          {loading && !showResend && !message && (
            <div className="flex justify-center items-center h-40">
              <Spinner />
            </div>
          )}

          {/* Conditional Rendering */}
          {showResend ? (
            // Resend Email Form
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-burgundy-700 mb-1"
                >
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-300 focus:border-gray-300 focus:outline-none"
                  required
                  aria-required="true"
                  disabled={loading}
                />
              </div>
              <button
                onClick={resendPasswordResetEmail}
                disabled={loading}
                className={`w-full bg-burgundy-500 text-white py-3 rounded-lg hover:bg-burgundy-600 transition-colors flex items-center justify-center gap-2 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? <Spinner size="sm" /> : "Resend Email"}
              </button>
              <button
                onClick={() => navigate("/login")}
                className="w-full bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft size={20} /> Back to Login
              </button>
            </div>
          ) : (
            // Reset Password Form
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="relative">
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-burgundy-700 mb-1"
                >
                  New Password
                </label>
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-300 focus:border-gray-300 focus:outline-none"
                  required
                  aria-required="true"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute right-3 top-10 text-burgundy-500 hover:text-burgundy-700 transition-transform hover:scale-110"
                  aria-label={
                    showNewPassword ? "Hide password" : "Show password"
                  }
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="relative">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-burgundy-700 mb-1"
                >
                  Confirm New Password
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-300 focus:border-gray-300 focus:outline-none"
                  required
                  aria-required="true"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-10 text-burgundy-500 hover:text-burgundy-700 transition-transform hover:scale-110"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>

              <div className="text-sm text-gray-600">
                Password must be at least 8 characters long and include an
                uppercase letter, a lowercase letter, a number, and a special
                character.
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-burgundy-500 text-white py-3 rounded-lg hover:bg-burgundy-600 transition-colors flex items-center justify-center gap-2 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? <Spinner size="sm" /> : "Update Password"}
              </button>
              <button
                onClick={() => navigate("/login")}
                className="w-full bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <ArrowLeft size={20} /> Back to Login
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default PasswordChange;
