const express = require('express');
const { getBatches, createBatch, generateInvite, joinBatch } = require('../controllers/batchController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getBatches)
  .post(authorize('trainer', 'institution'), createBatch);

router.post('/:id/invite', authorize('trainer', 'institution'), generateInvite);
router.post('/join/:inviteCode', authorize('student'), joinBatch);

module.exports = router;
