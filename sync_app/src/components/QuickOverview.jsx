import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaUserGraduate, FaChalkboardTeacher, FaDollarSign, FaChartLine,
  FaClock, FaMoneyCheckAlt, FaCheckCircle, FaExclamationCircle,
  FaSadTear, FaSpinner, FaSignOutAlt,FaSignInAlt,FaBell, FaBook
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const OverviewDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentPayments, setRecentPayments] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: '',
    role: 'admin'
  });

  // Initialize axios with token from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  // Handle login form changes
  const handleLoginChange = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value
    });
  };

  // Handle login submission
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3500/api/auth/login', {
        identifier: loginForm.username,
        password: loginForm.password,
        role: loginForm.role
      });
      
      // Store token and schoolId from response
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('schoolId', response.data.schoolId);
      
      // Set axios default headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      toast.success('Login successful');
      window.location.reload(); // Refresh to load dashboard
    } catch (err) {
      console.error('Login failed:', err);
      const errorMsg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(errorMsg);
      setError(errorMsg);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('schoolId');
    delete axios.defaults.headers.common['Authorization'];
    window.location.href = '/login';
    toast.info('Logged out successfully');
  };

  // Fetch all dashboard data
  const fetchAllData = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const schoolId = localStorage.getItem('schoolId');

      if (!token || !schoolId) {
        throw new Error('Authentication required');
      }

      const [statsRes, paymentsRes, activitiesRes] = await Promise.all([
        axios.get(`http://localhost:3500/api/dashboard/stats?schoolId=${schoolId}`),
        axios.get(`http://localhost:3500/api/fee-payments/recent?schoolId=${schoolId}&limit=5`)
          .catch(() => ({ data: [] })),
        axios.get(`http://localhost:3500/api/activities/recent?schoolId=${schoolId}&limit=5`)
          .catch(() => ({ data: [] }))
      ]);

      setStats(statsRes.data);
      
      // Transform payments data
      const transformedPayments = paymentsRes.data.map(payment => ({
        id: payment.id,
        student_name: payment.student?.user?.first_name
          ? `${payment.student.user.first_name} ${payment.student.user.last_name}`
          : 'Unknown Student',
        admission_number: payment.student?.admission_number || 'N/A',
        amount: payment.amount,
        payment_date: payment.payment_date,
        payment_method: payment.payment_method,
        status: 'completed',
        received_by: payment.received_by_user?.first_name
          ? `${payment.received_by_user.first_name} ${payment.received_by_user.last_name}`
          : 'System'
      }));
      
      setRecentPayments(transformedPayments);
      setRecentActivities(activitiesRes.data);

    } catch (err) {
      console.error('Failed to fetch data:', err);
      const errorMsg = err.response?.data?.error || err.message || 'Failed to load dashboard data';
      toast.error(errorMsg);
      setError(errorMsg);
      
      if (err.response?.status === 403) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  // Check authentication and fetch data on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const schoolId = localStorage.getItem('schoolId');
    
    if (token && schoolId) {
      fetchAllData();
    }
  }, []);

  // Activity icons mapping
  const activityIcons = {
    'student_registration': <FaUserGraduate className="text-blue-500 text-xl" />,
    'payment_received': <FaMoneyCheckAlt className="text-green-500 text-xl" />,
    'exam_result': <FaBook className="text-purple-500 text-xl" />,
    'announcement': <FaBell className="text-yellow-500 text-xl" />,
    'fee_payment': <FaMoneyCheckAlt className="text-green-500 text-xl" />
  };

  // Process stats data from API
  const processedStats = stats ? [
    {
      title: 'Total Students',
      value: stats.totalStudents,
      color: 'bg-blue-500',
      icon: <FaUserGraduate className="text-3xl" />,
      trend: stats.studentTrend,
      trendColor: stats.studentTrend?.startsWith('+') ? 'text-green-300' : 'text-red-300',
      description: 'Compared to last term',
    },
    {
      title: 'Active Teachers',
      value: stats.totalTeachers,
      color: 'bg-green-500',
      icon: <FaChalkboardTeacher className="text-3xl" />,
      trend: stats.teacherTrend,
      trendColor: stats.teacherTrend?.startsWith('+') ? 'text-green-300' : 'text-red-300',
      description: 'Compared to last term',
    },
    {
      title: 'Fee Balance',
      value: `KSh ${stats.totalFeeBalance?.toLocaleString() || '0'}`,
      color: 'bg-yellow-500',
      icon: <FaDollarSign className="text-3xl" />,
      trend: stats.feeTrend,
      trendColor: stats.feeTrend?.startsWith('+') ? 'text-green-300' : 'text-red-300',
      description: 'Outstanding balance',
    },
    {
      title: 'Attendance Rate',
      value: `${stats.attendanceRate}%`,
      color: 'bg-purple-500',
      icon: <FaChartLine className="text-3xl" />,
      progress: stats.attendanceRate,
      description: 'Current term average',
    }
  ] : [];

  // Check if user is authenticated
  const isAuthenticated = !!localStorage.getItem('token');

  // Login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-600 mb-2">School Management System</h1>
            <p className="text-gray-600">Please sign in to access the dashboard</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username/Email
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={loginForm.username}
                onChange={handleLoginChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={loginForm.password}
                onChange={handleLoginChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={loginForm.role}
                onChange={handleLoginChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="admin">Admin</option>
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
              </select>
            </div>
            
            <div>
              <button
                type="submit"
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FaSignInAlt className="mr-2" />
                Sign In
              </button>
            </div>
          </form>
          
          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center">
              <FaExclamationCircle className="mr-2" />
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-500 mb-4 mx-auto" />
          <p className="text-lg text-gray-700">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow">
          <FaExclamationCircle className="text-4xl text-red-500 mb-4 mx-auto" />
          <h3 className="text-xl font-semibold text-red-600 mb-2">Error Loading Data</h3>
          <p className="text-gray-700 mb-4">{error}</p>
          <div className="space-y-3">
            <button
              onClick={fetchAllData}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Login Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main dashboard view
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">School Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, Admin</span>
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {processedStats.map((stat, index) => (
            <div
              key={index}
              className={`p-6 rounded-lg text-white ${stat.color} hover:shadow-lg transition-shadow duration-300`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{stat.title}</h3>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className="text-white">{stat.icon}</div>
              </div>
              {stat.trend && (
                <div className="mt-2">
                  <span className={`text-sm ${stat.trendColor}`}>
                    {stat.trend} {stat.description}
                  </span>
                </div>
              )}
              {stat.progress && (
                <div className="mt-4">
                  <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                    <div
                      className="bg-white h-2 rounded-full"
                      style={{ width: `${stat.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm mt-2">{stat.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Recent Payments Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 mb-8">
          <h2 className="text-xl font-bold mb-6 text-blue-600 flex items-center gap-2">
            <FaMoneyCheckAlt className="text-blue-500" /> Recent Fee Payments
          </h2>
          {recentPayments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-left text-sm font-medium text-gray-700">Student</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-700">Amount</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-700">Date</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-700">Method</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-700">Received By</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPayments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="hover:bg-gray-50 transition duration-200"
                    >
                      <td className="p-3 border text-sm text-gray-700">
                        {payment.student_name} ({payment.admission_number})
                      </td>
                      <td className="p-3 border text-sm text-gray-700">
                        KSh {payment.amount?.toLocaleString() || '0'}
                      </td>
                      <td className="p-3 border text-sm text-gray-700">
                        {payment.payment_date ? new Date(payment.payment_date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="p-3 border text-sm text-gray-700 capitalize">
                        {payment.payment_method || 'Unknown'}
                      </td>
                      <td className="p-3 border text-sm text-gray-700">
                        {payment.received_by}
                      </td>
                      <td className="p-3 border">
                        <span
                          className={`px-2 py-1 rounded-full text-sm flex items-center justify-center gap-1 bg-green-100 text-green-800`}
                        >
                          <FaCheckCircle className="inline-block" />
                          Completed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FaSadTear className="text-4xl mx-auto mb-4" />
              <p>No recent fee payments found.</p>
            </div>
          )}
        </div>

        {/* Recent Activities Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold mb-6 text-blue-600 flex items-center gap-2">
            <FaClock className="text-blue-500" /> Recent Activities
          </h2>
          {recentActivities.length > 0 ? (
            <ul className="space-y-4">
              {recentActivities.map((activity) => (
                <li
                  key={activity.id || activity.created_at}
                  className="flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-lg transition duration-200"
                >
                  <div className="mt-1">
                    {activityIcons[activity.activity_type] || <FaBell className="text-gray-500 text-xl" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-semibold">
                      {activity.description || 'No description'}
                    </p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-sm text-gray-500">
                        {activity.created_at ? new Date(activity.created_at).toLocaleString() : 'N/A'}
                      </p>
                      <p className="text-sm text-gray-500">
                        by {activity.user_name || 'System'}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FaSadTear className="text-4xl mx-auto mb-4" />
              <p>No recent activities found.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default OverviewDashboard;