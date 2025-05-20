import { useEffect, useState } from "react";
import axios from "axios";
import { endpoint } from "../../backendAPI";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Spinner from "../../components/Spinner";
import { Home, Bed, Tag, Clock, Phone, Calendar, CheckCircle, MessageSquare } from "lucide-react";

const id = localStorage.getItem("tenantId");

function TenantHome() {
  const [tenant, setTenant] = useState(null);
  const [myRoom, setMyRoom] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);

  useEffect(() => {
    setLoading(true);
    const fetchDetails = async () => {
      const tenantId = localStorage.getItem("tenantId");
      if (!tenantId) return;

      try {
        const response = await axios.get(`${endpoint}/users/tenants/${tenantId}`);
        setTenant(response.data.tenant);
        setMyRoom(response.data.room);
      } catch (error) {
        console.error("Failed to fetch tenant:", error?.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, []);

  useEffect(() => {
    axios
      .get(`${endpoint}/advertisements/all`, { withCredentials: true })
      .then((res) => setAdvertisements(res.data))
      .catch(() => console.error("Failed to fetch advertisements."));
  }, []);

  useEffect(() => {
    axios
      .get(`${endpoint}/rooms/all-rooms`, { withCredentials: true })
      .then((res) => setRooms(res.data))
      .catch(() => console.error("Failed to fetch rooms."));
  }, []);

  const handleAdClick = (ad) => {
    setSelectedAd(ad);
  };

  const closeModal = () => {
    setSelectedAd(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-burgundy-100 to-burgundy-200 animate-fadeIn">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto p-6 md:p-10">
        {/* Hero Header */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-burgundy-800 animate-slideIn">
            Welcome, {tenant ? tenant.name : "Tenant"}!
          </h1>
          <p className="text-lg text-gray-600 mt-2">Manage your room and explore the latest advertisements.</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* My Room Details */}
          <section className="lg:w-3/5 bg-white rounded-3xl shadow-xl p-8 md:p-10 transition-transform hover:scale-[1.02] animate-slideUp">
            <h2 className="flex items-center gap-3 text-burgundy-700 text-3xl md:text-4xl font-extrabold mb-6">
              <Home size={36} /> My Room
            </h2>
            {loading ? (
              <div className="space-y-4">
                <div className="h-6 bg-burgundy-200 rounded animate-pulse"></div>
                <div className="h-6 bg-burgundy-200 rounded animate-pulse"></div>
                <div className="h-6 bg-burgundy-200 rounded animate-pulse"></div>
              </div>
            ) : tenant ? (
              myRoom ? (
                <div className="space-y-6 text-gray-800 text-lg">
                  <div className="flex items-center gap-3 animate-stagger" style={{ animationDelay: "0.1s" }}>
                    <Bed size={24} className="text-burgundy-600" />
                    <p><strong>Beds:</strong> {myRoom.beds}</p>
                  </div>
                  <div className="flex items-center gap-3 animate-stagger" style={{ animationDelay: "0.2s" }}>
                    <Tag size={24} className="text-burgundy-600" />
                    <p><strong>Room Type:</strong> {myRoom.roomtype}</p>
                  </div>
                  <div className="flex items-center gap-3 animate-stagger" style={{ animationDelay: "0.3s" }}>
                    <Clock size={24} className="text-burgundy-600" />
                    <p><strong>Status:</strong> {myRoom.status}</p>
                  </div>
                  <div className="flex items-center gap-3 animate-stagger" style={{ animationDelay: "0.4s" }}>
                    <CheckCircle size={24} className="text-green-600" />
                    <p><strong>Price:</strong> Kes {myRoom.price}</p>
                  </div>
                </div>
              ) : (
                <p className="italic text-gray-500">No room details available.</p>
              )
            ) : (
              <p className="italic text-gray-500">No tenant data available.</p>
            )}
          </section>

          {/* Advertisements */}
          <section className="lg:w-2/5 bg-white rounded-3xl shadow-xl p-6 md:p-8 flex flex-col animate-slideUp" style={{ animationDelay: "0.2s" }}>
            <h2 className="flex items-center gap-3 text-burgundy-700 text-2xl md:text-3xl font-bold mb-6">
              <Tag size={32} /> Recent Advertisement
            </h2>
            {advertisements.length === 0 ? (
              <p className="text-gray-600 italic">No advertisements available.</p>
            ) : (
              <ul className="space-y-5 overflow-y-auto max-h-[60vh] pr-2 scrollbar-custom">
                {advertisements
                  .slice()
                  .sort((a, b) => new Date(b.submission_date) - new Date(a.submission_date))
                  .slice(0, 1)
                  .map((ad, index) => (
                    <li
                      key={index}
                      className="border border-burgundy-300 rounded-2xl p-5 hover:shadow-2xl hover:bg-burgundy-50 transition-all duration-300 cursor-pointer animate-stagger"
                      style={{ animationDelay: `${0.1 * index}s` }}
                      onClick={() => handleAdClick(ad)}
                    >
                      <h3 className="text-xl font-semibold text-burgundy-800 mb-1">{ad.ad_title}</h3>
                      <p className="text-gray-700 mb-2 line-clamp-2">{ad.ad_description}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 font-medium">
                        <div className="flex items-center gap-1">
                          <Calendar size={16} />
                          <span>{new Date(ad.submission_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Tag size={16} />
                          <span>{ad.product_category}</span>
                        </div>
                        <div className="flex items-center gap-1 text-green-600 font-bold">
                          <CheckCircle size={16} />
                          <span>{ad.approval_status}</span>
                        </div>
                      </div>
                      <button
                        className="mt-4 flex items-center gap-2 bg-burgundy-500 text-white px-4 py-2 rounded-lg hover:bg-burgundy-600 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `tel:${ad.contact_details}`;
                        }}
                      >
                        <Phone size={16} /> Contact Now
                      </button>
                    </li>
                  ))}
              </ul>
            )}
          </section>
        </div>

        {/* Modal for Advertisement Details */}
        {selectedAd && (
          <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 relative animate-slideUp">
              <button className="absolute top-4 right-4 text-gray-500 hover:text-burgundy-700" onClick={closeModal}>
                ✕
              </button>
              <h3 className="text-2xl font-bold text-burgundy-800 mb-4">{selectedAd.ad_title}</h3>
              <p className="text-gray-700 mb-4">{selectedAd.ad_description}</p>
              <div className="space-y-2 text-gray-600">
                <p><strong>Category:</strong> {selectedAd.product_category}</p>
                <p><strong>Contact:</strong> {selectedAd.contact_details}</p>
                <p><strong>Posted:</strong> {new Date(selectedAd.submission_date).toLocaleDateString()}</p>
                <p><strong>Duration:</strong> {selectedAd.duration_days} days</p>
                <p><strong>Status:</strong> {selectedAd.approval_status}</p>
              </div>
              <button
                className="mt-6 w-full bg-burgundy-500 text-white px-4 py-2 rounded-lg hover:bg-burgundy-600 transition-colors"
                onClick={() => (window.location.href = `tel:${selectedAd.contact_details}`)}
              >
                Contact Now
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default TenantHome;