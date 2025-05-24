import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { toast } from "react-toastify";
import { endpoint } from "../../backendAPI";
import Spinner from "../../components/Spinner";
import { useState, useEffect } from "react";
import axios from "axios"; // Don't forget to import axios
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-burgundy-100 to-burgundy-200">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
        <header className="mb-8 animate-fadeIn">
          <h1 className="text-3xl sm:text-4xl font-bold text-burgundy-800">
            Your visitors
          </h1>
          <p className="text-base sm:text-lg text-burgundy-600 mt-2">
            Oversee your visitors
          </p>
        </header>

        {loading ? (
          <Spinner />
        ) : visitors.length === 0 ? (
          <p className="text-center text-gray-600">No visitors found.</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4 animate-fadeIn">
            <table className="min-w-full table-auto text-sm text-left text-gray-700">
              <thead className="text-xs uppercase bg-burgundy-200 text-burgundy-900">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Phone Number</th>
                  <th className="px-4 py-3">Entry Time</th>
                  <th className="px-4 py-3">Planned Exit</th>
                  <th className="px-4 py-3">Actual Exit</th>
                 
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {visitors.map((visitor) => (
                  <tr
                    key={visitor.visitorid}
                    className={`border-b ${
                      visitor.is_active ? "bg-green-50" : "bg-gray-100"
                    }`}
                  >
                    <td className="px-4 py-3">{visitor.name}</td>
                    <td className="px-4 py-3">{visitor.phonenumber}</td>
                    <td className="px-4 py-3">
                      {moment(visitor.entrytime).format("YYYY-MM-DD HH:mm")}
                    </td>
                    <td className="px-4 py-3">
                      {moment(visitor.plannedexittime).format(
                        "YYYY-MM-DD HH:mm"
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {visitor.exittime
                        ? moment(visitor.exittime).format("YYYY-MM-DD HH:mm")
                        : "—"}
                    </td>
                   
                    <td className="px-4 py-3 font-semibold">
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
