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
  DollarSign,
  Filter,
  MessageSquare, Home, Bed
} from "lucide-react";
import { toast } from "react-toastify";

function Bookings() {
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [filter, setFilter] = useState("");

  // Mock tenant data (replace with real data from backend/context)
  const tenantName = localStorage.getItem("tenantName") || "Tenant";

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${endpoint}/booking/my-bookings`, {
          withCredentials: true,
        });
        setMyBookings(response.data);
        toast.success("Bookings loaded successfully!");
      } catch (error) {
        toast.error("Failed to fetch bookings.");
        console.error("Failed to fetch bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
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

  // Mock total amount due (replace with real calculation from backend)
  const totalDue = filteredBookings
    .filter((booking) => booking.payment_status === "Unpaid")
    .reduce((sum, booking) => sum + (booking.amount || 15000), 0);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-burgundy-100 to-burgundy-200 animate-fadeIn">
      <Navbar />
      <main className="flex-grow px-4 py-8 max-w-7xl mx-auto">
        {/* Hero Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-burgundy-800 animate-slideIn">
            My Bookings, {tenantName}!
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            View your bookings and manage your rent payments.
          </p>
        </header>

        {/* Pay Rent Section */}
        <section className="mb-12 bg-white rounded-3xl shadow-xl p-8 animate-slideUp">
          <h2 className="text-2xl font-extrabold text-burgundy-700 mb-6 flex items-center gap-3">
            <DollarSign size={28} /> Pay Rent
          </h2>
          {totalDue > 0 ? (
            <div className="space-y-4">
              <p className="text-gray-600">
                You have <span className="font-bold text-red-600">KES {totalDue.toLocaleString()}</span> due for unpaid bookings.
              </p>
              <button
                onClick={handlePayRent}
                disabled={paymentLoading}
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
            <p className="text-gray-600 italic">No payments due at the moment.</p>
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
              className="p-2 border border-burgundy-300 rounded-lg focus:ring-2 focus:ring-burgundy-400"
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
            <p className="text-center text-gray-500">You have no bookings yet.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
              {filteredBookings.map((booking, index) => (
                <div
                  key={booking.booking_id}
                  className="bg-white shadow-lg rounded-3xl p-6 border border-burgundy-200 hover:shadow-2xl hover:bg-burgundy-50 transition-all duration-300 animate-slideUp"
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
      </main>
      <Footer />
    </div>
  );
}

export default Bookings;