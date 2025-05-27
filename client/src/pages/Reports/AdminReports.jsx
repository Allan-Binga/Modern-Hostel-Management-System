import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { endpoint } from "../../backendAPI";
import { toast } from "react-toastify";
import AdminNavbar from "../../components/AdminNavbar";
import Footer from "../../components/Footer";
import Spinner from "../../components/Spinner";
import { AlertCircle, Tag, Clock, Phone, CheckCircle, User, Calendar, X } from "lucide-react";

function AdminReports() {
  const [technicians, setTechnicians] = useState([]);
  const [issueReports, setIssueReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assigningIssueId, setAssigningIssueId] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const modalRef = useRef(null);
  const firstFocusableRef = useRef(null);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${endpoint}/issue/all-issues`, {
          withCredentials: true,
        });
        setIssueReports(response.data);
      } catch (error) {
        toast.error("Failed to fetch issue reports.");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  useEffect(() => {
    const fetchTechnicians = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${endpoint}/users/technicians/all-technicians`,
          {
            withCredentials: true,
          }
        );
        setTechnicians(response.data);
      } catch (error) {
        toast.error("Failed to fetch technicians.");
      } finally {
        setLoading(false);
      }
    };
    fetchTechnicians();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && selectedIssue) setSelectedIssue(null);
    };

    const handleFocusTrap = (e) => {
      if (!modalRef.current || !selectedIssue) return;
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

    if (selectedIssue && firstFocusableRef.current)
      firstFocusableRef.current.focus();
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keydown", handleFocusTrap);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keydown", handleFocusTrap);
    };
  }, [selectedIssue]);

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target))
      setSelectedIssue(null);
  };

  const formatDate = (isoString) => {
    try {
      const date = new Date(isoString);
      return isNaN(date.getTime())
        ? "Invalid Date"
        : date.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
    } catch {
      return "Invalid Date";
    }
  };

  const handleAssignTechnician = async (issueId) => {
    setAssigningIssueId(issueId);
    try {
      const response = await axios.put(
        `${endpoint}/issue/assign-technician`,
        { issueId },
        { withCredentials: true }
      );
      toast.success(
        `Technician ${response.data.technician} assigned to issue #${issueId}`
      );
      setIssueReports((prev) =>
        prev.map((issue) =>
          issue.issue_id === issueId
            ? {
                ...issue,
                status: "ASSIGNED",
                technician: response.data.technician,
              }
            : issue
        )
      );
      if (selectedIssue?.issue_id === issueId) {
        setSelectedIssue({
          ...selectedIssue,
          status: "ASSIGNED",
          technician: response.data.technician,
        });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Failed to assign technician."
      );
    } finally {
      setAssigningIssueId(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-burgundy-100 to-burgundy-200">
      <AdminNavbar />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
        <header className="mb-8 animate-fadeIn">
          <h1 className="text-3xl sm:text-4xl font-bold text-burgundy-800">
            Issue Reports
          </h1>
          <p className="text-base sm:text-lg text-burgundy-600 mt-2">
            Manage reported issues and assign technicians
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Issue Reports Section */}
          <section
            className="flex-1 min-h-[200px] relative"
            aria-live="polite"
            aria-busy={loading}
          >
            <h2 className="text-2xl font-semibold text-burgundy-800 flex items-center gap-3 mb-6">
              <AlertCircle size={28} className="text-red-500" /> All Issues
            </h2>
            {loading ? (
              <div className="absolute inset-0 flex justify-center items-center bg-burgundy-100/80 transition-opacity">
                <Spinner size="large" className="text-burgundy-500" />
              </div>
            ) : issueReports.length === 0 ? (
              <p className="text-burgundy-600 text-base italic">
                No issues reported.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {issueReports.map((issue, index) => (
                  <div
                    key={issue.issue_id}
                    className="bg-white rounded-lg shadow-sm min-h-[260px] transition-transform hover:scale-105 animate-slideUp"
                    style={{ animationDelay: `${0.1 * index}s` }}
                  >
                    <div className="p-8 space-y-3 text-burgundy-800">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-lg font-semibold">
                          <AlertCircle size={20} className="text-red-500" />#
                          {issue.issue_id}
                        </div>
                        <span
                          className={`text-sm px-2 py-1 rounded-lg ${
                            issue.status === "OPEN"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {issue.status}
                        </span>
                      </div>
                      <p className="text-lg truncate">
                        {issue.issue_description}
                      </p>
                      <div className="flex items-center gap-2 text-lg">
                        <Tag size={20} className="text-burgundy-600" />
                        {issue.category}
                      </div>
                      <div className="flex items-center gap-2 text-lg">
                        <Clock size={20} className="text-burgundy-600" />
                        Priority: {issue.priority}
                      </div>
                      <button
                        onClick={() => setSelectedIssue(issue)}
                        className="w-full mt-4 bg-burgundy-500 text-burgundy-100 py-2 rounded-lg hover:bg-burgundy-600 transition-all focus:outline-none focus:ring-2 focus:ring-burgundy-400"
                        aria-label={`View details for issue ${issue.issue_id}`}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Technician List */}
          <aside className="w-full lg:w-80 bg-white rounded-lg shadow-sm p-8">
            <h3 className="text-xl font-semibold text-burgundy-800 mb-6 flex items-center gap-2">
              <CheckCircle size={24} className="text-green-500" />
              Technicians
            </h3>
            {technicians.length === 0 ? (
              <p className="text-burgundy-600 text-base italic">
                No technicians available.
              </p>
            ) : (
              <ul className="space-y-4">
                {technicians.map((tech) => (
                  <li
                    key={tech.id}
                    className="border border-gray-300 p-4 rounded-lg  transition"
                  >
                    <div className="text-lg font-medium text-burgundy-800">
                      {tech.name}
                    </div>
                    <div className="flex items-center gap-2 text-base text-burgundy-700">
                      <CheckCircle size={20} className="text-burgundy-600" />
                      <span
                        className={`font-medium ${
                          tech.assignment_status === "Assigned"
                            ? "text-green-600"
                            : "text-blue-600"
                        }`}
                      >
                        {tech.assignment_status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-base text-burgundy-700 mt-1">
                      <Phone size={20} className="text-burgundy-600" />
                      {tech.phone_number}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </div>

        {/* Issue Details Modal */}
        {selectedIssue && (
          <div
            className="fixed inset-0 bg-burgundy-900/50 flex items-center justify-center z-50 transition-opacity"
            onClick={handleClickOutside}
          >
            <div
              ref={modalRef}
              className="bg-white rounded-lg shadow-lg w-11/12 sm:max-w-md mx-auto p-6 animate-slideUp"
              role="dialog"
              aria-modal="true"
              aria-labelledby="issue-modal-title"
            >
              <div className="flex justify-between items-center mb-4">
                <h3
                  id="issue-modal-title"
                  className="text-xl font-semibold text-burgundy-800 flex items-center gap-2"
                >
                  <AlertCircle size={20} className="text-red-500" /> Issue #
                  {selectedIssue.issue_id}
                </h3>
                <button
                  ref={firstFocusableRef}
                  onClick={() => setSelectedIssue(null)}
                  className="text-burgundy-600 hover:text-burgundy-800 focus:outline-none focus:ring-2 focus:ring-burgundy-400 rounded-full p-1"
                  aria-label="Close issue modal"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-3 text-burgundy-800">
                <div className="text-base">
                  {selectedIssue.issue_description}
                </div>
                <div className="flex items-center gap-2 text-base">
                  <Tag size={20} className="text-burgundy-600" />
                  Category: {selectedIssue.category}
                </div>
                <div className="flex items-center gap-2 text-base">
                  <Clock size={20} className="text-burgundy-600" />
                  Priority: {selectedIssue.priority}
                </div>
                <div className="flex items-center gap-2 text-base">
                  <CheckCircle size={20} className="text-burgundy-600" />
                  Status: {selectedIssue.status}
                </div>
                <div className="flex items-center gap-2 text-base">
                  <User size={20} className="text-burgundy-600" />
                  Technician: {selectedIssue.technician || "None"}
                </div>
                <div className="flex items-center gap-2 text-base">
                  <Calendar size={20} className="text-burgundy-600" />
                  Submitted: {formatDate(selectedIssue.reported_date)}
                </div>
              </div>
              {selectedIssue.status === "OPEN" && (
                <button
                  onClick={() => handleAssignTechnician(selectedIssue.issue_id)}
                  disabled={assigningIssueId === selectedIssue.issue_id}
                  className="w-full mt-4 bg-burgundy-500 text-burgundy-100 py-2 rounded-lg hover:bg-burgundy-600 transition-all focus:outline-none focus:ring-2 focus:ring-burgundy-400 disabled:opacity-50"
                  aria-label={`Assign technician to issue ${selectedIssue.issue_id}`}
                >
                  {assigningIssueId === selectedIssue.issue_id ? (
                    <div className="flex items-center justify-center gap-2">
                      <Spinner size="small" className="text-burgundy-100" />
                      Assigning...
                    </div>
                  ) : (
                    "Assign Technician"
                  )}
                </button>
              )}
              <button
                onClick={() => setSelectedIssue(null)}
                className="w-full mt-2 bg-burgundy-500 text-burgundy-100 py-2 rounded-lg hover:bg-burgundy-600 transition-all focus:outline-none focus:ring-2 focus:ring-burgundy-400"
                aria-label="Close issue modal"
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

export default AdminReports;
