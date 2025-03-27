import { useState } from 'react';
import { FaSchool, FaUserShield, FaLock, FaEnvelope, FaPhone, FaIdCard, FaVenusMars, FaCamera } from 'react-icons/fa';
import { motion } from 'framer-motion';

const SchoolRegistration = () => {
  const [step, setStep] = useState(1);
  const [schoolData, setSchoolData] = useState({
    name: '',
    code: '',
    motto: '',
    type: 'National',
    category: 'Mixed',
    address: '',
    county: '',
    sub_county: '',
    ward: '',
    phone: '',
    email: '',
    website: '',
    principal_name: '',
    principal_phone: ''
  });

  const [adminData, setAdminData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    phone: '',
    first_name: '',
    last_name: '',
    gender: 'Male',
    id_number: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSchoolChange = (e) => {
    const { name, value } = e.target;
    setSchoolData(prev => ({ ...prev, [name]: value }));
  };

  const handleAdminChange = (e) => {
    const { name, value } = e.target;
    setAdminData(prev => ({ ...prev, [name]: value }));
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    // School validation
    if (!schoolData.name) newErrors.schoolName = 'School name is required';
    if (!schoolData.code) newErrors.schoolCode = 'School code is required';
    if (!schoolData.address) newErrors.address = 'Address is required';
    if (!schoolData.county) newErrors.county = 'County is required';
    if (!schoolData.phone) newErrors.phone = 'Phone number is required';
    
    // Admin validation
    if (!adminData.username) newErrors.username = 'Username is required';
    if (!adminData.password) newErrors.password = 'Password is required';
    if (adminData.password !== adminData.confirmPassword) newErrors.confirmPassword = 'Passwords must match';
    if (!adminData.email) newErrors.email = 'Email is required';
    if (!adminData.first_name) newErrors.first_name = 'First name is required';
    if (!adminData.last_name) newErrors.last_name = 'Last name is required';
    if (!adminData.id_number) newErrors.id_number = 'ID number is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep1()) return;
    
    setIsSubmitting(true);
    try {
      // API call to register school and admin
      const response = await registerSchoolAndAdmin({ schoolData, adminData });
      if (response.success) {
        setStep(2); // Move to profile setup
      }
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="bg-indigo-600 py-4 px-6 flex items-center">
          <FaSchool className="text-white text-3xl mr-3" />
          <h1 className="text-2xl font-bold text-white">School Registration</h1>
        </div>
        
        <div className="p-8">
          <div className="mb-8">
            <div className="flex items-center mb-2">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <h3 className={`ml-3 text-lg font-medium ${step === 1 ? 'text-indigo-600' : 'text-gray-500'}`}>
                School & Admin Information
              </h3>
            </div>
            <div className="flex items-center mb-2">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <h3 className={`ml-3 text-lg font-medium ${step === 2 ? 'text-indigo-600' : 'text-gray-500'}`}>
                School Profile Setup
              </h3>
            </div>
          </div>

          {step === 1 && (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* School Information */}
                <div className="md:col-span-2">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <FaSchool className="mr-2 text-indigo-600" />
                    School Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">School Name *</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="name"
                          value={schoolData.name}
                          onChange={handleSchoolChange}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 ${errors.schoolName ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="e.g. Sunshine Academy"
                        />
                        {errors.schoolName && <p className="mt-1 text-sm text-red-600">{errors.schoolName}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">School Code *</label>
                        <input
                          type="text"
                          name="code"
                          value={schoolData.code}
                          onChange={handleSchoolChange}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 ${errors.schoolCode ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="e.g. 12345"
                        />
                        {errors.schoolCode && <p className="mt-1 text-sm text-red-600">{errors.schoolCode}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Motto</label>
                        <input
                          type="text"
                          name="motto"
                          value={schoolData.motto}
                          onChange={handleSchoolChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="e.g. Excellence in Education"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">School Type *</label>
                        <select
                          name="type"
                          value={schoolData.type}
                          onChange={handleSchoolChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="National">National</option>
                          <option value="Extra-County">Extra-County</option>
                          <option value="County">County</option>
                          <option value="Sub-County">Sub-County</option>
                          <option value="Private">Private</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                        <select
                          name="category"
                          value={schoolData.category}
                          onChange={handleSchoolChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="Boys">Boys</option>
                          <option value="Girls">Girls</option>
                          <option value="Mixed">Mixed</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                      <textarea
                        name="address"
                        value={schoolData.address}
                        onChange={handleSchoolChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                        rows="2"
                        placeholder="Physical address of the school"
                      ></textarea>
                      {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">County *</label>
                        <input
                          type="text"
                          name="county"
                          value={schoolData.county}
                          onChange={handleSchoolChange}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 ${errors.county ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="e.g. Nairobi"
                        />
                        {errors.county && <p className="mt-1 text-sm text-red-600">{errors.county}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sub-County *</label>
                        <input
                          type="text"
                          name="sub_county"
                          value={schoolData.sub_county}
                          onChange={handleSchoolChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="e.g. Westlands"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ward</label>
                        <input
                          type="text"
                          name="ward"
                          value={schoolData.ward}
                          onChange={handleSchoolChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="e.g. Kangemi"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={schoolData.phone}
                          onChange={handleSchoolChange}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="e.g. 0712345678"
                        />
                        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={schoolData.email}
                          onChange={handleSchoolChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="e.g. info@school.edu"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                        <input
                          type="url"
                          name="website"
                          value={schoolData.website}
                          onChange={handleSchoolChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="e.g. https://school.edu"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Principal Name</label>
                        <input
                          type="text"
                          name="principal_name"
                          value={schoolData.principal_name}
                          onChange={handleSchoolChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Principal's full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Principal Phone</label>
                        <input
                          type="tel"
                          name="principal_phone"
                          value={schoolData.principal_phone}
                          onChange={handleSchoolChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="e.g. 0712345678"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Admin Information */}
                <div className="md:col-span-2">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <FaUserShield className="mr-2 text-indigo-600" />
                    Administrator Account
                  </h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                        <input
                          type="text"
                          name="first_name"
                          value={adminData.first_name}
                          onChange={handleAdminChange}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 ${errors.first_name ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="John"
                        />
                        {errors.first_name && <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                        <input
                          type="text"
                          name="last_name"
                          value={adminData.last_name}
                          onChange={handleAdminChange}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 ${errors.last_name ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="Doe"
                        />
                        {errors.last_name && <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500">@</span>
                        </div>
                        <input
                          type="text"
                          name="username"
                          value={adminData.username}
                          onChange={handleAdminChange}
                          className={`pl-7 w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="username"
                        />
                        {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaEnvelope className="text-gray-400" />
                          </div>
                          <input
                            type="email"
                            name="email"
                            value={adminData.email}
                            onChange={handleAdminChange}
                            className={`pl-10 w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="john@example.com"
                          />
                          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaPhone className="text-gray-400" />
                          </div>
                          <input
                            type="tel"
                            name="phone"
                            value={adminData.phone}
                            onChange={handleAdminChange}
                            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="0712345678"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                        <select
                          name="gender"
                          value={adminData.gender}
                          onChange={handleAdminChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ID Number *</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaIdCard className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="id_number"
                            value={adminData.id_number}
                            onChange={handleAdminChange}
                            className={`pl-10 w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 ${errors.id_number ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="National ID/Birth Cert"
                          />
                          {errors.id_number && <p className="mt-1 text-sm text-red-600">{errors.id_number}</p>}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaLock className="text-gray-400" />
                          </div>
                          <input
                            type="password"
                            name="password"
                            value={adminData.password}
                            onChange={handleAdminChange}
                            className={`pl-10 w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="••••••••"
                          />
                          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaLock className="text-gray-400" />
                          </div>
                          <input
                            type="password"
                            name="confirmPassword"
                            value={adminData.confirmPassword}
                            onChange={handleAdminChange}
                            className={`pl-10 w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="••••••••"
                          />
                          {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Continue to Profile Setup
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <SchoolProfileSetup 
              schoolData={schoolData} 
              onComplete={() => setStep(3)} 
            />
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SchoolRegistration;