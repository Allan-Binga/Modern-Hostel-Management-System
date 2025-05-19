import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/prestigeLogo.png";
import {
  Home,
  BookUser,
  Megaphone,
  Proportions,
  CircleUser,
  ChevronDown,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { endpoint } from "../backendAPI";

function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  //Handle Logout
  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${endpoint}/auth/tenant/sign-out`,
        {},
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        document.cookie = "tenantPrestigeSession=; Max-Age=0; path=/;";
        localStorage.removeItem("tenantId");

        toast.success("Successfully logged out.");

        setTimeout(() => {
          navigate("/login");
        }, 4000);
      } else {
        toast.error("You are not logged in.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("You are not logged in.");
    }
  };
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <nav className="relative px-6 py-6 flex justify-between items-center bg-burgundy-500">
        <a className="text-3xl font-bold leading-none" href="#">
          {/* <Logo/> */}
        </a>
        <div className="lg:hidden">
          <button className="navbar-burger flex items-center text-white p-3">
            <svg
              className="block h-4 w-4 fill-current"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Mobile menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
            </svg>
          </button>
        </div>

        <ul className="hidden lg:flex lg:items-center lg:space-x-4">
          <li className="flex items-center space-x-1 text-white hover:font-bold">
            <Home
              className={`${
                location.pathname === "/home"
                  ? " font-semibold"
                  : "hover:font-semibold cursor-pointer"
              }`}
            />
            <a
              href="/home"
              className={`text-lg text-white hover:font-semibold${
                location.pathname === "/home"
                  ? " font-semibold"
                  : "hover:font-semibold cursor-pointer"
              }`}
            >
              <span>Home</span>
            </a>
          </li>
          <span className="text-white">|</span>

          <li className="flex items-center space-x-1 text-white">
            <BookUser
              className={`${
                location.pathname === "/bookings"
                  ? "font-semibold"
                  : "hover:font-semibold cursor-pointer"
              }`}
              size={26}
            />
            <a
              className={`text-lg text-white hover:font-semibold${
                location.pathname === "/bookings"
                  ? " font-semibold"
                  : "hover:font-semibold cursor-pointer"
              }`}
              href="/bookings"
            >
              <span>Bookings</span>
            </a>
          </li>
          <span className="text-white">|</span>

          <li className="flex items-center space-x-1 text-white">
            <Megaphone
              size={26}
              className={`${
                location.pathname === "/advertisements"
                  ? "font-semibold"
                  : "hover:font-semibold cursor-pointer"
              }`}
            />
            <a
              className={`text-lg text-white hover:font-semibold ${
                location.pathname === "/advertisements"
                  ? " font-semibold"
                  : "hover:font-semibold cursor-pointer"
              }`}
              href="/advertisements"
            >
              <span>Advertisements</span>
            </a>
          </li>
          <span className="text-white">|</span>

          <li className="flex items-center space-x-1 text-white">
            <Proportions
              size={26}
              className={`${
                location.pathname === "/issue-reports"
                  ? "font-semibold"
                  : "hover:font-semibold cursor-pointer"
              }`}
            />
            <a
              className={`text-lg text-white hover:font-semibold ${
                location.pathname === "/issue-reports"
                  ? " font-semibold"
                  : "hover:font-semibold cursor-pointer"
              }`}
              href="/issue-reports"
            >
              <span>Issue Reports</span>
            </a>
          </li>
          <span className="text-white">|</span>

          <li
            className="relative flex items-center space-x-1 text-white"
            ref={dropdownRef}
          >
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-1 text-lg text-white hover:text-white focus:outline-none cursor-pointer"
            >
              <CircleUser size={26} />
              <span>Account</span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isDropdownOpen && (
              <ul className="absolute top-full mt-2 w-40 bg-white text-gray-800 rounded shadow-lg">
                <li>
                  <a
                    href="/profile"
                    className="flex items-center px-6 py-3 hover:bg-gray-100 cursor-pointer"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </a>
                </li>
                <li>
                  <a
                    href="/account-settings"
                    className="flex items-center px-6 py-3 hover:bg-gray-100 cursor-pointer"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Account Settings
                  </a>
                </li>
                <li>
                  <a
                    onClick={handleLogout}
                    className="flex items-center px-6 py-3 hover:bg-red-100 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </a>
                </li>
              </ul>
            )}
          </li>
        </ul>

        <div className="hidden lg:flex items-center">
          <a
            className="py-2 px-6 bg-gray-50 hover:bg-gray-100 text-lg text-gray-900 font-bold rounded-xl transition duration-200"
            href="/login"
          >
            Sign In
          </a>
          <a
            className="ml-3 py-2 px-6 bg-blue-500 hover:bg-blue-600 text-lg text-white font-bold rounded-xl transition duration-200"
            href="#"
          >
            Sign up
          </a>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
