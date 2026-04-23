const Batch = require('../models/Batch');
const Session = require('../models/Session');
const Attendance = require('../models/Attendance');
const User = require('../models/User');

// @desc    Get attendance summary for a specific batch
// @route   GET /api/summary/batch/:id
// @access  Private (Institution, Programme Manager)
exports.getBatchSummary = async (req, res) => {
  try {
    const batchId = req.params.id;
    const sessions = await Session.find({ batch_id: batchId });
    const sessionIds = sessions.map(s => s._id);

    const attendances = await Attendance.find({ session_id: { $in: sessionIds } });
    
    // Calculate simple stats
    const totalSessions = sessions.length;
    let presentCount = 0;
    
    attendances.forEach(a => {
      if (a.status === 'present') presentCount++;
    });

    res.status(200).json({
      success: true,
      data: {
        totalSessions,
        totalAttendancesMarked: attendances.length,
        presentCount,
        overallAttendanceRate: attendances.length ? ((presentCount / attendances.length) * 100).toFixed(2) + '%' : '0%'
      }
    });

  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get attendance summary for an institution
// @route   GET /api/summary/institution/:id
// @access  Private (Programme Manager)
exports.getInstitutionSummary = async (req, res) => {
  try {
    const institutionId = req.params.id;
    const batches = await Batch.find({ institution_id: institutionId });
    const batchIds = batches.map(b => b._id);
    
    const sessions = await Session.find({ batch_id: { $in: batchIds } });
    const sessionIds = sessions.map(s => s._id);

    const attendances = await Attendance.find({ session_id: { $in: sessionIds } });

    res.status(200).json({
      success: true,
      data: {
        totalBatches: batches.length,
        totalSessions: sessions.length,
        totalAttendancesMarked: attendances.length
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get programme overall summary
// @route   GET /api/summary/programme
// @access  Private (Programme Manager, Monitoring Officer)
exports.getProgrammeSummary = async (req, res) => {
  try {
    const totalInstitutions = await User.countDocuments({ role: 'institution' });
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalTrainers = await User.countDocuments({ role: 'trainer' });
    const totalBatches = await Batch.countDocuments();
    const totalSessions = await Session.countDocuments();
    
    const attendances = await Attendance.find();
    let presentCount = 0;
    attendances.forEach(a => {
      if (a.status === 'present') presentCount++;
    });

    const averageAttendance = attendances.length ? ((presentCount / attendances.length) * 100).toFixed(2) + '%' : '0%';

    res.status(200).json({
      success: true,
      data: {
        totalInstitutions,
        totalStudents,
        totalTrainers,
        totalBatches,
        totalSessions,
        averageAttendance
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
