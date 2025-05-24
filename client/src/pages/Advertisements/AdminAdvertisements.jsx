import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { endpoint } from "../../backendAPI";
import { toast } from "react-toastify";
import AdminNavbar from "../../components/AdminNavbar";
import Footer from "../../components/Footer";
import Spinner from "../../components/Spinner";
import { Tag, Calendar, Phone, MessageSquare, X } from "lucide-react";

function AdminAdvertisements() {
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const modalRef = useRef(null);
  const firstFocusableRef = useRef(null);

  useEffect(() => {
    const fetchAds = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${endpoint}/advertisements/all`);
        setAdvertisements(response.data);
      } catch (error) {
        toast.error("Failed to fetch advertisements.");
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && selectedAd) setSelectedAd(null);
    };

    const handleFocusTrap = (e) => {
      if (!modalRef.current || !selectedAd) return;
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

    if (selectedAd && firstFocusableRef.current) firstFocusableRef.current.focus();
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keydown", handleFocusTrap);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keydown", handleFocusTrap);
    };
  }, [selectedAd]);

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) setSelectedAd(null);
  };

  const formatDate = (isoString) => {
    try {
      const date = new Date(isoString);
      return isNaN(date.getTime())
        ? "Invalid Date"
        : date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    } catch {
      return "Invalid Date";
    }
  };

  const handleApprove = async () => {
    setApproving(true);
    try {
      await axios.put(
        `${endpoint}/advertisements/approve/${selectedAd.ad_id}`,
        {},
        { withCredentials: true }
      );
      toast.success(`Advertisement #${selectedAd.ad_id} approved.`);
      setAdvertisements((prev) =>
        prev.map((ad) =>
          ad.ad_id === selectedAd.ad_id ? { ...ad, approval_status: "Approved" } : ad
        )
      );
      setSelectedAd({ ...selectedAd, approval_status: "Approved" });
    } catch (error) {
      toast.error(error.response?.data?.error || "Approval failed.");
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async () => {
    setRejecting(true);
    try {
      await axios.put(
        `${endpoint}/advertisements/reject/${selectedAd.ad_id}`,
        {},
        { withCredentials: true }
      );
      toast.success(`Advertisement #${selectedAd.ad_id} rejected.`);
      setAdvertisements((prev) =>
        prev.map((ad) =>
          ad.ad_id === selectedAd.ad_id ? { ...ad, approval_status: "Rejected" } : ad
        )
      );
      setSelectedAd({ ...selectedAd, approval_status: "Rejected" });
    } catch (error) {
      toast.error(error.response?.data?.error || "Rejection failed.");
    } finally {
      setRejecting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-burgundy-100 to-burgundy-200">
      <AdminNavbar />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
        <header className="mb-8 animate-fadeIn">
          <h1 className="text-3xl sm:text-4xl font-bold text-burgundy-800">Advertisements</h1>
          <p className="text-base sm:text-lg text-burgundy-600 mt-2">Manage advertisement requests</p>
        </header>

        <section className="relative min-h-[200px]" aria-live="polite" aria-busy={loading}>
          <h2 className="text-2xl font-semibold text-burgundy-800 flex items-center gap-3 mb-6">
            <Tag size={28} className="text-burgundy-600" /> All Advertisements
          </h2>
          {loading ? (
            <div className="absolute inset-0 flex justify-center items-center bg-burgundy-100/80 transition-opacity">
              <Spinner size="large" className="text-burgundy-500" />
            </div>
          ) : advertisements.length === 0 ? (
            <p className="text-burgundy-600 text-base italic">No advertisements available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {advertisements.map((ad, index) => (
                <div
                  key={ad.ad_id}
                  className="bg-white rounded-lg shadow-sm min-h-[260px] transition-transform hover:scale-105 animate-slideUp"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <div className="p-8 space-y-3 text-burgundy-800">
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-semibold truncate">{ad.ad_title}</div>
                      <span
                        className={`text-sm px-2 py-1 rounded-lg ${
                          ad.approval_status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : ad.approval_status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {ad.approval_status}
                      </span>
                    </div>
                    <p className="text-lg truncate">{ad.ad_description}</p>
                    <div className="flex items-center gap-2 text-lg">
                      <Tag size={20} className="text-burgundy-600" />
                      {ad.product_category}
                    </div>
                    <div className="flex items-center gap-2 text-lg">
                      <Calendar size={20} className="text-burgundy-600" />
                      {formatDate(ad.submission_date)}
                    </div>
                    <button
                      onClick={() => setSelectedAd(ad)}
                      className="w-full mt-4 bg-burgundy-500 text-burgundy-100 py-2 rounded-lg hover:bg-burgundy-600 transition-all focus:outline-none focus:ring-2 focus:ring-burgundy-400"
                      aria-label={`View details for advertisement ${ad.ad_id}`}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {selectedAd && (
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
                <h3 id="modal-title" className="text-xl font-semibold text-burgundy-800 flex items-center gap-2">
                  <Tag size={20} className="text-burgundy-600" /> {selectedAd.ad_title}
                </h3>
                <button
                  ref={firstFocusableRef}
                  onClick={() => setSelectedAd(null)}
                  className="text-burgundy-600 hover:text-burgundy-800 focus:outline-none focus:ring-2 focus:ring-burgundy-400 rounded-full p-1"
                  aria-label="Close modal"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-3 text-burgundy-800">
                <div className="text-base">{selectedAd.ad_description}</div>
                <div className="flex items-center gap-2 text-base">
                  <Tag size={20} className="text-burgundy-600" />
                  Category: {selectedAd.product_category}
                </div>
                <div className="flex items-center gap-2 text-base">
                  <Phone size={20} className="text-burgundy-600" />
                  Contact: {selectedAd.contact_details}
                </div>
                <div className="flex items-center gap-2 text-base">
                  <MessageSquare size={20} className="text-burgundy-600" />
                  Duration: {selectedAd.duration_days} day(s)
                </div>
                <div className="flex items-center gap-2 text-base">
                  <Calendar size={20} className="text-burgundy-600" />
                  Submitted: {formatDate(selectedAd.submission_date)}
                </div>
                <div className="flex items-center gap-2 text-base">
                  <Tag size={20} className="text-burgundy-600" />
                  Status: {selectedAd.approval_status}
                </div>
              </div>
              {selectedAd.approval_status === "Pending" && (
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={handleApprove}
                    disabled={approving || rejecting}
                    className="flex-1 bg-burgundy-500 text-burgundy-100 py-2 rounded-lg hover:bg-burgundy-600 transition-all focus:outline-none focus:ring-2 focus:ring-burgundy-400 disabled:opacity-50"
                    aria-label={`Approve advertisement ${selectedAd.ad_id}`}
                  >
                    {approving ? (
                      <div className="flex items-center justify-center gap-2">
                        <Spinner size="small" className="text-burgundy-100" />
                        Approving...
                      </div>
                    ) : (
                      "Approve"
                    )}
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={approving || rejecting}
                    className="flex-1 bg-burgundy-500 text-burgundy-100 py-2 rounded-lg hover:bg-burgundy-600 transition-all focus:outline-none focus:ring-2 focus:ring-burgundy-400 disabled:opacity-50"
                    aria-label={`Reject advertisement ${selectedAd.ad_id}`}
                  >
                    {rejecting ? (
                      <div className="flex items-center justify-center gap-2">
                        <Spinner size="small" className="text-burgundy-100" />
                        Rejecting...
                      </div>
                    ) : (
                      "Reject"
                    )}
                  </button>
                </div>
              )}
              <button
                onClick={() => setSelectedAd(null)}
                className="w-full mt-4 bg-burgundy-500 text-burgundy-100 py-2 rounded-lg hover:bg-burgundy-600 transition-all focus:outline-none focus:ring-2 focus:ring-burgundy-400"
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

export default AdminAdvertisements;