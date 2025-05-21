import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Spinner from "../../components/Spinner";
import { toast } from "react-toastify";
import {
  User,
  Lock,
  Bell,
  Mail,
  Phone,
  Trash2,
  Palette,
  Eye,
  EyeOff,
  MessageSquare,
} from "lucide-react";

function AccountSettings() {
  const [loading, setLoading] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "John Doe", // Mock data
    email: "john.doe@example.com",
    phone: "+254 700 123 456",
  });
  const [settings, setSettings] = useState({
    adsEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
    twoFactorAuth: false,
    darkMode: false,
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success("Profile updated successfully.");
      setLoading(false);
    }, 1500);
  };

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    toast.info(
      `${key.replace(/([A-Z])/g, " $1").toLowerCase()} ${
        settings[key] ? "disabled" : "enabled"
      }.`
    );
  };

  const handlePasswordReset = () => {
    setLoading(true);
    setTimeout(() => {
      toast.success("Password reset link sent to your email.");
      setShowPasswordModal(false);
      setLoading(false);
    }, 1500);
  };

  const handleDeleteAccount = () => {
    if (deleteConfirm.toLowerCase() !== "delete") {
      toast.error("Please type 'delete' to confirm.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      toast.success("Account deletion request submitted.");
      setShowDeleteModal(false);
      setDeleteConfirm("");
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-burgundy-100 to-burgundy-200 animate-fadeIn">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto p-6 md:p-10">
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-burgundy-800 animate-slideIn">
            Account Settings
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Manage your profile, security, and preferences, {profileForm.name}.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Profile & Preferences */}
          <div className="lg:w-1/2 space-y-8">
            {/* Profile Information */}
            <section className="bg-white rounded-3xl shadow-xl p-8 animate-slideUp">
              <h2 className="text-2xl font-extrabold text-burgundy-700 mb-6 flex items-center gap-3">
                <User size={32} /> Profile Information
              </h2>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    placeholder="Enter your name"
                    className="w-full p-3 border border-burgundy-300 rounded-lg focus:ring-2 focus:ring-burgundy-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    placeholder="Enter your email"
                    className="w-full p-3 border border-burgundy-300 rounded-lg focus:ring-2 focus:ring-burgundy-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileForm.phone}
                    onChange={handleProfileChange}
                    placeholder="Enter your phone number"
                    className="w-full p-3 border border-burgundy-300 rounded-lg focus:ring-2 focus:ring-burgundy-400"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-burgundy-500 text-white py-3 px-4 rounded-lg hover:bg-burgundy-600 transition-colors flex items-center justify-center gap-2 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? <Spinner size="sm" /> : "Save Profile"}
                </button>
              </form>
            </section>

            {/* Preferences */}
            <section
              className="bg-white rounded-3xl shadow-xl p-8 animate-slideUp"
              style={{ animationDelay: "0.1s" }}
            >
              <h2 className="text-2xl font-extrabold text-burgundy-700 mb-6 flex items-center gap-3">
                <Palette size={32} /> Preferences
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 flex items-center gap-2">
                    <MessageSquare size={20} /> Show Advertisements
                  </span>
                  <label className="inline-flex relative items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={settings.adsEnabled}
                      onChange={() => handleToggle("adsEnabled")}
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-burgundy-500 transition"></div>
                    <span className="ml-3 text-sm text-gray-500">
                      {settings.adsEnabled ? "On" : "Off"}
                    </span>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 flex items-center gap-2">
                    <Palette size={20} /> Dark Mode
                  </span>
                  <label className="inline-flex relative items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={settings.darkMode}
                      onChange={() => handleToggle("darkMode")}
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-burgundy-500 transition"></div>
                    <span className="ml-3 text-sm text-gray-500">
                      {settings.darkMode ? "On" : "Off"}
                    </span>
                  </label>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Security & Notifications */}
          <div className="lg:w-1/2 space-y-8">
            {/* Security */}
            <section
              className="bg-white rounded-3xl shadow-xl p-8 animate-slideUp"
              style={{ animationDelay: "0.2s" }}
            >
              <h2 className="text-2xl font-extrabold text-burgundy-700 mb-6 flex items-center gap-3">
                <Lock size={32} /> Security
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 flex items-center gap-2">
                    <Lock size={20} /> Two-Factor Authentication
                  </span>
                  <label className="inline-flex relative items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={settings.twoFactorAuth}
                      onChange={() => handleToggle("twoFactorAuth")}
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-burgundy-500 transition"></div>
                    <span className="ml-3 text-sm text-gray-500">
                      {settings.twoFactorAuth ? "On" : "Off"}
                    </span>
                  </label>
                </div>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full bg-burgundy-500 text-white py-3 px-4 rounded-lg hover:bg-burgundy-600 transition-colors flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading ? <Spinner size="sm" /> : "Reset Password"}
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 size={20} /> Delete Account
                </button>
              </div>
            </section>

            {/* Notifications */}
            <section
              className="bg-white rounded-3xl shadow-xl p-8 animate-slideUp"
              style={{ animationDelay: "0.3s" }}
            >
              <h2 className="text-2xl font-extrabold text-burgundy-700 mb-6 flex items-center gap-3">
                <Bell size={32} /> Notifications
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 flex items-center gap-2">
                    <Mail size={20} /> Email Notifications
                  </span>
                  <label className="inline-flex relative items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={settings.emailNotifications}
                      onChange={() => handleToggle("emailNotifications")}
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-burgundy-500 transition"></div>
                    <span className="ml-3 text-sm text-gray-500">
                      {settings.emailNotifications ? "On" : "Off"}
                    </span>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 flex items-center gap-2">
                    <Phone size={20} /> SMS Notifications
                  </span>
                  <label className="inline-flex relative items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={settings.smsNotifications}
                      onChange={() => handleToggle("smsNotifications")}
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-burgundy-500 transition"></div>
                    <span className="ml-3 text-sm text-gray-500">
                      {settings.smsNotifications ? "On" : "Off"}
                    </span>
                  </label>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Quick Stats */}
        <section
          className="mt-8 bg-white rounded-3xl shadow-xl p-8 animate-slideUp"
          style={{ animationDelay: "0.4s" }}
        >
          <h2 className="text-2xl font-extrabold text-burgundy-700 mb-6 flex items-center gap-3">
            <User size={32} /> Account Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
            <div>
              <p className="text-sm text-gray-500">Account Created</p>
              <p className="text-lg font-semibold text-burgundy-800">
                January 15, 2023
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Login</p>
              <p className="text-lg font-semibold text-burgundy-800">
                May 20, 2025, 12:30 PM
              </p>
            </div>
          </div>
        </section>

        {/* Password Reset Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 relative animate-slideUp">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-burgundy-700"
                onClick={() => setShowPasswordModal(false)}
              >
                ✕
              </button>
              <h3 className="text-2xl font-bold text-burgundy-800 mb-4">
                Reset Password
              </h3>
              <p className="text-gray-600 mb-6">
                A password reset link will be sent to your registered email
                address.
              </p>
              <button
                onClick={handlePasswordReset}
                className={`w-full bg-burgundy-500 text-white py-3 px-4 rounded-lg hover:bg-burgundy-600 transition-colors flex items-center justify-center gap-2 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? <Spinner size="sm" /> : "Send Reset Link"}
              </button>
            </div>
          </div>
        )}

        {/* Delete Account Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 relative animate-slideUp">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-burgundy-700"
                onClick={() => setShowDeleteModal(false)}
              >
                ✕
              </button>
              <h3 className="text-2xl font-bold text-burgundy-800 mb-4">
                Delete Account
              </h3>
              <p className="text-gray-600 mb-6">
                This action is irreversible. Type <strong>delete</strong> to
                confirm.
              </p>
              <input
                type="text"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="Type 'delete' to confirm"
                className="w-full p-3 border border-burgundy-300 rounded-lg focus:ring-2 focus:ring-burgundy-400 mb-4"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className={`bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                >
                  {loading ? <Spinner size="sm" /> : "Delete Account"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default AccountSettings;
