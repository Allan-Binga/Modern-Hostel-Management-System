import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Spinner from "../../components/Spinner";

function AccountSettings() {
  const [adsEnabled, setAdsEnabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleToggleAds = () => {
    setAdsEnabled((prev) => !prev);
    // You could add an API call here to persist the setting
  };

  const handlePasswordReset = () => {
    setLoading(true);
    // Simulate async operation
    setTimeout(() => {
      setLoading(false);
      alert("Password reset link sent to your email.");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center bg-gray-50 py-10">
        <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md space-y-8">
          <h2 className="text-2xl font-semibold text-gray-800 text-center">
            Account Settings
          </h2>

          {/* Advertisement Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Show Advertisements</span>
            <label className="inline-flex relative items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={adsEnabled}
                onChange={handleToggleAds}
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-600 transition"></div>
              <span className="ml-3 text-sm text-gray-500">
                {adsEnabled ? "On" : "Off"}
              </span>
            </label>
          </div>

          {/* Password Reset */}
          <button
            onClick={handlePasswordReset}
            className="w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition"
            disabled={loading}
          >
            {loading ? <Spinner size="sm" /> : "Reset Password"}
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default AccountSettings;
