import express from 'express';
import { applyLoan, getLeads, updateLeadStatus, updateLead, deleteLead, getMyLeads } from '../controllers/leadController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/apply', upload.array('documents', 5), applyLoan);
router.get('/', protect, adminOnly, getLeads);
router.get('/my-leads', protect, getMyLeads);
router.patch('/:id/status', protect, adminOnly, updateLeadStatus);
router.put('/:id', protect, adminOnly, updateLead);
router.delete('/:id', protect, adminOnly, deleteLead);

export default router;
