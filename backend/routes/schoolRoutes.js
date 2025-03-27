const express = require('express');
const router = express.Router();
const db = require('../db');

// Get school data with all related information
router.get('/', async (req, res) => {
  try {
    const { schoolId } = req.query;
    
    if (!schoolId) {
      return res.status(400).json({ success: false, message: 'School ID is required' });
    }

    // Get school info
    const [school] = await db.query(
      'SELECT * FROM schools WHERE id = ?', 
      [schoolId]
    );

    if (!school) {
      return res.status(404).json({ success: false, message: 'School not found' });
    }

    // Get school settings
    const [settings] = await db.query(
      'SELECT * FROM school_settings WHERE school_id = ?',
      [schoolId]
    );

    // Get current academic year
    const [academicYears] = await db.query(
      'SELECT * FROM academic_years WHERE school_id = ? ORDER BY id DESC LIMIT 1',
      [schoolId]
    );
    const academicYear = academicYears[0];

    // Get current term
    let currentTerm = null;
    if (academicYear) {
      const [terms] = await db.query(
        'SELECT * FROM terms WHERE academic_year_id = ? AND is_current = TRUE',
        [academicYear.id]
      );
      currentTerm = terms[0];
    }

    // Get classes for current academic year
    let classes = [];
    if (academicYear) {
      [classes] = await db.query(`
        SELECT c.*, CONCAT(u.first_name, ' ', u.last_name) as teacher_name
        FROM classes c
        LEFT JOIN users u ON c.class_teacher_id = u.id
        WHERE c.school_id = ? AND c.academic_year_id = ?
        ORDER BY c.name, c.stream
      `, [schoolId, academicYear.id]);
    }

    // Get teachers
    const [teachers] = await db.query(`
      SELECT u.id, CONCAT(u.first_name, ' ', u.last_name) as name 
      FROM teachers t
      JOIN users u ON t.user_id = u.id
      WHERE u.school_id = ? AND u.is_active = TRUE
      ORDER BY u.first_name, u.last_name
    `, [schoolId]);

    // Get subjects
    const [subjects] = await db.query(
      'SELECT * FROM subjects WHERE school_id = ? ORDER BY name',
      [schoolId]
    );

    res.json({
      success: true,
      school,
      settings: settings[0] || null,
      academicYear: academicYear || null,
      currentTerm: currentTerm || null,
      classes,
      teachers,
      subjects
    });

  } catch (error) {
    console.error('Error fetching school data:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch school data' });
  }
});

// Update school info
router.put('/info', async (req, res) => {
  try {
    const { id, ...schoolInfo } = req.body;
    
    if (!id) {
      return res.status(400).json({ success: false, message: 'School ID is required' });
    }

    await db.query(
      'UPDATE schools SET ? WHERE id = ?',
      [schoolInfo, id]
    );

    res.json({ success: true, message: 'School info updated successfully' });
  } catch (error) {
    console.error('Error updating school info:', error);
    res.status(500).json({ success: false, message: 'Failed to update school info' });
  }
});

// Update school settings
router.put('/settings', async (req, res) => {
  try {
    const { school_id, ...settings } = req.body;
    
    if (!school_id) {
      return res.status(400).json({ success: false, message: 'School ID is required' });
    }

    // Check if settings exist
    const [existingSettings] = await db.query(
      'SELECT * FROM school_settings WHERE school_id = ?',
      [school_id]
    );

    if (existingSettings.length > 0) {
      // Update existing settings
      await db.query(
        'UPDATE school_settings SET ? WHERE school_id = ?',
        [settings, school_id]
      );
    } else {
      // Insert new settings
      await db.query(
        'INSERT INTO school_settings SET ?',
        { school_id, ...settings }
      );
    }

    res.json({ success: true, message: 'School settings updated successfully' });
  } catch (error) {
    console.error('Error updating school settings:', error);
    res.status(500).json({ success: false, message: 'Failed to update school settings' });
  }
});

module.exports = router;