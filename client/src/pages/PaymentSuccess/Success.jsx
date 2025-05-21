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

function Success() {
  const [loading, setLoading] = useState(false);
  const [iconAnimated, setIconAnimated] = useState(false);

  // Mock tenant and payment data (replace with real data from backend/context)
  const tenantName = localStorage.getItem("tenantName") || "Tenant";
  const paymentDetails = {
    amount: "KES 15,000",
    date: new Date().toLocaleString(),
    transactionId: "TXN123456789",
    method: "M-Pesa",
  };

  useEffect(() => {
    // Trigger toast on page load
    toast.success("Payment received successfully!");
    // Trigger icon animation
    setIconAnimated(true);
    // Reset animation after 1s for reusability
    const timer = setTimeout(() => setIconAnimated(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleDownloadReceipt = () => {
    setLoading(true);
    setTimeout(() => {
      toast.info("Receipt download initiated...");
      setLoading(false);
      // Simulate download (replace with actual download logic)
      alert("Receipt downloaded successfully!");
    }, 1500);
  };

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
              Thank you, {tenantName}! Your rent has been received.
            </p>
          </div>

          {/* Payment Details */}
          <section className="mb-8">
            <h2 className="text-2xl font-extrabold text-burgundy-700 mb-4 flex items-center gap-3">
              <Receipt size={28} /> Payment Details
            </h2>
            <div className="space-y-3 text-gray-600">
              <div className="flex justify-between">
                <span className="font-medium">Amount:</span>
                <span>{paymentDetails.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Date:</span>
                <span>{paymentDetails.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Transaction ID:</span>
                <span>{paymentDetails.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Payment Method:</span>
                <span>{paymentDetails.method}</span>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Success;
