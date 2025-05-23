import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Info, Menu, X } from "lucide-react";
import { toast } from "react-toastify";


function LandingNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleVisitorClick = () => {
    toast.info("Redirecting to visitor page...");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-900 text-burgundy-100 shadow-sm z-50 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Name */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="text-lg font-bold text-burgundy-100 hover:text-burgundy-200 transition-colors"
              aria-label="Home"
            >
              Prestige Hostels
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex items-center gap-6">
            <Link
              to="/visitor"
              onClick={handleVisitorClick}
              className="text-md text-burgundy-100 hover:text-burgundy-200 flex items-center gap-2 transition-colors hover:scale-105"
              aria-label="Visitor page"
            >
              <Info size={16} />
              Are you a visitor?
            </Link>
            <Link
              to="/visitors/login"
              className="bg-burgundy-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-burgundy-600 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-burgundy-400"
              aria-label="Log in"
            >
              <User size={16} />
              Log In
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden">
            <button
              onClick={toggleMenu}
              className="text-burgundy-100 hover:text-burgundy-200 focus:outline-none focus:ring-2 focus:ring-burgundy-400 p-2"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="sm:hidden bg-burgundy-800 px-4 py-4 animate-slideUp">
            <Link
              to="/visitor"
              onClick={() => {
                handleVisitorClick();
                setIsMenuOpen(false);
              }}
              className="block text-sm text-burgundy-100 hover:text-burgundy-200 py-2 flex items-center gap-2 transition-colors"
              aria-label="Visitor page"
            >
              <Info size={16} />
              Are you a visitor? Click the login button.
            </Link>
            <Link
              to="/visitors/login"
              onClick={() => setIsMenuOpen(false)}
              className="block bg-burgundy-500 text-white px-4 py-2 rounded-lg mt-2 flex items-center gap-2 hover:bg-burgundy-600 transition-all focus:outline-none focus:ring-2 focus:ring-burgundy-400"
              aria-label="Log in"
            >
              <User size={16} />
              Log In
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default LandingNavbar;