import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { XCircle, Home, MessageSquare, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import Spinner from "../../components/Spinner";
import axios from "axios";
import { endpoint } from "../../backendAPI";

function Failure() {
  const [loading, setLoading] = useState(false);
  const [iconAnimated, setIconAnimated] = useState(false);

  // Mock tenant and error data (replace with real data from backend/context)
  const tenantName = localStorage.getItem("tenantName") || "Tenant";
  const errorDetails = {
    amount: "KES 15,000",
    date: new Date().toLocaleString(),
    reason: "Insufficient funds or invalid card details",
    attemptId: "ATT123456789",
  };

  useEffect(() => {
    // Trigger toast on page load
    toast.error("Payment failed. Please try again.");
    // Trigger icon animation
    setIconAnimated(true);
    // Reset animation after 1s for reusability
    const timer = setTimeout(() => setIconAnimated(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Handling Payment Retries
  const handlePaymentRetry = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${endpoint}/checkout/pay-rent-via-stripe`,
        {},
        { withCredentials: true }
      );
      const { url } = response.data;
      toast.info("Redirecting to payment gateway...");
      window.location.href = url;
    } catch (error) {
      toast.error("Failed to initiate payment retry.");
      console.error("Error creating checkout session", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-burgundy-100 to-burgundy-200 animate-fadeIn">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto p-6 md:p-10 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 w-full max-w-lg animate-slideUp">
          {/* Failure Header */}
          <div className="text-center mb-8">
            <XCircle
              className={`text-red-500 w-20 h-20 mx-auto mb-4 transition-transform ${
                iconAnimated ? "scale-110" : "scale-100"
              }`}
            />
            <h1 className="text-3xl md:text-4xl font-extrabold text-burgundy-800">
              Payment Failed
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              Sorry, {tenantName}. Your payment could not be processed.
            </p>
          </div>

          {/* Error Details */}
          <section className="mb-8">
            <h2 className="text-2xl font-extrabold text-burgundy-700 mb-4 flex items-center gap-3">
              <XCircle size={28} /> Error Details
            </h2>
            <div className="space-y-3 text-gray-600">
              <div className="flex justify-between">
                <span className="font-medium">Amount Attempted:</span>
                <span>{errorDetails.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Date:</span>
                <span>{errorDetails.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Reason:</span>
                <span>{errorDetails.reason}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Attempt ID:</span>
                <span>{errorDetails.attemptId}</span>
              </div>
            </div>
          </section>

          {/* Actions */}
          <section className="space-y-4">
            <button
              onClick={handlePaymentRetry}
              disabled={loading}
              className={`w-full bg-burgundy-500 text-white py-3 px-4 rounded-lg hover:bg-burgundy-600 transition-colors flex items-center justify-center gap-2 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <RefreshCw size={20} /> Retry Payment
                </>
              )}
            </button>
            {/* <div className="flex gap-4">
              <button
                onClick={() => {
                  toast.info("Returning to dashboard...");
                  window.location.href = "/tenant-home";
                }}
                className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
              >
                <Home size={20} /> Back to Dashboard
              </button>
              <button
                onClick={() => {
                  toast.info("Contacting support...");
                  window.location.href = "tel:+254700123456";
                }}
                className="flex-1 bg-burgundy-500 text-white py-3 px-4 rounded-lg hover:bg-burgundy-600 transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquare size={20} /> Contact Support
              </button>
            </div> */}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Failure;
