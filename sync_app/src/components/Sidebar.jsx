import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaHome,
  FaCog,
  FaCalendarAlt,
  FaUser,
  FaBook,
  FaChartLine,
  FaBullhorn,
  FaChartBar,
} from 'react-icons/fa';

import { X, Send, Users, Bookmark, User, Mail, BookOpen, GraduationCap } from 'lucide-react';

const AnnouncementsModal = ({ onClose }) => {
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("all");
  const [specificRecipient, setSpecificRecipient] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = () => {
    setIsSending(true);
    // Simulate API call
    setTimeout(() => {
      if (recipient === "specific") {
        alert(`Message sent to ${specificRecipient}: ${message}`);
      } else {
        alert(`Message sent to ${recipient}: ${message}`);
      }
      setIsSending(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Mail className="text-blue-600" size={24} />
            <h2 className="text-2xl font-bold text-gray-800">New Announcement</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
            aria-label="Close"
          >
            <X size={24} className="text-gray-500 hover:text-red-500" />
          </button>
        </div>

        {/* Recipient Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Users className="mr-2 text-blue-500" size={18} />
            Recipients
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <button
              onClick={() => setRecipient("all")}
              className={`p-3 rounded-lg border flex flex-col items-center transition-all ${recipient === "all" ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-300 hover:border-blue-300'}`}
            >
              <GraduationCap size={20} className="mb-1" />
              <span>All Students</span>
            </button>
            <button
              onClick={() => setRecipient("teachers")}
              className={`p-3 rounded-lg border flex flex-col items-center transition-all ${recipient === "teachers" ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-300 hover:border-blue-300'}`}
            >
              <User size={20} className="mb-1" />
              <span>All Teachers</span>
            </button>
            <button
              onClick={() => setRecipient("class")}
              className={`p-3 rounded-lg border flex flex-col items-center transition-all ${recipient === "class" ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-300 hover:border-blue-300'}`}
            >
              <BookOpen size={20} className="mb-1" />
              <span>Specific Class</span>
            </button>
            <button
              onClick={() => setRecipient("specific")}
              className={`p-3 rounded-lg border flex flex-col items-center transition-all ${recipient === "specific" ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-300 hover:border-blue-300'}`}
            >
              <Bookmark size={20} className="mb-1" />
              <span>Specific Person</span>
            </button>
          </div>

          {recipient === "specific" && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Enter Name or Email</label>
              <input
                type="text"
                value={specificRecipient}
                onChange={(e) => setSpecificRecipient(e.target.value)}
                placeholder="e.g. john@example.com or John Doe"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
            </div>
          )}

          {recipient === "class" && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Class</label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              >
                <option value="">Select a class</option>
                <option value="math101">Math 101</option>
                <option value="science9">Science 9</option>
                <option value="history11">History 11</option>
              </select>
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Mail className="mr-2 text-blue-500" size={18} />
            Message
          </label>
          <textarea
            className="w-full p-4 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none transition-all duration-200"
            rows="5"
            placeholder="Type your announcement here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ minHeight: '120px' }}
          />
          <div className="text-xs text-gray-500 mt-1">
            {message.length}/500 characters
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200 flex items-center"
            onClick={onClose}
          >
            <X className="mr-2" size={18} />
            Cancel
          </button>
          <button
            className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-white font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center disabled:opacity-70"
            onClick={handleSend}
            disabled={!message || (recipient === "specific" && !specificRecipient) || isSending}
          >
            {isSending ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2" size={18} />
                Send Announcement
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};





const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAnnouncementClick = () => {
    toggleSidebar(); // Close the sidebar (optional)
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  return (
    <div
      className={`bg-gray-800 text-white w-64 min-h-screen fixed z-50 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      } transition-transform duration-300 flex flex-col justify-between`}
    >
      <div>
        <div className="p-4">
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        </div>
        <ul className="space-y-2 p-4">
          <li>
            <Link
              to="/admin"
              className="flex items-center p-2 hover:bg-gray-700 rounded"
              onClick={toggleSidebar}
            >
              <FaHome className="mr-2" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/admin/students"
              className="flex items-center p-2 hover:bg-gray-700 rounded"
              onClick={toggleSidebar}
            >
              <FaUser className="mr-2" />
              Students
            </Link>
          </li>
          <li>
            <Link
              to="/academics"
              className="flex items-center p-2 hover:bg-gray-700 rounded"
              onClick={toggleSidebar}
            >
              <FaBook className="mr-2" />
              Academics
            </Link>
          </li>
          <li>
            <Link
              to="/admin/fee"
              className="flex items-center p-2 hover:bg-gray-700 rounded"
              onClick={toggleSidebar}
            >
              <FaChartLine className="mr-2" />
              Reports
            </Link>
          </li>
          <li>
            <Link
              to="/admin/school-settings"
              className="flex items-center p-2 hover:bg-gray-700 rounded"
              onClick={toggleSidebar}
            >
              <FaCog className="mr-2" />
              School Settings
            </Link>
          </li>
          <li>
            <Link
              to="/admin/teachers"
              className="flex items-center p-2 hover:bg-gray-700 rounded"
              onClick={toggleSidebar}
            >
              <FaCalendarAlt className="mr-2" />
              Teachers
            </Link>
          </li>

          {/* Add Smart Analytics Dashboard Link */}
          <li>
            <Link
              to="/admin/analytics"
              className="flex items-center p-2 hover:bg-gray-700 rounded"
              onClick={toggleSidebar}
            >
              <FaChartBar className="mr-2" />
              Smart Analytics
            </Link>
          </li>

          {/* Add Quick Announcements & Broadcasts Link */}
          <li>
            <button
              className="flex items-center w-full p-2 hover:bg-gray-700 rounded"
              onClick={handleAnnouncementClick}
            >
              <FaBullhorn className="mr-2" />
              Quick Announcements
            </button>
          </li>
        </ul>
      </div>

      {/* Footer with Edusync Version */}
      <div className="p-4 border-t border-gray-700">
        <p className="text-sm text-gray-400 text-center">
          © 2023 Edusync. All rights reserved.
        </p>
        <p className="text-xs text-gray-500 text-center mt-1">
          Version 1.0
        </p>
      </div>

      {/* Render the Modal */}
      {isModalOpen && <AnnouncementsModal onClose={closeModal} />}
    </div>
  );
};

export default Sidebar;