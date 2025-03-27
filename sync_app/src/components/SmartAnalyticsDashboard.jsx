import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { FaFilter, FaChartBar, FaChartLine, FaChartPie, FaTrophy, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';

const SmartAnalyticsDashboard = ({ schoolId }) => {
  const [studentData, setStudentData] = useState([]);
  const [teacherData, setTeacherData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [feeData, setFeeData] = useState([]);
  const [examResults, setExamResults] = useState([]);
  const [timePeriod, setTimePeriod] = useState('term');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [studentsRes, teachersRes, attendanceRes, feesRes, examsRes] = await Promise.all([
          axios.get(`/api/students`, { params: { schoolId, includeClass: true } }),
          axios.get(`/api/teachers`, { params: { schoolId } }),
          axios.get(`/api/attendance`, { params: { schoolId, period: timePeriod } }),
          axios.get(`/api/fee-payments`, { params: { schoolId, period: timePeriod } }),
          axios.get(`/api/exam-results`, { params: { schoolId, period: timePeriod, includeClass: true } })
        ]);

        setStudentData(Array.isArray(studentsRes?.data) ? studentsRes.data : []);
        setTeacherData(Array.isArray(teachersRes?.data) ? teachersRes.data : []);
        setAttendanceData(Array.isArray(attendanceRes?.data) ? attendanceRes.data : []);
        setFeeData(Array.isArray(feesRes?.data) ? feesRes.data : []);
        setExamResults(Array.isArray(examsRes?.data) ? examsRes.data : []);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [schoolId, timePeriod]);

  // Process student performance data from exam results
  const getStudentPerformanceData = () => {
    const results = Array.isArray(examResults) ? examResults : [];
    if (!results.length) return [];
    
    const monthlyData = results.reduce((acc, result) => {
      try {
        const date = new Date(result.exam_date);
        const month = date.toLocaleString('default', { month: 'short' });
        
        if (!acc[month]) {
          acc[month] = { total: 0, count: 0 };
        }
        
        acc[month].total += result.marks || 0;
        acc[month].count++;
      } catch (e) {
        console.error('Error processing exam result:', e);
      }
      return acc;
    }, {});

    return Object.entries(monthlyData).map(([month, { total, count }]) => ({
      name: month,
      Performance: count ? Math.round(total / count) : 0
    }));
  };

  // Process attendance data for pie chart
  const getAttendanceRateData = () => {
    const attendance = Array.isArray(attendanceData) ? attendanceData : [];
    if (!attendance.length) return [{ name: 'No Data', value: 100 }];
    
    const presentCount = attendance.filter(a => 
      a.morning_status === 'Present' && a.afternoon_status === 'Present'
    ).length;
    
    const absentCount = attendance.length - presentCount;
    
    return [
      { name: 'Present', value: Math.round((presentCount / attendance.length) * 100) },
      { name: 'Absent', value: Math.round((absentCount / attendance.length) * 100) }
    ];
  };

  // Process fee collection data
  const getFeeCollectionData = () => {
    const fees = Array.isArray(feeData) ? feeData : [];
    if (!fees.length) return [];
    
    const monthlyData = fees.reduce((acc, payment) => {
      try {
        const date = new Date(payment.payment_date);
        const month = date.toLocaleString('default', { month: 'short' });
        
        if (!acc[month]) {
          acc[month] = 0;
        }
        
        acc[month] += payment.amount || 0;
      } catch (e) {
        console.error('Error processing fee payment:', e);
      }
      return acc;
    }, {});

    return Object.entries(monthlyData).map(([month, amount]) => ({
      name: month,
      Fees: amount
    }));
  };

  // Calculate class performance from exam results
  const getClassPerformanceData = () => {
    const results = Array.isArray(examResults) ? examResults : [];
    const students = Array.isArray(studentData) ? studentData : [];
    if (!results.length || !students.length) return [];
    
    const classResults = results.reduce((acc, result) => {
      try {
        const classId = result.student?.class_id;
        if (!classId) return acc;
        
        if (!acc[classId]) {
          acc[classId] = {
            className: result.student?.class?.name || `Class ${classId}`,
            total: 0,
            count: 0
          };
        }
        
        acc[classId].total += result.marks || 0;
        acc[classId].count++;
      } catch (e) {
        console.error('Error processing class result:', e);
      }
      return acc;
    }, {});

    return Object.values(classResults).map(cls => ({
      className: cls.className,
      averageScore: cls.count ? Math.round(cls.total / cls.count) : 0
    }));
  };

  // Calculate school performance metrics
  const getSchoolPerformanceData = () => {
    const classPerformance = getClassPerformanceData();
    const topClass = classPerformance.reduce((max, cls) => 
      cls.averageScore > (max?.averageScore || 0) ? cls : max, null);
    
    const overallScore = classPerformance.length 
      ? Math.round(classPerformance.reduce((sum, cls) => sum + cls.averageScore, 0) / classPerformance.length)
      : 0;
    
    return {
      overallScore,
      topClass: topClass?.className || 'N/A',
      topClassScore: topClass?.averageScore || 0
    };
  };

  // Calculate predictive insights
  const getPredictiveInsights = () => {
    const students = Array.isArray(studentData) ? studentData : [];
    const attendance = Array.isArray(attendanceData) ? attendanceData : [];
    const teachers = Array.isArray(teacherData) ? teacherData : [];
    
    const atRiskStudents = students.filter(student => {
      const studentAttendance = attendance.filter(a => a.student_id === student.id);
      if (!studentAttendance.length) return false;
      
      const absentCount = studentAttendance.filter(a => 
        a.morning_status !== 'Present' || a.afternoon_status !== 'Present'
      ).length;
      
      return (absentCount / studentAttendance.length) > 0.2;
    });

    const overloadedTeachers = teachers.filter(teacher => {
      const teacherLessons = teacher.subjects_specialization 
        ? teacher.subjects_specialization.split(',').length * 5
        : 0;
      return teacherLessons > 30;
    });

    return {
      atRiskStudents: atRiskStudents.length,
      overloadedTeachers: overloadedTeachers.length
    };
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  const studentPerformanceData = getStudentPerformanceData();
  const attendanceRateData = getAttendanceRateData();
  const feeCollectionData = getFeeCollectionData();
  const classPerformanceData = getClassPerformanceData();
  const schoolPerformanceData = getSchoolPerformanceData();
  const predictiveInsights = getPredictiveInsights();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
        <span className="ml-2">Loading analytics data...</span>
      </div>
    );
  }


  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Smart Analytics Dashboard</h1>

      {/* Filters */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
        <div className="flex items-center space-x-4">
          <FaFilter className="text-gray-600" />
          <select
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="term">Per Term</option>
            <option value="semester">Per Semester</option>
          </select>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Student Performance Chart */}
        <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FaChartBar className="mr-2" />
            Student Performance
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={studentPerformanceData}>
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(value) => [`${value}%`, 'Performance']} />
              <Legend />
              <Bar dataKey="Performance" fill="#8884d8" name="Performance (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Attendance Rate Pie Chart */}
        <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FaChartPie className="mr-2" />
            Attendance Rate
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={attendanceRateData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {attendanceRateData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Fee Collection Line Chart */}
        <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FaChartLine className="mr-2" />
            Fee Collection (KSh)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={feeCollectionData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`KSh ${value.toLocaleString()}`, 'Amount']} />
              <Legend />
              <Line type="monotone" dataKey="Fees" stroke="#82ca9d" name="Amount (KSh)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Class Performance Section */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <h2 className="text-xl font-semibold mb-4">Class Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classPerformanceData.length > 0 ? (
            classPerformanceData.map((classData, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold">{classData.className}</h3>
                <p className="text-gray-600">Average Score: {classData.averageScore}%</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div
                    className="bg-blue-500 h-2.5 rounded-full"
                    style={{ width: `${classData.averageScore}%` }}
                  ></div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-4 text-gray-500">
              No class performance data available
            </div>
          )}
        </div>
      </div>

      {/* School Performance Section */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <h2 className="text-xl font-semibold mb-4">School Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold">Overall Performance</h3>
            <p className="text-gray-600">Average Score: {schoolPerformanceData.overallScore}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div
                className="bg-green-500 h-2.5 rounded-full"
                style={{ width: `${schoolPerformanceData.overallScore}%` }}
              ></div>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold">Top Performing Class</h3>
            <p className="text-gray-600">{schoolPerformanceData.topClass}</p>
            <div className="flex items-center mt-2">
              <FaTrophy className="text-yellow-500 mr-2" />
              <span className="text-gray-600">Score: {schoolPerformanceData.topClassScore}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Predictive Insights Section */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <h2 className="text-xl font-semibold mb-4">Predictive Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold">At-Risk Students</h3>
            <p className="text-gray-600">
              {predictiveInsights.atRiskStudents} students are at risk of dropping out this {timePeriod}.
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold">Teacher Workload</h3>
            <p className="text-gray-600">
              {predictiveInsights.overloadedTeachers} teachers are exceeding their workload capacity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartAnalyticsDashboard;