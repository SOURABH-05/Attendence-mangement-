const express = require('express');
const { getBatchSummary, getInstitutionSummary, getProgrammeSummary } = require('../controllers/summaryController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/batch/:id', authorize('institution', 'programme_manager', 'monitoring_officer'), getBatchSummary);
router.get('/institution/:id', authorize('programme_manager', 'monitoring_officer'), getInstitutionSummary);
router.get('/programme', authorize('programme_manager', 'monitoring_officer'), getProgrammeSummary);

module.exports = router;
