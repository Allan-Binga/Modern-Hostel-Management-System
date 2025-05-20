import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Spinner from "../../components/Spinner";
import { useEffect, useState } from "react";
import axios from "axios";
import { endpoint } from "../../backendAPI";
import { toast } from "react-toastify";
import { AlertCircle, Clock, Tag, Calendar, CheckCircle } from "lucide-react";

function IssueReport() {
  const [issueReports, setIssueReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    issueDescription: "",
    priority: "",
  });
  const [error, setError] = useState("");
  const [fetchError, setFetchError] = useState("");
  const [reportsLoading, setReportsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const categories = [
    "Internet",
    "Plumbing",
    "Carpentry",
    "Pest Control",
    "Electrical",
    "Security",
    "Cleaning",
  ];

  const fetchReports = async () => {
    try {
      setReportsLoading(true);
      const response = await axios.get(`${endpoint}/issue/my-report-issues`, {
        withCredentials: true,
      });
      setIssueReports(response.data);
    } catch (error) {
      setFetchError("Failed to fetch issue reports. Please try again.");
      toast.error("Failed to fetch issue reports.");
    } finally {
      setReportsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const submitIssueReport = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${endpoint}/issue/report-issue`,
        formData,
        {
          withCredentials: true,
        }
      );
      toast.success(response.data.message || "Issue reported successfully.");
      setFormData({ category: "", priority: "", issueDescription: "" });
      setShowModal(false);
      await fetchReports();
    } catch (error) {
      setError("Failed to submit issue report. Please try again.");
      toast.error("Failed to submit issue report.");
    } finally {
      setLoading(false);
    }
  };

  const handleReportClick = (report) => {
    setSelectedReport(report);
  };

  const closeReportModal = () => {
    setSelectedReport(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-burgundy-100 to-burgundy-200 animate-fadeIn">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto p-6 md:p-10">
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-burgundy-800 animate-slideIn">
            Issue Reports
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Report and track maintenance issues with ease.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Reported Issues (Right) */}
          <section
            className="lg:w-2/3 bg-white rounded-3xl shadow-xl p-8 animate-slideUp"
            style={{ animationDelay: "0.2s" }}
          >
            <h2 className="text-2xl md:text-3xl font-extrabold text-burgundy-700 mb-6 flex items-center gap-3">
              <Tag size={32} /> My Reported Issues
            </h2>
            {fetchError && <p className="text-red-500 mb-4">{fetchError}</p>}
            {reportsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-24 bg-burgundy-200 rounded-lg animate-pulse"
                  ></div>
                ))}
              </div>
            ) : issueReports.length === 0 ? (
              <p className="text-gray-600 italic text-center">
                No reports found.
              </p>
            ) : (
              <ul className="space-y-5 overflow-y-auto max-h-[60vh] pr-2 scrollbar-custom">
                {issueReports.map((report, index) => (
                  <li
                    key={index}
                    className="border border-burgundy-300 rounded-2xl p-5 hover:shadow-sm hover:bg-burgundy-50 transition-all duration-300 cursor-pointer animate-stagger"
                    style={{ animationDelay: `${0.1 * index}s` }}
                    onClick={() => handleReportClick(report)}
                  >
                    <h3 className="text-xl font-semibold text-burgundy-800 mb-1">
                      {report.category}
                    </h3>
                    <p className="text-gray-700 mb-2 line-clamp-2">
                      {report.issue_description}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 font-medium">
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        <span>
                          {new Date(report.reported_date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span>{report.priority}</span>
                      </div>
                      <div className="flex items-center gap-1 text-green-600 font-bold">
                        <CheckCircle size={16} />
                        <span>{report.status}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Report an Issue Section (Left) */}
          <section className="lg:w-1/3 bg-white rounded-3xl shadow-xl p-8 transition-transform hover:scale-[1.02] animate-slideUp">
            <h2 className="text-2xl font-extrabold text-burgundy-700 mb-4">
              Tenant Feedback
            </h2>
            <p className="text-gray-600 mb-6">
              At Prestige, we value tenant feedback. If you have any queries,
              please hit the button below.
            </p>
            <button
              className="w-full bg-burgundy-500 text-white py-3 px-4 rounded-lg hover:bg-burgundy-600 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              onClick={() => setShowModal(true)}
            >
              <AlertCircle size={20} /> Report an Issue
            </button>
          </section>
        </div>

        {/* Report Issue Modal */}
        {showModal && (
          <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 relative animate-slideUp">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-burgundy-700"
                onClick={() => setShowModal(false)}
              >
                X
              </button>
              <h2 className="text-2xl font-bold text-burgundy-800 mb-4">
                Report an Issue
              </h2>
              <form onSubmit={submitIssueReport} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Issue Description
                  </label>
                  <textarea
                    name="issueDescription"
                    value={formData.issueDescription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        issueDescription: e.target.value,
                      })
                    }
                    placeholder="Describe your issue"
                    className="w-full p-3 border border-burgundy-300 rounded-lg focus:ring-2 focus:ring-burgundy-400"
                    rows="4"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full p-3 border border-burgundy-300 rounded-lg focus:ring-2 focus:ring-burgundy-400"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value })
                    }
                    className="w-full p-3 border border-burgundy-300 rounded-lg focus:ring-2 focus:ring-burgundy-400"
                    required
                  >
                    <option value="">Select Priority</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`bg-burgundy-500 text-white py-2 px-4 rounded-lg cursor-pointer hover:bg-burgundy-600 transition-colors ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Issue Report Details Modal */}
        {selectedReport && (
          <div className="fixed inset-0 backdrop-blur-sm bg-white/30  flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 relative animate-slideUp">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-burgundy-700"
                onClick={closeReportModal}
              >
                ✕
              </button>
              <h3 className="text-2xl font-bold text-burgundy-800 mb-4">
                {selectedReport.category}
              </h3>
              <div className="space-y-2 text-gray-600">
                <p>
                  <strong>Description:</strong>{" "}
                  {selectedReport.issue_description}
                </p>
                <p>
                  <strong>Priority:</strong> {selectedReport.priority}
                </p>
                <p>
                  <strong>Status:</strong> {selectedReport.status}
                </p>
                <p>
                  <strong>Reported:</strong>{" "}
                  {new Date(selectedReport.reported_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default IssueReport;
