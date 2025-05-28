import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { endpoint } from "../backendAPI";
import {
  Home,
  WalletCards,
  Megaphone,
  BadgeAlert,
  CircleUser,
  ChevronDown,
  LogOutIcon,
  Menu,
  X,
  Users,
  UserPlus,
} from "lucide-react";
import Logo from "../assets/prestigeLogo.png";

function AdminNavbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${endpoint}/auth/administrator/sign-out`,
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        document.cookie = "adminPrestigeSession=; Max-Age=0; path=/;";
        localStorage.removeItem("adminId");
        toast.success("Successfully logged out.");
        setTimeout(() => navigate("/administrator/login"), 4000);
      } else {
        toast.error("You are not logged in.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("You are not logged in.");
    }
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="relative px-4 py-4 flex justify-between items-center bg-burgundy-600 shadow-md">
      {/* Logo */}
      <a href="/administrator/home" className="flex items-center space-x-2">
        <img src={Logo} alt="Prestige Logo" className="h-10 w-auto" />
        <span className="text-white text-2xl font-semibold select-none hidden lg:inline">
          Hostel Management System
        </span>
      </a>

      {/* Burger Icon (Mobile) */}
      <button
        className="lg:hidden text-white"
        onClick={toggleMobileMenu}
        aria-label="Toggle Menu"
      >
        {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
      </button>

      {/* Desktop Nav */}
      <ul className="hidden lg:flex lg:items-center lg:space-x-6 text-white font-medium tracking-wide">
        {[
          { to: "/administrator/home", icon: Home, label: "Home" },
          { to: "/tenants", icon: Users, label: "Tenants" },
          { to: "/administrator/visitors", icon: UserPlus, label: "Visitors" },
          {
            to: "/administrator/bookings",
            icon: WalletCards,
            label: "Booking & Payments",
          },
          {
            to: "/administrator/issue-reports",
            icon: BadgeAlert,
            label: "Issue Reports",
          },
          {
            to: "/administrator/advertisements",
            icon: Megaphone,
            label: "Tenant Advertisements",
          },
        ].map(({ to, icon: Icon, label }) => (
          <li key={to} className="flex items-center space-x-2">
            <Icon
              size={26}
              className={`transition-colors duration-200 ${
                isActive(to)
                  ? "text-amber-300"
                  : "hover:text-amber-200 cursor-pointer"
              }`}
            />
            <a
              href={to}
              className={`text-lg transition-colors duration-200 ${
                isActive(to)
                  ? "text-amber-300"
                  : "hover:text-amber-200 cursor-pointer"
              }`}
            >
              {label}
            </a>
            <span className="text-gray-400 select-none">|</span>
          </li>
        ))}
        <li className="relative flex items-center space-x-2" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="flex items-center text-lg text-white hover:text-amber-200 transition"
          >
            <CircleUser size={26} />
            <span className="ml-1">Account</span>
            <ChevronDown
              size={18}
              className={`ml-1 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isDropdownOpen && (
            <ul className="absolute top-full mt-2 w-44 bg-white text-gray-900 rounded-lg shadow-lg z-50 border">
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-5 py-3 text-red-600 hover:bg-red-100 w-full text-left"
                >
                  <LogOutIcon className="w-5 h-5 mr-2" />
                  Logout
                </button>
              </li>
            </ul>
          )}
        </li>
      </ul>

      {/* Right icons (Desktop only) */}
      <div className="hidden lg:flex items-center space-x-6">
        <a
          href="/administrator/messages"
          className="relative text-white hover:text-amber-300"
        >
          {notifications.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-amber-400 text-burgundy-900 text-xs font-semibold rounded-full px-2 py-0.5">
              {notifications.length}
            </span>
          )}
        </a>

        <button
          onClick={handleLogout}
          className="bg-burgundy-700 hover:bg-amber-400 hover:text-burgundy-900 transition text-white p-2 rounded-md shadow-md"
        >
          <LogOutIcon size={26} />
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-burgundy-700 text-white z-40 py-4 px-6 space-y-4 lg:hidden shadow-md">
          {[
            { to: "/administrator/home", icon: Home, label: "Home" },
            {
              to: "/administrator/visitors",
              icon: UserPlus,
              label: "Visitors",
            },
            { to: "/tenants", icon: Users, label: "Tenants" },
            {
              to: "/administrator/bookings",
              icon: WalletCards,
              label: "Rent & Booking",
            },
            {
              to: "/administrator/issue-reports",
              icon: BadgeAlert,
              label: "Issue Reports",
            },
            {
              to: "/administrator/advertisements",
              icon: Megaphone,
              label: "Advertisements",
            },
          ].map(({ to, icon: Icon, label }) => (
            <a
              key={to}
              href={to}
              className="flex items-center space-x-3 text-lg hover:text-amber-300"
            >
              <Icon size={24} />
              <span>{label}</span>
            </a>
          ))}

          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 text-lg text-red-400 hover:text-red-600"
          >
            <LogOutIcon size={24} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
}

export default AdminNavbar;
