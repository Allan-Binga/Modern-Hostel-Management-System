import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { endpoint } from "../../backendAPI";
import { toast } from "react-toastify";
import AdminNavbar from "../../components/AdminNavbar";
import Footer from "../../components/Footer";
import Spinner from "../../components/Spinner";
import {
  Bed,
  Tag,
  Clock,
  BanknoteArrowUp,
  Filter,
  X,
  PlusSquare,
  Upload,
} from "lucide-react";

function AdministratorHome() {
  const [rooms, setRooms] = useState([]);
  const [roomFilter, setRoomFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [addRoomModal, setAddRoomModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [fileName, setFileName] = useState("Choose an image");
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    room_type: "",
    beds: "",
    price: "",
    image: "",
  });
  const modalRef = useRef(null);
  const firstFocusableRef = useRef(null);

  const getRooms = async () => {
    try {
      const response = await axios.get(`${endpoint}/rooms/all-rooms`);
      return response.data;
    } catch (error) {
      throw error.response.data.message;
    }
  };

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

  const handleAddRoomClick = () => {
    setAddRoomModal(true);
    setFormData({
      room_type: "",
      beds: "",
      price: "",
      image: "",
    });
  };

  const createRoom = async () => {
    const formPayload = new FormData();
    formPayload.append("room_type", formData.room_type);
    formPayload.append("beds", formData.beds);
    formPayload.append("price", formData.price);
    if (formData.image) {
      formPayload.append("image", formData.image);
    }
    try {
      const response = await axios.post(
        `${endpoint}/rooms/create-a-room`,
        formPayload,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setAddRoomModal(false);
      const updatedRooms = await getRooms();
      setRooms(updatedRooms);
      toast.success("Room added successfully.");
    } catch (error) {
      console.error("Error in room:", {
        message: error.message,
        response: error.response?.data,
      });
      toast.error("Failed to add room.");
    }
  };

  const updateRoom = async () => {
    try {
      await axios.put(
        `${endpoint}/rooms/update-room/${selectedRoom.roomid}`,
        formData
      );
      setUpdateModal(false);
      const updatedRooms = await getRooms();
      setRooms(updatedRooms);
      toast.success("Listing updated successfully.");
    } catch (error) {
      console.error("Error updating room:", error);
      toast.error("Failed to update room.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setFileName(file.name);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFileName("Choose an image");
      setImagePreview(null);
    }
  };
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
            {/* Add Room Button */}
            <div className="relative w-full sm:w-auto">
              <button
                className="bg-burgundy-500 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg hover:bg-burgundy-600 transition text-sm sm:text-base cursor-pointer"
                onClick={handleAddRoomClick}
              >
                <PlusSquare className="w-5 h-5" />
                Add a Room
              </button>
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
          className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 transition-opacity duration-300"
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

      {/*Add Room Modal*/}
      {addRoomModal && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center px-4"
          onClick={handleClickOutside}
        >
          <div
            ref={modalRef}
            className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-burgundy-800">
                Add a New Room
              </h3>
              <button
                onClick={() => setAddRoomModal(false)}
                className="text-burgundy-600 hover:text-burgundy-800"
                aria-label="Close add room modal"
              >
                <X size={24} />
              </button>
            </div>

            {/* Room Type */}
            <div>
              <label className="block text-sm font-medium text-burgundy-700">
                Room Type
              </label>
              <input
                type="text"
                value={formData.room_type}
                onChange={(e) =>
                  setFormData({ ...formData, room_type: e.target.value })
                }
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-gray-200 focus:border-gray-200"
                placeholder="Shared/Single"
              />
            </div>

            {/* Beds */}
            <div>
              <label className="block text-sm font-medium text-burgundy-700">
                Number of Beds
              </label>
              <input
                type="number"
                value={formData.beds}
                onChange={(e) =>
                  setFormData({ ...formData, beds: e.target.value })
                }
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-gray-400 focus:border-gray-500"
                min={1}
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-burgundy-700">
                Price (KES)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-gray-400 focus:border-gray-500"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-burgundy-700 mb-1">
                Room Image
              </label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 bg-burgundy-100 text-burgundy-800 px-3 py-2 rounded-lg cursor-pointer hover:bg-burgundy-200">
                  <Upload size={18} />
                  <span>{fileName}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-16 w-24 object-cover rounded"
                  />
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setAddRoomModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={createRoom}
                className="px-5 py-2 text-sm font-semibold bg-burgundy-500 text-white rounded hover:bg-burgundy-600 transition cursor-pointer"
              >
                Add Room
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
