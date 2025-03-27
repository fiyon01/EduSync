const express = require('express'); // Use require instead of import
const cors = require('cors'); // Use require instead of import
const morgan = require('morgan'); // Use require instead of import
const swaggerJSDoc = require('swagger-jsdoc'); // Use require instead of import
const swaggerUi = require('swagger-ui-express'); // Use require instead of import
const authRoutes = require('./routes/authRoutes'); // Use require instead of import
const db = require("./db")
const dotenv = require("dotenv")
const jwt = require("jsonwebtoken")
dotenv.config()
// Initialize the Express app
const app = express();
app.use(express.json());
// Setup CORS middleware
app.use(cors({
    origin: "http://localhost:5173", // Adjust the origin as needed
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

// Use morgan to log HTTP requests
app.use(morgan('dev')); // 'dev' is the format of logs (you can use other formats like 'combined', 'short', etc.)

// Register routes
app.use('/api', authRoutes);
app.use('/api/school', require('./routes/schoolRoutes'));

app.get("/api/students", async (req, res) => {
    const { schoolId } = req.query;
    const schoolIdInt = parseInt(schoolId, 10);
  
    if (isNaN(schoolIdInt)) {
      return res.status(400).json({ message: "Invalid schoolId" });
    }
  
    let connection;
    try {
      // 1. Get a connection from the pool
      connection = await db.getConnection();
  
      // 2. Debug: Ping the database
      await connection.ping();
      console.log("Database ping successful");
  
      // 3. Execute the query
      const [students] = await connection.query(
        "SELECT * FROM students JOIN users ON students.user_id = users.id WHERE students.school_id = ?",
        [schoolIdInt]
      );
  
      // 4. Handle empty results
      if (students.length === 0) {
        return res.status(404).json({ message: "No students found" });
      }
  
      // 5. Return data
      res.json(students);
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ message: "Error fetching students", error: error.message });
    } finally {
      // 6. Always release the connection!
      if (connection) connection.release();
    }
  });
  //stup Swagger Documentation
const swaggerOptions = {
  definition: {
    openapi: "3.0.0", // OpenAPI version
    info: {
      title: "My API",
      version: "1.0.0",
      description: "API documentation for my Express app",
    },
    servers: [
      {
        url: "http://localhost:3500", // Server URL
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to the API files where Swagger will look for annotations
};

// Create Swagger definition
const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Define a simple API endpoint
/**
 * @swagger
 * /:
 *   get:
 *     summary: "Welcome endpoint"
 *     description: "Returns a simple welcome message"
 *     responses:
 *       200:
 *         description: "A simple welcome message"
 */
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API!" });
});
const authenticateToken = (req, res, next) => {
    console.log('Headers:', req.headers); // Log all headers to see if the Authorization header exists

    // Retrieve the Authorization header from the request
    const authHeader = req.header('Authorization');
    console.log('Auth header:', authHeader); // Log the Authorization header

    // Check if the Authorization header is missing
    if (!authHeader) {
        console.log('No authorization header');
        return res.status(403).send('Access denied. No Authorization header.');
    }

    // Split the Authorization header into 'Bearer' and the token
    const token = authHeader.split(' ')[1]; // 'Bearer <token>'
    
    // Check if the token is missing after 'Bearer'
    if (!token) {
        console.log('No token found in Authorization header');
        return res.status(403).send('Access denied. No token found.');
    }

    // Verify the token using JWT secret key
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        // If token verification fails, return a 403 response with error details
        if (err) {
            console.log('Token verification failed:', err);
            return res.status(403).send('Invalid token.');
        }

        // If token is valid, attach decoded data to req.user and move to the next middleware
        console.log('Token verified successfully:', decoded);
        req.user = decoded;
        next();
    });
};


// 2. Get Dashboard Statistics
app.get('/api/dashboard/stats',authenticateToken,async (req, res) => {
    const { schoolId } = req.query;
    
    if (!schoolId) {
      return res.status(400).json({ error: 'School ID is required' });
    }
  
    try {
      // Get current term ID
      const [termResults] = await db.query(
        `SELECT id FROM terms 
         WHERE school_id = ? AND is_current = TRUE 
         ORDER BY start_date DESC LIMIT 1`,
        [schoolId]
      );
      
      if (termResults.length === 0) {
        return res.status(404).json({ error: 'No active term found' });
      }
      
      const currentTermId = termResults[0].id;
      
      // Get previous term ID for comparison
      const [prevTermResults] = await db.query(
        `SELECT id FROM terms 
         WHERE school_id = ? AND id != ? 
         ORDER BY start_date DESC LIMIT 1`,
        [schoolId, currentTermId]
      );
      
      const prevTermId = prevTermResults.length > 0 ? prevTermResults[0].id : null;
      
      // Fetch all stats in parallel
      const [
        totalStudents,
        prevTermStudents,
        totalTeachers,
        prevTermTeachers,
        feeBalance,
        prevTermFeeBalance,
        attendanceRate
      ] = await Promise.all([
        // Current term students
        db.query(
          `SELECT COUNT(*) as count FROM students 
           WHERE school_id = ? AND class_id IN (
             SELECT id FROM classes WHERE academic_year_id IN (
               SELECT academic_year_id FROM terms WHERE id = ?
             )
           )`,
          [schoolId, currentTermId]
        ),
        
        // Previous term students (if available)
        prevTermId ? db.query(
          `SELECT COUNT(*) as count FROM students 
           WHERE school_id = ? AND class_id IN (
             SELECT id FROM classes WHERE academic_year_id IN (
               SELECT academic_year_id FROM terms WHERE id = ?
             )
           )`,
          [schoolId, prevTermId]
        ) : Promise.resolve([[{ count: 0 }]]),
        
        // Current term teachers
        db.query(
          `SELECT COUNT(*) as count FROM teachers 
           JOIN users ON teachers.user_id = users.id 
           WHERE users.school_id = ? AND users.is_active = TRUE`,
          [schoolId]
        ),
        
        // Previous term teachers (we'll use same count as it's likely similar)
        db.query(
          `SELECT COUNT(*) as count FROM teachers 
           JOIN users ON teachers.user_id = users.id 
           WHERE users.school_id = ? AND users.is_active = TRUE`,
          [schoolId]
        ),
        
        // Current fee balance
        db.query(
          `SELECT SUM(balance) as total FROM student_fees 
           WHERE term_id = ?`,
          [currentTermId]
        ),
        
        // Previous term fee balance
        prevTermId ? db.query(
          `SELECT SUM(balance) as total FROM student_fees 
           WHERE term_id = ?`,
          [prevTermId]
        ) : Promise.resolve([{ total: 0 }]),
        
        // Attendance rate (current term)
        db.query(
          `SELECT 
             COUNT(*) as total_days,
             SUM(CASE WHEN morning_status = 'Present' THEN 1 ELSE 0 END) as morning_present,
             SUM(CASE WHEN afternoon_status = 'Present' THEN 1 ELSE 0 END) as afternoon_present
           FROM attendance
           WHERE student_id IN (
             SELECT user_id FROM students WHERE school_id = ?
           ) AND date BETWEEN (
             SELECT start_date FROM terms WHERE id = ?
           ) AND (
             SELECT end_date FROM terms WHERE id = ?
           )`,
          [schoolId, currentTermId, currentTermId]
        )
      ]);
      
      // Calculate student trend
      const currentStudentCount = totalStudents[0][0].count;
      const prevStudentCount = prevTermStudents[0][0].count;
      const studentTrend = prevStudentCount > 0 
        ? `${(((currentStudentCount - prevStudentCount) / prevStudentCount) * 100).toFixed(1)}%` 
        : '0%';
      
      // Calculate teacher trend (same as students for simplicity)
      const currentTeacherCount = totalTeachers[0][0].count;
      const prevTeacherCount = prevTermTeachers[0][0].count;
      const teacherTrend = prevTeacherCount > 0 
        ? `${(((currentTeacherCount - prevTeacherCount) / prevTeacherCount) * 100).toFixed(1)}%` 
        : '0%';
      
      // Calculate fee balance trend
      const currentFeeBalance = feeBalance[0][0].total || 0;
      const prevFeeBalance = prevTermFeeBalance[0][0].total || 0;
      const feeTrend = prevFeeBalance > 0 
        ? `${(((currentFeeBalance - prevFeeBalance) / prevFeeBalance) * 100).toFixed(1)}%` 
        : '0%';
      
      // Calculate attendance rate
      const attendanceData = attendanceRate[0][0];
      const attendanceRateValue = attendanceData.total_days > 0 
        ? ((attendanceData.morning_present + attendanceData.afternoon_present) / (attendanceData.total_days * 2)) * 100
        : 0;
      
      res.json({
        totalStudents: currentStudentCount,
        studentTrend: studentTrend.startsWith('-') ? studentTrend : `+${studentTrend}`,
        totalTeachers: currentTeacherCount,
        teacherTrend: teacherTrend.startsWith('-') ? teacherTrend : `+${teacherTrend}`,
        totalFeeBalance: currentFeeBalance,
        feeTrend: feeTrend.startsWith('-') ? feeTrend : `+${feeTrend}`,
        attendanceRate: attendanceRateValue.toFixed(1)
      });
      
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  // 3. Get Recent Fee Payments
  app.get('/api/fee-payments/recent', authenticateToken, async (req, res) => {
    const { schoolId, limit = 5 } = req.query;
    
    if (!schoolId) {
      return res.status(400).json({ error: 'School ID is required' });
    }
  
    try {
      const [payments] = await db.query(
        `SELECT 
           fp.id, 
           fp.amount, 
           fp.payment_date, 
           fp.payment_method, 
           s.admission_number,
           u.first_name as student_first_name,
           u.last_name as student_last_name,
           ru.first_name as received_by_first_name,
           ru.last_name as received_by_last_name,
           fi.name as fee_item_name,
           fi.amount as fee_item_amount
         FROM fee_payments fp
         JOIN student_fees sf ON fp.student_fee_id = sf.id
         JOIN fee_items fi ON sf.fee_item_id = fi.id
         JOIN students s ON sf.student_id = s.id
         JOIN users u ON s.user_id = u.id
         JOIN users ru ON fp.recorded_by = ru.id
         WHERE fp.school_id = ?
         ORDER BY fp.payment_date DESC, fp.id DESC
         LIMIT ?`,
        [schoolId, parseInt(limit)]
      );
      
      const formattedPayments = payments.map(payment => ({
        id: payment.id,
        amount: payment.amount,
        payment_date: payment.payment_date,
        payment_method: payment.payment_method,
        student: {
          admission_number: payment.admission_number,
          name: `${payment.student_first_name} ${payment.student_last_name}`
        },
        received_by: `${payment.received_by_first_name} ${payment.received_by_last_name}`,
        fee_item: {
          name: payment.fee_item_name,
          amount: payment.fee_item_amount
        }
      }));
      
      res.json(formattedPayments);
    } catch (error) {
      console.error('Detailed error fetching fee payments:', {
        message: error.message,
        stack: error.stack,
        sql: error.sql
      });
      res.status(500).json({ 
        error: 'Failed to retrieve fee payments',
        details: error.message
      });
    }
});
  
  // 4. Get Recent Activities
  app.get('/api/activities/recent',authenticateToken,async (req, res) => {
    const { schoolId, limit = 5 } = req.query;
    
    if (!schoolId) {
      return res.status(400).json({ error: 'School ID is required' });
    }
  
    try {
      const [activities] = await db.query(
        `SELECT 
           ra.id,
           ra.activity_type,
           ra.description,
           ra.created_at,
           u.first_name as user_first_name,
           u.last_name as user_last_name
         FROM recent_activities ra
         JOIN users u ON ra.user_id = u.id
         WHERE ra.school_id = ?
         ORDER BY ra.created_at DESC
         LIMIT ?`,
        [schoolId, parseInt(limit)]
      );
      
      const formattedActivities = activities.map(activity => ({
        id: activity.id,
        activity_type: activity.activity_type,
        description: activity.description,
        created_at: activity.created_at,
        user_name: `${activity.user_first_name} ${activity.user_last_name}`
      }));
      
      res.json(formattedActivities);
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
// Start the server
app.listen(3500, () => {
  console.log("Server is running on port 3500");
});
