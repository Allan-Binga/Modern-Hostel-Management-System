import { useState, useEffect } from "react";
import axios from "axios";
import { endpoint } from "../../backendAPI";
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
  Save,
  ArrowLeft,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function AccountSettings() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    adsEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
    twoFactorAuth: false,
    darkMode: false,
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [tenantDetails, setTenantDetails] = useState({});
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const navigate = useNavigate();

  // Fetch tenant details
  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      const tenantId = localStorage.getItem("tenantId");
      if (!tenantId) {
        toast.error("No tenant ID found. Please log in.");
        navigate("/login");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${endpoint}/users/tenants/${tenantId}`,
          { withCredentials: true }
        );
        const tenant = response.data.tenant || {};
        setTenantDetails(tenant);
        setProfileForm({
          firstName: tenant.firstname || "",
          lastName: tenant.lastname || "",
          email: tenant.email || "",
          phone: tenant.phonenumber || "",
        });
      } catch (error) {
        toast.error("Failed to fetch tenant details.");
        console.error(
          "Failed to fetch tenant:",
          error?.response?.data?.message || error.message
        );
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [navigate]);

  // Delete Tenant
  const deleteTenant = async () => {
    const tenantId = localStorage.getItem("tenantId");
    if (!tenantId) {
      toast.error("No tenant ID found.");
      return;
    }
    if (deleteConfirm.toLowerCase() !== "delete") {
      toast.error("Please type 'delete' to confirm.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.delete(
        `${endpoint}/tenants/tenant/delete/${tenantId}`,
        { withCredentials: true }
      );
      toast.success(response.data.message || "Account deleted successfully!");
      localStorage.removeItem("tenantId");
      setShowDeleteModal(false);
      setDeleteConfirm("");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete account.");
      console.error("Failed to delete account:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update Information
  const updateInformation = async () => {
    const tenantId = localStorage.getItem("tenantId");
    if (!tenantId) {
      toast.error("No tenant ID found.");
      return;
    }

    // Client-side validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^07\d{8}$/;
    if (!emailRegex.test(profileForm.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (profileForm.phone && !phoneRegex.test(profileForm.phone)) {
      toast.error("Please enter a valid phone number (e.g., 0712345678).");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(
        `${endpoint}/tenants/tenant/update/${tenantId}`,
        {
          firstName: profileForm.firstName,
          lastName: profileForm.lastName,
          email: profileForm.email,
          phone: profileForm.phone,
        },
        { withCredentials: true }
      );
      setTenantDetails(
        response.data.tenant || {
          firstName: profileForm.firstName,
          lastName: profileForm.lastName,
          email: profileForm.email,
          phone: profileForm.phone,
        }
      );
      toast.success(response.data.message || "Profile updated successfully!");
      setShowUpdateModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile.");
      console.error("Failed to update profile:", error);
    } finally {
      setLoading(false);
    }
  };

  // Send a Password Reset Email
  const handleReset = async () => {
    const email = tenantDetails.email;
    if (!email) {
      toast.error("No email found for this account.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${endpoint}/verify/resend/password-reset`,
        { email },
        { withCredentials: true }
      );
      toast.success(response.data.message || "Password reset email sent!");
      setShowPasswordModal(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send reset email."
      );
      console.error("Failed to send reset email:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateInformation();
  };

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    toast.info(
      `${key.replace(/([A-Z])/g, " $1").toLowerCase()} ${
        settings[key] ? "disabled" : "enabled"
      }.`
    );
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
            Manage your profile, security, and preferences.
          </p>
        </header>

        {loading && !tenantDetails.email ? (
          <div className="flex justify-center items-center h-64">
            <Spinner />
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column: Profile & Preferences */}
            <div className="lg:w-1/2 space-y-8">
              {/* Profile Information */}
              <section className="bg-white rounded-3xl shadow-xl p-10 animate-slideUp">
                <h2 className="text-2xl font-extrabold text-burgundy-700 mb-6 flex items-center gap-3">
                  <User size={32} /> Profile Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-burgundy-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={profileForm.firstName}
                      onChange={handleProfileChange}
                      placeholder="Enter your first name"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-300 focus:border-gray-300 focus:outline-none"
                      required
                      aria-required="true"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-burgundy-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={profileForm.lastName}
                      onChange={handleProfileChange}
                      placeholder="Enter your last name"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-300 focus:border-gray-300 focus:outline-none"
                      required
                      aria-required="true"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-burgundy-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profileForm.email}
                      onChange={handleProfileChange}
                      placeholder="Enter your email"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-300 focus:border-gray-300 focus:outline-none"
                      required
                      aria-required="true"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-burgundy-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileForm.phone}
                      onChange={handleProfileChange}
                      placeholder="Enter your phone number (e.g., +254700123456)"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-300 focus:border-gray-300 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={() => setShowUpdateModal(true)}
                    disabled={loading}
                    className={`w-full bg-burgundy-500 text-white py-3 px-4 rounded-lg hover:bg-burgundy-600 transition-colors flex items-center justify-center gap-2 ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    Update Profile
                  </button>
                </div>
              </section>

              {/* Preferences */}
              {/* <section
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
                </div>
              </section> */}
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
        )}

        {/* Password Reset Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 relative animate-slideUp">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-burgundy-700"
                onClick={() => setShowPasswordModal(false)}
              >
                <X size={24} />
              </button>
              <h3 className="text-2xl font-bold text-burgundy-800 mb-4">
                Reset Password
              </h3>
              <p className="text-gray-600 mb-6">
                A password reset link will be sent to your registered email
                address ({tenantDetails.email || "your email"}).
              </p>
              <button
                onClick={handleReset}
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
          <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 relative animate-slideUp">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-burgundy-700 cursor-pointer"
                onClick={() => setShowDeleteModal(false)}
              >
                <X size={24} />
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
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-300 focus:border-gray-300 focus:outline-none mb-4"
                aria-required="true"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteTenant}
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

        {/* Update Profile Modal */}
        {showUpdateModal && (
          <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 relative animate-slideUp">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-burgundy-700"
                onClick={() => setShowUpdateModal(false)}
              >
                <X size={24} />
              </button>
              <h3 className="text-2xl font-bold text-burgundy-800 mb-4">
                Update Profile
              </h3>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-burgundy-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={profileForm.firstName}
                    onChange={handleProfileChange}
                    placeholder="Enter your first name"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-300 focus:border-gray-300 focus:outline-none"
                    required
                    aria-required="true"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-burgundy-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={profileForm.lastName}
                    onChange={handleProfileChange}
                    placeholder="Enter your last name"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-300 focus:border-gray-300 focus:outline-none"
                    required
                    aria-required="true"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-burgundy-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    placeholder="Enter your email"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-300 focus:border-gray-300 focus:outline-none"
                    required
                    aria-required="true"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-burgundy-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileForm.phone}
                    onChange={handleProfileChange}
                    placeholder="Enter your phone number (e.g., 0712345678)"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-300 focus:border-gray-300 focus:outline-none"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowUpdateModal(false)}
                    className="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    // disabled={loading}
                    className={`bg-burgundy-500 text-white py-2 px-4 rounded-lg hover:bg-burgundy-600 transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? <Spinner size="sm" /> : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default AccountSettings;
