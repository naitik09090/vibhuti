import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  adminAuthStart, adminAuthSuccess, adminAuthFailure, adminClearError
} from '../store/authSlice';
import {
  KeyRound, Loader2, AlertCircle, Mail, Lock
} from 'lucide-react';
import SEOMeta from '../components/SEOMeta';
import { API_BASE_URL } from '../config';

export default function AdminLogin() {
  const { isAdminAuthenticated, adminUser, adminError, adminLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Redirect if already authenticated as admin
  useEffect(() => {
    if (isAdminAuthenticated) {
      navigate('/admin');
    }
  }, [isAdminAuthenticated, navigate]);

  // Clear errors on load
  useEffect(() => {
    dispatch(adminClearError());
  }, [dispatch]);

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(adminAuthStart());
    dispatch(adminClearError());

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      if (response.data.success) {
        const loggedUser = response.data.user;
        
        // Block non-admin roles on this login route
        if (loggedUser.role !== 'admin') {
          dispatch(adminAuthFailure('Access denied. This login portal is restricted to administrators. Standard users must sign in via the Customer Portal.'));
          return;
        }

        dispatch(adminAuthSuccess({ user: loggedUser, token: response.data.token }));
        navigate('/admin');
      }
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message ||
        (!err.response ? 'Cannot connect to server. Ensure backend is running.' : 'Login failed.');
      dispatch(adminAuthFailure(errMsg));
    }
  };

  return (
    <>
      <SEOMeta title="Admin Login" description="Vibhuti Enterprise admin dashboard access." />

      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="card max-w-md w-full p-8 border-teal-500/20 bg-gradient-to-br from-charcoal-900 to-charcoal-950 space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center mx-auto shadow-lg">
              <KeyRound className="w-6 h-6 text-charcoal-950" />
            </div>
            <h2 className="font-heading text-xl font-bold">Admin Login</h2>
            <p className="text-xs text-teal-400 tracking-wider">Dashboard Access</p>
          </div>

          {adminError && (
            <div className="p-3 rounded bg-red-950/40 border border-red-800/30 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{adminError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-charcoal-500 uppercase tracking-wider font-semibold">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-charcoal-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@vibhuti.com"
                  className="w-full bg-charcoal-800 border border-charcoal-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-charcoal-100 focus:outline-none focus:border-teal-500/50"
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-xs text-charcoal-500 uppercase tracking-wider font-semibold">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-charcoal-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-charcoal-800 border border-charcoal-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-charcoal-100 focus:outline-none focus:border-teal-500/50"
                />
              </div>
            </div>

            <button type="submit" disabled={adminLoading} className="btn-accent w-full flex items-center justify-center gap-2 mt-2">
              {adminLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
              Sign In
            </button>
          </form>

          <div className="text-center pt-2">
            <span className="text-xs text-charcoal-500">
              For customer accounts, navigate to{' '}
              <Link to="/login" className="text-teal-400 hover:underline">
                Customer Portal
              </Link>
            </span>
          </div>

        </div>
      </div>
    </>
  );
}
