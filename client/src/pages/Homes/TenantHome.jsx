import { useEffect, useState } from "react";
import axios from "axios";
import { endpoint } from "../../backendAPI";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Spinner from "../../components/Spinner";
import {
  Home,
  Bed,
  Tag,
  Clock,
  Phone,
  Calendar,
  BanknoteArrowUp,
  MessageSquare,
  Filter,
} from "lucide-react";
import { toast } from "react-toastify";

function TenantHome() {
  const [tenant, setTenant] = useState(null);
  const [bookings, setBookings] = useState(null);
  const [myRoom, setMyRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);
  const [roomFilter, setRoomFilter] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      const tenantId = localStorage.getItem("tenantId");
      if (!tenantId) {
        toast.error("No tenant ID found.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${endpoint}/users/tenants/${tenantId}`
        );
        setTenant(response.data.tenant);
        setMyRoom(response.data.room);
        setBookings(response.data.bookings);
      } catch (error) {
        toast.error("Failed to fetch tenant details.");
        console.error(
          "Failed to fetch tenant:",
          error?.response?.data?.message || error.message
        );
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
      .catch(() => {
        toast.error("Failed to fetch advertisements.");
        console.error("Failed to fetch advertisements.");
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${endpoint}/rooms/all-rooms`, { withCredentials: true })
      .then((res) => setRooms(res.data))
      .catch(() => {
        toast.error("Failed to fetch rooms.");
        console.error("Failed to fetch rooms.");
      });
  }, []);

  const handleAdClick = (ad) => {
    setSelectedAd(ad);
  };

  const closeModal = () => {
    setSelectedAd(null);
  };

  const filteredRooms = roomFilter
    ? rooms.filter(
        (room) => room.roomtype === roomFilter || room.status === roomFilter
      )
    : rooms;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-burgundy-100 to-burgundy-200 animate-fadeIn">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto p-6 md:p-10">
        {/* Hero Header */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-burgundy-800 animate-slideIn">
            Welcome, {tenant ? tenant.firstname : "Tenant"}!
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Manage your room and explore the latest advertisements.
          </p>
        </header>

        {/* Quick Stats */}
        <section className="mb-8 bg-white rounded-3xl shadow-xl p-8 animate-slideUp">
          <h2 className="text-2xl font-extrabold text-burgundy-700 mb-6 flex items-center gap-3">
            <Home size={32} /> Your Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
            <div>
              <p className="text-sm text-gray-500">Check-In Date</p>
              <p className="text-lg font-semibold text-burgundy-800">
                {bookings?.[0]?.check_in_date
                  ? new Date(bookings[0].check_in_date).toLocaleDateString(
                      "en-GB",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Check-Out Date</p>
              <p className="text-lg font-semibold text-burgundy-800">
                {bookings?.[0]?.check_out_date
                  ? new Date(bookings[0].check_out_date).toLocaleDateString(
                      "en-GB",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )
                  : "N/A"}
              </p>
            </div>
          </div>
        </section>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* My Room Details */}
          <section className="lg:w-3/5 bg-white rounded-3xl shadow-xl p-8 md:p-10 transition-transform hover:scale-[1.02] animate-slideUp">
            <h2 className="flex items-center gap-3 text-burgundy-700 text-3xl md:text-4xl font-extrabold mb-6">
              <Home size={36} /> My Room
            </h2>
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <Spinner />
              </div>
            ) : tenant ? (
              myRoom ? (
                <div className="space-y-6 text-gray-800 text-lg">
                  {myRoom.image && (
                    <div className="w-full aspect-video mb-4">
                      <img
                        src={myRoom.image}
                        alt="My Room"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <div
                    className="flex items-center gap-3 animate-stagger"
                    style={{ animationDelay: "0.1s" }}
                  >
                    <Bed size={24} className="text-burgundy-600" />
                    <p>
                      <strong>Beds:</strong> {myRoom.beds}
                    </p>
                  </div>
                  <div
                    className="flex items-center gap-3 animate-stagger"
                    style={{ animationDelay: "0.2s" }}
                  >
                    <Tag size={24} className="text-burgundy-600" />
                    <p>
                      <strong>Room Type:</strong> {myRoom.roomtype}
                    </p>
                  </div>
                  <div
                    className="flex items-center gap-3 animate-stagger"
                    style={{ animationDelay: "0.3s" }}
                  >
                    <Clock size={24} className="text-burgundy-600" />
                    <p>
                      <strong>Status:</strong>{" "}
                      <span
                        className={
                          myRoom.status === "AVAILABLE"
                            ? "text-green-600"
                            : "text-blue-600"
                        }
                      >
                        {myRoom.status}
                      </span>
                    </p>
                  </div>
                  <div
                    className="flex items-center gap-3 animate-stagger"
                    style={{ animationDelay: "0.4s" }}
                  >
                    <BanknoteArrowUp size={24} className="text-green-600" />
                    <p>
                      <strong>Price:</strong> KES{" "}
                      {parseFloat(myRoom.price).toLocaleString()}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="italic text-gray-500">
                  No room details available.
                </p>
              )
            ) : (
              <p className="italic text-gray-500">No tenant data available.</p>
            )}
          </section>

          {/* Recent Advertisement */}
          <section
            className="lg:w-2/5 bg-white rounded-3xl shadow-xl p-6 md:p-8 flex flex-col animate-slideUp"
            style={{ animationDelay: "0.2s" }}
          >
            <h2 className="flex items-center gap-3 text-burgundy-700 text-2xl md:text-3xl font-extrabold mb-6">
              <Tag size={36} /> Recent Advertisement
            </h2>
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <Spinner />
              </div>
            ) : advertisements.length === 0 ? (
              <p className="text-gray-600 italic">
                No advertisements available.
              </p>
            ) : (
              <ul className="space-y-5 overflow-y-auto max-h-[60vh] pr-2 scrollbar-custom">
                {advertisements
                  .slice()
                  .sort(
                    (a, b) =>
                      new Date(b.submission_date) - new Date(a.submission_date)
                  )
                  .slice(0, 1)
                  .map((ad, index) => (
                    <li
                      key={ad.ad_id}
                      className="border border-burgundy-300 rounded-2xl p-5 hover:shadow-2xl hover:bg-burgundy-50 transition-all duration-300 cursor-pointer animate-stagger"
                      style={{ animationDelay: `${0.1 * index}s` }}
                      onClick={() => handleAdClick(ad)}
                    >
                      {ad.image && (
                        <img
                          src={ad.image}
                          alt={ad.ad_title}
                          className="w-full h-32 object-cover rounded-lg mb-4"
                        />
                      )}
                      <h3 className="text-xl font-semibold text-burgundy-800 mb-1">
                        {ad.ad_title}
                      </h3>
                      <p className="text-gray-700 mb-2 line-clamp-2">
                        {ad.ad_description}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 font-medium">
                        <div className="flex items-center gap-1">
                          <Calendar size={16} />
                          <span>
                            {new Date(ad.submission_date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Tag size={16} />
                          <span>{ad.product_category}</span>
                        </div>
                        <div className="flex items-center gap-1 font-bold">
                          <CheckCircle
                            size={16}
                            className={
                              ad.approval_status === "APPROVED"
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          />
                          <span
                            className={
                              ad.approval_status === "APPROVED"
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {ad.approval_status}
                          </span>
                        </div>
                      </div>
                      <button
                        className="mt-4 flex items-center gap-2 bg-burgundy-500 text-white px-4 py-2 rounded-lg hover:bg-burgundy-600 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `tel:${ad.contact_details}`;
                          toast.info("Initiating call...");
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

        {/* Available Rooms */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-extrabold text-burgundy-800 flex items-center gap-3">
              <Bed size={36} /> Available Rooms
            </h2>
            <select
              value={roomFilter}
              onChange={(e) => setRoomFilter(e.target.value)}
              className="p-2 border border-burgundy-300 rounded-lg focus:ring-2 focus:ring-burgundy-400"
            >
              <option value="">All Rooms</option>
              <option value="Single">Single</option>
              <option value="Double">Double</option>
              <option value="AVAILABLE">Available</option>
              <option value="OCCUPIED">Occupied</option>
            </select>
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Spinner />
            </div>
          ) : filteredRooms.length === 0 ? (
            <p className="text-gray-600 italic">
              No rooms available at the moment.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRooms.map((room, index) => (
                <div
                  key={room.roomid}
                  className="bg-white rounded-3xl shadow-lg overflow-hidden transition-transform hover:scale-[1.02] animate-slideUp"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <img
                    src={
                      room.image ||
                      "https://via.placeholder.com/400x300?text=Room+Image"
                    }
                    alt={`Room ${room.roomid}`}
                    className="w-full h-56 object-cover"
                  />
                  <div className="p-8 space-y-4 text-gray-800">
                    <h3 className="text-2xl font-semibold text-burgundy-700 flex items-center gap-2">
                      <Tag size={24} /> {room.roomtype} Room
                    </h3>
                    <div className="flex items-center gap-2">
                      <Bed size={24} className="text-burgundy-600" />
                      <span>{room.beds} Beds</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={24} className="text-burgundy-600" />
                      <span>
                        Status:{" "}
                        <span
                          className={
                            room.status === "AVAILABLE"
                              ? "text-green-600"
                              : "text-blue-700"
                          }
                        >
                          {room.status}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-green-700 font-bold">
                      <BanknoteArrowUp size={24} />
                      <span>KES {parseFloat(room.price).toLocaleString()}</span>
                    </div>
                    <button className="w-full flex items-center justify-center gap-2 bg-burgundy-500 text-white px-4 py-3 rounded-lg hover:bg-burgundy-600 transition-colors">
                      <MessageSquare size={20} /> Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Modal for Advertisement Details */}
        {selectedAd && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 relative animate-slideUp">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-burgundy-700"
                onClick={closeModal}
              >
                ✕
              </button>
              <h3 className="text-2xl font-bold text-burgundy-800 mb-4">
                {selectedAd.ad_title}
              </h3>
              {selectedAd.image && (
                <img
                  src={selectedAd.image}
                  alt={selectedAd.ad_title}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
              )}
              <p className="text-gray-700 mb-4">{selectedAd.ad_description}</p>
              <div className="space-y-2 text-gray-600">
                <p>
                  <strong>Category:</strong> {selectedAd.product_category}
                </p>
                <p>
                  <strong>Contact:</strong> {selectedAd.contact_details}
                </p>
                <p>
                  <strong>Posted:</strong>{" "}
                  {new Date(selectedAd.submission_date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Duration:</strong> {selectedAd.duration_days} days
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={
                      selectedAd.approval_status === "APPROVED"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {selectedAd.approval_status}
                  </span>
                </p>
              </div>
              <button
                className="mt-6 w-full bg-burgundy-500 text-white px-4 py-2 rounded-lg hover:bg-burgundy-600 transition-colors"
                onClick={() => {
                  window.location.href = `tel:${selectedAd.contact_details}`;
                  toast.info("Initiating call...");
                }}
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
