import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { Menu, X, User, LogOut, ChevronDown, Landmark, ShieldAlert } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [calcDropdown, setCalcDropdown] = useState(false);
  const [legalDropdown, setLegalDropdown] = useState(false);

  const { isAuthenticated, user, token, isAdminAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  // Loan Approval/Rejection Popup States
  const [notifyLead, setNotifyLead] = useState(null);
  const [showNotifyModal, setShowNotifyModal] = useState(false);

  useEffect(() => {
    let active = true;
    if (!isAuthenticated || !token) {
      setNotifyLead(null);
      setShowNotifyModal(false);
      return;
    }

    const checkLoanStatus = async () => {
      try {
        const authHeaders = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`${API_BASE_URL}/leads/my-leads`, authHeaders);
        if (response.data.success && active) {
          console.log(`[Navbar Notifications] Fetched ${response.data.leads.length} customer applications.`);
          const leadToNotify = response.data.leads.find(
            (lead) =>
              (lead.status === 'Approved' || lead.status === 'Rejected') &&
              !localStorage.getItem(`notify_dismissed_${lead._id}_${lead.status}`)
          );
          if (leadToNotify) {
            console.log(`[Navbar Notifications] Active notification triggered for lead ID: ${leadToNotify._id}, status: ${leadToNotify.status}`);
            setNotifyLead(leadToNotify);
            setShowNotifyModal(true);
          }
        }
      } catch (err) {
        console.error('Error checking loan status:', err);
      }
    };

    checkLoanStatus();
    // Poll every 3 seconds to discover status updates dynamically
    const interval = setInterval(checkLoanStatus, 3000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [isAuthenticated, token]);

  const handleDismissNotify = () => {
    if (notifyLead) {
      localStorage.setItem(`notify_dismissed_${notifyLead._id}_${notifyLead.status}`, 'true');
    }
    setShowNotifyModal(false);
  };

  // Auto-dismiss popup after 3 seconds
  useEffect(() => {
    if (showNotifyModal && notifyLead) {
      const timer = setTimeout(() => {
        handleDismissNotify();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showNotifyModal, notifyLead]);

  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const confirmLogout = () => {
    setIsOpen(false);
    setShowLogoutConfirm(true);
  };

  const doLogout = () => {
    setShowLogoutConfirm(false);
    dispatch(logout());
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-charcoal-950/90 backdrop-blur-md border-b border-charcoal-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg">
              <Landmark className="w-4 h-4 text-charcoal-950" />
            </div>
            <div>
              <span className="font-heading text-lg tracking-wider font-bold text-charcoal-100 group-hover:text-teal-400 transition-colors duration-300">
                VIBHUTI
              </span>
              <span className="block font-sans text-[8px] tracking-[0.25em] text-teal-400 uppercase -mt-1 font-semibold">
                Enterprise
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm transition-colors duration-200 ${isActive(link.path)
                  ? 'text-teal-400 font-medium'
                  : 'text-charcoal-400 hover:text-charcoal-100'
                  }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="relative">
              <button
                onClick={() => { setCalcDropdown(!calcDropdown); setLegalDropdown(false); }}
                className="flex items-center gap-1 text-sm text-charcoal-400 hover:text-charcoal-100 transition-colors duration-200"
              >
                Calculators <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {calcDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setCalcDropdown(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-charcoal-900 border border-charcoal-700 rounded-lg p-1.5 z-20 shadow-lg">
                    <Link
                      to="/emi-calculator"
                      onClick={() => setCalcDropdown(false)}
                      className="block px-3 py-2 text-sm text-charcoal-300 hover:text-charcoal-100 hover:bg-charcoal-800 rounded-md transition-colors"
                    >
                      EMI Calculator
                    </Link>
                    <Link
                      to="/loan-calculator"
                      onClick={() => setCalcDropdown(false)}
                      className="block px-3 py-2 text-sm text-charcoal-300 hover:text-charcoal-100 hover:bg-charcoal-800 rounded-md transition-colors"
                    >
                      Eligibility Checker
                    </Link>
                  </div>
                </>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => { setLegalDropdown(!legalDropdown); setCalcDropdown(false); }}
                className="flex items-center gap-1 text-sm text-charcoal-400 hover:text-charcoal-100 transition-colors duration-200"
              >
                Legal <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {legalDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setLegalDropdown(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-charcoal-900 border border-charcoal-700 rounded-lg p-1.5 z-20 shadow-lg">
                    <Link
                      to="/privacy-policy"
                      onClick={() => setLegalDropdown(false)}
                      className="block px-3 py-2 text-sm text-charcoal-300 hover:text-charcoal-100 hover:bg-charcoal-800 rounded-md transition-colors"
                    >
                      Privacy Policy
                    </Link>
                    <Link
                      to="/terms-of-service"
                      onClick={() => setLegalDropdown(false)}
                      className="block px-3 py-2 text-sm text-charcoal-300 hover:text-charcoal-100 hover:bg-charcoal-800 rounded-md transition-colors"
                    >
                      Terms of Service
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/apply-loan" className="btn-accent text-xs !px-4 !py-2">
              Apply Now
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-sm text-charcoal-300">
                  <User className="w-4 h-4 text-teal-400" />
                  <span className="max-w-[100px] truncate">{user.name}</span>
                </div>
                <button
                  onClick={confirmLogout}
                  className="text-charcoal-500 hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Link to="/contact" className="btn-primary text-xs !px-4 !py-2">
                  Get in Touch
                </Link>
                <Link to="/login" className="text-xs text-charcoal-400 hover:text-teal-400 font-semibold px-2 py-1.5 transition-colors">
                  Login
                </Link>
              </>
            )}
          </div>

      {/* Mobile hamburger button (in nav) */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-charcoal-800/60 border border-charcoal-700/50 text-charcoal-300 hover:text-charcoal-100 hover:bg-charcoal-700 transition-all"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[998] bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Drawer Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[85vw] max-w-[340px] z-[999] md:hidden flex flex-col bg-charcoal-950 border-l border-charcoal-800/80 shadow-2xl transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-charcoal-800">
          <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg">
              <Landmark className="w-4 h-4 text-charcoal-950" />
            </div>
            <div>
              <span className="font-heading text-sm tracking-wider font-bold text-charcoal-100">VIBHUTI</span>
              <span className="block font-sans text-[7px] tracking-[0.2em] text-teal-400 uppercase -mt-0.5 font-semibold">Enterprise</span>
            </div>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-charcoal-800/60 border border-charcoal-700/50 text-charcoal-400 hover:text-charcoal-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">

          {/* Main nav links */}
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive(link.path)
                  ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                  : 'text-charcoal-300 hover:text-charcoal-100 hover:bg-charcoal-800/60'
              }`}
            >
              {link.name}
              {isActive(link.path) && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-400" />
              )}
            </Link>
          ))}

          {/* Calculators section */}
          <div className="pt-3">
            <p className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-charcoal-600">Calculators</p>
            <Link to="/emi-calculator" onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${isActive('/emi-calculator') ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'text-charcoal-400 hover:text-charcoal-100 hover:bg-charcoal-800/60'}`}>
              <div className="w-7 h-7 rounded-lg bg-charcoal-800 border border-charcoal-700/50 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-bold text-teal-400">₹</span>
              </div>
              EMI Calculator
            </Link>
            <Link to="/loan-calculator" onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${isActive('/loan-calculator') ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'text-charcoal-400 hover:text-charcoal-100 hover:bg-charcoal-800/60'}`}>
              <div className="w-7 h-7 rounded-lg bg-charcoal-800 border border-charcoal-700/50 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-bold text-teal-400">%</span>
              </div>
              Eligibility Checker
            </Link>
          </div>

          {/* Legal section */}
          <div className="pt-2">
            <p className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-charcoal-600">Legal</p>
            <Link to="/privacy-policy" onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-charcoal-400 hover:text-charcoal-100 hover:bg-charcoal-800/60 transition-all">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-charcoal-400 hover:text-charcoal-100 hover:bg-charcoal-800/60 transition-all">
              Terms of Service
            </Link>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="px-4 py-4 border-t border-charcoal-800 space-y-3">
          {/* Apply Now CTA */}
          <Link
            to="/apply-loan"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-charcoal-950 transition-all shadow-lg shadow-teal-900/30"
          >
            Apply Now
          </Link>

          {isAuthenticated ? (
            <>
              {/* User chip */}
              <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-charcoal-800/60 border border-charcoal-700/40">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500/20 to-teal-700/20 border border-teal-600/30 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-teal-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-charcoal-100 truncate">{user.name}</p>
                  <p className="text-[10px] text-charcoal-500">Logged in</p>
                </div>
              </div>
              <button
                onClick={confirmLogout}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold text-red-400 border border-red-800/40 hover:bg-red-950/30 transition-all cursor-pointer bg-transparent"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex-1 text-center text-sm font-semibold text-charcoal-300 py-2.5 rounded-xl border border-charcoal-700/60 hover:bg-charcoal-800/60 hover:text-charcoal-100 transition-all"
              >
                Login
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="flex-1 text-center text-sm font-semibold text-teal-400 py-2.5 rounded-xl border border-teal-700/40 hover:bg-teal-900/20 transition-all"
              >
                Contact
              </Link>
            </div>
          )}
        </div>
      </div>


      {/* Loan Status Modal Notification (Approved or Rejected) */}
      {showNotifyModal && notifyLead && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            onClick={handleDismissNotify}
          />
          <div className={`card relative max-w-md w-full p-6 border bg-gradient-to-br from-charcoal-900 to-charcoal-950 text-center space-y-6 shadow-2xl animate-fade-in z-[10000] ${
            notifyLead.status === 'Approved' ? 'border-teal-500/40' : 'border-red-500/40'
          }`}>
            {/* Visual Icon Alert */}
            <div className={`mx-auto w-16 h-16 rounded-full border flex items-center justify-center animate-bounce ${
              notifyLead.status === 'Approved' 
                ? 'bg-teal-500/10 border-teal-500/30' 
                : 'bg-red-500/10 border-red-500/30'
            }`}>
              {notifyLead.status === 'Approved' ? (
                <Landmark className="w-8 h-8 text-teal-400" />
              ) : (
                <ShieldAlert className="w-8 h-8 text-red-400 animate-pulse" />
              )}
            </div>

            <div className="space-y-2">
              <h3 className={`font-heading text-2xl font-bold ${
                notifyLead.status === 'Approved' ? 'text-teal-400' : 'text-red-400'
              }`}>
                {notifyLead.status === 'Approved' ? 'Loan Approved!' : 'Application Rejected'}
              </h3>
              <p className="text-sm text-charcoal-300">
                Dear <span className="font-semibold text-charcoal-100">{notifyLead.customerName}</span>, your loan application has been {notifyLead.status === 'Approved' ? 'successfully approved.' : 'evaluated and rejected.'}
              </p>
            </div>

            {/* Approved/Rejected Loan Details */}
            <div className="bg-charcoal-800/50 border border-charcoal-800 rounded-xl p-4 text-left divide-y divide-charcoal-800/80 text-xs font-mono">
              <div className="flex justify-between py-2">
                <span className="text-charcoal-500">LOAN PRODUCT</span>
                <span className={`font-bold ${notifyLead.status === 'Approved' ? 'text-teal-400' : 'text-red-400'}`}>{notifyLead.loanType}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-charcoal-500">REQUESTED AMOUNT</span>
                <span className="text-charcoal-100 font-bold">₹{notifyLead.loanAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-charcoal-100/60">TENURE</span>
                <span className="text-charcoal-100 font-bold">{notifyLead.loanTenureYears} Years</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-charcoal-100/60">REFERENCE ID</span>
                <span className="text-charcoal-100 truncate max-w-[150px]" title={notifyLead._id}>
                  {notifyLead._id}
                </span>
              </div>
            </div>

            {notifyLead.status === 'Approved' ? (
              <p className="text-[10px] text-charcoal-500">
                Our coordinator will contact you shortly to finalize disbursement processing.
              </p>
            ) : (
              <p className="text-[10px] text-charcoal-500">
                Please contact support for more details regarding eligibility criteria.
              </p>
            )}

            <button
              onClick={handleDismissNotify}
              className={`w-full text-sm py-2.5 font-bold cursor-pointer transition-colors rounded-lg ${
                notifyLead.status === 'Approved' 
                  ? 'btn-accent' 
                  : 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 font-bold'
              }`}
            >
              {notifyLead.status === 'Approved' ? 'Great, Thank You!' : 'Close'}
            </button>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowLogoutConfirm(false)}
          />

          {/* Modal Card */}
          <div className="relative z-10 w-full max-w-sm rounded-2xl border border-charcoal-700/60 bg-charcoal-900 shadow-2xl p-6 flex flex-col items-center gap-4 animate-[fadeInScale_0.2s_ease-out]">
            {/* Icon */}
            <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
              <LogOut className="w-6 h-6 text-red-400" />
            </div>

            {/* Text */}
            <div className="text-center space-y-1.5">
              <h3 className="text-charcoal-100 font-display font-bold text-lg">Confirm Logout</h3>
              <p className="text-charcoal-400 text-sm leading-relaxed">
                Are you sure you want to logout from your account? You will need to login again to access your applications.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 w-full mt-1">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-charcoal-300 bg-charcoal-800 hover:bg-charcoal-700 border border-charcoal-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={doLogout}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-500 border border-red-500/40 transition-colors flex items-center justify-center gap-2"
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
