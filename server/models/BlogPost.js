import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true,
  },
  summary: {
    type: String,
    required: [true, 'Summary teaser is required'],
    trim: true,
    maxlength: 300,
  },
  content: {
    type: String,
    required: [true, 'Content body is required'],
  },
  author: {
    type: String,
    default: 'Administrator',
  },
  tags: {
    type: String,
    default: 'Financial Tips',
  },
  coverImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);
export default BlogPost;
