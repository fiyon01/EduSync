import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaArrowLeft, FaArrowRight, FaSchool, FaUser, FaPhone, FaEnvelope, FaLock, FaClock, FaChartLine, FaImage } from 'react-icons/fa';

const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const [schoolData, setSchoolData] = useState({
    schoolName: '',
    address: '',
    uniqueId: '',
    classDuration: 45,
    gradingSystem: 'Percentage',
    termDuration: 13,
    structureType: 'Term',
    termName: '',
    duration: 13,
    principalName: '',
    contactDetails: '',
    logo: null,
    adminEmail: '',
    adminPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSchoolData({ ...schoolData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleFileChange = (e) => {
    setSchoolData({ ...schoolData, logo: e.target.files[0] });
  };

  const validateStep = () => {
    let isValid = true;
    const newErrors = {};

    if (step === 1) {
      if (!schoolData.schoolName.trim()) {
        newErrors.schoolName = 'School name is required';
        isValid = false;
      }
      if (!schoolData.address.trim()) {
        newErrors.address = 'Address is required';
        isValid = false;
      }
      if (!schoolData.uniqueId.trim()) {
        newErrors.uniqueId = 'Unique ID is required';
        isValid = false;
      }
    } else if (step === 2) {
      if (!schoolData.classDuration || schoolData.classDuration <= 0) {
        newErrors.classDuration = 'Class duration must be greater than 0';
        isValid = false;
      }
    } else if (step === 3) {
      if (!schoolData.principalName.trim()) {
        newErrors.principalName = "Principal's name is required";
        isValid = false;
      }
      if (!schoolData.contactDetails.trim()) {
        newErrors.contactDetails = 'Contact details are required';
        isValid = false;
      }
    } else if (step === 4) {
      if (!schoolData.adminEmail.trim() || !/\S+@\S+\.\S+/.test(schoolData.adminEmail)) {
        newErrors.adminEmail = 'Valid email is required';
        isValid = false;
      }
      if (!schoolData.adminPassword.trim() || schoolData.adminPassword.length < 6) {
        newErrors.adminPassword = 'Password must be at least 6 characters';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep()) {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white shadow-2xl rounded-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
            School Registration & Profile Setup
          </h1>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-green-100 text-green-800 p-4 mb-4 rounded-lg flex items-center">
              <FaCheckCircle className="text-green-600 text-xl mr-2" />
              <span>School registration completed successfully! Redirecting...</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1: School Registration */}
            {step === 1 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">
                  Step 1: School Registration
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      School Name
                    </label>
                    <div className="relative">
                      <FaSchool className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        name="schoolName"
                        value={schoolData.schoolName}
                        onChange={handleChange}
                        className={`pl-10 w-full px-4 py-2 border ${
                          errors.schoolName ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="Enter school name"
                        required
                      />
                    </div>
                    {errors.schoolName && (
                      <p className="text-red-500 text-sm mt-1">{errors.schoolName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <div className="relative">
                      <FaSchool className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        name="address"
                        value={schoolData.address}
                        onChange={handleChange}
                        className={`pl-10 w-full px-4 py-2 border ${
                          errors.address ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="Enter school address"
                        required
                      />
                    </div>
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unique School ID
                    </label>
                    <div className="relative">
                      <FaSchool className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        name="uniqueId"
                        value={schoolData.uniqueId}
                        onChange={handleChange}
                        className={`pl-10 w-full px-4 py-2 border ${
                          errors.uniqueId ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="Enter unique ID"
                        required
                      />
                    </div>
                    {errors.uniqueId && (
                      <p className="text-red-500 text-sm mt-1">{errors.uniqueId}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: School Settings */}
            {step === 2 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">
                  Step 2: School Settings
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Class Duration (minutes)
                    </label>
                    <div className="relative">
                      <FaClock className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="number"
                        name="classDuration"
                        value={schoolData.classDuration}
                        onChange={handleChange}
                        className={`pl-10 w-full px-4 py-2 border ${
                          errors.classDuration ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="Enter class duration"
                        required
                      />
                    </div>
                    {errors.classDuration && (
                      <p className="text-red-500 text-sm mt-1">{errors.classDuration}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grading System
                    </label>
                    <div className="relative">
                      <FaChartLine className="absolute left-3 top-3 text-gray-400" />
                      <select
                        name="gradingSystem"
                        value={schoolData.gradingSystem}
                        onChange={handleChange}
                        className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Percentage">Percentage</option>
                        <option value="GPA">GPA</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: School Profile */}
            {step === 3 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">
                  Step 3: School Profile
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Principal's Name
                    </label>
                    <div className="relative">
                      <FaUser className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        name="principalName"
                        value={schoolData.principalName}
                        onChange={handleChange}
                        className={`pl-10 w-full px-4 py-2 border ${
                          errors.principalName ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="Enter principal's name"
                        required
                      />
                    </div>
                    {errors.principalName && (
                      <p className="text-red-500 text-sm mt-1">{errors.principalName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Details
                    </label>
                    <div className="relative">
                      <FaPhone className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        name="contactDetails"
                        value={schoolData.contactDetails}
                        onChange={handleChange}
                        className={`pl-10 w-full px-4 py-2 border ${
                          errors.contactDetails ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="Enter contact details"
                        required
                      />
                    </div>
                    {errors.contactDetails && (
                      <p className="text-red-500 text-sm mt-1">{errors.contactDetails}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      School Logo
                    </label>
                    <div className="relative">
                      <FaImage className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        accept="image/*"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Admin Account Creation */}
            {step === 4 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">
                  Step 4: Admin Account Creation
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Admin Email
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="email"
                        name="adminEmail"
                        value={schoolData.adminEmail}
                        onChange={handleChange}
                        className={`pl-10 w-full px-4 py-2 border ${
                          errors.adminEmail ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="Enter admin email"
                        required
                      />
                    </div>
                    {errors.adminEmail && (
                      <p className="text-red-500 text-sm mt-1">{errors.adminEmail}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Admin Password
                    </label>
                    <div className="relative">
                      <FaLock className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="password"
                        name="adminPassword"
                        value={schoolData.adminPassword}
                        onChange={handleChange}
                        className={`pl-10 w-full px-4 py-2 border ${
                          errors.adminPassword ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="Enter admin password"
                        required
                      />
                    </div>
                    {errors.adminPassword && (
                      <p className="text-red-500 text-sm mt-1">{errors.adminPassword}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 flex items-center transition duration-300"
                >
                  <FaArrowLeft className="mr-2" /> Previous
                </button>
              )}
              {step < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 flex items-center transition duration-300"
                >
                  Next <FaArrowRight className="ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-300"
                >
                  Submit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MultiStepForm;