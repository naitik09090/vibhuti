import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  authStart, authSuccess, authFailure, clearError
} from '../store/authSlice';
import {
  User, Lock, Mail, Phone, LogIn, UserPlus, Loader2, AlertCircle, CheckCircle
} from 'lucide-react';
import SEOMeta from '../components/SEOMeta';
import { API_BASE_URL } from '../config';

export default function Login() {
  const { isAuthenticated, user, error: authError, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('signin'); // 'signin' or 'signup'
  const [successMsg, setSuccessMsg] = useState(null);

  // Form Fields
  const [signInForm, setSignInForm] = useState({ email: '', password: '' });
  const [signUpForm, setSignUpForm] = useState({ name: '', email: '', phone: '', password: '' });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Clear errors on tab toggle
  useEffect(() => {
    dispatch(clearError());
    setSuccessMsg(null);
  }, [activeTab, dispatch]);

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    dispatch(authStart());
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, signInForm);
      if (response.data.success) {
        dispatch(authSuccess({ user: response.data.user, token: response.data.token }));
        if (response.data.user?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || 'Login failed. Please verify your credentials.';
      dispatch(authFailure(errMsg));
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    dispatch(authStart());
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, signUpForm);
      if (response.data.success) {
        setSuccessMsg('Account created successfully! Logging you in...');
        // Auto-login after registration
        setTimeout(() => {
          dispatch(authSuccess({ user: response.data.user, token: response.data.token }));
          if (response.data.user?.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/');
          }
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || 'Registration failed. Email might already be registered.';
      dispatch(authFailure(errMsg));
    }
  };

  return (
    <>
      <SEOMeta title={activeTab === 'signin' ? 'Sign In' : 'Create Account'} description="Vibhuti Enterprise Customer Portal login and registration." />

      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="card max-w-md w-full p-8 border-teal-500/10 bg-gradient-to-br from-charcoal-900 to-charcoal-950 space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center mx-auto shadow-lg">
              {activeTab === 'signin' ? <LogIn className="w-6 h-6 text-charcoal-950" /> : <UserPlus className="w-6 h-6 text-charcoal-950" />}
            </div>
            <h2 className="font-heading text-xl font-bold">
              {activeTab === 'signin' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-xs text-teal-400 tracking-wider">
              {activeTab === 'signin' ? 'Customer Portal Sign In' : 'Register for lending services'}
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-charcoal-800 gap-4">
            <button
              onClick={() => setActiveTab('signin')}
              className={`pb-2 text-sm font-semibold tracking-wide border-b-2 transition-all cursor-pointer bg-transparent border-none ${activeTab === 'signin' ? 'border-teal-500 text-teal-400' : 'border-transparent text-charcoal-400 hover:text-charcoal-200'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`pb-2 text-sm font-semibold tracking-wide border-b-2 transition-all cursor-pointer bg-transparent border-none ${activeTab === 'signup' ? 'border-teal-500 text-teal-400' : 'border-transparent text-charcoal-400 hover:text-charcoal-200'}`}
            >
              Create Account
            </button>
          </div>

          {/* Feedback alerts */}
          {authError && (
            <div className="p-3 rounded bg-red-950/40 border border-red-800/30 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded bg-emerald-950/40 border border-emerald-800/30 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 flex-shrink-0 animate-pulse" />
              <span>{successMsg}</span>
            </div>
          )}

          {activeTab === 'signin' ? (
            /* Sign In Form */
            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-charcoal-500 uppercase tracking-wider font-semibold">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-charcoal-500" />
                  <input
                    type="email"
                    required
                    value={signInForm.email}
                    onChange={(e) => setSignInForm({ ...signInForm, email: e.target.value })}
                    placeholder="Enter your email"
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
                    value={signInForm.password}
                    onChange={(e) => setSignInForm({ ...signInForm, password: e.target.value })}
                    placeholder="Enter password"
                    className="w-full bg-charcoal-800 border border-charcoal-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-charcoal-100 focus:outline-none focus:border-teal-500/50"
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-accent w-full flex items-center justify-center gap-2 mt-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                Sign In
              </button>
            </form>
          ) : (
            /* Sign Up / Create Account Form */
            <form onSubmit={handleSignUpSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-charcoal-500 uppercase tracking-wider font-semibold">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-charcoal-500" />
                  <input
                    type="text"
                    required
                    value={signUpForm.name}
                    onChange={(e) => setSignUpForm({ ...signUpForm, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full bg-charcoal-800 border border-charcoal-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-charcoal-100 focus:outline-none focus:border-teal-500/50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-charcoal-500 uppercase tracking-wider font-semibold">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-charcoal-500" />
                  <input
                    type="email"
                    required
                    value={signUpForm.email}
                    onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full bg-charcoal-800 border border-charcoal-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-charcoal-100 focus:outline-none focus:border-teal-500/50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-charcoal-500 uppercase tracking-wider font-semibold">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 w-4 h-4 text-charcoal-500" />
                  <input
                    type="tel"
                    required
                    value={signUpForm.phone}
                    onChange={(e) => setSignUpForm({ ...signUpForm, phone: e.target.value })}
                    placeholder="+91 99887 76655"
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
                    value={signUpForm.password}
                    onChange={(e) => setSignUpForm({ ...signUpForm, password: e.target.value })}
                    placeholder="Min 6 characters"
                    minLength="6"
                    className="w-full bg-charcoal-800 border border-charcoal-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-charcoal-100 focus:outline-none focus:border-teal-500/50"
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-accent w-full flex items-center justify-center gap-2 mt-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                Register
              </button>
            </form>
          )}

          <div className="text-center pt-2">
            <span className="text-xs text-charcoal-500">
              For administrative portals, navigate to{' '}
              <Link to="/admin" className="text-teal-400 hover:underline">
                Admin Panel
              </Link>
            </span>
          </div>

        </div>
      </div>
    </>
  );
}
