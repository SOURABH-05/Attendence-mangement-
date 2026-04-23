const express = require('express');
const { markAttendance, getSessionAttendance } = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/mark', authorize('student'), markAttendance);
router.get('/session/:id', authorize('trainer', 'institution'), getSessionAttendance);

module.exports = router;
