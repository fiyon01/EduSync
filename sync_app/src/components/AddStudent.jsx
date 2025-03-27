import React, { useState } from 'react';
import axios from 'axios';
import { 
  FaUser, FaCalendar, FaVenusMars, FaCamera, FaSave,
  FaIdCard, FaPhone, FaEnvelope, FaUserTie, FaGraduationCap,
  FaSchool, FaMoneyBillWave, FaSpinner
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const AddStudent = ({ schoolId }) => {
  const [formData, setFormData] = useState({
    admissionNumber: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'Male',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    kcpeIndex: '',
    kcpeMarks: '',
    enrollmentDate: new Date().toISOString().split('T')[0], // Default to today
    photo: null,
    feeStatus: 'Pending',
    currentClassId: ''
  });

  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [showClassDropdown, setShowClassDropdown] = useState(false);

  // Fetch classes when component mounts
  React.useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/classes?schoolId=${schoolId}`);
        setClasses(response.data);
      } catch (err) {
        toast.error('Failed to fetch classes');
      }
    };
    fetchClasses();
  }, [schoolId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    for (const key in formData) {
      if (formData[key] !== null && formData[key] !== '') {
        data.append(key, formData[key]);
      }
    }
    data.append('schoolId', schoolId);

    try {
      const response = await axios.post('http://localhost:5000/api/students', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      toast.success('Student added successfully!');
      // Reset form
      setFormData({
        admissionNumber: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: 'Male',
        parentName: '',
        parentPhone: '',
        parentEmail: '',
        kcpeIndex: '',
        kcpeMarks: '',
        enrollmentDate: new Date().toISOString().split('T')[0],
        photo: null,
        feeStatus: 'Pending',
        currentClassId: ''
      });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to add student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-blue-600 flex items-center gap-2">
        <FaUser className="text-blue-500" /> Register New Student
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Admission Number */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Admission Number *</label>
            <div className="relative">
              <input
                type="text"
                name="admissionNumber"
                value={formData.admissionNumber}
                onChange={handleChange}
                className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                required
                placeholder="e.g. ADM2023001"
              />
              <span className="absolute left-3 top-3 text-gray-400">
                <FaIdCard />
              </span>
            </div>
          </div>

          {/* Enrollment Date */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment Date *</label>
            <div className="relative">
              <input
                type="date"
                name="enrollmentDate"
                value={formData.enrollmentDate}
                onChange={handleChange}
                className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                required
              />
              <span className="absolute left-3 top-3 text-gray-400">
                <FaCalendar />
              </span>
            </div>
          </div>

          {/* First Name */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
            <div className="relative">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                required
                placeholder="John"
              />
              <span className="absolute left-3 top-3 text-gray-400">
                <FaUser />
              </span>
            </div>
          </div>

          {/* Last Name */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
            <div className="relative">
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                required
                placeholder="Doe"
              />
              <span className="absolute left-3 top-3 text-gray-400">
                <FaUser />
              </span>
            </div>
          </div>

          {/* Date of Birth */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
            <div className="relative">
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                required
              />
              <span className="absolute left-3 top-3 text-gray-400">
                <FaCalendar />
              </span>
            </div>
          </div>

          {/* Gender */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
            <div className="relative">
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                required
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <span className="absolute left-3 top-3 text-gray-400">
                <FaVenusMars />
              </span>
            </div>
          </div>

          {/* KCPE Index */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">KCPE Index</label>
            <div className="relative">
              <input
                type="text"
                name="kcpeIndex"
                value={formData.kcpeIndex}
                onChange={handleChange}
                className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                placeholder="e.g. 123456789"
              />
              <span className="absolute left-3 top-3 text-gray-400">
                <FaGraduationCap />
              </span>
            </div>
          </div>

          {/* KCPE Marks */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">KCPE Marks</label>
            <div className="relative">
              <input
                type="number"
                name="kcpeMarks"
                value={formData.kcpeMarks}
                onChange={handleChange}
                min="0"
                max="500"
                className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                placeholder="e.g. 350"
              />
              <span className="absolute left-3 top-3 text-gray-400">
                <FaGraduationCap />
              </span>
            </div>
          </div>

          {/* Parent Name */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Parent/Guardian Name *</label>
            <div className="relative">
              <input
                type="text"
                name="parentName"
                value={formData.parentName}
                onChange={handleChange}
                className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                required
                placeholder="Parent's full name"
              />
              <span className="absolute left-3 top-3 text-gray-400">
                <FaUserTie />
              </span>
            </div>
          </div>

          {/* Parent Phone */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Parent Phone *</label>
            <div className="relative">
              <input
                type="tel"
                name="parentPhone"
                value={formData.parentPhone}
                onChange={handleChange}
                className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                required
                placeholder="e.g. 0712345678"
              />
              <span className="absolute left-3 top-3 text-gray-400">
                <FaPhone />
              </span>
            </div>
          </div>

          {/* Parent Email */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Parent Email</label>
            <div className="relative">
              <input
                type="email"
                name="parentEmail"
                value={formData.parentEmail}
                onChange={handleChange}
                className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                placeholder="parent@example.com"
              />
              <span className="absolute left-3 top-3 text-gray-400">
                <FaEnvelope />
              </span>
            </div>
          </div>

          {/* Class Assignment */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Assign to Class</label>
            <div className="relative">
              <select
                name="currentClassId"
                value={formData.currentClassId}
                onChange={handleChange}
                className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
              >
                <option value="">Select Class</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </select>
              <span className="absolute left-3 top-3 text-gray-400">
                <FaSchool />
              </span>
            </div>
          </div>

          {/* Fee Status */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Initial Fee Status</label>
            <div className="relative">
              <select
                name="feeStatus"
                value={formData.feeStatus}
                onChange={handleChange}
                className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
              >
                <option value="Pending">Pending</option>
                <option value="Partial">Partial</option>
                <option value="Completed">Completed</option>
              </select>
              <span className="absolute left-3 top-3 text-gray-400">
                <FaMoneyBillWave />
              </span>
            </div>
          </div>

          {/* Photo Upload */}
          <div className="relative col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Student Photo</label>
            <div className="relative">
              <input
                type="file"
                name="photo"
                onChange={handleFileChange}
                accept="image/*"
                className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <span className="absolute left-3 top-3 text-gray-400">
                <FaCamera />
              </span>
            </div>
            {formData.photo && (
              <div className="mt-2 text-sm text-green-600 flex items-center gap-2">
                <FaCheckCircle /> {formData.photo.name} selected
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-md flex items-center justify-center gap-2 transition duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" /> Processing...
              </>
            ) : (
              <>
                <FaSave /> Register Student
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStudent;