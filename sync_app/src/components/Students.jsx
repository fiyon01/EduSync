import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaUserPlus, FaUpload, FaList, FaUserCircle } from 'react-icons/fa'; // Import icons
import StudentList from './StudentList';
import BulkUpload from './BulkUpload';
import AddStudent from './AddStudent';
import StudentProfile from './StudentProfile';

const Students = ({ schoolId }) => {
  const { studentId } = useParams(); // Get studentId from URL if viewing a profile
  const [activeSection, setActiveSection] = useState(null);
  const [uploadedStudents, setUploadedStudents] = useState([]); // Store uploaded students

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  // Handle new students uploaded via BulkUpload
  const handleUpload = (newStudents) => {
    console.log("Newly Uploaded Students:", newStudents); // Debugging
    setUploadedStudents((prev) => [...prev, ...newStudents]);
  };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold text-blue-600 flex items-center gap-2">
        <FaUserCircle className="text-blue-500" /> Student Management
      </h1>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 md:gap-4">
        <button
          onClick={() => toggleSection('add')}
          className={`px-4 py-2 rounded-md flex items-center gap-2 transition duration-300 ${
            activeSection === 'add'
              ? 'bg-blue-600 text-white'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          <FaUserPlus /> {activeSection === 'add' ? 'Hide Add Student' : 'Add Student'}
        </button>
        <button
          onClick={() => toggleSection('bulk')}
          className={`px-4 py-2 rounded-md flex items-center gap-2 transition duration-300 ${
            activeSection === 'bulk'
              ? 'bg-green-600 text-white'
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          <FaUpload /> {activeSection === 'bulk' ? 'Hide Bulk Upload' : 'Bulk Upload'}
        </button>
      </div>

      {/* Add Student Form */}
      {activeSection === 'add' && (
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg border border-gray-100">
          <AddStudent schoolId={schoolId} />
        </div>
      )}

      {/* Bulk Upload Form */}
      {activeSection === 'bulk' && (
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg border border-gray-100">
          <BulkUpload schoolId={schoolId} onUpload={handleUpload} />
        </div>
      )}

      {/* Student List */}
      {!studentId && (
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold mb-4 text-blue-600 flex items-center gap-2">
            <FaList className="text-blue-500" /> Student List
          </h2>
          <StudentList uploadedStudents={uploadedStudents} />
        </div>
      )}

      {/* Student Profile */}
      {studentId && (
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg border border-gray-100">
          <StudentProfile studentId={studentId} />
        </div>
      )}
    </div>
  );
};

export default Students;