const mysql = require('mysql2/promise');
const dotenv = require("dotenv");

// Load environment variables from the .env file
dotenv.config();

// Create a connection pool using environment variables
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,   // Ensures the pool will wait for a connection if it's at max capacity
  connectionLimit: 10,        // Maximum number of connections in the pool
  queueLimit: 0               // No limit on the queue size (optional, default is 0)
});

// Test the database connection
async function testConnection() {
  try {
    const connection = await db.getConnection();
    console.log("Successfully connected to the database!");
    connection.release(); // Release the connection back to the pool
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

// Test the connection when the app starts
testConnection();

module.exports = db;
