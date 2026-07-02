import express from 'express';
import { getBlogs, getBlogById, createBlog, deleteBlog } from '../controllers/blogController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getBlogs);
router.get('/:id', getBlogById);
router.post('/', protect, adminOnly, createBlog);
router.delete('/:id', protect, adminOnly, deleteBlog);

export default router;
