import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/prestigeLogo.png";
import {
  Home,
  WalletCards,
  Megaphone,
  BadgeAlert,
  CircleUser,
  ChevronDown,
  Settings,
  Mail,
  LogOutIcon,
  Menu,
  UserPlus,
  X,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { endpoint } from "../backendAPI";

function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch notifications on mount
  useEffect(() => {
    axios
      .get(`${endpoint}/notifications/my-notifications`, {
        withCredentials: true,
      })
      .then((res) => setNotifications(res.data))
      .catch((err) => console.error("Failed to fetch notifications:", err));
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${endpoint}/auth/tenant/sign-out`,
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        document.cookie = "tenantPrestigeSession=; Max-Age=0; path=/;";
        localStorage.removeItem("tenantId");
        toast.success("Successfully logged out.");
        setTimeout(() => navigate("/login"), 2000); // Reduced timeout for faster UX
      } else {
        toast.error("You are not logged in.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("You are not logged in.");
    }
  };

  // Toggle dropdown and mobile menu
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Navigation items array for DRY code
  const navItems = [
    { to: "/home", icon: Home, label: "Home" },
    { to: "/visitors", icon: UserPlus, label: "Visitors" },
    { to: "/bookings", icon: WalletCards, label: "Rent & Booking" },
    { to: "/issue-reports", icon: BadgeAlert, label: "Issue Reports" },
    { to: "/advertisements", icon: Megaphone, label: "Advertisements" },
  ];

  // Check active route
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="relative px-4 py-3 bg-burgundy-600 shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <a href="/home" className="flex items-center space-x-2">
          <img src={Logo} alt="Prestige Logo" className="h-10 w-auto" />
          <span className="text-white text-xl font-semibold select-none hidden md:inline">
            Hostel Management
          </span>
        </a>

        {/* Burger Icon (Mobile) */}
        <button
          className="lg:hidden text-white p-2 focus:outline-none"
          onClick={toggleMobileMenu}
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex items-center space-x-4 text-white font-medium">
          {navItems.map(({ to, icon: Icon, label }) => (
            <li key={to} className="flex items-center">
              <a
                href={to}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors duration-200 ${
                  isActive(to) ? "text-amber-300" : "hover:text-amber-200"
                }`}
              >
                <Icon size={22} />
                <span>{label}</span>
              </a>
            </li>
          ))}
          {/* Account Dropdown */}
          <li className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-1 px-3 py-2 rounded-md text-white hover:text-amber-200 transition-colors duration-200"
            >
              <CircleUser size={22} />
              <span>Account</span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isDropdownOpen && (
              <ul className="absolute right-0 mt-2 w-48 bg-white text-gray-900 rounded-lg shadow-lg border z-50">
                <li>
                  <a
                    href="/account-settings"
                    className="flex items-center px-4 py-2 hover:bg-gray-100"
                  >
                    <Settings className="w-5 h-5 mr-2" />
                    Account Settings
                  </a>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 text-red-600 hover:bg-red-100 w-full text-left"
                  >
                    <LogOutIcon className="w-5 h-5 mr-2" />
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </li>
        </ul>

        {/* Right Icons (Desktop) */}
        <div className="hidden lg:flex items-center space-x-4">
          <a
            href="/messages"
            className={`relative p-2 rounded-full transition-colors duration-200 ${
              isActive("/messages")
                ? "text-amber-300"
                : "text-white hover:text-amber-200"
            }`}
          >
            <Mail size={24} />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-400 text-burgundy-900 text-xs font-semibold rounded-full px-1.5 py-0.5">
                {notifications.length}
              </span>
            )}
          </a>
          <button
            onClick={handleLogout}
            className="p-2 bg-burgundy-700 hover:bg-amber-400 hover:text-burgundy-900 rounded-md transition-colors duration-200"
          >
            <LogOutIcon size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden absolute left-0 right-0 bg-burgundy-700 text-white shadow-md transition-all duration-300 ease-in-out ${
          isMobileMenuOpen
            ? "max-h-screen opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="container mx-auto py-4 px-6 space-y-3">
          {navItems.map(({ to, icon: Icon, label }) => (
            <a
              key={to}
              href={to}
              className={`flex items-center space-x-3 text-lg py-2 rounded-md transition-colors duration-200 ${
                isActive(to) ? "text-amber-300" : "hover:text-amber-200"
              }`}
              onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
            >
              <Icon size={22} />
              <span>{label}</span>
            </a>
          ))}
          <a
            href="/messages"
            className={`flex items-center space-x-3 text-lg py-2 rounded-md transition-colors duration-200 ${
              isActive("/messages") ? "text-amber-300" : "hover:text-amber-200"
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Mail size={22} />
            <span>
              Messages {notifications.length > 0 && `(${notifications.length})`}
            </span>
          </a>
          <button
            onClick={() => {
              handleLogout();
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center space-x-3 text-lg py-2 text-red-400 hover:text-red-600 w-full text-left"
          >
            <LogOutIcon size={22} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
