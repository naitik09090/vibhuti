import express from 'express';
import { applyLoan, getLeads, updateLeadStatus } from '../controllers/leadController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/apply', upload.array('documents', 5), applyLoan);
router.get('/', protect, adminOnly, getLeads);
router.patch('/:id/status', protect, adminOnly, updateLeadStatus);

export default router;
