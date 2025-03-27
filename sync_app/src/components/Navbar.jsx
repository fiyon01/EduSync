import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBell, FaSearch, FaCaretDown, FaBars } from 'react-icons/fa';

const Navbar = ({ toggleSidebar }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleProfileDropdown = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsNotificationsOpen(false); // Close notifications dropdown
  };

  const toggleNotificationsDropdown = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    setIsProfileOpen(false); // Close profile dropdown
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <div className="bg-white shadow-md p-4 flex justify-between items-center fixed top-0 w-full md:w-[calc(100%-16rem)] z-50">

      {/* Left Section: Logo & Sidebar Toggle */}
      <div className="flex items-center space-x-4">
        {/* Sidebar Toggle for Mobile */}
        <button onClick={toggleSidebar} className="md:hidden text-gray-700 hover:text-gray-900">
          <FaBars size={24} />
        </button>
        <h1 className="text-xl font-bold hidden md:block">EduSync</h1>
      </div>

      {/* Center: Search Bar (Hidden on Small Screens) */}
      <div className="hidden md:flex relative w-64">
        <input
          type="text"
          placeholder="Search..."
          className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
        />
        <FaSearch className="absolute left-3 top-3 text-gray-400" />
      </div>

      {/* Right Section: Icons & Profile */}
      <div className="flex items-center space-x-6 relative">
        {/* Search Icon for Mobile */}
        <button onClick={toggleSearch} className="md:hidden text-gray-700 hover:text-gray-900">
          <FaSearch size={20} />
        </button>

        {/* Mobile Search Dropdown */}
        {isSearchOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white p-4 shadow-md md:hidden z-50">
            <input
              type="text"
              placeholder="Search..."
              className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
            />
          </div>
        )}

        {/* Notifications */}
        <div className="relative">
          <button onClick={toggleNotificationsDropdown} className="text-gray-700 hover:text-gray-900 relative">
            <FaBell size={20} />
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              3
            </span>
          </button>

          {/* Notifications Dropdown */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg overflow-auto max-h-56 z-50">
              <div className="p-4">
                <h3 className="font-bold text-gray-800">Notifications</h3>
                <ul className="mt-2 text-gray-700">
                  <li className="p-2 border-b hover:bg-gray-100 cursor-pointer">
                    New student registered
                  </li>
                  <li className="p-2 border-b hover:bg-gray-100 cursor-pointer">
                    Exam schedule updated
                  </li>
                  <li className="p-2 hover:bg-gray-100 cursor-pointer">Fee payment reminder</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button onClick={toggleProfileDropdown} className="flex items-center space-x-2">
            <img
              src="https://via.placeholder.com/40"
              alt="Profile"
              className="w-10 h-10 rounded-full border border-gray-300"
            />
            <span className="hidden md:inline">Admin</span>
            <FaCaretDown />
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <ul className="py-2 text-gray-700">
                <li className="p-2 hover:bg-gray-100">
                  <Link to="/profile">Profile</Link>
                </li>
                <li className="p-2 hover:bg-gray-100">
                  <Link to="/settings">Settings</Link>
                </li>
                <li className="p-2 hover:bg-gray-100">
                  <Link to="/logout">Logout</Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
