import BlogPost from '../models/BlogPost.js';

// @desc    Get all blog posts
// @route   GET /api/blogs
// @access  Public
export const getBlogs = async (req, res) => {
  try {
    const blogs = await BlogPost.find({}).sort({ createdAt: -1 });
    res.json({
      success: true,
      blogs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single blog post details
// @route   GET /api/blogs/:id
// @access  Public
export const getBlogById = async (req, res) => {
  try {
    const blog = await BlogPost.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Article not found.' });
    }
    res.json({
      success: true,
      blog,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a blog post
// @route   POST /api/blogs
// @access  Private/Admin
export const createBlog = async (req, res) => {
  try {
    const { title, summary, content, author, tags, coverImage } = req.body;

    const blog = await BlogPost.create({
      title,
      summary,
      content,
      author: author || req.user.name,
      tags: tags || 'Financial Tips',
      coverImage: coverImage || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80',
    });

    if (blog) {
      res.status(201).json({
        success: true,
        blog,
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid article draft variables.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a blog post
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
export const deleteBlog = async (req, res) => {
  try {
    const blog = await BlogPost.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Article not found.' });
    }

    await blog.deleteOne();
    res.json({
      success: true,
      message: 'Article removed successfully.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
