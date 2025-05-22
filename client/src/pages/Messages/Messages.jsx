import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Spinner from "../../components/Spinner";
import { toast } from "react-toastify";
import {
  MessageCircle,
  CheckCircle2,
  Clock4,
  Star,
  Filter,
  SortAsc,
  SortDesc,
  CheckSquare,
} from "lucide-react";
import { endpoint } from "../../backendAPI";


function Messages() {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [activeModal, setActiveModal] = useState(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");
  const [filterStatus, setFilterStatus] = useState("all");

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${endpoint}/notifications/my-notifications`, {
          withCredentials: true,
        });
        setNotifications(res.data || []);
        setFilteredNotifications(res.data || []);
        toast.success("Notifications loaded successfully!");
      } catch (err) {
        toast.error("Failed to fetch notifications.");
        console.error("Failed to fetch notifications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  // Sort and filter notifications
  useEffect(() => {
    let sorted = [...notifications];
    if (sortOrder === "newest") {
      sorted.sort(
        (a, b) => new Date(b.notification_date) - new Date(a.notification_date)
      );
    } else if (sortOrder === "oldest") {
      sorted.sort(
        (a, b) => new Date(a.notification_date) - new Date(b.notification_date)
      );
    } else if (sortOrder === "status") {
      sorted.sort((a, b) => a.status.localeCompare(b.status));
    }

    let filtered = sorted;
    if (filterStatus === "read") {
      filtered = sorted.filter((note) => note.status === "read");
    } else if (filterStatus === "unread") {
      filtered = sorted.filter((note) => note.status === "unread");
    }

    setFilteredNotifications(filtered);
  }, [notifications, sortOrder, filterStatus]);

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const res = await axios.put(
        `${endpoint}/notifications/my-notifications/${notificationId}/mark-as-read`,
        {},
        { withCredentials: true }
      );
      setNotifications((prev) =>
        prev.map((note) =>
          note.notification_id === notificationId ? res.data : note
        )
      );
      toast.info("Notification marked as read.");
    } catch (error) {
      toast.error("Failed to mark notification as read.");
      console.error("Failed to mark notification as read:", error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    setLoading(true);
    try {
      await axios.put(
        `${endpoint}/notifications/my-notifications/mark-all-as-read`,
        {},
        { withCredentials: true }
      );
      setNotifications((prev) =>
        prev.map((note) => ({ ...note, status: "read" }))
      );
      toast.success("All notifications marked as read!");
    } catch (error) {
      toast.error("Failed to mark all notifications as read.");
      console.error("Failed to mark all notifications as read:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle feedback modal
  const handleOpenModal = (notificationId) => {
    markAsRead(notificationId);
    setActiveModal(notificationId);
    setRating(0);
    setFeedback("");
  };

  // Submit feedback
  const handleSubmitFeedback = async () => {
    if (!rating) {
      toast.error("Please select a rating.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${endpoint}/notifications/feedback/${activeModal}`,
        { rating, feedback },
        { withCredentials: true }
      );
      toast.success("Feedback submitted successfully!");
      setActiveModal(null);
    } catch (error) {
      toast.error("Failed to submit feedback.");
      console.error("Failed to submit feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(dateString));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-burgundy-100 to-burgundy-200 animate-fadeIn">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto p-6 md:p-10">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-burgundy-800 animate-slideIn flex items-center gap-3">
            <MessageCircle size={36} /> Messages
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Stay updated with your notifications and provide feedback.
          </p>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner />
          </div>
        ) : (
          <section className="bg-white rounded-3xl shadow-xl p-8 animate-slideUp">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-2xl font-extrabold text-burgundy-700 flex items-center gap-3">
                <MessageCircle size={28} /> Your Notifications
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <div className="relative">
                  <Filter size={20} className="absolute left-3 top-2.5 text-burgundy-500" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-300 focus:border-gray-300 focus:outline-none"
                    aria-label="Filter notifications"
                  >
                    <option value="all">All</option>
                    <option value="read">Read</option>
                    <option value="unread">Unread</option>
                  </select>
                </div>
                <div className="relative">
                  <SortAsc size={20} className="absolute left-3 top-2.5 text-burgundy-500" />
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-300 focus:border-gray-300 focus:outline-none"
                    aria-label="Sort notifications"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="status">By Status</option>
                  </select>
                </div>
                <button
                  onClick={markAllAsRead}
                  disabled={loading || notifications.every((note) => note.status === "read")}
                  className={`flex items-center gap-2 px-4 py-2 bg-burgundy-500 text-white rounded-lg hover:bg-burgundy-600 transition-colors text-sm ${
                    loading || notifications.every((note) => note.status === "read")
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  <CheckSquare size={20} /> Mark All as Read
                </button>
              </div>
            </div>

            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle size={48} className="text-burgundy-300 mx-auto mb-4" />
                <p className="text-gray-600 text-base">
                  No notifications to display. You're all caught up!
                </p>
              </div>
            ) : (
              <ul className="space-y-4">
                {filteredNotifications.map((note, index) => (
                  <li
                    key={note.notification_id}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center border border-gray-300 p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition-all hover:scale-101 cursor-pointer animate-slideUp"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => {
                      markAsRead(note.notification_id);
                      if (note.message.includes("Were you satisfied")) {
                        handleOpenModal(note.notification_id);
                      }
                    }}
                    role="button"
                    aria-label={`Notification: ${note.message}`}
                  >
                    <div className="flex-1">
                      <p className="text-base text-burgundy-800">{note.message}</p>
                      <div className="flex items-center text-sm text-gray-500 mt-2 gap-2">
                        <Clock4 size={16} />
                        {formatDate(note.notification_date)}
                      </div>
                    </div>
                    <div className="mt-2 sm:mt-0 text-sm font-medium text-burgundy-600 flex items-center gap-2">
                      {note.status === "read" ? (
                        <>
                          <CheckCircle2 size={16} className="text-green-500" />
                          <span>Read</span>
                        </>
                      ) : (
                        <>
                          <Clock4 size={16} className="text-yellow-500" />
                          <span>Unread</span>
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </main>

      {/* Feedback Modal */}
      {activeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 relative animate-slideUp">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-burgundy-700 transition-colors"
              onClick={() => setActiveModal(null)}
              aria-label="Close modal"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold text-burgundy-800 mb-6 text-center">
              Rate Our Service
            </h3>
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={32}
                  className={`cursor-pointer transition-transform duration-200 ${
                    (hover || rating) >= star
                      ? "text-yellow-400 scale-110"
                      : "text-burgundy-200"
                  }`}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(star)}
                  fill={(hover || rating) >= star ? "currentColor" : "none"}
                  aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                />
              ))}
            </div>
            <textarea
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your feedback (optional)..."
              className="w-full border border-burgundy-300 rounded-lg p-3 text-sm mb-6 focus:outline-none focus:ring-2 focus:ring-burgundy-400"
              aria-label="Feedback input"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitFeedback}
                disabled={loading || !rating}
                className={`px-4 py-2 text-sm rounded-lg text-white flex items-center gap-2 transition-colors ${
                  rating && !loading
                    ? "bg-burgundy-500 hover:bg-burgundy-600"
                    : "bg-burgundy-300 cursor-not-allowed"
                }`}
              >
                {loading ? <Spinner size="sm" /> : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default Messages;