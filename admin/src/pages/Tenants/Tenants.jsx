import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { endpoint } from "../../backendAPI";
import { toast } from "react-toastify";
import AdminNavbar from "../../components/AdminNavbar";
import Footer from "../../components/Footer";
import Spinner from "../../components/Spinner";
import { User, Mail, Phone, Trash, X } from "lucide-react";

function Tenants() {
  const [tenants, setTenants] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const detailsModalRef = useRef(null);
  const confirmModalRef = useRef(null);
  const firstFocusableRef = useRef(null);

  useEffect(() => {
    const fetchTenants = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${endpoint}/users/tenants/all-tenants`, {
          withCredentials: true,
        });
        setTenants(res.data);
      } catch (error) {
        toast.error("Failed to fetch tenants. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchTenants();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (confirmDelete) setConfirmDelete(null);
        else if (selectedTenant) setSelectedTenant(null);
      }
    };

    const handleFocusTrap = (e, modalRef) => {
      if (!modalRef.current) return;
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

    const handleDetailsFocus = (e) => handleFocusTrap(e, detailsModalRef);
    const handleConfirmFocus = (e) => handleFocusTrap(e, confirmModalRef);

    if (selectedTenant || confirmDelete) {
      document.body.style.overflow = "hidden";
      if (firstFocusableRef.current) firstFocusableRef.current.focus();
    } else {
      document.body.style.overflow = "";
    }

    document.addEventListener("keydown", handleKeyDown);
    if (selectedTenant)
      document.addEventListener("keydown", handleDetailsFocus);
    if (confirmDelete) document.addEventListener("keydown", handleConfirmFocus);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keydown", handleDetailsFocus);
      document.removeEventListener("keydown", handleConfirmFocus);
      document.body.style.overflow = "";
    };
  }, [selectedTenant, confirmDelete]);

  const handleClickOutside = (e, modalRef, setState) => {
    if (modalRef.current && !modalRef.current.contains(e.target))
      setState(null);
  };

  const handleDeleteTenant = async (tenantId) => {
    setDeleting(true);
    try {
      await axios.delete(`${endpoint}/users/tenants/delete/${tenantId}`, {
        withCredentials: true,
      });
      toast.success("Tenant deleted successfully.");
      setTenants((prev) => prev.filter((tenant) => tenant.id !== tenantId));
      setSelectedTenant(null);
      setConfirmDelete(null);
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Failed to delete tenant."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-burgundy-100 to-burgundy-200">
      <AdminNavbar />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
        <header className="mb-8 animate-fadeIn">
          <h1 className="text-3xl sm:text-4xl font-bold text-burgundy-800">
            Tenants
          </h1>
          <p className="text-base sm:text-lg text-burgundy-600 mt-2">
            Manage tenant accounts
          </p>
        </header>

        <section
          className="relative min-h-[200px]"
          aria-live="polite"
          aria-busy={loading}
        >
          <h2 className="text-2xl font-semibold text-burgundy-800 flex items-center gap-3 mb-6">
            <User size={28} className="text-burgundy-600" /> All Tenants
          </h2>
          {loading ? (
            <div className="absolute inset-0 flex justify-center items-center bg-burgundy-100/80 transition-opacity">
              <Spinner size="large" className="text-burgundy-500" />
            </div>
          ) : tenants.length === 0 ? (
            <p className="text-burgundy-600 text-base italic">
              No tenants found.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {tenants.map((tenant, index) => (
                <div
                  key={tenant.id}
                  className="bg-white rounded-lg shadow-sm min-h-[260px] transition-transform hover:scale-105 animate-slideUp"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <div className="p-8 space-y-3 text-burgundy-800">
                    <div className="text-lg font-semibold">
                      {tenant.firstname} {tenant.lastname}
                    </div>
                    <div className="flex items-center gap-2 text-lg">
                      <Mail size={20} className="text-burgundy-600" />
                      {tenant.email}
                    </div>
                    <div className="flex items-center gap-2 text-lg">
                      <Phone size={20} className="text-burgundy-600" />
                      {tenant.phonenumber}
                    </div>
                    <button
                      onClick={() => setSelectedTenant(tenant)}
                      className="w-full mt-4 bg-burgundy-500 text-burgundy-100 py-2 rounded-lg hover:bg-burgundy-600 transition-all focus:outline-none focus:ring-2 focus:ring-burgundy-400"
                      aria-label={`View details for tenant ${tenant.firstname} ${tenant.lastname}`}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Tenant Details Modal */}
        {selectedTenant && (
          <div
            className="fixed inset-0 bg-burgundy-900/50 flex items-center justify-center z-50 transition-opacity"
            onClick={(e) =>
              handleClickOutside(e, detailsModalRef, setSelectedTenant)
            }
          >
            <div
              ref={detailsModalRef}
              className="bg-white rounded-lg shadow-lg w-11/12 sm:max-w-md mx-auto p-6 animate-slideUp"
              role="dialog"
              aria-modal="true"
              aria-labelledby="tenant-modal-title"
            >
              <div className="flex justify-between items-center mb-4">
                <h3
                  id="tenant-modal-title"
                  className="text-xl font-semibold text-burgundy-800 flex items-center gap-2"
                >
                  <User size={20} className="text-burgundy-600" /> Tenant
                  Details
                </h3>
                <button
                  ref={firstFocusableRef}
                  onClick={() => setSelectedTenant(null)}
                  className="text-burgundy-600 hover:text-burgundy-800 focus:outline-none focus:ring-2 focus:ring-burgundy-400 rounded-full p-1"
                  aria-label="Close tenant details modal"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-3 text-burgundy-800">
                <div className="flex items-center gap-2 text-base">
                  <User size={20} className="text-burgundy-600" />
                  First Name: {selectedTenant.firstname}
                </div>
                <div className="flex items-center gap-2 text-base">
                  <User size={20} className="text-burgundy-600" />
                  Last Name: {selectedTenant.lastname}
                </div>
                <div className="flex items-center gap-2 text-base">
                  <Mail size={20} className="text-burgundy-600" />
                  Email: {selectedTenant.email}
                </div>
                <div className="flex items-center gap-2 text-base">
                  <Phone size={20} className="text-burgundy-600" />
                  Phone: {selectedTenant.phonenumber}
                </div>
              </div>
              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => {
                    setConfirmDelete(selectedTenant);
                    setSelectedTenant(null);
                  }}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-all focus:outline-none focus:ring-2 focus:ring-red-500"
                  aria-label={`Delete tenant ${selectedTenant.firstname} ${selectedTenant.lastname}`}
                >
                  Delete Tenant
                </button>
                <button
                  onClick={() => setSelectedTenant(null)}
                  className="flex-1 bg-burgundy-500 text-burgundy-100 py-2 rounded-lg hover:bg-burgundy-600 transition-all focus:outline-none focus:ring-2 focus:ring-burgundy-400"
                  aria-label="Close tenant details modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {confirmDelete && (
          <div
            className="fixed inset-0 bg-burgundy-900/50 flex items-center justify-center z-50 transition-opacity"
            onClick={(e) =>
              handleClickOutside(e, confirmModalRef, setConfirmDelete)
            }
          >
            <div
              ref={confirmModalRef}
              className="bg-white rounded-lg shadow-lg w-11/12 sm:max-w-sm mx-auto p-6 animate-slideUp"
              role="dialog"
              aria-modal="true"
              aria-labelledby="confirm-modal-title"
            >
              <div className="flex justify-between items-center mb-4">
                <h3
                  id="confirm-modal-title"
                  className="text-xl font-semibold text-burgundy-800 flex items-center gap-2"
                >
                  <Trash size={20} className="text-red-600" /> Confirm Deletion
                </h3>
                <button
                  ref={firstFocusableRef}
                  onClick={() => setConfirmDelete(null)}
                  className="text-burgundy-600 hover:text-burgundy-800 focus:outline-none focus:ring-2 focus:ring-burgundy-400 rounded-full p-1"
                  aria-label="Close confirmation modal"
                >
                  <X size={24} />
                </button>
              </div>
              <p className="text-burgundy-800 text-base mb-6">
                Are you sure you want to delete {confirmDelete.firstname}{" "}
                {confirmDelete.lastname}?
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => handleDeleteTenant(confirmDelete.id)}
                  disabled={deleting}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-all focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                  aria-label={`Confirm deletion of tenant ${confirmDelete.firstname} ${confirmDelete.lastname}`}
                >
                  {deleting ? (
                    <div className="flex items-center justify-center gap-2">
                      <Spinner size="small" className="text-white" />
                      Deleting...
                    </div>
                  ) : (
                    "Confirm"
                  )}
                </button>
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 bg-burgundy-500 text-burgundy-100 py-2 rounded-lg hover:bg-burgundy-600 transition-all focus:outline-none focus:ring-2 focus:ring-burgundy-400"
                  aria-label="Cancel deletion"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default Tenants;
