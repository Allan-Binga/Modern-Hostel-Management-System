import AdminNavbar from "../../components/AdminNavbar";
import Footer from "../../components/Footer";
import { toast } from "react-toastify";
import { endpoint } from "../../backendAPI";
import Spinner from "../../components/Spinner";
import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment"; // Optional: For better time formatting

function AdminVisitors() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVisitors = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${endpoint}/visitors/all-visitors`, {
          withCredentials: true,
        });
        setVisitors(res.data);
      } catch (error) {
        toast.error("Failed to fetch visitors. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchVisitors();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-burgundy-100 to-burgundy-200">
      <AdminNavbar />
      <main className="flex-grow max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
        <header className="mb-6 sm:mb-8 animate-fadeIn">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-burgundy-800">
            Visitors
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-burgundy-600 mt-2">
            Oversee Prestige Girls Visitors
          </p>
        </header>

        {loading ? (
          <Spinner />
        ) : visitors.length === 0 ? (
          <p className="text-center text-gray-600 text-sm sm:text-base">
            No visitors found.
          </p>
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
                  <th className="px-2 py-2 sm:px-4 sm:py-3 hidden sm:table-cell">
                    Room ID
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
                    <td className="px-2 py-2 sm:px-4 sm:py-3 hidden sm:table-cell">
                      {visitor.visitedroomid}
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

export default AdminVisitors;
