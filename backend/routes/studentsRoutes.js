const express = require('express');
const router = express.Router();
const db = require('../db');

router.get("/", async (req, res) => {
    const { schoolId } = req.query;
    const schoolIdInt = parseInt(schoolId, 10); // Convert to integer
    console.log(typeof(schoolIdInt))
    
    if (isNaN(schoolIdInt)) {
        return res.status(400).json({ message: "Invalid schoolId" });
    }

    // Define the query with the placeholder for school_id
    const query = "SELECT * FROM students WHERE school_id = ?";

    // Execute the query
    db.query(query, [schoolIdInt], (error, students) => {
        if (error) {
            res.status(500).json({ message: "Error fetching students", error: error.message });
        } else {
            res.json(students);
        }
    });
});

module.exports = router;
