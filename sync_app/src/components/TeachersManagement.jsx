import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaCheckCircle,
  FaTimesCircle,
  FaPhone,
  FaEnvelope,
  FaArrowLeft,
  FaArrowRight,
  FaSpinner,
  FaIdCard,
  FaBook,
  FaUsers,
} from "react-icons/fa";
import { toast } from "react-toastify";

const TeachersManagement = ({ schoolId }) => {
  // State for teachers
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);

  // State for adding/editing teachers
  const [teacherForm, setTeacherForm] = useState({
    id: null,
    user_id: null,
    tsc_number: "",
    employment_type: "TSC",
    qualification: "",
    subjects_specialization: [],
    is_class_teacher: false,
    class_teacher_for: null,
  });

  // State for user details (from users table)
  const [userDetails, setUserDetails] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    profile_picture_url: "",
  });

  // State for search functionality
  const [searchQuery, setSearchQuery] = useState("");

  // State for modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const teachersPerPage = 6;

 // Fetch data from database with error handling
 useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all necessary data with proper error handling
      const [teachersRes, classesRes, subjectsRes] = await Promise.all([
        axios.get(`/api/teachers`, { 
          params: { 
            schoolId,
            includeUser: true,
            includeClass: true 
          } 
        }).catch(() => ({ data: [] })), // Fallback to empty array on error
        axios.get(`/api/classes`, { params: { schoolId } }).catch(() => ({ data: [] })),
        axios.get(`/api/subjects`, { params: { schoolId } }).catch(() => ({ data: [] }))
      ]);

      setTeachers(Array.isArray(teachersRes.data) ? teachersRes.data : []);
      setClasses(Array.isArray(classesRes.data) ? classesRes.data : []);
      setSubjects(Array.isArray(subjectsRes.data) ? subjectsRes.data : []);
      
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Failed to load teacher data');
      toast.error('Failed to load teacher data');
      // Ensure we have empty arrays even on error
      setTeachers([]);
      setClasses([]);
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [schoolId]);


  // Handle adding/editing teachers
  const handleTeacherFormSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!userDetails.first_name || !userDetails.last_name || !userDetails.email) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      if (teacherForm.id) {
        // Update existing teacher
        const response = await axios.put(`/api/teachers/${teacherForm.id}`, {
          ...teacherForm,
          school_id: schoolId,
          user: userDetails
        });
        
        setTeachers(teachers.map(t => 
          t.id === teacherForm.id ? response.data : t
        ));
        toast.success("Teacher updated successfully");
      } else {
        // Create new teacher
        const response = await axios.post('/api/teachers', {
          ...teacherForm,
          school_id: schoolId,
          user: userDetails
        });
        
        setTeachers([...teachers, response.data]);
        toast.success("Teacher added successfully");
      }

      // Reset form
      setTeacherForm({
        id: null,
        user_id: null,
        tsc_number: "",
        employment_type: "TSC",
        qualification: "",
        subjects_specialization: [],
        is_class_teacher: false,
        class_teacher_for: null,
      });
      
      setUserDetails({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        profile_picture_url: "",
      });
      
      setIsModalOpen(false);
      
    } catch (err) {
      console.error('Failed to save teacher:', err);
      toast.error('Failed to save teacher');
    }
  };

  // Handle deleting teachers
  const handleDeleteTeacher = async (id) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      try {
        await axios.delete(`/api/teachers/${id}`);
        setTeachers(teachers.filter((t) => t.id !== id));
        toast.success("Teacher deleted successfully");
      } catch (err) {
        console.error('Failed to delete teacher:', err);
        toast.error('Failed to delete teacher');
      }
    }
  };

  // Handle editing teachers
  const handleEditTeacher = (teacher) => {
    setTeacherForm({
      id: teacher.id,
      user_id: teacher.user_id,
      tsc_number: teacher.tsc_number,
      employment_type: teacher.employment_type,
      qualification: teacher.qualification,
      subjects_specialization: teacher.subjects_specialization?.split(',') || [],
      is_class_teacher: teacher.is_class_teacher,
      class_teacher_for: teacher.class_teacher_for,
    });
    
    setUserDetails({
      first_name: teacher.user?.first_name || "",
      last_name: teacher.user?.last_name || "",
      email: teacher.user?.email || "",
      phone: teacher.user?.phone || "",
      profile_picture_url: teacher.user?.profile_picture_url || "",
    });
    
    setIsModalOpen(true);
  };

  // Handle assigning class teacher
  const handleAssignClassTeacher = async (teacherId, classId) => {
    try {
      const response = await axios.put(`/api/teachers/${teacherId}/assign-class`, {
        class_id: classId,
        school_id: schoolId
      });
      
      setTeachers(teachers.map(t => 
        t.id === teacherId 
          ? { ...t, is_class_teacher: true, class_teacher_for: classId }
          : t.class_teacher_for === classId
            ? { ...t, is_class_teacher: false, class_teacher_for: null }
            : t
      ));
      
      toast.success("Class teacher assigned successfully");
    } catch (err) {
      console.error('Failed to assign class teacher:', err);
      toast.error('Failed to assign class teacher');
    }
  };

 // Filter teachers based on search query with null checks
 const filteredTeachers = (Array.isArray(teachers) ? teachers : []).filter((teacher) => {
  const user = teacher.user || {};
  const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
  const tscNumber = teacher.tsc_number || '';
  return fullName.includes(searchQuery.toLowerCase()) || 
         tscNumber.toLowerCase().includes(searchQuery.toLowerCase());
});

  // Pagination logic
  const indexOfLastTeacher = currentPage * teachersPerPage;
  const indexOfFirstTeacher = indexOfLastTeacher - teachersPerPage;
  const currentTeachers = filteredTeachers.slice(
    indexOfFirstTeacher,
    indexOfLastTeacher
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Open modal for adding a new teacher
  const openAddTeacherModal = () => {
    setTeacherForm({
      id: null,
      user_id: null,
      tsc_number: "",
      employment_type: "TSC",
      qualification: "",
      subjects_specialization: [],
      is_class_teacher: false,
      class_teacher_for: null,
    });
    
    setUserDetails({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      profile_picture_url: "",
    });
    
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
        <span className="ml-2">Loading teachers...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-blue-600 flex items-center gap-2">
        <FaChalkboardTeacher className="text-blue-500" /> Teachers Management
      </h1>

      {/* Search Bar */}
      <div className="mb-6 p-6 bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search teachers by name or TSC number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 pl-10 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Teachers List */}
      <div className="mb-6 p-6 bg-white rounded-lg shadow-lg border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaChalkboardTeacher className="text-blue-500" /> Teachers List
        </h2>
        
        {filteredTeachers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No teachers found matching your search criteria
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentTeachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={teacher.user?.profile_picture_url || "https://via.placeholder.com/150"}
                      alt={`${teacher.user?.first_name} ${teacher.user?.last_name}`}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-semibold">
                        {teacher.user?.first_name} {teacher.user?.last_name}
                      </h3>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <FaIdCard className="text-gray-500" /> {teacher.tsc_number || 'No TSC number'}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <FaPhone className="text-gray-500" /> {teacher.user?.phone || 'No phone'}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <FaEnvelope className="text-gray-500" /> {teacher.user?.email}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Employment Type:</span> {teacher.employment_type}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Qualification:</span> {teacher.qualification || 'Not specified'}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Subjects:</span> {teacher.subjects_specialization?.split(',').join(', ') || 'Not specified'}
                    </p>
                    {teacher.is_class_teacher && teacher.class_teacher_for && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Class Teacher:</span>{" "}
                        <span className="text-green-600 flex items-center gap-1">
                          <FaCheckCircle /> {
                            classes.find(c => c.id === teacher.class_teacher_for)?.name || 
                            `Class ${teacher.class_teacher_for}`
                          }
                        </span>
                      </p>
                    )}
                  </div>
                  <div className="mt-4 flex gap-2 flex-wrap">
                    <button
                      onClick={() => handleEditTeacher(teacher)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTeacher(teacher.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-1"
                    >
                      <FaTrash /> Delete
                    </button>
                    {!teacher.is_class_teacher && (
                      <select
                        onChange={(e) => handleAssignClassTeacher(teacher.id, e.target.value)}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                        defaultValue=""
                      >
                        <option value="" disabled>Assign Class</option>
                        {classes.map(cls => (
                          <option key={cls.id} value={cls.id}>
                            {cls.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {filteredTeachers.length > teachersPerPage && (
              <div className="mt-6 flex justify-center items-center gap-4">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <FaArrowLeft />
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {Math.ceil(filteredTeachers.length / teachersPerPage)}
                </span>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={
                    currentPage === Math.ceil(filteredTeachers.length / teachersPerPage)
                  }
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <FaArrowRight />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Floating Add Teacher Button */}
      <button
        onClick={openAddTeacherModal}
        className="fixed bottom-6 right-6 p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300"
      >
        <FaPlus className="text-2xl" />
      </button>

      {/* Add/Edit Teacher Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaPlus className="text-blue-500" />{" "}
              {teacherForm.id ? "Edit Teacher" : "Add Teacher"}
            </h2>
            <form onSubmit={handleTeacherFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* User Details */}
                <div className="space-y-4">
                  <h3 className="font-medium text-blue-600 flex items-center gap-2">
                    <FaUserGraduate /> Personal Information
                  </h3>
                  
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-600 flex items-center gap-2">
                      <FaUserGraduate className="text-gray-500" /> First Name*
                    </label>
                    <input
                      type="text"
                      placeholder="Enter first name"
                      value={userDetails.first_name}
                      onChange={(e) =>
                        setUserDetails({ ...userDetails, first_name: e.target.value })
                      }
                      className="p-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-600 flex items-center gap-2">
                      <FaUserGraduate className="text-gray-500" /> Last Name*
                    </label>
                    <input
                      type="text"
                      placeholder="Enter last name"
                      value={userDetails.last_name}
                      onChange={(e) =>
                        setUserDetails({ ...userDetails, last_name: e.target.value })
                      }
                      className="p-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-600 flex items-center gap-2">
                      <FaEnvelope className="text-gray-500" /> Email*
                    </label>
                    <input
                      type="email"
                      placeholder="Enter email"
                      value={userDetails.email}
                      onChange={(e) =>
                        setUserDetails({ ...userDetails, email: e.target.value })
                      }
                      className="p-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-600 flex items-center gap-2">
                      <FaPhone className="text-gray-500" /> Phone
                    </label>
                    <input
                      type="text"
                      placeholder="Enter phone number"
                      value={userDetails.phone}
                      onChange={(e) =>
                        setUserDetails({ ...userDetails, phone: e.target.value })
                      }
                      className="p-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-600 flex items-center gap-2">
                      <FaUserGraduate className="text-gray-500" /> Profile Picture URL
                    </label>
                    <input
                      type="text"
                      placeholder="Enter photo URL"
                      value={userDetails.profile_picture_url}
                      onChange={(e) =>
                        setUserDetails({ ...userDetails, profile_picture_url: e.target.value })
                      }
                      className="p-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Teacher Details */}
                <div className="space-y-4">
                  <h3 className="font-medium text-blue-600 flex items-center gap-2">
                    <FaChalkboardTeacher /> Professional Information
                  </h3>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-600 flex items-center gap-2">
                      <FaIdCard className="text-gray-500" /> TSC Number
                    </label>
                    <input
                      type="text"
                      placeholder="Enter TSC number"
                      value={teacherForm.tsc_number}
                      onChange={(e) =>
                        setTeacherForm({ ...teacherForm, tsc_number: e.target.value })
                      }
                      className="p-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-600 flex items-center gap-2">
                      <FaChalkboardTeacher className="text-gray-500" /> Employment Type
                    </label>
                    <select
                      value={teacherForm.employment_type}
                      onChange={(e) =>
                        setTeacherForm({ ...teacherForm, employment_type: e.target.value })
                      }
                      className="p-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="TSC">TSC</option>
                      <option value="BOM">BOM</option>
                      <option value="PTA">PTA</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-600 flex items-center gap-2">
                      <FaBook className="text-gray-500" /> Qualification
                    </label>
                    <input
                      type="text"
                      placeholder="Enter qualification"
                      value={teacherForm.qualification}
                      onChange={(e) =>
                        setTeacherForm({ ...teacherForm, qualification: e.target.value })
                      }
                      className="p-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-600 flex items-center gap-2">
                      <FaBook className="text-gray-500" /> Subjects (comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="Math, English, etc."
                      value={teacherForm.subjects_specialization.join(', ')}
                      onChange={(e) =>
                        setTeacherForm({
                          ...teacherForm,
                          subjects_specialization: e.target.value.split(',').map(s => s.trim()),
                        })
                      }
                      className="p-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={teacherForm.is_class_teacher}
                      onChange={(e) =>
                        setTeacherForm({
                          ...teacherForm,
                          is_class_teacher: e.target.checked,
                        })
                      }
                      className="rounded focus:ring-blue-500"
                    />
                    <label className="text-sm text-gray-600">Is Class Teacher</label>
                  </div>

                  {teacherForm.is_class_teacher && (
                    <div className="flex flex-col gap-1">
                      <label className="text-sm text-gray-600 flex items-center gap-2">
                        <FaUsers className="text-gray-500" /> Class Teacher For
                      </label>
                      <select
                        value={teacherForm.class_teacher_for || ''}
                        onChange={(e) =>
                          setTeacherForm({
                            ...teacherForm,
                            class_teacher_for: e.target.value || null,
                          })
                        }
                        className="p-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Class</option>
                        {classes.map(cls => (
                          <option key={cls.id} value={cls.id}>
                            {cls.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
                >
                  <FaPlus /> {teacherForm.id ? "Update Teacher" : "Add Teacher"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeachersManagement;