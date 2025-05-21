import { useState, useEffect } from "react";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import Spinner from "../../components/Spinner";
import { endpoint } from "../../backendAPI";
import axios from "axios";
import { CreditCard, History, CalendarDays, Check, CheckCheck } from "lucide-react";

function Bookings() {
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${endpoint}/booking/my-bookings`, {
          withCredentials: true,
        });
        setMyBookings(response.data);
      } catch (error) {
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow px-4 py-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">My Bookings</h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner />
          </div>
        ) : myBookings.length === 0 ? (
          <p className="text-center text-gray-500">You have no bookings yet.</p>
        ) : (
          <div className="grid gap-6">
            {myBookings.map((booking) => (
              <div
                key={booking.booking_id}
                className="bg-white shadow rounded-2xl p-6 border border-gray-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="text-burgundy-800" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Booking Date</p>
                      <p className="font-medium">
                        {formatDate(booking.booking_date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Check className="text-burgundy-800" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Check-In</p>
                      <p className="font-medium">
                        {formatDate(booking.check_in_date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <CheckCheck className="text-burgundy-800" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Check-Out</p>
                      <p className="font-medium">
                        {formatDate(booking.check_out_date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <CreditCard className="text-burgundy-800" size={20} />
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
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default Bookings;
