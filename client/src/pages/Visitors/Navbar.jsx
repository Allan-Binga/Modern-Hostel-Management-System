import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, LogOut, X } from "lucide-react";
import axios from "axios";
import { endpoint } from "../../backendAPI";
import { toast } from "react-toastify";

function VisitorNavbar() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  // Open modal on sign out button click
  const openModal = () => {
    setPhoneNumber("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSignOutSubmit = async (e) => {
    e.preventDefault();

    // Basic phone number format validation: must start with "254" and be digits only
    if (!/^254\d{7,}$/.test(phoneNumber)) {
      toast.error("Please enter a valid phone number starting with 254.");
      return;
    }

    setLoading(true);
    try {
      // Call your sign-out API
      await axios.post(`${endpoint}/visitors/sign-out`, {
        phoneNumber,
        actualExitTime: new Date().toTimeString().slice(0, 5), // HH:mm format for now
      });

      toast.success("Signed out successfully!");
      setShowModal(false);
      navigate("/visitors/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to sign out visitor."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 bg-burgundy-800 text-burgundy-100 shadow-sm z-50 animate-fadeIn"
        role="navigation"
        aria-label="Visitor navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <p
              className="flex items-center gap-2 text-lg font-bold text-burgundy-100 hover:text-burgundy-200 transition-colors"
              aria-label="Visitor dashboard"
            >
              <Home size={20} />
              Prestige Girls Hostel
            </p>

            {/* Sign Out Button */}
            <button
              onClick={openModal}
              className="bg-burgundy-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold hover:bg-burgundy-600 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-burgundy-400"
              aria-label="Sign out"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-60"
          aria-modal="true"
          role="dialog"
          aria-labelledby="modal-title"
        >
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <h2
              id="modal-title"
              className="text-xl font-semibold mb-4 text-center"
            >
              Visitor Sign Out
            </h2>

            <form onSubmit={handleSignOutSubmit}>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number (start with 254)
              </label>
              <input
                id="phoneNumber"
                type="tel"
                placeholder="254XXXXXXXXX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:ring-1 focus:ring-gray-300 focus:border-gray-300 focus:outline-none"
                required
                pattern="254\d{7,}"
                aria-describedby="phoneHelp"
              />
              <div id="phoneHelp" className="text-xs text-gray-500 mb-4">
                Enter your phone number starting with country code 254
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-burgundy-500 text-white py-2 rounded-lg font-semibold hover:bg-burgundy-600 transition-colors disabled:opacity-50"
              >
                {loading ? "Signing Out..." : "Sign Out"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default VisitorNavbar;
