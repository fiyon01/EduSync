import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaIdCard, FaChalkboardTeacher, FaUserShield } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: '', // Will be email or admission number
    password: '',
    role: 'student', // Default role
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleChange = (role) => {
    setFormData({
      ...formData,
      role,
      identifier: '', // Clear identifier when changing roles
      password: ''
    });
  };

  const validateForm = () => {
    if (!formData.identifier) {
      toast.error(
        formData.role === 'student' 
          ? 'Admission number is required' 
          : 'Email is required'
      );
      return false;
    }

    if (!formData.password) {
      toast.error('Password is required');
      return false;
    }

    // Additional validation for email format when not student
    if (formData.role !== 'student' && !/^\S+@\S+\.\S+$/.test(formData.identifier)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      // Prepare the request payload
      const payload = {
        identifier: formData.identifier,
        password: formData.password,
        role: formData.role
      };

      // API call to your authentication endpoint
      const response = await axios.post('http://localhost:3500/api/auth/login', payload);

      // Store the authentication token and user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Show success message
      toast.success(`Welcome, ${response.data.user.name}!`);

      // Redirect based on role
      switch (formData.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'teacher':
          navigate('/teacher/dashboard');
          break;
        case 'student':
          navigate('/student/dashboard');
          break;
        default:
          navigate('/');
      }

    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-96 transform transition-all duration-300 hover:scale-105">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Login
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Login As
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => handleRoleChange('admin')}
                className={`flex-1 p-2 rounded-md transition duration-300 flex flex-col items-center ${
                  formData.role === 'admin'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <FaUserShield className="mb-1" />
                Admin
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('teacher')}
                className={`flex-1 p-2 rounded-md transition duration-300 flex flex-col items-center ${
                  formData.role === 'teacher'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <FaChalkboardTeacher className="mb-1" />
                Teacher
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('student')}
                className={`flex-1 p-2 rounded-md transition duration-300 flex flex-col items-center ${
                  formData.role === 'student'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <FaIdCard className="mb-1" />
                Student
              </button>
            </div>
          </div>

          {/* Identifier Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {formData.role === 'student' ? 'Admission Number' : 'Email'}
            </label>
            <div className="relative">
              <input
                type={formData.role === 'student' ? 'text' : 'email'}
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                placeholder={
                  formData.role === 'student' 
                    ? 'Enter admission number' 
                    : 'Enter your email'
                }
                required
              />
              <span className="absolute left-3 top-3 text-gray-400">
                {formData.role === 'student' ? <FaIdCard /> : <FaEnvelope />}
              </span>
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                placeholder="Enter your password"
                required
              />
              <span className="absolute left-3 top-3 text-gray-400">
                <FaLock />
              </span>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-500 text-white p-2 rounded-md transition duration-300 shadow-md flex justify-center items-center ${
              loading ? 'opacity-70' : 'hover:bg-blue-600'
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : 'Login'}
          </button>
        </form>

        {/* Additional Links */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <a
              href="/register"
              className="text-blue-500 hover:underline transition duration-300"
            >
              Register here
            </a>
          </p>
          <p className="text-gray-600">
            <a
              href="/forgot-password"
              className="text-blue-500 hover:underline transition duration-300"
            >
              Forgot password?
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;