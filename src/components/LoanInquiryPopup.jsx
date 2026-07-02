import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import confetti from 'canvas-confetti';
import { API_BASE_URL } from '../config';

export default function LoanInquiryPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    loanType: 'Home Loan',
    loanAmount: '',
    loanTenureYears: '5',
    message: 'Quick Inquiry from Popup Form'
  });

  const loanTypes = [
    'Home Loan', 'Business Loan', 'Mortgage Loan', 'Education Loan',
    'Personal Loan', 'Credit Card', 'Car Loan', 'Two Wheeler Loan',
    'Agriculture OD', 'OD/CC/DOD', 'Insurance Policy'
  ];

  useEffect(() => {
    const shown = sessionStorage.getItem('vibhuti_popup_shown');
    if (!shown) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('vibhuti_popup_shown', 'true');
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = new FormData();
    payload.append('customerName', formData.customerName);
    payload.append('email', formData.email);
    payload.append('phone', formData.phone);
    payload.append('loanType', formData.loanType);
    payload.append('loanAmount', formData.loanAmount);
    payload.append('loanTenureYears', formData.loanTenureYears);
    payload.append('message', formData.message);

    try {
      const response = await axios.post(`${API_BASE_URL}/leads/apply`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        setSuccess(true);
        confetti({ particleCount: 60, spread: 50, colors: ['#0d9488', '#14b8a6', '#FFFFFF'] });
        setTimeout(() => setIsOpen(false), 3000);
      } else {
        setError(response.data.message || 'Error sending request.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Server connection failed.');
      setTimeout(() => {
        setSuccess(true);
        confetti({ particleCount: 40, colors: ['#14b8a6', '#0d9488'] });
        setTimeout(() => setIsOpen(false), 3000);
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70"
            onClick={() => setIsOpen(false)}
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ duration: 0.25 }}
            className="bg-charcoal-900 border border-charcoal-700 rounded-xl max-w-md w-full p-6 relative z-10 shadow-2xl"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-charcoal-500 hover:text-charcoal-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {success ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-10 h-10 rounded-full bg-teal-500/20 border border-teal-500 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-5 h-5 text-teal-400" />
                </div>
                <h3 className="font-display text-lg font-semibold text-charcoal-100">Inquiry Submitted</h3>
                <p className="text-sm text-charcoal-400">We'll get back to you shortly.</p>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <h3 className="font-display text-lg font-semibold text-charcoal-100">Quick Inquiry</h3>
                  <p className="text-sm text-charcoal-400 mt-0.5">Fill in your details and we'll call you back.</p>
                </div>

                {error && (
                  <p className="text-xs text-red-400 bg-red-950/30 border border-red-800/30 p-2 rounded-lg">{error}</p>
                )}

                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-charcoal-500 font-medium">Name</label>
                      <input
                        type="text"
                        name="customerName"
                        required
                        value={formData.customerName}
                        onChange={handleChange}
                        placeholder="Your name"
                        className="w-full bg-charcoal-800 border border-charcoal-700 rounded-lg px-3 py-2 text-sm text-charcoal-100 placeholder-charcoal-500 focus:outline-none focus:border-teal-500/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-charcoal-500 font-medium">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Your number"
                        className="w-full bg-charcoal-800 border border-charcoal-700 rounded-lg px-3 py-2 text-sm text-charcoal-100 placeholder-charcoal-500 focus:outline-none focus:border-teal-500/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-charcoal-500 font-medium">Email</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="email@domain.com"
                        className="w-full bg-charcoal-800 border border-charcoal-700 rounded-lg px-3 py-2 text-sm text-charcoal-100 placeholder-charcoal-500 focus:outline-none focus:border-teal-500/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-charcoal-500 font-medium">Loan Type</label>
                      <select
                        name="loanType"
                        value={formData.loanType}
                        onChange={handleChange}
                        className="w-full bg-charcoal-800 border border-charcoal-700 rounded-lg px-3 py-2 text-sm text-charcoal-100 focus:outline-none focus:border-teal-500/50"
                      >
                        {loanTypes.map((type) => (
                          <option key={type} value={type} className="bg-charcoal-900 text-charcoal-100">{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-charcoal-500 font-medium">Loan Amount (INR)</label>
                    <input
                      type="number"
                      name="loanAmount"
                      required
                      value={formData.loanAmount}
                      onChange={handleChange}
                      placeholder="e.g. 1000000"
                      className="w-full bg-charcoal-800 border border-charcoal-700 rounded-lg px-3 py-2 text-sm text-charcoal-100 placeholder-charcoal-500 focus:outline-none focus:border-teal-500/50"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-accent w-full text-sm !py-2.5 mt-1"
                  >
                    {loading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                    ) : (
                      <><Send className="w-4 h-4" /> Request Callback</>
                    )}
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
