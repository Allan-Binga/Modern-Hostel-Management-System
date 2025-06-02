import { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import { endpoint } from "../../backendAPI";
import { toast } from "react-toastify";
import axios from "axios";
import {
  Tag,
  Calendar,
  Phone,
  CheckCircle,
  MessageSquare,
  X,
  Upload,
} from "lucide-react";
import Spinner from "../../components/Spinner";

function Advertisements() {
  const [advertisements, setAdvertisements] = useState([]);
  const [myAdvertisements, setMyAdvertisements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    adTitle: "",
    adDescription: "",
    productCategory: "",
    durationDays: "",
    image: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);
  const [fileName, setFileName] = useState("Choose an image...");
  const [imagePreview, setImagePreview] = useState(null);

  const productCategories = [
    "Electronics",
    "Clothing",
    "Footwear",
    "Home Appliances",
    "Beauty & Personal Care",
    "Sports & Outdoors",
    "Groceries",
    "Toys & Games",
    "Books & Stationery",
    "Automobile Accessories",
    "Jewelry & Accessories",
    "Furniture",
    "Kitchenware",
    "Health & Wellness",
    "Pet Supplies",
    "Other",
  ];

  // Fetch All Advertisements
  const fetchAds = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${endpoint}/advertisements/all`);
      setAdvertisements(response.data);
    } catch (error) {
      toast.error("Failed to fetch advertisements.");
      setError("Failed to fetch advertisements. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch My Advertisements
  const fetchMyAds = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${endpoint}/advertisements/my-advertisements`,
        {
          withCredentials: true,
        }
      );
      setMyAdvertisements(response.data);
    } catch (error) {
      toast.error("Failed to fetch your advertisements.");
      setError("Failed to fetch your advertisements. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
    fetchMyAds();
  }, []);

  // Post an Ad
  const submitAdvertisement = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formPayload = new FormData();
    formPayload.append("adTitle", formData.adTitle);
    formPayload.append("adDescription", formData.adDescription);
    formPayload.append("productCategory", formData.productCategory);
    formPayload.append("durationDays", formData.durationDays);
    if (formData.image) {
      formPayload.append("image", formData.image);
    }

    try {
      const response = await axios.post(
        `${endpoint}/advertisements/post-advertisement`,
        formPayload,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(response.data.message || "Ad submitted successfully.");
      setFormData({
        adTitle: "",
        adDescription: "",
        productCategory: "",
        durationDays: "",
        image: "",
      });
      setShowModal(false);
      await Promise.all([fetchAds(), fetchMyAds()]);
    } catch (error) {
      toast.error("Failed to submit advertisement. Please try again.");
      setError("Failed to submit advertisement. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdClick = (ad) => {
    setSelectedAd(ad);
  };

  const closeModal = () => {
    setSelectedAd(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setFileName(file.name);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFileName("Choose an image...");
      setImagePreview(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-burgundy-100 to-burgundy-200 animate-fadeIn">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-6 sm:py-8 md:py-10">
        <header className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-burgundy-800 animate-slideIn">
            Advertisements
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mt-2">
            Discover and share products or services with our community.
          </p>
        </header>

        {/* My Ads and Post an Ad Sections */}
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 mb-8 sm:mb-10">
          {/* My Advertisements Section */}
          <section
            className="w-full lg:w-2/3 bg-white rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 animate-slideUp"
            style={{ animationDelay: "0.1s" }}
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-burgundy-700 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
              <Tag size={24} className="w-6 h-6 sm:w-8 sm:h-8" /> My
              Advertisements
            </h2>
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <Spinner />
              </div>
            ) : myAdvertisements.length === 0 ? (
              <p className="text-gray-600 italic text-center text-sm sm:text-base">
                You haven't posted any advertisements yet.
              </p>
            ) : (
              <ul className="space-y-4 sm:space-y-5 overflow-y-auto max-h-[50vh] sm:max-h-[40vh] pr-2 scrollbar-custom">
                {myAdvertisements
                  .slice()
                  .sort(
                    (a, b) =>
                      new Date(b.submission_date) - new Date(a.submission_date)
                  )
                  .map((ad, index) => (
                    <li
                      key={ad.ad_id}
                      className="border border-gray-300 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-5 transition-all duration-300 cursor-pointer animate-stagger hover:bg-burgundy-50"
                      style={{ animationDelay: `${0.1 * index}s` }}
                      onClick={() => handleAdClick(ad)}
                    >
                      {/* Image */}
                      {ad.image && (
                        <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
                          <img
                            src={ad.image}
                            alt={ad.ad_title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Details */}
                      <div className="flex-1">
                        <h3 className="text-lg sm:text-xl font-semibold text-burgundy-800 mb-1 truncate">
                          {ad.ad_title}
                        </h3>
                        <p className="text-gray-700 mb-2 text-sm sm:text-base line-clamp-2">
                          {ad.ad_description}
                        </p>
                        <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 font-medium">
                          <div className="flex items-center gap-1">
                            <Calendar
                              size={14}
                              className="w-4 h-4 sm:w-5 sm:h-5"
                            />
                            <span>
                              {new Date(
                                ad.submission_date
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Tag size={14} className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span>{ad.product_category}</span>
                          </div>
                          <div
                            className={`flex items-center gap-1 font-bold ${
                              ad.approval_status === "Approved"
                                ? "text-green-600"
                                : ad.approval_status === "Pending"
                                ? "text-blue-600"
                                : "text-red-400"
                            }`}
                          >
                            <CheckCircle
                              size={14}
                              className="w-4 h-4 sm:w-5 sm:h-5"
                            />
                            <span>{ad.approval_status}</span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            )}
          </section>

          {/* Post an Ad Section */}
          <section
            className="w-full lg:w-1/3 bg-white rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 transition-transform hover:scale-[1.01] sm:hover:scale-[1.02] animate-slideUp"
            style={{ animationDelay: "0.2s" }}
          >
            <h2 className="text-xl sm:text-2xl font-extrabold text-burgundy-700 mb-3 sm:mb-4">
              Share Your Ad
            </h2>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
              At Prestige, we value tenant engagement. Share your products or
              services by posting an advertisement below.
            </p>
            <button
              className="w-full bg-burgundy-500 text-white py-2 sm:py-3 px-4 rounded-lg hover:bg-burgundy-600 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
              onClick={() => setShowModal(true)}
            >
              <MessageSquare size={16} className="w-4 h-4 sm:w-5 sm:h-5" /> Post
              an Ad
            </button>
          </section>
        </div>

        {/* All Advertisements Section */}
        <section
          className="bg-white rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 animate-slideUp"
          style={{ animationDelay: "0.3s" }}
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-burgundy-700 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
            <Tag size={24} className="w-6 h-6 sm:w-8 sm:h-8" /> All
            Advertisements
          </h2>
          {error && (
            <p className="text-red-500 mb-4 text-sm sm:text-base">{error}</p>
          )}
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Spinner />
            </div>
          ) : advertisements.length === 0 ? (
            <p className="text-gray-600 italic text-center text-sm sm:text-base">
              No advertisements available.
            </p>
          ) : (
            <ul className="space-y-4 sm:space-y-5 overflow-y-auto max-h-[60vh] pr-2 scrollbar-custom">
              {advertisements
                .slice()
                .sort(
                  (a, b) =>
                    new Date(b.submission_date) - new Date(a.submission_date)
                )
                .map((ad, index) => (
                  <li
                    key={ad.ad_id}
                    className="border border-gray-300 rounded-2xl p-4 sm:p-5 hover:bg-burgundy-50 transition-all duration-300 cursor-pointer animate-stagger"
                    style={{ animationDelay: `${0.1 * index}s` }}
                    onClick={() => handleAdClick(ad)}
                  >
                    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                      {/* Text content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-semibold text-burgundy-800 mb-1 truncate">
                          {ad.ad_title}
                        </h3>
                        <p className="text-gray-700 mb-2 text-sm sm:text-base line-clamp-2">
                          {ad.ad_description}
                        </p>
                        <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 font-medium">
                          <div className="flex items-center gap-1">
                            <Calendar
                              size={14}
                              className="w-4 h-4 sm:w-5 sm:h-5"
                            />
                            <span>
                              {new Date(
                                ad.submission_date
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Tag size={14} className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span>{ad.product_category}</span>
                          </div>
                          <div
                            className={`flex items-center gap-1 font-bold ${
                              ad.approval_status === "Approved"
                                ? "text-green-600"
                                : ad.approval_status === "Pending"
                                ? "text-blue-600"
                                : "text-red-400"
                            }`}
                          >
                            <CheckCircle
                              size={14}
                              className="w-4 h-4 sm:w-5 sm:h-5"
                            />
                            <span>{ad.approval_status}</span>
                          </div>
                        </div>
                        <div className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600 space-y-1">
                          <p className="font-bold text-burgundy-700">
                            Contact Details:
                          </p>
                          {ad.contact_details.split("|").map((part, i) => (
                            <p key={i}>{part.trim()}</p>
                          ))}
                        </div>
                      </div>

                      {/* Image */}
                      {ad.image && (
                        <div className="w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
                          <img
                            src={ad.image}
                            alt={ad.ad_title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </section>

        {/* Post Advertisement Modal */}
        {showModal && (
          <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white rounded-3xl p-4 sm:p-6 md:p-8 max-w-md w-full mx-4 relative animate-slideUp max-h-[90vh] overflow-y-auto scrollbar-custom">
              <button
                className="absolute top-3 sm:top-4 right-3 sm:right-4 text-gray-500 hover:text-burgundy-700"
                onClick={() => setShowModal(false)}
              >
                <X size={20} className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <h2 className="text-xl sm:text-2xl font-bold text-burgundy-800 mb-3 sm:mb-4">
                Post an Advertisement
              </h2>
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <Spinner />
                </div>
              ) : (
                <form onSubmit={submitAdvertisement} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ad Title
                    </label>
                    <input
                      type="text"
                      value={formData.adTitle}
                      onChange={(e) =>
                        setFormData({ ...formData, adTitle: e.target.value })
                      }
                      placeholder="Enter ad title"
                      className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-300 focus:border-gray-300 focus:outline-none text-sm sm:text-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.adDescription}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          adDescription: e.target.value,
                        })
                      }
                      placeholder="Describe your ad"
                      className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-300 focus:border-gray-300 focus:outline-none text-sm sm:text-base"
                      rows="4"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Category
                    </label>
                    <select
                      value={formData.productCategory}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          productCategory: e.target.value,
                        })
                      }
                      className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-300 focus:border-gray-300 focus:outline-none text-sm sm:text-base"
                      required
                    >
                      <option value="" className="text-gray-700">
                        Select Category
                      </option>
                      {productCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Upload Image
                    </label>
                    <div className="flex items-center">
                      <label
                        htmlFor="file-upload"
                        className="flex items-center w-full p-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                      >
                        <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 mr-2" />
                        <span className="text-gray-500 truncate text-sm sm:text-base">
                          {fileName}
                        </span>
                        <input
                          id="file-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </label>
                    </div>

                    {/* Preview */}
                    {imagePreview && (
                      <div className="mt-3 sm:mt-4">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-lg border border-gray-300"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (days)
                    </label>
                    <input
                      type="number"
                      value={formData.durationDays}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          durationDays: e.target.value,
                        })
                      }
                      placeholder="Enter duration"
                      className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-300 focus:border-gray-300 focus:outline-none text-sm sm:text-base"
                      min="1"
                      required
                    />
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="bg-gray-400 text-white py-2 px-3 sm:px-4 rounded-lg hover:bg-gray-500 transition-colors text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className={`bg-burgundy-500 text-white py-2 px-3 sm:px-4 rounded-lg hover:bg-burgundy-600 transition-colors text-sm sm:text-base ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {loading ? "Submitting..." : "Submit"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Advertisement Details Modal */}
        {selectedAd && (
          <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white rounded-3xl p-4 sm:p-6 md:p-8 max-w-md w-full mx-4 relative animate-slideUp max-h-[90vh] overflow-y-auto scrollbar-custom">
              <button
                className="absolute top-3 sm:top-4 right-3 sm:right-4 text-gray-500 hover:text-burgundy-700"
                onClick={closeModal}
              >
                <X size={20} className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <h3 className="text-xl sm:text-2xl font-bold text-burgundy-800 mb-3 sm:mb-4">
                {selectedAd.ad_title}
              </h3>

              {/* Image Section */}
              {selectedAd.image && (
                <div className="mb-4 sm:mb-6 rounded-lg overflow-hidden border border-gray-100">
                  <img
                    src={selectedAd.image}
                    alt={selectedAd.ad_title}
                    className="w-full object-contain max-h-48 sm:max-h-64"
                  />
                </div>
              )}

              <div className="space-y-2 text-gray-600 text-sm sm:text-base">
                <p>
                  <strong>Description:</strong> {selectedAd.ad_description}
                </p>
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
                  <strong>Status:</strong> {selectedAd.approval_status}
                </p>
              </div>

              <button
                className="mt-4 sm:mt-6 w-full bg-burgundy-500 text-white px-4 py-2 sm:py-3 rounded-lg hover:bg-burgundy-600 transition-colors text-sm sm:text-base"
                onClick={() =>
                  (window.location.href = `tel:${selectedAd.contact_details}`)
                }
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

export default Advertisements;
