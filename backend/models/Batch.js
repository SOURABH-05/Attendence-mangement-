const mongoose = require('mongoose');

const BatchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a batch name'],
    trim: true
  },
  institution_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  trainers: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  students: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  inviteCode: {
    type: String,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Batch', BatchSchema);
