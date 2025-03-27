import React, { useState, useEffect } from 'react';
import { 
  FaEye, FaEdit, FaTrash, FaCheckCircle, FaTimesCircle,
  FaUserGraduate, FaPhone, FaUserTie, FaSearch, 
  FaPlus, FaSpinner, FaExclamationTriangle, FaTimes,
  FaIdCard, FaEnvelope, FaSchool, FaInfoCircle, FaMoneyBillWave
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // New student form state
  const [newStudent, setNewStudent] = useState({
    first_name: '',
    last_name: '',
    admission_number: '',
    email: '',
    class_id: '',
    parent_name: '',
    parent_email: '',
    parent_phone: ''
  });

  // Fetch students from API
  useEffect(() => {
    const fetchStudents = async () => {
      const schoolId = localStorage.getItem("schoolId");
      try {
        const response = await fetch(`http://localhost:3500/api/students?schoolId=${schoolId}`);
        const data = await response.json();
        
        if (response.ok) {
          setStudents(data);
        } else {
          setError(data.message || 'Failed to fetch students');
          toast.error(data.message || 'Failed to fetch students');
        }
      } catch (err) {
        setError('Network error. Please try again.');
        toast.error('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudents();
  }, []);

  // Handle student deletion
  const handleDelete = async () => {
    if (!selectedStudent) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`http://localhost:3500/api/students/${selectedStudent.user_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        setStudents(prev => prev.filter(s => s.user_id !== selectedStudent.user_id));
        toast.success('Student deleted successfully');
        setDeleteModalOpen(false);
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to delete student');
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
    } finally {
      setIsDeleting(false);
      setSelectedStudent(null);
    }
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    if (!selectedStudent) return;
    
    setIsSaving(true);
    try {
      // Here you would typically make an API call to save changes
      // For now, we'll just simulate a successful save
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Student updated successfully');
      setEditModalOpen(false);
    } catch (err) {
      toast.error('Failed to update student');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle add new student
  const handleAddStudent = async () => {
    setIsSaving(true);
    try {
      // Here you would typically make an API call to add a new student
      // For now, we'll just simulate a successful add
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a mock student object with a random ID
      const mockStudent = {
        user_id: Math.floor(Math.random() * 10000),
        ...newStudent,
        class_name: 'Form 1', // This would come from your API
        is_active: true,
        fee_items: []
      };
      
      setStudents(prev => [...prev, mockStudent]);
      toast.success('Student added successfully');
      setAddModalOpen(false);
      setNewStudent({
        first_name: '',
        last_name: '',
        admission_number: '',
        email: '',
        class_id: '',
        parent_name: '',
        parent_email: '',
        parent_phone: ''
      });
    } catch (err) {
      toast.error('Failed to add student');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle input change for new student form
  const handleNewStudentChange = (e) => {
    const { name, value } = e.target;
    setNewStudent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Calculate fee status
  const getFeeStatus = (student) => {
    const totalExpected = student.fee_items?.reduce((sum, item) => sum + item.amount_expected, 0) || 0;
    const totalPaid = student.fee_items?.reduce((sum, item) => sum + item.amount_paid, 0) || 0;
    
    if (totalPaid >= totalExpected) {
      return { 
        status: 'Paid', 
        class: 'bg-green-100 text-green-800',
        icon: <FaCheckCircle className="text-green-500" />
      };
    } else if (totalPaid > 0) {
      return { 
        status: `Ksh ${(totalExpected - totalPaid).toLocaleString()} Due`, 
        class: 'bg-yellow-100 text-yellow-800',
        icon: <FaCheckCircle className="text-yellow-500" />
      };
    }
    return { 
      status: `Ksh ${totalExpected.toLocaleString()} Due`, 
      class: 'bg-red-100 text-red-800',
      icon: <FaTimesCircle className="text-red-500" />
    };
  };

  // Filter students based on search term
  const filteredStudents = students.filter(student => {
    const searchLower = searchTerm.toLowerCase();
    return (
      student.admission_number.toLowerCase().includes(searchLower) ||
      student.first_name.toLowerCase().includes(searchLower) ||
      student.last_name.toLowerCase().includes(searchLower) ||
      (student.parent_name && student.parent_name.toLowerCase().includes(searchLower)) ||
      (student.parent_phone && student.parent_phone.includes(searchTerm))
    );
  });

  // Open modal handlers
  const openViewModal = (student) => {
    setSelectedStudent(student);
    setViewModalOpen(true);
  };

  const openEditModal = (student) => {
    setSelectedStudent(student);
    setEditModalOpen(true);
  };

  const openDeleteModal = (student) => {
    setSelectedStudent(student);
    setDeleteModalOpen(true);
  };

  const openAddModal = () => {
    setAddModalOpen(true);
  };

  if (loading && students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <FaSpinner className="animate-spin text-blue-500 text-4xl mb-4" />
        <p className="text-gray-600">Loading students...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
        <div className="flex items-center">
          <FaExclamationTriangle className="text-red-500 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Error loading students</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaUserGraduate className="text-blue-600" /> Student Records
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            {students.length} {students.length !== 1 ? 'students' : 'student'} registered
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, admission no, or parent..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button
            onClick={openAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-colors duration-200 text-sm"
          >
            <FaPlus size={14} /> Add Student
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-xs">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <FaIdCard size={12} /> Admission No
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <FaSchool size={12} /> Class
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <FaUserTie size={12} /> Parent
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <FaPhone size={12} /> Contact
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fee Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => {
                const feeStatus = getFeeStatus(student);
                
                return (
                  <tr 
                    key={student.user_id} 
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {student.admission_number}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {student.first_name} {student.last_name}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <FaEnvelope size={10} /> {student.email || 'No email'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        student.class_name ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {student.class_name || 'Not assigned'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {student.parent_name || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {student.parent_email || 'No email'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.parent_phone || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${feeStatus.class}`}>
                        {feeStatus.icon}
                        {feeStatus.status}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${
                        student.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {student.is_active ? (
                          <FaCheckCircle className="text-green-500" />
                        ) : (
                          <FaTimesCircle className="text-gray-500" />
                        )}
                        {student.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openViewModal(student)}
                          className="text-blue-600 hover:text-blue-900 transition-colors duration-200 p-1 rounded hover:bg-blue-50"
                          title="View details"
                        >
                          <FaEye size={16} />
                        </button>
                        <button
                          onClick={() => openEditModal(student)}
                          className="text-yellow-600 hover:text-yellow-900 transition-colors duration-200 p-1 rounded hover:bg-yellow-50"
                          title="Edit student"
                        >
                          <FaEdit size={16} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(student)}
                          disabled={isDeleting}
                          className="text-red-600 hover:text-red-900 transition-colors duration-200 p-1 rounded hover:bg-red-50 disabled:opacity-50"
                          title="Delete student"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <FaUserGraduate className="text-4xl mb-3 text-gray-300" />
                    <h3 className="text-lg font-medium mb-1">No students found</h3>
                    <p className="max-w-md mx-auto text-sm">
                      {searchTerm ? 'No students match your search criteria.' : 'Get started by adding your first student.'}
                    </p>
                    {!searchTerm && (
                      <button
                        onClick={openAddModal}
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <FaPlus className="mr-2" size={12} /> Add Student
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Student Modal */}
      {viewModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white z-10">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FaUserGraduate className="text-blue-600" />
                Student Details
              </h3>
              <button 
                onClick={() => setViewModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FaTimes />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <FaInfoCircle className="text-blue-500" />
                    Personal Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-gray-500">Full Name</p>
                      <p className="text-sm">{selectedStudent.first_name} {selectedStudent.last_name}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Admission Number</p>
                      <p className="text-sm">{selectedStudent.admission_number}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Class</p>
                      <p className="text-sm">{selectedStudent.class_name || 'Not assigned'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Email</p>
                      <p className="text-sm">{selectedStudent.email || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <FaUserTie className="text-blue-500" />
                    Parent/Guardian Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-gray-500">Name</p>
                      <p className="text-sm">{selectedStudent.parent_name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Email</p>
                      <p className="text-sm">{selectedStudent.parent_email || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Phone</p>
                      <p className="text-sm">{selectedStudent.parent_phone || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <FaMoneyBillWave className="text-blue-500" />
                  Fee Information
                </h4>
                {selectedStudent.fee_items?.length > 0 ? (
                  <div className="border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fee Item</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Expected</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Paid</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedStudent.fee_items.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">Ksh {item.amount_expected.toLocaleString()}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">Ksh {item.amount_paid.toLocaleString()}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">Ksh {(item.amount_expected - item.amount_paid).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No fee information available</p>
                )}
              </div>
            </div>
            <div className="border-t p-4 flex justify-end sticky bottom-0 bg-white">
              <button
                onClick={() => setViewModalOpen(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {editModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white z-10">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FaEdit className="text-blue-600" />
                Edit Student
              </h3>
              <button 
                onClick={() => setEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FaTimes />
              </button>
            </div>
            <div className="p-6">
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                      <input
                        type="text"
                        defaultValue={selectedStudent.first_name}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                      <input
                        type="text"
                        defaultValue={selectedStudent.last_name}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Admission Number *</label>
                      <input
                        type="text"
                        defaultValue={selectedStudent.admission_number}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Parent Name</label>
                      <input
                        type="text"
                        defaultValue={selectedStudent.parent_name || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Parent Email</label>
                      <input
                        type="email"
                        defaultValue={selectedStudent.parent_email || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Parent Phone</label>
                      <input
                        type="tel"
                        defaultValue={selectedStudent.parent_phone || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="border-t p-4 flex justify-end space-x-3 sticky bottom-0 bg-white">
              <button
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FaExclamationTriangle className="text-red-500" />
                Confirm Deletion
              </h3>
              <button 
                onClick={() => setDeleteModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FaTimes />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to permanently delete <span className="font-semibold">{selectedStudent.first_name} {selectedStudent.last_name}</span> (Adm: {selectedStudent.admission_number})? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete Student'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Student Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white z-10">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FaUserGraduate className="text-blue-600" />
                Add New Student
              </h3>
              <button 
                onClick={() => setAddModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FaTimes />
              </button>
            </div>
            <div className="p-6">
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                      <input
                        type="text"
                        name="first_name"
                        value={newStudent.first_name}
                        onChange={handleNewStudentChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                      <input
                        type="text"
                        name="last_name"
                        value={newStudent.last_name}
                        onChange={handleNewStudentChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Admission Number *</label>
                      <input
                        type="text"
                        name="admission_number"
                        value={newStudent.admission_number}
                        onChange={handleNewStudentChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={newStudent.email}
                        onChange={handleNewStudentChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                      <select
                        name="class_id"
                        value={newStudent.class_id}
                        onChange={handleNewStudentChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Class</option>
                        <option value="1">Form 1</option>
                        <option value="2">Form 2</option>
                        <option value="3">Form 3</option>
                        <option value="4">Form 4</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Parent Name</label>
                      <input
                        type="text"
                        name="parent_name"
                        value={newStudent.parent_name}
                        onChange={handleNewStudentChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Parent Email</label>
                      <input
                        type="email"
                        name="parent_email"
                        value={newStudent.parent_email}
                        onChange={handleNewStudentChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Parent Phone</label>
                      <input
                        type="tel"
                        name="parent_phone"
                        value={newStudent.parent_phone}
                        onChange={handleNewStudentChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="border-t p-4 flex justify-end space-x-3 sticky bottom-0 bg-white">
              <button
                onClick={() => setAddModalOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                onClick={handleAddStudent}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Adding...
                  </>
                ) : (
                  'Add Student'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;