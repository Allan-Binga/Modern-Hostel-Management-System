import { useState, useEffect } from "react";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import Spinner from "../../components/Spinner";
import { endpoint } from "../../backendAPI";
import axios from "axios";
import {
  CreditCard,
  History,
  CalendarDays,
  Check,
  CheckCheck,
  BanknoteArrowUp,
  Filter,
  MessageSquare,
  Home,
  Bed,
  X,
} from "lucide-react";
import { toast } from "react-toastify";

function Bookings() {
  const [myBookings, setMyBookings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [payments, setPayments] = useState([]);
  const [showMpesaModal, setShowMpesaModal] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${endpoint}/booking/my-bookings`, {
          withCredentials: true,
        });
        setMyBookings(response.data);
      } catch (error) {
        toast.error("Failed to fetch bookings.");
        console.error("Failed to fetch bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${endpoint}/payments/my-payments`, {
          withCredentials: true,
        });
        setPayments(response.data);
      } catch (error) {
        toast.error("Failed to fetch payments.");
        console.error("Failed to fetch payments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handlePayRent = async () => {
    setPaymentLoading(true);
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
      toast.error("Failed to initiate payment.");
      console.error("Error creating checkout session", error);
    } finally {
      setPaymentLoading(false);
    }
  };

  const filteredBookings = filter
    ? myBookings.filter((booking) => booking.payment_status === filter)
    : myBookings;

  const totalDue = myBookings
    .filter((b) => b.payment_status === "Unpaid")
    .reduce((sum, b) => sum + (parseFloat(b.room_price) || 0), 0)
    .toFixed(2);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-burgundy-100 to-burgundy-200 animate-fadeIn">
      <Navbar />
      <main className="flex-grow px-4 py-8 max-w-7xl mx-auto">
        {/* Hero Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-burgundy-800 animate-slideIn">
            My Booking
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            View your bookings and manage your rent payments.
          </p>
        </header>

        {/* Pay Rent Section */}
        <section className="mb-12 bg-white rounded-3xl shadow-xl p-8 animate-slideUp">
          <h2 className="text-2xl font-extrabold text-burgundy-700 mb-6 flex items-center gap-3">
            <BanknoteArrowUp size={28} /> Pay Rent
          </h2>
          {parseFloat(totalDue) > 0 ? (
            <div className="space-y-4">
              <p className="text-gray-600">
                You have{" "}
                <span className="font-bold text-red-600">KES {totalDue}</span>{" "}
                due for unpaid bookings.
              </p>

              <button
                onClick={() => setIsModalOpen(true)}
                // disabled={paymentLoading}
                className={`w-full bg-burgundy-500 text-white py-3 px-4 rounded-lg hover:bg-burgundy-600 transition-colors flex items-center justify-center gap-2 ${
                  paymentLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {paymentLoading ? (
                  <Spinner size="sm" />
                ) : (
                  <>
                    <CreditCard size={20} /> Pay Rent Now
                  </>
                )}
              </button>
            </div>
          ) : (
            <p className="text-gray-600 italic">
              No payments due at the moment.
            </p>
          )}
        </section>

        {/* Bookings Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-extrabold text-burgundy-800 flex items-center gap-3">
              <History size={36} /> My Bookings
            </h2>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-2 border border-burgundy-300 rounded-lg focus:ring-1 focus:ring-pink-950 focus:border-gray-300 focus:outline-none"
            >
              <option value="">All Bookings</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner />
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 shadow-xl text-center text-gray-500 border border-gray-200">
              <p className="text-lg italic">You have no bookings yet.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
              {filteredBookings.map((booking, index) => (
                <div
                  key={booking.booking_id}
                  className="bg-white shadow-lg rounded-3xl p-6 border border-gray-200 transition-all duration-300 animate-slideUp"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="text-burgundy-600" size={20} />
                      <div>
                        <p className="text-sm text-gray-500">Booking Date</p>
                        <p className="font-medium">
                          {formatDate(booking.booking_date)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Check className="text-burgundy-600" size={20} />
                      <div>
                        <p className="text-sm text-gray-500">Check-In</p>
                        <p className="font-medium">
                          {formatDate(booking.check_in_date)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <CheckCheck className="text-burgundy-600" size={20} />
                      <div>
                        <p className="text-sm text-gray-500">Check-Out</p>
                        <p className="font-medium">
                          {formatDate(booking.check_out_date)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <CreditCard className="text-burgundy-600" size={20} />
                      <div>
                        <p className="text-sm text-gray-500">Payment Status</p>
                        <p
                          className={`font-medium ${
                            booking.payment_status === "Paid"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {booking.payment_status}
                        </p>
                      </div>
                    </div>

                    {/* Room Details (assumed from backend) */}
                    <div className="flex items-center gap-2">
                      <Home className="text-burgundy-600" size={20} />
                      <div>
                        <p className="text-sm text-gray-500">Room Type</p>
                        <p className="font-medium">
                          {booking.room_type || "Single"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Bed className="text-burgundy-600" size={20} />
                      <div>
                        <p className="text-sm text-gray-500">Beds</p>
                        <p className="font-medium">{booking.beds || "1"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => {
                      toast.info("Contacting support for booking details...");
                      window.location.href = "tel:+254700123456";
                    }}
                    className="mt-4 w-full bg-burgundy-500 text-white py-2 px-4 rounded-lg hover:bg-burgundy-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageSquare size={16} /> Contact Support
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Payments Section */}
        <section className="mt-12">
          <h2 className="text-3xl font-extrabold text-burgundy-800 flex items-center gap-3 mb-6">
            <BanknoteArrowUp size={30} /> My Payments
          </h2>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner />
            </div>
          ) : payments.length === 0 ? (
            <div className="bg-white shadow-lg rounded-3xl p-8 text-center text-gray-500 border border-gray-200">
              <p className="text-lg italic">You have no payment history yet.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
              {payments.map((payment, index) => (
                <div
                  key={payment.payment_id}
                  className="bg-white shadow-md rounded-2xl p-5 border border-gray-200 hover:shadow-lg transition duration-300"
                >
                  <div className="space-y-2 text-gray-700">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-burgundy-700">
                        Amount Paid:
                      </p>
                      <span className="text-lg font-bold text-green-600">
                        KES {parseFloat(payment.amount).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <p className="text-gray-600">Payment Date:</p>
                      <span>{formatDate(payment.payment_date)}</span>
                    </div>

                    <div className="flex justify-between">
                      <p className="text-gray-600">Payment Method:</p>
                      <span>{payment.payment_method}</span>
                    </div>

                    <div className="flex justify-between">
                      <p className="text-gray-600">Payment Status:</p>
                      <span
                        className={`font-medium ${
                          payment.payment_status === "Paid"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {payment.payment_status}
                      </span>
                    </div>

                    {/* Show Mpesa details only if payment method is not Stripe */}
                    {payment.payment_method !== "Stripe" && (
                      <>
                        <div className="flex justify-between">
                          <p className="text-gray-600">Mpesa Number:</p>
                          <span>{payment.mpesa_number || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-gray-600">Transaction ID:</p>
                          <span>{payment.transaction_id || "N/A"}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-[90%] sm:max-w-md p-4 sm:p-6 rounded-2xl shadow-lg relative">
              <button
                className="absolute top-2 right-2 sm:top-3 sm:right-3 text-gray-500 cursor-pointer"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={24} />
              </button>
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                Choose Payment Method
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <button
                  onClick={handlePayRent}
                  className="w-full flex items-center gap-2 sm:gap-3 bg-purple-900 text-white py-4 sm:py-6 px-3 sm:px-4 rounded-xl hover:bg-purple-700 transition cursor-pointer"
                >
                  <span className="flex-1 text-left text-sm sm:text-base">
                    Pay with Stripe
                  </span>
                </button>
                <button
                  onClick={handlePayRent}
                  className="w-full flex items-center gap-2 sm:gap-3 bg-green-600 text-white py-4 sm:py-6 px-3 sm:px-4 rounded-xl hover:bg-green-700 transition cursor-pointer"
                >
                  <span className="flex-1 text-left text-sm sm:text-base">
                    Pay with Link
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* === M-Pesa Phone Number Modal === */}
        {showMpesaModal && (
          <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg max-w-[90%] sm:max-w-sm w-full">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-center">
                Please enter your valid M-pesa number.
              </h2>
              <input
                type="tel"
                placeholder="07XXXXXXXX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md mb-3 sm:mb-4 focus:outline-none focus:border-gray-400 text-sm sm:text-base"
              />
              <div className="flex justify-between">
                <button
                  className="bg-gray-300 text-black px-3 sm:px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm sm:text-base"
                  onClick={() => setShowMpesaModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-green-600 text-white px-3 sm:px-4 py-2 rounded-md hover:bg-green-700 text-sm sm:text-base"
                  onClick={handleSubmitMpesa}
                >
                  Submit
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

export default Bookings;
