import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { toast } from "react-toastify";
import { endpoint } from "../../backendAPI";
import Spinner from "../../components/Spinner";
import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment"; // Optional: For better time formatting

function TenantVisitors() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVisitors = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${endpoint}/visitors/my-visitors`, {
          withCredentials: true,
        });
        setVisitors(res.data.visitors);
      } catch (error) {
        toast.error("Failed to fetch visitors. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchVisitors();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-burgundy-100 to-burgundy-200 animate-fadeIn">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-6 sm:py-8 md:py-10">
        <header className="mb-6 sm:mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-burgundy-800 animate-slideIn">
            Your Visitors
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mt-2">
            Oversee Your Visitors
          </p>
        </header>

        {loading ? (
          <Spinner />
        ) : visitors.length === 0 ? (
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow p-8 mt-10">
            <p className="text-center text-gray-600 text-base sm:text-lg italic">
              You currently have no visitors.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4 sm:p-6 animate-fadeIn">
            <table className="min-w-full table-auto text-xs sm:text-sm md:text-base text-left text-gray-700">
              <thead className="text-xs uppercase bg-burgundy-200 text-burgundy-900">
                <tr>
                  <th className="px-2 py-2 sm:px-4 sm:py-3">Name</th>
                  <th className="px-2 py-2 sm:px-4 sm:py-3">Phone Number</th>
                  <th className="px-2 py-2 sm:px-4 sm:py-3 hidden sm:table-cell">
                    Entry Time
                  </th>
                  <th className="px-2 py-2 sm:px-4 sm:py-3 hidden md:table-cell">
                    Planned Exit
                  </th>
                  <th className="px-2 py-2 sm:px-4 sm:py-3 hidden lg:table-cell">
                    Actual Exit
                  </th>
                  <th className="px-2 py-2 sm:px-4 sm:py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {visitors.map((visitor) => (
                  <tr
                    key={visitor.visitorid}
                    className={`border-b ${
                      visitor.is_active ? "bg-green-50" : "bg-gray-100"
                    } hover:bg-burgundy-50 transition-colors`}
                  >
                    <td className="px-2 py-2 sm:px-4 sm:py-3 font-medium">
                      {visitor.name}
                    </td>
                    <td className="px-2 py-2 sm:px-4 sm:py-3">
                      {visitor.phonenumber}
                    </td>
                    <td className="px-2 py-2 sm:px-4 sm:py-3 hidden sm:table-cell">
                      {moment(visitor.entrytime).format("YYYY-MM-DD HH:mm")}
                    </td>
                    <td className="px-2 py-2 sm:px-4 sm:py-3 hidden md:table-cell">
                      {moment(visitor.plannedexittime).format(
                        "YYYY-MM-DD HH:mm"
                      )}
                    </td>
                    <td className="px-2 py-2 sm:px-4 sm:py-3 hidden lg:table-cell">
                      {visitor.exittime
                        ? moment(visitor.exittime).format("YYYY-MM-DD HH:mm")
                        : "—"}
                    </td>
                    <td className="px-2 py-2 sm:px-4 sm:py-3 font-semibold">
                      {visitor.is_active ? (
                        <span className="text-green-600">Active</span>
                      ) : (
                        <span className="text-gray-500">Exited</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default TenantVisitors;
