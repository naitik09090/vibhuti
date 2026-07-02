import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Plus, Trash2, Calendar, User, X, BookOpen, Clock, 
  Loader2, AlertCircle, Sparkles, ArrowLeft 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEOMeta from '../components/SEOMeta';
import { blogPosts } from '../data/blogPosts';
import { API_BASE_URL } from '../config';

export default function Blog() {
  const { isAuthenticated, user, token } = useSelector((state) => state.auth);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isWriteMode, setIsWriteMode] = useState(false);

  const navigate = useNavigate();

  const [newBlog, setNewBlog] = useState({
    title: '',
    summary: '',
    content: '',
    tags: 'Financial Tips',
    coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80'
  });

  const fetchPosts = async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/blogs`);
      const apiPosts = response.data.blogs || [];
      const hasSeoPost = apiPosts.some(p => p._id === 'seo-master-post');
      if (!hasSeoPost) {
        setPosts([blogPosts[0], ...apiPosts]);
      } else {
        setPosts(apiPosts);
      }
    } catch (err) {
      console.error(err);
      if (isInitial) setPosts(blogPosts);
    } finally {
      if (isInitial) {
        setIsWriteMode(false);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchPosts(true);
    // Poll updated blogs every 5 seconds to show admin updates automatically in background
    const interval = setInterval(() => {
      fetchPosts(false);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleWriteChange = (e) => {
    setNewBlog({ ...newBlog, [e.target.name]: e.target.value });
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/blogs`,
        { ...newBlog, author: user?.name || 'Administrator' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setIsWriteMode(false);
        setNewBlog({
          title: '', summary: '', content: '', tags: 'Financial Tips',
          coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80'
        });
        fetchPosts();
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error publishing blog post.');
      // Local addition fallback
      const offlinePost = {
        _id: `offline-${Date.now()}`,
        title: newBlog.title,
        summary: newBlog.summary,
        content: newBlog.content,
        author: user?.name || 'Local Editor',
        tags: newBlog.tags,
        coverImage: newBlog.coverImage,
        createdAt: new Date().toISOString()
      };
      setPosts([offlinePost, ...posts]);
      setIsWriteMode(false);
      setNewBlog({
        title: '', summary: '', content: '', tags: 'Financial Tips',
        coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this article?')) return;
    setLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/blogs/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPosts();
    } catch (err) {
      console.error(err);
      alert('Delete failed or offline. Post removed from current view.');
      setPosts(posts.filter(p => p._id !== postId));
    } finally {
      setLoading(false);
    }
  };

  // Helper to format 2000+ words post content cleanly
  const formatBlogContent = (content) => {
    return content.split('\n').map((paragraph, index) => {
      const trimmed = paragraph.trim();
      if (!trimmed) return null;

      // Primary Headings
      if (trimmed.startsWith('SECTION ') || trimmed.startsWith('INTRODUCTION') || trimmed.startsWith('SUMMARY')) {
        return (
          <h2 key={index} className="font-heading text-lg md:text-xl font-bold text-charcoal-100 mt-8 mb-4 border-b border-charcoal-800 pb-2">
            {trimmed}
          </h2>
        );
      }

      // Subheadings
      if (trimmed.endsWith(':') && trimmed.length < 100) {
        return (
          <h3 key={index} className="font-display font-semibold text-xs md:text-sm text-charcoal-200 mt-6 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
            {trimmed}
          </h3>
        );
      }

      // Bullets
      if (trimmed.startsWith('-')) {
        return (
          <div key={index} className="flex items-start gap-2 text-xs md:text-sm text-charcoal-400 pl-4 py-1 leading-relaxed">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500/50 flex-shrink-0 mt-2" />
            <span>{trimmed.substring(1).trim()}</span>
          </div>
        );
      }

      // Default paragraph
      return (
        <p key={index} className="text-xs md:text-sm text-charcoal-400 leading-relaxed mb-4 text-justify font-sans">
          {trimmed}
        </p>
      );
    });
  };

  // Fallback posts are imported from ../data/blogPosts

  // If a post is selected, show full screen reader view instead of list
  if (selectedPost) {
    return (
      <>
        <SEOMeta
          title={`${selectedPost.title} | Vibhuti Enterprise Blog`}
          description={selectedPost.summary}
        />

        <div className="py-20 bg-gradient-to-b from-charcoal-950 via-charcoal-900/50 to-charcoal-950 relative overflow-hidden">
          {/* Soft glowing ambient background elements */}
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-teal-700/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-3xl mx-auto px-6 relative z-10 space-y-8">
            
            {/* Go Back Link */}
            <button
              onClick={() => { setSelectedPost(null); window.scrollTo(0, 0); }}
              className="flex items-center gap-2 text-xs font-semibold text-charcoal-400 hover:text-teal-400 transition-colors cursor-pointer group bg-transparent border-0"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Articles
            </button>

            {/* Post Tags & Read Time */}
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2.5 py-0.5 rounded">
                {selectedPost.tags}
              </span>
              <span className="text-xs text-charcoal-500 flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-teal-400" />
                {selectedPost._id === 'seo-master-post' ? '12 min read' : '3 min read'}
              </span>
            </div>

            {/* Post Title */}
            <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-charcoal-100 leading-tight">
              {selectedPost.title}
            </h1>

            {/* Author Profile Metadata Banner */}
            <div className="flex items-center justify-between border-t border-b border-charcoal-800/60 py-4 font-mono text-[11px] text-charcoal-500">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center font-bold text-teal-400 text-xs uppercase">
                  {selectedPost.author[0]}
                </div>
                <div>
                  <span className="block font-bold text-charcoal-300">{selectedPost.author}</span>
                  <span className="text-[9px] text-charcoal-500">Financial Advisor</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-teal-400" />
                <span>{new Date(selectedPost.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>

            {/* Cover Image */}
            {selectedPost.coverImage && (
              <div 
                className="w-full h-64 sm:h-96 rounded-2xl bg-cover bg-center border border-charcoal-800 shadow-lg"
                style={{ backgroundImage: `url(${selectedPost.coverImage})` }}
              />
            )}

            {/* Render formatted body paragraphs */}
            <div className="space-y-1">
              {formatBlogContent(selectedPost.content)}
            </div>

            {/* Bottom Navigation */}
            <div className="border-t border-charcoal-800/60 pt-8 flex items-center justify-between">
              <button
                onClick={() => { setSelectedPost(null); window.scrollTo(0, 0); }}
                className="px-5 py-2.5 rounded-xl bg-charcoal-900 border border-charcoal-800 hover:border-charcoal-700 text-xs font-semibold text-charcoal-300 hover:text-charcoal-100 transition-colors cursor-pointer"
              >
                Back to Articles
              </button>
              <button
                onClick={() => navigate('/apply-loan', { state: { defaultLoanType: selectedPost.tags } })}
                className="btn-accent text-xs"
              >
                Start Loan Inquiry
              </button>
            </div>

          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOMeta
        title="Expert Loan & Financial Blog Surat | Vibhuti Enterprise"
        description="Read comprehensive loan guides, CIBIL score optimization tips, and business credit advisory from Vibhuti Enterprise, Surat's top loan consultancy."
      />

      <div className="py-20 bg-gradient-to-b from-charcoal-950 via-charcoal-900/50 to-charcoal-950 relative overflow-hidden">
        {/* Soft glowing ambient background elements */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-teal-700/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-16">
            <div className="space-y-3">
              <div className="section-label">
                <Sparkles className="w-3.5 h-3.5" />
                Knowledge Center
              </div>
              <h1 className="font-heading text-4xl sm:text-5xl font-bold">
                Financial <span className="text-gradient">Insights &amp; Guides</span>
              </h1>
              <p className="text-charcoal-400 text-sm max-w-xl">
                Expert credit advisory, loan process walk-throughs, and financial market insights prepared by the Vibhuti Enterprise team.
              </p>
            </div>

            {isAuthenticated && user?.role === 'admin' && (
              <button
                onClick={() => setIsWriteMode(!isWriteMode)}
                className="btn-accent text-sm"
              >
                {isWriteMode ? 'Cancel' : (
                  <><Plus className="w-4 h-4" /> Write Post</>
                )}
              </button>
            )}
          </div>

          {isWriteMode && (
            <div className="card p-6 border-charcoal-800 max-w-2xl mx-auto mb-12 bg-charcoal-900/60 backdrop-blur-md">
              <h2 className="font-display font-semibold text-charcoal-100 mb-5">Create New Post</h2>

              {error && (
                <div className="p-3 mb-4 rounded bg-red-950/40 border border-red-800/30 flex items-center gap-3 text-red-400 text-xs">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handlePublish} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs text-charcoal-500 uppercase tracking-wider">Title</label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={newBlog.title}
                    onChange={handleWriteChange}
                    placeholder="Article title"
                    className="w-full bg-charcoal-800 border border-charcoal-700 rounded-lg px-3 py-2.5 text-sm text-charcoal-100 placeholder-charcoal-500 focus:outline-none focus:border-teal-500/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-charcoal-500 uppercase tracking-wider">Category</label>
                    <input
                      type="text"
                      name="tags"
                      required
                      value={newBlog.tags}
                      onChange={handleWriteChange}
                      placeholder="e.g. Home Loan"
                      className="w-full bg-charcoal-800 border border-charcoal-700 rounded-lg px-3 py-2.5 text-sm text-charcoal-100 placeholder-charcoal-500 focus:outline-none focus:border-teal-500/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-charcoal-500 uppercase tracking-wider">Cover Image URL</label>
                    <input
                      type="text"
                      name="coverImage"
                      value={newBlog.coverImage}
                      onChange={handleWriteChange}
                      className="w-full bg-charcoal-800 border border-charcoal-700 rounded-lg px-3 py-2.5 text-sm text-charcoal-100 placeholder-charcoal-500 focus:outline-none focus:border-teal-500/50 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-charcoal-500 uppercase tracking-wider">Summary</label>
                  <textarea
                    name="summary"
                    rows="2"
                    required
                    maxLength="250"
                    value={newBlog.summary}
                    onChange={handleWriteChange}
                    placeholder="Brief summary..."
                    className="w-full bg-charcoal-800 border border-charcoal-700 rounded-lg px-3 py-2.5 text-sm text-charcoal-100 placeholder-charcoal-500 focus:outline-none focus:border-teal-500/50 resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-charcoal-500 uppercase tracking-wider">Content</label>
                  <textarea
                    name="content"
                    rows="8"
                    required
                    value={newBlog.content}
                    onChange={handleWriteChange}
                    placeholder="Full article content..."
                    className="w-full bg-charcoal-800 border border-charcoal-700 rounded-lg px-3 py-2.5 text-sm text-charcoal-100 placeholder-charcoal-500 focus:outline-none focus:border-teal-500/50 resize-none"
                  />
                </div>

                <button type="submit" disabled={loading} className="btn-accent w-full cursor-pointer">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Publish'}
                </button>
              </form>
            </div>
          )}

          {loading && posts.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 text-teal-400 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {posts.map((post) => (
                <div
                  key={post._id}
                  onClick={() => { setSelectedPost(post); window.scrollTo(0, 0); }}
                  className="card-hover overflow-hidden flex flex-col md:flex-row cursor-pointer border-charcoal-800 hover:border-charcoal-700 hover:shadow-lg bg-charcoal-900"
                >
                  <div 
                    className="w-full md:w-48 aspect-video md:aspect-auto bg-cover bg-center bg-charcoal-850 flex-shrink-0" 
                    style={{ backgroundImage: `url(${post.coverImage || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80'})` }} 
                  />

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded">
                          {post.tags}
                        </span>
                        {isAuthenticated && user?.role === 'admin' && post._id !== 'seo-master-post' && (
                          <button
                            onClick={(e) => handleDelete(post._id, e)}
                            className="text-charcoal-500 hover:text-red-400 p-1 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <h3 className="font-heading font-bold text-charcoal-100 text-base leading-snug group-hover:text-teal-400 transition-colors line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-charcoal-400 text-xs leading-relaxed line-clamp-2">
                        {post.summary}
                      </p>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-charcoal-500 border-t border-charcoal-800/60 pt-3.5 mt-5 font-mono">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3 h-3 text-teal-400" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-teal-400" />
                        <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {posts.length === 0 && !loading && (
            <div className="text-center py-20 max-w-sm mx-auto">
              <BookOpen className="w-10 h-10 text-charcoal-500 mx-auto mb-3" />
              <h3 className="text-charcoal-100 font-display font-semibold">No posts yet</h3>
              <p className="text-sm text-charcoal-500 mt-1">Check back later for new articles.</p>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
