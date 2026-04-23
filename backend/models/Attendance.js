const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  session_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'Session',
    required: true
  },
  student_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late'],
    required: true
  },
  marked_at: {
    type: Date,
    default: Date.now
  }
});

// Prevent duplicate attendance records for the same student in a session
AttendanceSchema.index({ session_id: 1, student_id: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
