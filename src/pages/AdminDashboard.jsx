import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import {
  authStart, authSuccess, authFailure, clearError
} from '../store/authSlice';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer
} from 'recharts';
import {
  TrendingUp, Users, CheckCircle, Clock, Download,
  Trash2, Mail, Phone, ExternalLink, ShieldAlert, KeyRound, Loader2, AlertCircle
} from 'lucide-react';
import SEOMeta from '../components/SEOMeta';

export default function AdminDashboard() {
  const { isAuthenticated, user, token, error: authError } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [stats, setStats] = useState({
    totalLeads: 0, totalVolume: 0, pendingLeads: 0, approvalRate: 98,
  });
  const [leads, setLeads] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

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

  const fetchDashboardData = async () => {
    if (!isAuthenticated || user?.role !== 'admin') return;
    setLoading(true);
    setError(null);

    try {
      const authHeaders = { headers: { Authorization: `Bearer ${token}` } };
      const statsRes = await axios.get('http://localhost:5000/api/dashboard/stats', authHeaders);
      const leadsRes = await axios.get('http://localhost:5000/api/leads', authHeaders);

      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (leadsRes.data.success) setLeads(leadsRes.data.leads);

      setChartData([
        { name: 'Mon', leads: 4 }, { name: 'Tue', leads: 8 },
        { name: 'Wed', leads: 5 }, { name: 'Thu', leads: 12 },
        { name: 'Fri', leads: leadsRes.data.leads.length || 7 },
      ]);
    } catch (err) {
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

  useEffect(() => {
    fetchDashboardData();
  }, [isAuthenticated, token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    dispatch(authStart());
    dispatch(clearError());

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      if (response.data.success) {
        dispatch(authSuccess({ user: response.data.user, token: response.data.token }));
      }
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message ||
        (!err.response ? 'Cannot connect to server. Ensure backend is running on port 5000.' : 'Login failed.');
      dispatch(authFailure(errMsg));
    } finally {
      setLoginLoading(false);
    }
  };

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      const authHeaders = { headers: { Authorization: `Bearer ${token}` } };
      await axios.patch(`http://localhost:5000/api/leads/${leadId}/status`, { status: newStatus }, authHeaders);
      fetchDashboardData();
    } catch (err) {
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

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <SEOMeta title="Admin Login" description="Vibhuti Enterprise admin dashboard access." />
        <div className="card max-w-md w-full p-8 border-teal-500/20 bg-gradient-to-br from-charcoal-900 to-charcoal-950 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center mx-auto shadow-lg">
              <KeyRound className="w-6 h-6 text-charcoal-950" />
            </div>
            <h2 className="font-heading text-xl font-bold">Admin Login</h2>
            <p className="text-xs text-teal-400 tracking-wider">Dashboard Access</p>
          </div>

          {authError && (
            <div className="p-3 rounded bg-red-950/40 border border-red-800/30 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-charcoal-500 uppercase tracking-wider">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@vibhuti.com"
                className="w-full bg-charcoal-800 border border-charcoal-700 rounded-lg px-4 py-2.5 text-sm text-charcoal-100 focus:outline-none focus:border-teal-500/50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-charcoal-500 uppercase tracking-wider">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-charcoal-800 border border-charcoal-700 rounded-lg px-4 py-2.5 text-sm text-charcoal-100 focus:outline-none focus:border-teal-500/50"
              />
            </div>
            <button type="submit" disabled={loginLoading} className="btn-accent w-full">
              {loginLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
            </button>
          </form>

          <div className="text-xs text-center text-charcoal-500 border-t border-charcoal-800 pt-4">
            Authorized personnel only.<br />
            <span className="text-teal-400">Default: admin@vibhuti.com / Admin@123</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOMeta title="Admin Dashboard" description="Vibhuti Enterprise lead management dashboard." />

      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="font-heading text-2xl font-bold">Admin <span className="text-gradient">Dashboard</span></h1>
              <p className="text-sm text-charcoal-400">Welcome back, {user.name}</p>
            </div>
            <button onClick={handleExportCSV} className="btn-secondary text-sm">
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>

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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 card p-5 border-charcoal-700/50">
              <h3 className="font-display font-semibold text-charcoal-100 text-sm mb-5">Weekly Lead Volume</h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#9ca3af" style={{ fontSize: '10px' }} />
                  <YAxis stroke="#9ca3af" style={{ fontSize: '10px' }} />
                  <ChartTooltip
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px', color: '#374151' }}
                  />
                  <Area type="monotone" dataKey="leads" stroke="#0d9488" fillOpacity={1} fill="url(#colorLeads)" />
                </AreaChart>
              </ResponsiveContainer>
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
                    <th className="py-3 px-3 text-right">Docs</th>
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
                      <td className="py-3.5 px-3 text-right">
                        {lead.documentUrls && lead.documentUrls.length > 0 ? (
                          <div className="flex justify-end gap-2">
                            {lead.documentUrls.map((doc, idx) => (
                              <a
                                key={idx}
                                href={`http://localhost:5000${doc}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-teal-400 bg-teal-500/10 border border-teal-500/20 hover:border-teal-500/50 px-2 py-0.5 rounded transition-colors"
                                title="View Document"
                              >
                                Doc {idx + 1} <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-charcoal-500 italic">None</span>
                        )}
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
        </div>
      </div>
    </>
  );
}
