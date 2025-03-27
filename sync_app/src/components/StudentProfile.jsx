import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const StudentProfile = () => {
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/students/${studentId}`);
        setStudent(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStudent();
  }, [studentId]);

  if (!student) return <div>Loading...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Student Profile</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <p className="mt-1">{student.firstName}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <p className="mt-1">{student.lastName}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
          <p className="mt-1">{student.dateOfBirth}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <p className="mt-1">{student.gender}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Fee Status</label>
          <p className="mt-1">{student.feeStatus}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Photo</label>
          {student.photo && (
            <img
              src={student.photo}
              alt="Student"
              className="mt-1 w-24 h-24 rounded-full"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;