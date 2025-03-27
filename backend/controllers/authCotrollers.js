const jwt = require('jsonwebtoken');
const db = require('../db');
const dotenv = require('dotenv');

dotenv.config();

const authLogin = async (req, res) => {
  const { identifier, password, role } = req.body;

  if (!identifier || !password || !role) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }

  try {
    let user;
    if (role === 'admin' || role === 'teacher') {
      const [users] = await db.query('SELECT * FROM users WHERE email = ?', [identifier]);

      if (users.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      user = users[0];

      // Directly compare the plain text password
      if (password !== user.password_hash) {  // Assuming the password is stored as plain text for testing
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const tokenPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
        schoolId: user.school_id // Add schoolId to the token
      };

      const token = jwt.sign(
        tokenPayload,
        process.env.JWT_SECRET_KEY,
        { expiresIn: '1h' }
      );
      
      const { password: _, ...userData } = user;
      return res.status(200).json({ 
        message: 'Login successful', 
        user: userData, 
        token,
        schoolId: user.school_id // Also send schoolId directly in response
      });
    }
    else if (role === 'student') {
      const [students] = await db.query('SELECT * FROM students WHERE admission_number = ?', [identifier]);

      if (students.length === 0) {
        return res.status(404).json({ message: 'Student not found' });
      }

      const student = students[0];

      // Directly compare the plain text password for student (no bcrypt used here)
      if (password !== student.password) {  // Assuming student password is stored as plain text for testing
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const tokenPayload = {
        id: student.id,
        admissionNumber: student.admission_number,
        schoolId: student.school_id // Assuming this field exists
      };

      const token = jwt.sign(
        tokenPayload,
        process.env.JWT_SECRET_KEY,
        { expiresIn: '1h' }
      );

      const { password: _, ...studentData } = student;
      return res.status(200).json({ 
        message: 'Login successful', 
        user: studentData, 
        token,
        schoolId: student.school_id // Assuming this field exists
      });
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error during login' });
  }
};

module.exports = authLogin;
