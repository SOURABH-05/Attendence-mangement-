const express = require('express');
const { getSessions, createSession } = require('../controllers/sessionController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getSessions)
  .post(authorize('trainer'), createSession);

module.exports = router;
