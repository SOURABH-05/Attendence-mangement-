const Attendance = require('../models/Attendance');
const Session = require('../models/Session');
const Batch = require('../models/Batch');

// @desc    Mark attendance for a session
// @route   POST /api/attendance/mark
// @access  Private (Student)
exports.markAttendance = async (req, res) => {
  try {
    const { session_id, status } = req.body;
    
    // Check if session exists
    const session = await Session.findById(session_id);
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }

    // Check if student belongs to the batch
    const batch = await Batch.findById(session.batch_id);
    if (!batch.students.includes(req.user._id)) {
      return res.status(403).json({ success: false, error: 'You do not belong to this batch' });
    }

    // Create or update attendance record
    const attendance = await Attendance.findOneAndUpdate(
      { session_id, student_id: req.user._id },
      { status, marked_at: Date.now() },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, data: attendance });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, error: 'Attendance already marked for this session' });
    }
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get attendance for a specific session
// @route   GET /api/attendance/session/:id
// @access  Private (Trainer, Institution)
exports.getSessionAttendance = async (req, res) => {
  try {
    const session_id = req.params.id;
    const session = await Session.findById(session_id);
    
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }

    const attendance = await Attendance.find({ session_id }).populate('student_id', 'name email');
    res.status(200).json({ success: true, count: attendance.length, data: attendance });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
