const Session = require('../models/Session');
const Batch = require('../models/Batch');

// @desc    Get sessions for a batch or current user
// @route   GET /api/sessions
// @access  Private
exports.getSessions = async (req, res) => {
  try {
    let query = {};
    if (req.query.batchId) {
      query.batch_id = req.query.batchId;
    }

    // Role-based filtering if needed:
    // If student, only see sessions for batches they are part of
    // If trainer, only see sessions they created or for their batches

    const sessions = await Session.find(query).populate('batch_id', 'name').sort({ date: -1 });
    res.status(200).json({ success: true, count: sessions.length, data: sessions });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Create a new session
// @route   POST /api/sessions
// @access  Private (Trainer)
exports.createSession = async (req, res) => {
  try {
    const { batch_id, title, date, start_time, end_time } = req.body;

    const batch = await Batch.findById(batch_id);
    if (!batch) {
      return res.status(404).json({ success: false, error: 'Batch not found' });
    }

    if (!batch.trainers.includes(req.user._id)) {
      return res.status(403).json({ success: false, error: 'Not authorized to create session for this batch' });
    }

    const session = await Session.create({
      title,
      batch_id,
      trainer_id: req.user._id,
      date,
      start_time,
      end_time
    });

    res.status(201).json({ success: true, data: session });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
