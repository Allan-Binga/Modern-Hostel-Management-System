import { Link, useNavigate } from "react-router-dom";
import { Home, LogOut } from "lucide-react";
import axios from "axios";
import { endpoint } from "../../backendAPI";
import { toast } from "react-toastify";

function VisitorNavbar() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      toast.success("Signed out successfully!");
      navigate("/visitors/login");
    } catch (error) {
    }
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 bg-burgundy-800 text-burgundy-100 shadow-sm z-50 animate-fadeIn"
      role="navigation"
      aria-label="Visitor navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/visitor"
            className="flex items-center gap-2 text-lg font-bold text-burgundy-100 hover:text-burgundy-200 transition-colors"
            aria-label="Visitor dashboard"
          >
            <Home size={20} />
            Prestige Girls Hostel
          </Link>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="bg-burgundy-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold hover:bg-burgundy-600 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-burgundy-400"
            aria-label="Sign out"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}

export default VisitorNavbar;
