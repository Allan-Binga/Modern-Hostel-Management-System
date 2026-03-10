import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { endpoint } from "../../backendAPI";
import { toast } from "react-toastify";
import AdminNavbar from "../../components/AdminNavbar";
import Footer from "../../components/Footer";
import Spinner from "../../components/Spinner";
import { CalendarDays, Home, CreditCard, Banknote, X } from "lucide-react";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const modalRef = useRef(null);
  const firstFocusableRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [bookingsRes, paymentsRes] = await Promise.all([
          axios.get(`${endpoint}/booking/all-bookings`, {
            withCredentials: true,
          }),
          axios.get(`${endpoint}/payments/all-payments`, {
            withCredentials: true,
          }),
        ]);
        setBookings(bookingsRes.data);
        setPayments(paymentsRes.data);
      } catch (error) {
        toast.error("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && selectedItem) setSelectedItem(null);
    };

    const handleFocusTrap = (e) => {
      if (!modalRef.current || !selectedItem) return;
      const focusable = modalRef.current.querySelectorAll("button");
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.key === "Tab") {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    if (selectedItem && firstFocusableRef.current)
      firstFocusableRef.current.focus();
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keydown", handleFocusTrap);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keydown", handleFocusTrap);
    };
  }, [selectedItem]);

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target))
      setSelectedItem(null);
  };

  const formatDate = (isoString) => {
    try {
      const date = new Date(isoString);
      return isNaN(date.getTime())
        ? "Invalid Date"
        : date.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });
    } catch {
      return "Invalid Date";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-burgundy-100 to-burgundy-200">
      <AdminNavbar />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
        <header className="mb-8 animate-fadeIn">
          <h1 className="text-3xl sm:text-4xl font-bold text-burgundy-800">
            Bookings & Payments
          </h1>
          <p className="text-base sm:text-lg text-burgundy-600 mt-2">
            Manage bookings and payments
          </p>
        </header>

        <section
          className="mb-12 relative min-h-[200px]"
          aria-live="polite"
          aria-busy={loading}
        >
          <h2 className="text-2xl font-semibold text-burgundy-800 flex items-center gap-3 mb-6">
            <CalendarDays size={28} /> Bookings
          </h2>
          {loading ? (
            <div className="absolute inset-0 flex justify-center items-center bg-burgundy-100/80 transition-opacity">
              <Spinner size="large" className="text-burgundy-500" />
            </div>
          ) : bookings.length === 0 ? (
            <p className="text-burgundy-600 text-base italic">
              No bookings available.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {bookings.map((booking, index) => (
                <div
                  key={booking.booking_id}
                  className="bg-white rounded-lg shadow-sm min-h-[260px] transition-transform hover:scale-105 animate-slideUp"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <div className="p-8 space-y-3 text-burgundy-800">
                    <div className="text-lg font-semibold">
                      Booking ID: {booking.booking_id}
                    </div>
                    <div className="flex items-center gap-2 text-lg">
                      <Home size={20} className="text-burgundy-600" />
                      <span>Room ID: {booking.room_id}</span>
                    </div>
                    <div className="flex items-center gap-2 text-lg">
                      <CalendarDays size={20} className="text-burgundy-600" />
                      <span>Check-in: {formatDate(booking.check_in_date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-lg">
                      <CalendarDays size={20} className="text-burgundy-600" />
                      <span>
                        Status:{" "}
                        <span className="text-green-600">
                          {booking.payment_status}
                        </span>
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        setSelectedItem({ type: "booking", data: booking })
                      }
                      className="w-full mt-4 bg-burgundy-500 text-burgundy-100 py-2 rounded-lg hover:bg-burgundy-600 transition-all focus:outline-none focus:ring-2 focus:ring-burgundy-400"
                      aria-label={`View details for booking ${booking.booking_id}`}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section
          className="relative min-h-[200px]"
          aria-live="polite"
          aria-busy={loading}
        >
          <h2 className="text-2xl font-semibold text-burgundy-800 flex items-center gap-3 mb-6">
            <CreditCard size={28} /> Payments
          </h2>
          {loading ? (
            <div className="absolute inset-0 flex justify-center items-center bg-burgundy-100/80 transition-opacity">
              <Spinner size="large" className="text-burgundy-500" />
            </div>
          ) : payments.length === 0 ? (
            <p className="text-burgundy-600 text-base italic">
              No payments available.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {payments.map((payment, index) => (
                <div
                  key={payment.payment_id}
                  className="bg-white rounded-lg shadow-sm min-h-[260px] transition-transform hover:scale-105 animate-slideUp"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <div className="p-8 space-y-3 text-burgundy-800">
                    <div className="text-lg font-semibold">
                      Payment ID: {payment.payment_id}
                    </div>
                    <div className="flex items-center gap-2 text-lg">
                      <Banknote size={20} className="text-burgundy-600" />
                      <span>
                        Amount: KSh {payment.amount?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-lg">
                      <CalendarDays size={20} className="text-burgundy-600" />
                      <span>Date: {formatDate(payment.payment_date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-lg">
                      <CreditCard size={20} className="text-burgundy-600" />
                      <span>
                        Status:{" "}
                        <span className="text-green-600">
                          {payment.payment_status}
                        </span>
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        setSelectedItem({ type: "payment", data: payment })
                      }
                      className="w-full mt-4 bg-burgundy-500 text-burgundy-100 py-2 rounded-lg hover:bg-burgundy-600 transition-all focus:outline-none focus:ring-2 focus:ring-burgundy-400"
                      aria-label={`View details for payment ${payment.payment_id}`}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {selectedItem && (
          <div
            className="fixed inset-0 bg-burgundy-900/50 flex items-center justify-center z-50 transition-opacity"
            onClick={handleClickOutside}
          >
            <div
              ref={modalRef}
              className="bg-white rounded-lg shadow-lg w-11/12 sm:max-w-md mx-auto p-6 animate-slideUp"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
            >
              <div className="flex justify-between items-center mb-4">
                <h3
                  id="modal-title"
                  className="text-xl font-semibold text-burgundy-800 flex items-center gap-2"
                >
                  {selectedItem.type === "booking" ? (
                    <CalendarDays size={20} />
                  ) : (
                    <CreditCard size={20} />
                  )}
                  {selectedItem.type === "booking" ? "Booking" : "Payment"}{" "}
                  Details
                </h3>
                <button
                  ref={firstFocusableRef}
                  onClick={() => setSelectedItem(null)}
                  className="text-burgundy-600 hover:text-burgundy-800 focus:outline-none focus:ring-2 focus:ring-burgundy-400 rounded-full p-1"
                  aria-label="Close modal"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-3 text-burgundy-800">
                {selectedItem.type === "booking" ? (
                  <>
                    <div className="flex items-center gap-2 text-base">
                      <CalendarDays size={20} className="text-burgundy-600" />
                      Booking ID: {selectedItem.data.booking_id}
                    </div>
                    <div className="flex items-center gap-2 text-base">
                      <Home size={20} className="text-burgundy-600" />
                      Room ID: {selectedItem.data.room_id}
                    </div>
                    <div className="flex items-center gap-2 text-base">
                      <CalendarDays size={20} className="text-burgundy-600" />
                      Tenant ID: {selectedItem.data.tenant_id}
                    </div>
                    <div className="flex items-center gap-2 text-base">
                      <CalendarDays size={20} className="text-burgundy-600" />
                      Booking Date: {formatDate(selectedItem.data.booking_date)}
                    </div>
                    <div className="flex items-center gap-2 text-base">
                      <CalendarDays size={20} className="text-burgundy-600" />
                      Check-in: {formatDate(selectedItem.data.check_in_date)}
                    </div>
                    <div className="flex items-center gap-2 text-base">
                      <CalendarDays size={20} className="text-burgundy-600" />
                      Check-out: {formatDate(selectedItem.data.check_out_date)}
                    </div>
                    <div className="flex items-center gap-2 text-base">
                      <CalendarDays size={20} className="text-burgundy-600" />
                      Status:{" "}
                      <span className="text-green-600">
                        {selectedItem.data.payment_status}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 text-base">
                      <CreditCard size={20} className="text-burgundy-600" />
                      Payment ID: {selectedItem.data.payment_id}
                    </div>
                    <div className="flex items-center gap-2 text-base">
                      <CreditCard size={20} className="text-burgundy-600" />
                      Tenant: {selectedItem.data.tenantname}
                    </div>
                    <div className="flex items-center gap-2 text-base">
                      <Banknote size={20} className="text-burgundy-600" />
                      Amount: KSh {selectedItem.data.amount?.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2 text-base">
                      <CalendarDays size={20} className="text-burgundy-600" />
                      Date: {formatDate(selectedItem.data.payment_date)}
                    </div>
                    <div className="flex items-center gap-2 text-base">
                      <CreditCard size={20} className="text-burgundy-600" />
                      Method: {selectedItem.data.payment_method}
                    </div>
                    <div className="flex items-center gap-2 text-base">
                      <CreditCard size={20} className="text-burgundy-600" />
                      Status:{" "}
                      <span className="text-green-600">
                        {selectedItem.data.payment_status}
                      </span>
                    </div>
                  </>
                )}
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="w-full mt-6 bg-burgundy-500 text-burgundy-100 py-2 rounded-lg hover:bg-burgundy-600 transition-all focus:outline-none focus:ring-2 focus:ring-burgundy-400"
                aria-label="Close modal"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default AdminBookings;
