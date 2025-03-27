import React, { useState } from 'react';

const AnnouncementsModal = ({ onClose }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    alert(`Message sent: ${message}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Send Announcement</h2>
        <textarea
          className="w-full p-2 border rounded mb-4"
          rows="4"
          placeholder="Type your announcement..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="flex justify-end">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementsModal;