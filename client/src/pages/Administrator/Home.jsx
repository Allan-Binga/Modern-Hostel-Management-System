import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { endpoint } from "../../backendAPI";
import { toast } from "react-toastify";
import AdminNavbar from "../../components/AdminNavbar";
import Footer from "../../components/Footer";
import Spinner from "../../components/Spinner";
import { Bed, Tag, Clock, BanknoteArrowUp, Filter, X } from "lucide-react";

function AdministratorHome() {
  const [rooms, setRooms] = useState([]);
  const [roomFilter, setRoomFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const modalRef = useRef(null);
  const firstFocusableRef = useRef(null);

  // Fetch rooms
  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${endpoint}/rooms/all-rooms`, {
          withCredentials: true,
        });
        setRooms(res.data);
      } catch (error) {
        toast.error("Failed to fetch rooms. Please try again.");
        console.error("Failed to fetch rooms:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  // Handle Escape key and focus trapping
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && selectedRoom) {
        setSelectedRoom(null);
      }
    };

    const handleFocusTrap = (e) => {
      if (!modalRef.current || !selectedRoom) return;
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.key === "Tab") {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    if (selectedRoom && firstFocusableRef.current) {
      firstFocusableRef.current.focus();
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keydown", handleFocusTrap);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keydown", handleFocusTrap);
    };
  }, [selectedRoom]);

  // Handle click outside modal
  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setSelectedRoom(null);
    }
  };

  // Case-insensitive filtering for roomtype or status
  const filteredRooms = roomFilter
    ? rooms.filter((room) =>
        [room.roomtype, room.status].some((field) =>
          field.toLowerCase().includes(roomFilter.toLowerCase())
        )
      )
    : rooms;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-burgundy-100 to-burgundy-200">
      <AdminNavbar />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
        {/* Hero Header */}
        <header className="mb-8 animate-fadeIn">
          <h1 className="text-3xl sm:text-4xl font-bold text-burgundy-800">
            Admin Dashboard
          </h1>
          <p className="text-base sm:text-lg text-burgundy-600 mt-2">
            Manage rooms and view availability
          </p>
        </header>
       
        {/* Available Rooms */}
        <section
          className="mt-12 relative min-h-[400px]"
          aria-live="polite"
          aria-busy={loading}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl sm:text-3xl font-semibold text-burgundy-800 flex items-center gap-3">
              <Bed size={28} /> Rooms
            </h2>
            <div className="relative w-full sm:w-auto">
              <Filter
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-burgundy-600"
              />
              <select
                value={roomFilter}
                onChange={(e) => setRoomFilter(e.target.value)}
                className="w-full sm:w-48 pl-10 pr-4 py-2 bg-burgundy-100 text-burgundy-800 border border-burgundy-400 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 focus:outline-none transition-all"
                aria-label="Filter rooms by type or status"
              >
                <option value="">All Rooms</option>
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="AVAILABLE">Available</option>
                <option value="OCCUPIED">Occupied</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="absolute inset-0 flex justify-center items-center bg-burgundy-100/80 transition-opacity duration-300">
              <Spinner size="large" className="text-burgundy-500" />
            </div>
          ) : filteredRooms.length === 0 ? (
            <p className="text-burgundy-600 text-base italic">
              No rooms match your filter.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRooms.map((room, index) => (
                <div
                  key={room.roomid}
                  className="bg-white rounded-lg shadow-sm overflow-hidden transition-transform hover:scale-105 animate-slideUp"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <img
                    src={
                      room.image ||
                      "https://via.placeholder.com/400x300?text=Room+Image"
                    }
                    alt={`Room ${room.roomid}`}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                  />
                  <div className="p-6 space-y-3 text-burgundy-800">
                    <h3 className="text-xl font-semibold text-burgundy-700 flex items-center gap-2">
                      <Tag size={20} /> {room.roomtype} Room
                    </h3>
                    <div className="flex items-center gap-2 text-base">
                      <Bed size={20} className="text-burgundy-600" />
                      <span>
                        {room.beds} Bed{room.beds > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-base">
                      <Clock size={20} className="text-burgundy-600" />
                      <span
                        className={
                          room.status === "AVAILABLE"
                            ? "text-green-600"
                            : "text-burgundy-600"
                        }
                      >
                        {room.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-base font-semibold text-burgundy-600">
                      <BanknoteArrowUp size={20} />
                      <span>KES {parseFloat(room.price).toLocaleString()}</span>
                    </div>
                    <button
                      onClick={() => setSelectedRoom(room)}
                      className="inline-flex items-center gap-2 bg-burgundy-500 text-burgundy-100 px-4 py-2 rounded-lg hover:bg-burgundy-600 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-burgundy-400"
                      aria-label={`View details for ${room.roomtype} room ${room.roomid}`}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Modal for Room Details */}
      {selectedRoom && (
        <div
          className="fixed inset-0 bg-burgundy-900/50 flex items-center justify-center z-50 transition-opacity duration-300"
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
                <Tag size={20} /> {selectedRoom.roomtype} Room
              </h3>
              <button
                ref={firstFocusableRef}
                onClick={() => setSelectedRoom(null)}
                className="text-burgundy-600 hover:text-burgundy-800 focus:outline-none focus:ring-2 focus:ring-burgundy-400 rounded-full p-1"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>
            <img
              src={
                selectedRoom.image ||
                "https://via.placeholder.com/400x300?text=Room+Image"
              }
              alt={`Room ${selectedRoom.roomid}`}
              className="w-full h-48 sm:h-64 object-cover rounded-lg mb-4"
              loading="lazy"
            />
            <div className="space-y-3 text-burgundy-800">
              <div className="flex items-center gap-2 text-base">
                <Tag size={20} className="text-burgundy-600" />
                <span>Room ID: {selectedRoom.roomid}</span>
              </div>
              <div className="flex items-center gap-2 text-base">
                <Bed size={20} className="text-burgundy-600" />
                <span>
                  {selectedRoom.beds} Bed{selectedRoom.beds > 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center gap-2 text-base">
                <Clock size={20} className="text-burgundy-600" />
                <span
                  className={
                    selectedRoom.status === "AVAILABLE"
                      ? "text-green-600"
                      : "text-burgundy-600"
                  }
                >
                  {selectedRoom.status}
                </span>
              </div>
              <div className="flex items-center gap-2 text-base font-semibold text-burgundy-600">
                <BanknoteArrowUp size={20} />
                <span>
                  KES {parseFloat(selectedRoom.price).toLocaleString()}
                </span>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedRoom(null)}
                className="inline-flex items-center gap-2 bg-burgundy-500 text-burgundy-100 px-4 py-2 rounded-lg hover:bg-burgundy-600 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-burgundy-400"
                aria-label="Close modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

     
      <Footer />
    </div>
  );
}

export default AdministratorHome;
