const crypto = require('crypto');
const Batch = require('../models/Batch');
const User = require('../models/User');

// @desc    Get batches for current user
// @route   GET /api/batches
// @access  Private
exports.getBatches = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'institution') {
      query = { institution_id: req.user._id };
    } else if (req.user.role === 'trainer') {
      query = { trainers: req.user._id };
    } else if (req.user.role === 'student') {
      query = { students: req.user._id };
    } else if (req.user.role === 'programme_manager' || req.user.role === 'monitoring_officer') {
      // get all
      query = {};
    }

    const batches = await Batch.find(query).populate('trainers', 'name email').populate('students', 'name email');
    res.status(200).json({ success: true, count: batches.length, data: batches });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Create a new batch
// @route   POST /api/batches
// @access  Private (Institution, Trainer)
exports.createBatch = async (req, res) => {
  try {
    const { name, institution_id, trainer_id } = req.body;
    let b_institution_id = institution_id;
    let trainers = [];

    if (req.user.role === 'institution') {
      b_institution_id = req.user._id;
      if (trainer_id) trainers.push(trainer_id);
    } else if (req.user.role === 'trainer') {
      b_institution_id = req.user.institution_id;
      trainers.push(req.user._id);
    }

    if (!b_institution_id) {
      return res.status(400).json({ success: false, error: 'Institution ID is required' });
    }

    const inviteCode = crypto.randomBytes(4).toString('hex');

    const batch = await Batch.create({
      name,
      institution_id: b_institution_id,
      trainers,
      students: [],
      inviteCode
    });

    res.status(201).json({ success: true, data: batch });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Generate new invite link for a batch
// @route   POST /api/batches/:id/invite
// @access  Private (Trainer, Institution)
exports.generateInvite = async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id);
    if (!batch) {
      return res.status(404).json({ success: false, error: 'Batch not found' });
    }

    // Role checks
    if (req.user.role === 'trainer' && !batch.trainers.includes(req.user._id)) {
      return res.status(403).json({ success: false, error: 'Not authorized to manage this batch' });
    }
    if (req.user.role === 'institution' && batch.institution_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: 'Not authorized to manage this batch' });
    }

    batch.inviteCode = crypto.randomBytes(4).toString('hex');
    await batch.save();

    res.status(200).json({ success: true, data: { inviteCode: batch.inviteCode } });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Student joins batch via invite code
// @route   POST /api/batches/join/:inviteCode
// @access  Private (Student)
exports.joinBatch = async (req, res) => {
  try {
    const inviteCode = req.params.inviteCode;
    const batch = await Batch.findOne({ inviteCode });

    if (!batch) {
      return res.status(404).json({ success: false, error: 'Invalid invite code' });
    }

    if (batch.students.includes(req.user._id)) {
      return res.status(400).json({ success: false, error: 'Already a member of this batch' });
    }

    batch.students.push(req.user._id);
    await batch.save();

    res.status(200).json({ success: true, data: batch });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
