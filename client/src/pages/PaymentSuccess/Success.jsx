import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
  CheckCircle,
  Download,
  Home,
  MessageSquare,
  Receipt,
} from "lucide-react";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import Spinner from "../../components/Spinner";
import axios from "axios";
import { endpoint } from "../../backendAPI";

function Success() {
  const [loading, setLoading] = useState(false);
  const [iconAnimated, setIconAnimated] = useState(false);
  const [payments, setPayments] = useState([]);

  const recentPayments = async () => {
    try {
      const response = await axios.get(`${endpoint}/payments/my-payments`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to fetch payments";
    }
  };

  useEffect(() => {
    const fetchPayouts = async () => {
      setLoading(true);
      try {
        const data = await recentPayments();
        setPayments(data);
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayouts();
  }, []);

  useEffect(() => {
    toast.success("Payment received successfully!");
    setIconAnimated(true);
    const timer = setTimeout(() => setIconAnimated(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const latestPayment = payments[0]; // Just pick the most recent one

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-burgundy-100 to-burgundy-200 animate-fadeIn">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto p-6 md:p-10 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 w-full max-w-lg animate-slideUp">
          {/* Success Header */}
          <div className="text-center mb-8">
            <CheckCircle
              className={`text-green-500 w-20 h-20 mx-auto mb-4 transition-transform ${
                iconAnimated ? "scale-110" : "scale-100"
              }`}
            />
            <h1 className="text-3xl md:text-4xl font-extrabold text-burgundy-800">
              Payment Successful!
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              Thank you! Your rent has been received.
            </p>
          </div>

          {/* Payment Details */}
          <section className="mb-8">
            <h2 className="text-2xl font-extrabold text-burgundy-700 mb-4 flex items-center gap-3">
              <Receipt size={28} /> Payment Details
            </h2>
            {loading ? (
              <Spinner />
            ) : latestPayment ? (
              <div className="space-y-3 text-gray-600">
                <div className="flex justify-between">
                  <span className="font-medium">Amount:</span>
                  <span>KES {parseFloat(latestPayment.amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Date:</span>
                  <span>
                    {new Date(latestPayment.payment_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Transaction ID:</span>
                  <span>{latestPayment.transaction_id || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Payment Method:</span>
                  <span>{latestPayment.payment_method}</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No payment data available.</p>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Success;
