import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { adminLogout } from '../store/authSlice';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer
} from 'recharts';
import {
  TrendingUp, Users, CheckCircle, Clock, Download,
  Trash2, Mail, Phone, ExternalLink, ShieldAlert, KeyRound, Loader2, AlertCircle,
  Pencil, Plus, X, Landmark, FileText, LogOut, Menu
} from 'lucide-react';
import SEOMeta from '../components/SEOMeta';
import { API_BASE_URL } from '../config';

const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
    const payload = JSON.parse(window.atob(padded));
    if (payload.exp) {
      return payload.exp * 1000 < Date.now();
    }
    return false;
  } catch (e) {
    console.error('Token decode error:', e);
    return true;
  }
};

export default function AdminDashboard() {
  const { isAdminAuthenticated, adminUser: user, adminToken: token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalLeads: 0, totalVolume: 0, pendingLeads: 0, approvalRate: 98,
  });
  const [leads, setLeads] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Blog Management States
  const [activeTab, setActiveTab] = useState('leads');
  const [blogs, setBlogs] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(false);
  const [isBlogFormOpen, setIsBlogFormOpen] = useState(false);
  const [blogFormMode, setBlogFormMode] = useState('create');
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [blogForm, setBlogForm] = useState({
    title: '',
    tags: 'Financial Tips',
    coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80',
    summary: '',
    content: ''
  });
  const [blogError, setBlogError] = useState(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Lead Inquiry Edit Modal States
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [leadForm, setLeadForm] = useState({
    customerName: '',
    email: '',
    phone: '',
    loanType: 'Home Loan',
    loanAmount: '',
    loanTenureYears: '',
    status: 'Pending',
    message: ''
  });
  const [leadFormLoading, setLeadFormLoading] = useState(false);
  const [leadFormError, setLeadFormError] = useState(null);

  const fallbackLeads = [
    {
      _id: 'lead-1', customerName: 'Rajesh Patel', email: 'rajesh@patelbuilders.com',
      phone: '+91 98980 12345', loanType: 'Business Loan', loanAmount: 2500000,
      loanTenureYears: 5, status: 'Pending', documentUrls: [],
      message: 'Urgent liquidity for raw material imports.', createdAt: new Date().toISOString()
    },
    {
      _id: 'lead-2', customerName: 'Vikram Singh', email: 'vikram.singh@gmail.com',
      phone: '+91 91234 56789', loanType: 'Home Loan', loanAmount: 8500000,
      loanTenureYears: 20, status: 'Approved', documentUrls: [],
      message: 'Residential flat in Pune.', createdAt: new Date().toISOString()
    }
  ];

  const handleAuthError = (err) => {
    if (err.response && err.response.status === 401) {
      dispatch(adminLogout());
      return true;
    }
    return false;
  };

  const fetchDashboardData = async () => {
    if (!isAdminAuthenticated || user?.role !== 'admin') return;
    setLoading(true);
    setError(null);

    try {
      const authHeaders = { headers: { Authorization: `Bearer ${token}` } };
      const statsRes = await axios.get(`${API_BASE_URL}/dashboard/stats`, authHeaders);
      const leadsRes = await axios.get(`${API_BASE_URL}/leads`, authHeaders);

      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (leadsRes.data.success) setLeads(leadsRes.data.leads);

      setChartData([
        { name: 'Mon', leads: 4 }, { name: 'Tue', leads: 8 },
        { name: 'Wed', leads: 5 }, { name: 'Thu', leads: 12 },
        { name: 'Fri', leads: leadsRes.data.leads.length || 7 },
      ]);
    } catch (err) {
      if (handleAuthError(err)) return;
      console.warn('Backend offline. Using fallback data.');
      setLeads(fallbackLeads);
      setStats({ totalLeads: fallbackLeads.length, totalVolume: 11000000, pendingLeads: 1, approvalRate: 99 });
      setChartData([
        { name: 'Mon', leads: 3 }, { name: 'Tue', leads: 6 },
        { name: 'Wed', leads: 5 }, { name: 'Thu', leads: 9 },
        { name: 'Fri', leads: fallbackLeads.length },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogs = async () => {
    setBlogsLoading(true);
    setBlogError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/blogs`);
      if (response.data.success) {
        setBlogs(response.data.blogs || []);
      }
    } catch (err) {
      console.error(err);
      setBlogError('Failed to fetch blog posts from database.');
    } finally {
      setBlogsLoading(false);
    }
  };

  const handleBlogDelete = async (blogId) => {
    if (!window.confirm('Delete this article?')) return;
    setBlogsLoading(true);
    try {
      const authHeaders = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`${API_BASE_URL}/blogs/${blogId}`, authHeaders);
      fetchBlogs();
    } catch (err) {
      if (handleAuthError(err)) return;
      console.error(err);
      alert('Delete failed. Please verify connection.');
    } finally {
      setBlogsLoading(false);
    }
  };

  const openEditBlog = (blog) => {
    setBlogForm({
      title: blog.title,
      tags: blog.tags,
      coverImage: blog.coverImage,
      summary: blog.summary,
      content: blog.content
    });
    setSelectedBlogId(blog._id);
    setBlogFormMode('edit');
    setBlogError(null);
    setIsBlogFormOpen(true);
  };

  const openCreateBlog = () => {
    setBlogForm({
      title: '',
      tags: 'Financial Tips',
      coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80',
      summary: '',
      content: ''
    });
    setSelectedBlogId(null);
    setBlogFormMode('create');
    setBlogError(null);
    setIsBlogFormOpen(true);
  };

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    setBlogsLoading(true);
    setBlogError(null);
    try {
      const authHeaders = { headers: { Authorization: `Bearer ${token}` } };
      if (blogFormMode === 'create') {
        const response = await axios.post(`${API_BASE_URL}/blogs`, {
          ...blogForm,
          author: user?.name || 'Administrator'
        }, authHeaders);
        if (response.data.success) {
          setIsBlogFormOpen(false);
          fetchBlogs();
        }
      } else {
        const response = await axios.put(`${API_BASE_URL}/blogs/${selectedBlogId}`, {
          ...blogForm,
          author: user?.name || 'Administrator'
        }, authHeaders);
        if (response.data.success) {
          setIsBlogFormOpen(false);
          fetchBlogs();
        }
      }
    } catch (err) {
      if (handleAuthError(err)) return;
      console.error(err);
      setBlogError(err.response?.data?.message || 'Error processing blog post submission.');
    } finally {
      setBlogsLoading(false);
    }
  };

  const openEditLead = (lead) => {
    setLeadForm({
      customerName: lead.customerName,
      email: lead.email,
      phone: lead.phone,
      loanType: lead.loanType,
      loanAmount: lead.loanAmount,
      loanTenureYears: lead.loanTenureYears,
      status: lead.status,
      message: lead.message || ''
    });
    setSelectedLeadId(lead._id);
    setLeadFormError(null);
    setIsLeadModalOpen(true);
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    setLeadFormLoading(true);
    setLeadFormError(null);
    try {
      const authHeaders = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.put(`${API_BASE_URL}/leads/${selectedLeadId}`, leadForm, authHeaders);
      if (response.data.success) {
        setIsLeadModalOpen(false);
        fetchDashboardData();
      }
    } catch (err) {
      if (handleAuthError(err)) return;
      console.error(err);
      setLeadFormError(err.response?.data?.message || 'Error updating loan inquiry.');
    } finally {
      setLeadFormLoading(false);
    }
  };

  const handleLeadDelete = async (leadId) => {
    if (!window.confirm('Are you sure you want to delete this loan inquiry? This action cannot be undone.')) return;
    setLoading(true);
    try {
      const authHeaders = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`${API_BASE_URL}/leads/${leadId}`, authHeaders);
      fetchDashboardData();
    } catch (err) {
      if (handleAuthError(err)) return;
      console.error(err);
      alert(err.response?.data?.message || 'Error deleting inquiry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let intervalId;
    if (isAdminAuthenticated) {
      if (isTokenExpired(token)) {
        dispatch(adminLogout());
        return;
      }
      if (user?.role === 'admin') {
        const loadData = () => {
          if (activeTab === 'leads') {
            fetchDashboardData();
          } else {
            fetchBlogs();
          }
        };

        loadData();
        intervalId = setInterval(loadData, 5000); // Poll fresh data every 5 seconds
      } else {
        navigate('/admin/login');
      }
    } else {
      navigate('/admin/login');
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isAdminAuthenticated, token, activeTab, user, navigate]);

  const [showAdminLogoutConfirm, setShowAdminLogoutConfirm] = useState(false);

  const handleLogout = () => {
    setIsMobileSidebarOpen(false);
    setShowAdminLogoutConfirm(true);
  };

  const doAdminLogout = () => {
    setShowAdminLogoutConfirm(false);
    dispatch(adminLogout());
  };

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      const authHeaders = { headers: { Authorization: `Bearer ${token}` } };
      await axios.patch(`${API_BASE_URL}/leads/${leadId}/status`, { status: newStatus }, authHeaders);
      fetchDashboardData();
    } catch (err) {
      if (handleAuthError(err)) return;
      setLeads(prev => prev.map(lead => lead._id === leadId ? { ...lead, status: newStatus } : lead));
      alert('Status updated locally. (Connect server to save changes)');
    }
  };

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Name,Email,Phone,Service,Amount,Tenure,Status,Date\n";
    leads.forEach(lead => {
      csvContent += `"${lead.customerName}","${lead.email}","${lead.phone}","${lead.loanType}",${lead.loanAmount},${lead.loanTenureYears},"${lead.status}","${new Date(lead.createdAt).toLocaleDateString()}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Vibhuti_Leads_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Rejected': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'In Review': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'Contacted': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      default: return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
    }
  };

  if (!isAdminAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-charcoal-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-teal-400 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <SEOMeta title="Admin Dashboard" description="Vibhuti Enterprise lead management dashboard." />

      <div className="min-h-screen flex flex-col md:flex-row bg-charcoal-950 text-charcoal-300 overflow-x-hidden">
        {/* Mobile Header Bar */}
        <div className="md:hidden flex items-center justify-between bg-charcoal-900 border-b border-charcoal-800 px-4 py-3 sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg">
              <Landmark className="w-3.5 h-3.5 text-charcoal-950" />
            </div>
            <span className="font-heading text-sm tracking-wider font-bold text-charcoal-100">
              VIBHUTI Admin
            </span>
          </div>
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="p-1 bg-transparent border-0 text-charcoal-400 hover:text-charcoal-100 cursor-pointer"
          >
            {isMobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Sidebar Drawer Overlay */}
        {isMobileSidebarOpen && (
          <div 
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          />
        )}

        {/* Mobile Sidebar Drawer Container */}
        <aside 
          className={`fixed top-0 bottom-0 left-0 w-64 bg-charcoal-900 border-r border-charcoal-800 flex flex-col justify-between z-50 md:hidden transform transition-transform duration-300 ease-in-out ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="p-6 space-y-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg">
                  <Landmark className="w-4 h-4 text-charcoal-950" />
                </div>
                <div>
                  <span className="font-heading text-base tracking-wider font-bold text-charcoal-100">
                    VIBHUTI
                  </span>
                  <span className="block font-sans text-[7px] tracking-[0.25em] text-teal-400 uppercase -mt-1 font-semibold">
                    Admin Panel
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsMobileSidebarOpen(false)}
                className="text-charcoal-500 hover:text-charcoal-200 p-1 bg-transparent border-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => { setActiveTab('leads'); setIsMobileSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold tracking-wide transition-all cursor-pointer border-0 bg-transparent text-left ${activeTab === 'leads' ? 'bg-teal-500/10 text-teal-400 border-l-2 border-teal-500 rounded-l-none' : 'text-charcoal-400 hover:text-charcoal-200 hover:bg-charcoal-800/50'}`}
              >
                <Users className="w-4 h-4 flex-shrink-0" />
                <span>Inquiries &amp; Leads</span>
              </button>
              <button
                onClick={() => { setActiveTab('blogs'); setIsMobileSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold tracking-wide transition-all cursor-pointer border-0 bg-transparent text-left ${activeTab === 'blogs' ? 'bg-teal-500/10 text-teal-400 border-l-2 border-teal-500 rounded-l-none' : 'text-charcoal-400 hover:text-charcoal-200 hover:bg-charcoal-800/50'}`}
              >
                <FileText className="w-4 h-4 flex-shrink-0" />
                <span>Blog Management</span>
              </button>
            </nav>
          </div>

          <div className="p-6 border-t border-charcoal-800/60 space-y-3">
            <div className="flex items-center gap-2 px-2 text-xs text-charcoal-500 font-mono">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Admin Active</span>
            </div>

            <Link
              to="/"
              onClick={() => setIsMobileSidebarOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-charcoal-400 hover:text-charcoal-200 hover:bg-charcoal-800/50 transition-all text-decoration-none"
            >
              <ExternalLink className="w-4 h-4 flex-shrink-0" />
              <span>View Website</span>
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/20 border-0 bg-transparent cursor-pointer transition-all text-left"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              <span>Log Out</span>
            </button>
          </div>
        </aside>

        {/* Desktop Sidebar (hidden on mobile) */}
        <aside className="hidden md:flex w-64 bg-charcoal-900 border-r border-charcoal-800 flex flex-col justify-between flex-shrink-0 min-h-screen sticky top-0">
          <div className="p-6 space-y-8">
            {/* Sidebar Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg">
                <Landmark className="w-4 h-4 text-charcoal-950" />
              </div>
              <div>
                <span className="font-heading text-base tracking-wider font-bold text-charcoal-100">
                  VIBHUTI
                </span>
                <span className="block font-sans text-[7px] tracking-[0.25em] text-teal-400 uppercase -mt-1 font-semibold">
                  Admin Panel
                </span>
              </div>
            </div>

            {/* Sidebar Navigation */}
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('leads')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold tracking-wide transition-all cursor-pointer border-0 bg-transparent text-left ${activeTab === 'leads' ? 'bg-teal-500/10 text-teal-400 border-l-2 border-teal-500 rounded-l-none' : 'text-charcoal-400 hover:text-charcoal-200 hover:bg-charcoal-800/50'}`}
              >
                <Users className="w-4 h-4 flex-shrink-0" />
                <span>Inquiries &amp; Leads</span>
              </button>
              <button
                onClick={() => setActiveTab('blogs')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold tracking-wide transition-all cursor-pointer border-0 bg-transparent text-left ${activeTab === 'blogs' ? 'bg-teal-500/10 text-teal-400 border-l-2 border-teal-500 rounded-l-none' : 'text-charcoal-400 hover:text-charcoal-200 hover:bg-charcoal-800/50'}`}
              >
                <FileText className="w-4 h-4 flex-shrink-0" />
                <span>Blog Management</span>
              </button>
            </nav>
          </div>

          {/* Sidebar Footer (View Site & Logout) */}
          <div className="p-6 border-t border-charcoal-800/60 space-y-3">
            <div className="flex items-center gap-2 px-2 text-xs text-charcoal-500 font-mono">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Admin Active</span>
            </div>

            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-charcoal-400 hover:text-charcoal-200 hover:bg-charcoal-800/50 transition-all text-decoration-none"
            >
              <ExternalLink className="w-4 h-4 flex-shrink-0" />
              <span>View Website</span>
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/20 border-0 bg-transparent cursor-pointer transition-all text-left"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              <span>Log Out</span>
            </button>
          </div>
        </aside>

        {/* Admin Content Area (responsive padding) */}
        <main className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-8 lg:p-12 space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="font-heading text-2xl font-bold">Admin <span className="text-gradient">Dashboard</span></h1>
              <p className="text-sm text-charcoal-400">Welcome back, {user.name}</p>
            </div>
            {activeTab === 'leads' && (
              <button onClick={handleExportCSV} className="btn-secondary text-sm">
                <Download className="w-4 h-4" /> Export CSV
              </button>
            )}
          </div>

          {activeTab === 'leads' ? (
            <>
              {/* Stats Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="card p-5 border-charcoal-700/50 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-charcoal-500 uppercase tracking-wider font-medium">Total Inquiries</span>
                    <span className="text-2xl font-bold text-charcoal-100 block mt-1">{stats.totalLeads}</span>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-teal-900/60 border border-teal-700/40 flex items-center justify-center">
                    <Users className="w-5 h-5 text-teal-400" />
                  </div>
                </div>

                <div className="card p-5 border-charcoal-700/50 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-charcoal-500 uppercase tracking-wider font-medium">Requested Volume</span>
                    <span className="text-xl font-bold text-teal-400 block mt-1">₹{stats.totalVolume.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-teal-900/60 border border-teal-700/40 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-teal-400" />
                  </div>
                </div>

                <div className="card p-5 border-charcoal-700/50 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-charcoal-500 uppercase tracking-wider font-medium">Pending Review</span>
                    <span className="text-2xl font-bold text-charcoal-100 block mt-1">{stats.pendingLeads}</span>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-teal-900/60 border border-teal-700/40 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-teal-400" />
                  </div>
                </div>

                <div className="card p-5 border-charcoal-700/50 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-charcoal-500 uppercase tracking-wider font-medium">Approval Rate</span>
                    <span className="text-2xl font-bold text-charcoal-100 block mt-1">{stats.approvalRate}%</span>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-teal-900/60 border border-teal-700/40 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-teal-400" />
                  </div>
                </div>
              </div>

              {/* Chart & Notes */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 card p-5 border-charcoal-700/50 overflow-hidden">
                  <h3 className="font-display font-semibold text-charcoal-100 text-sm mb-4">Weekly Lead Volume</h3>
                  <div className="w-full" style={{ minHeight: 200 }}>
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                          dataKey="name"
                          stroke="#6b7280"
                          tick={{ fontSize: 10, fill: '#9ca3af' }}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="#6b7280"
                          tick={{ fontSize: 10, fill: '#9ca3af' }}
                          tickLine={false}
                          axisLine={false}
                          width={32}
                          allowDecimals={false}
                        />
                        <ChartTooltip
                          contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px', fontSize: '12px', color: '#f3f4f6' }}
                          cursor={{ stroke: '#0d9488', strokeWidth: 1, strokeDasharray: '4 4' }}
                        />
                        <Area type="monotone" dataKey="leads" stroke="#0d9488" fillOpacity={1} fill="url(#colorLeads)" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#0d9488', strokeWidth: 0 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="card p-5 border-teal-500/10 bg-gradient-to-br from-charcoal-900 to-charcoal-950 flex flex-col justify-between">
                  <h3 className="font-display font-semibold text-charcoal-100 text-sm border-b border-charcoal-800 pb-2">Compliance Notes</h3>
                  <div className="space-y-3 my-4 text-sm text-charcoal-400">
                    <div className="flex gap-2 items-start">
                      <ShieldAlert className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                      <span>Verify PAN records before approving applications.</span>
                    </div>
                    <div className="flex gap-2 items-start">
                      <ShieldAlert className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                      <span>Cross-check asset documents before updating status.</span>
                    </div>
                  </div>
                  <div className="text-xs text-charcoal-500 bg-charcoal-800 p-3 rounded-lg border border-charcoal-700 leading-relaxed">
                    All actions are logged for audit purposes.
                  </div>
                </div>
              </div>

              {/* Active Applications Table */}
              <div className="card p-5 border-charcoal-700/50">
                <div className="mb-5">
                  <h3 className="font-display font-semibold text-charcoal-100 text-sm">Active Applications</h3>
                  <p className="text-xs text-charcoal-500 mt-0.5">Manage lead status and review documents.</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-charcoal-800 text-charcoal-500 uppercase text-xs tracking-wider font-medium">
                        <th className="py-3 px-3">Client</th>
                        <th className="py-3 px-3">Product</th>
                        <th className="py-3 px-3">Amount</th>
                        <th className="py-3 px-3">Contact</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3">Docs</th>
                        <th className="py-3 px-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-charcoal-800/60 text-charcoal-300">
                      {leads.map((lead) => (
                        <tr key={lead._id} className="hover:bg-charcoal-800/30 transition-colors">
                          <td className="py-3.5 px-3">
                            <span className="font-medium text-charcoal-100 block">{lead.customerName}</span>
                            <span className="text-xs text-charcoal-500">{new Date(lead.createdAt).toLocaleDateString()}</span>
                          </td>
                          <td className="py-3.5 px-3">{lead.loanType}</td>
                          <td className="py-3.5 px-3 font-mono font-medium">
                            {lead.loanAmount > 0 ? `₹${lead.loanAmount.toLocaleString('en-IN')}` : 'N/A'}
                          </td>
                          <td className="py-3.5 px-3 text-xs">
                            <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-teal-400" /> {lead.phone}</span>
                            <span className="flex items-center gap-1 mt-0.5 text-charcoal-500"><Mail className="w-3 h-3 text-teal-400" /> {lead.email}</span>
                          </td>
                          <td className="py-3.5 px-3">
                            <select
                              value={lead.status}
                              onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                              className={`text-xs font-medium border rounded-md px-2 py-1 bg-charcoal-800 focus:outline-none focus:border-teal-500/50 cursor-pointer ${getStatusColor(lead.status)}`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Contacted">Contacted</option>
                              <option value="In Review">In Review</option>
                              <option value="Approved">Approved</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          </td>
                          <td className="py-3.5 px-3">
                            {lead.documentUrls && lead.documentUrls.length > 0 ? (
                              <div className="flex flex-wrap gap-1.5">
                                {lead.documentUrls.map((doc, idx) => (
                                  <a
                                    key={idx}
                                    href={`http://localhost:5000${doc}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-[10px] text-teal-400 bg-teal-500/10 border border-teal-500/20 hover:border-teal-500/50 px-1.5 py-0.5 rounded transition-colors"
                                    title="View Document"
                                  >
                                    Doc {idx + 1}
                                  </a>
                                ))}
                              </div>
                            ) : (
                              <span className="text-xs text-charcoal-500 italic">None</span>
                            )}
                          </td>
                          <td className="py-3.5 px-3 text-center">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => openEditLead(lead)}
                                className="inline-flex items-center gap-1 text-xs text-teal-400 bg-teal-500/10 border border-teal-500/20 hover:border-teal-500/50 px-2 py-1 rounded transition-colors cursor-pointer"
                                title="Edit Inquiry Data"
                              >
                                <Pencil className="w-3 h-3" /> Edit
                              </button>
                              <button
                                onClick={() => handleLeadDelete(lead._id)}
                                className="inline-flex items-center gap-1 text-xs text-red-400 bg-red-500/10 border border-red-500/20 hover:border-red-500/50 px-2 py-1 rounded transition-colors cursor-pointer"
                                title="Delete Inquiry Record"
                              >
                                <Trash2 className="w-3 h-3" /> Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {leads.length === 0 && (
                  <div className="text-center py-10 text-charcoal-500 italic text-sm">
                    No applications found. Submit a loan application to generate records.
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Blog Management View */}
              <div className="card p-5 border-charcoal-700/50">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h3 className="font-display font-semibold text-charcoal-100 text-sm">Blog Articles ({blogs.length})</h3>
                    <p className="text-xs text-charcoal-500 mt-0.5">Manage posts, edit contents, and write new guides.</p>
                  </div>
                  <button onClick={openCreateBlog} className="btn-accent text-sm flex items-center gap-1.5 cursor-pointer">
                    <Plus className="w-4 h-4" /> Create Blog Post
                  </button>
                </div>

                {blogsLoading && blogs.length === 0 ? (
                  <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-8 h-8 text-teal-400 animate-spin" />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-charcoal-800 text-charcoal-500 uppercase text-xs tracking-wider font-medium">
                          <th className="py-3 px-3">Article Info</th>
                          <th className="py-3 px-3">Category</th>
                          <th className="py-3 px-3">Author</th>
                          <th className="py-3 px-3">Published Date</th>
                          <th className="py-3 px-3 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-charcoal-800/60 text-charcoal-300">
                        {blogs.map((blog) => (
                          <tr key={blog._id} className="hover:bg-charcoal-800/30 transition-colors">
                            <td className="py-3.5 px-3 flex items-center gap-3">
                              <div 
                                className="w-12 h-12 rounded-lg bg-cover bg-center bg-charcoal-800 border border-charcoal-700 flex-shrink-0"
                                style={{ backgroundImage: `url(${blog.coverImage || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80'})` }}
                              />
                              <div className="min-w-0 max-w-md">
                                <span className="font-semibold text-charcoal-100 block truncate" title={blog.title}>{blog.title}</span>
                                <span className="text-xs text-charcoal-500 line-clamp-1">{blog.summary}</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-3">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded whitespace-nowrap">
                                {blog.tags}
                              </span>
                            </td>
                            <td className="py-3.5 px-3 text-charcoal-300 font-mono text-xs whitespace-nowrap">{blog.author}</td>
                            <td className="py-3.5 px-3 text-xs text-charcoal-500 whitespace-nowrap">
                              {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </td>
                            <td className="py-3.5 px-3 text-center">
                              <div className="flex justify-center gap-2">
                                <button
                                  onClick={() => openEditBlog(blog)}
                                  className="inline-flex items-center gap-1 text-xs text-teal-400 bg-teal-500/10 border border-teal-500/20 hover:border-teal-500/50 px-2.5 py-1.5 rounded transition-colors cursor-pointer"
                                  title="Edit Post"
                                >
                                  <Pencil className="w-3.5 h-3.5" /> Edit
                                </button>
                                <button
                                  onClick={() => handleBlogDelete(blog._id)}
                                  className="inline-flex items-center gap-1 text-xs text-red-400 bg-red-500/10 border border-red-500/20 hover:border-red-500/50 px-2.5 py-1.5 rounded transition-colors cursor-pointer"
                                  title="Delete Post"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {blogs.length === 0 && !blogsLoading && (
                  <div className="text-center py-20 text-charcoal-500 italic text-sm">
                    No blog articles found. Click "Create Blog Post" to add record.
                  </div>
                )}
              </div>
            </>
          )}

          {/* Blog Edit/Create Modal Overlay */}
          {isBlogFormOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
              <div className="card w-full max-w-2xl bg-charcoal-900 border border-charcoal-800 rounded-xl p-6 shadow-2xl space-y-5 my-8">
                
                <div className="flex justify-between items-center border-b border-charcoal-800 pb-3">
                  <h3 className="font-heading text-lg font-bold text-charcoal-100">
                    {blogFormMode === 'create' ? 'Create New Blog Post' : 'Edit Blog Post'}
                  </h3>
                  <button 
                    onClick={() => setIsBlogFormOpen(false)}
                    className="text-charcoal-500 hover:text-charcoal-200 transition-colors p-1 bg-transparent border-0 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {blogError && (
                  <div className="p-3 rounded bg-red-950/40 border border-red-800/30 text-red-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{blogError}</span>
                  </div>
                )}

                <form onSubmit={handleBlogSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-charcoal-500 uppercase tracking-wider font-semibold">Title</label>
                      <input
                        type="text"
                        required
                        value={blogForm.title}
                        onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                        placeholder="Enter blog title"
                        className="w-full bg-charcoal-800 border border-charcoal-700 rounded-lg px-3 py-2 text-sm text-charcoal-100 placeholder-charcoal-500 focus:outline-none focus:border-teal-500/50"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-xs text-charcoal-500 uppercase tracking-wider font-semibold">Category / Tag</label>
                      <input
                        type="text"
                        required
                        value={blogForm.tags}
                        onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })}
                        placeholder="e.g. Home Loan"
                        className="w-full bg-charcoal-800 border border-charcoal-700 rounded-lg px-3 py-2 text-sm text-charcoal-100 placeholder-charcoal-500 focus:outline-none focus:border-teal-500/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-charcoal-500 uppercase tracking-wider font-semibold">Cover Image URL</label>
                    <input
                      type="text"
                      required
                      value={blogForm.coverImage}
                      onChange={(e) => setBlogForm({ ...blogForm, coverImage: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-charcoal-800 border border-charcoal-700 rounded-lg px-3 py-2 text-xs font-mono text-charcoal-100 placeholder-charcoal-500 focus:outline-none focus:border-teal-500/50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-charcoal-500 uppercase tracking-wider font-semibold">Summary</label>
                    <textarea
                      required
                      rows="2"
                      maxLength="300"
                      value={blogForm.summary}
                      onChange={(e) => setBlogForm({ ...blogForm, summary: e.target.value })}
                      placeholder="Provide a brief summary under 300 characters..."
                      className="w-full bg-charcoal-800 border border-charcoal-700 rounded-lg px-3 py-2 text-sm text-charcoal-100 placeholder-charcoal-500 focus:outline-none focus:border-teal-500/50 resize-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-charcoal-500 uppercase tracking-wider font-semibold">Full Article Content</label>
                    <textarea
                      required
                      rows="10"
                      value={blogForm.content}
                      onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                      placeholder="Write your article content here..."
                      className="w-full bg-charcoal-800 border border-charcoal-700 rounded-lg px-3 py-2 text-sm text-charcoal-100 placeholder-charcoal-500 focus:outline-none focus:border-teal-500/50 resize-none font-sans leading-relaxed"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-charcoal-800">
                    <button
                      type="button"
                      onClick={() => setIsBlogFormOpen(false)}
                      className="px-4 py-2 text-xs font-semibold text-charcoal-400 bg-charcoal-800 hover:bg-charcoal-700 border border-charcoal-700 rounded-lg cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={blogsLoading}
                      className="btn-accent text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      {blogsLoading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Processing...
                        </>
                      ) : (
                        blogFormMode === 'create' ? 'Publish Article' : 'Save Changes'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit Lead Inquiry Modal */}
          {isLeadModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={() => setIsLeadModalOpen(false)}
              />
              <div className="card relative max-w-lg w-full p-6 border-teal-500/20 bg-gradient-to-br from-charcoal-900 to-charcoal-950 space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b border-charcoal-800 pb-3">
                  <h3 className="font-heading text-lg font-bold">Edit Loan Inquiry</h3>
                  <button
                    onClick={() => setIsLeadModalOpen(false)}
                    className="p-1 bg-transparent border-0 text-charcoal-500 hover:text-charcoal-200 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {leadFormError && (
                  <div className="p-3 rounded bg-red-950/40 border border-red-800/30 text-red-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{leadFormError}</span>
                  </div>
                )}

                <form onSubmit={handleLeadSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-charcoal-500 uppercase tracking-wider font-semibold">Client Name</label>
                      <input
                        type="text"
                        required
                        value={leadForm.customerName}
                        onChange={(e) => setLeadForm({ ...leadForm, customerName: e.target.value })}
                        className="w-full bg-charcoal-800 border border-charcoal-700 rounded-lg px-3 py-2 text-sm text-charcoal-100 focus:outline-none focus:border-teal-500/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-charcoal-500 uppercase tracking-wider font-semibold">Email Address</label>
                      <input
                        type="email"
                        required
                        value={leadForm.email}
                        onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                        className="w-full bg-charcoal-800 border border-charcoal-700 rounded-lg px-3 py-2 text-sm text-charcoal-100 focus:outline-none focus:border-teal-500/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-charcoal-500 uppercase tracking-wider font-semibold">Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={leadForm.phone}
                        onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                        className="w-full bg-charcoal-800 border border-charcoal-700 rounded-lg px-3 py-2 text-sm text-charcoal-100 focus:outline-none focus:border-teal-500/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-charcoal-500 uppercase tracking-wider font-semibold">Loan Type</label>
                      <select
                        value={leadForm.loanType}
                        onChange={(e) => setLeadForm({ ...leadForm, loanType: e.target.value })}
                        className="w-full bg-charcoal-800 border border-charcoal-700 rounded-lg px-3 py-2 text-sm text-charcoal-100 focus:outline-none focus:border-teal-500/50 cursor-pointer"
                      >
                        <option value="Home Loan">Home Loan</option>
                        <option value="Business Loan">Business Loan</option>
                        <option value="Mortgage Loan">Mortgage Loan</option>
                        <option value="Education Loan">Education Loan</option>
                        <option value="Personal Loan">Personal Loan</option>
                        <option value="Credit Card">Credit Card</option>
                        <option value="Car Loan">Car Loan</option>
                        <option value="Two Wheeler Loan">Two Wheeler Loan</option>
                        <option value="Agriculture OD">Agriculture OD</option>
                        <option value="OD/CC/DOD">OD/CC/DOD</option>
                        <option value="Insurance Policy">Insurance Policy</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-xs text-charcoal-500 uppercase tracking-wider font-semibold">Loan Amount (₹)</label>
                      <input
                        type="number"
                        required
                        value={leadForm.loanAmount}
                        onChange={(e) => setLeadForm({ ...leadForm, loanAmount: e.target.value })}
                        className="w-full bg-charcoal-800 border border-charcoal-700 rounded-lg px-3 py-2 text-sm text-charcoal-100 focus:outline-none focus:border-teal-500/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-charcoal-500 uppercase tracking-wider font-semibold">Tenure (Years)</label>
                      <input
                        type="number"
                        required
                        value={leadForm.loanTenureYears}
                        onChange={(e) => setLeadForm({ ...leadForm, loanTenureYears: e.target.value })}
                        className="w-full bg-charcoal-800 border border-charcoal-700 rounded-lg px-3 py-2 text-sm text-charcoal-100 focus:outline-none focus:border-teal-500/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-charcoal-500 uppercase tracking-wider font-semibold">Verification Status</label>
                      <select
                        value={leadForm.status}
                        onChange={(e) => setLeadForm({ ...leadForm, status: e.target.value })}
                        className="w-full bg-charcoal-800 border border-charcoal-700 rounded-lg px-3 py-2 text-sm text-charcoal-100 focus:outline-none focus:border-teal-500/50 cursor-pointer"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Contacted">Contacted</option>
                        <option value="In Review">In Review</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-charcoal-500 uppercase tracking-wider font-semibold">Inquiry Message</label>
                    <textarea
                      rows="3"
                      value={leadForm.message}
                      onChange={(e) => setLeadForm({ ...leadForm, message: e.target.value })}
                      placeholder="Enter inquiry remarks..."
                      className="w-full bg-charcoal-800 border border-charcoal-700 rounded-lg px-3 py-2 text-sm text-charcoal-100 placeholder-charcoal-500 focus:outline-none focus:border-teal-500/50 resize-none font-sans"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-charcoal-800">
                    <button
                      type="button"
                      onClick={() => setIsLeadModalOpen(false)}
                      className="px-4 py-2 text-xs font-semibold text-charcoal-400 bg-charcoal-800 hover:bg-charcoal-700 border border-charcoal-700 rounded-lg cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={leadFormLoading}
                      className="btn-accent text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      {leadFormLoading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Updating...
                        </>
                      ) : (
                        'Update Application'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
      {/* Admin Logout Confirmation Modal */}
      {showAdminLogoutConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowAdminLogoutConfirm(false)}
          />

          {/* Modal Card */}
          <div className="relative z-10 w-full max-w-sm rounded-2xl border border-charcoal-700/60 bg-charcoal-900 shadow-2xl p-6 flex flex-col items-center gap-4" style={{ animation: 'fadeInScale 0.2s ease-out' }}>
            {/* Icon */}
            <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
              <LogOut className="w-6 h-6 text-red-400" />
            </div>

            {/* Text */}
            <div className="text-center space-y-1.5">
              <h3 className="text-charcoal-100 font-display font-bold text-lg">Confirm Admin Logout</h3>
              <p className="text-charcoal-400 text-sm leading-relaxed">
                Are you sure you want to logout from the Admin Dashboard? You will need to login again to access the panel.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 w-full mt-1">
              <button
                onClick={() => setShowAdminLogoutConfirm(false)}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-charcoal-300 bg-charcoal-800 hover:bg-charcoal-700 border border-charcoal-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={doAdminLogout}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-500 border border-red-500/40 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
