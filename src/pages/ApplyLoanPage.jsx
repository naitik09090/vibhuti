import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import confetti from 'canvas-confetti';
import { ShieldAlert, Landmark, FileText, Upload, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import SEOMeta from '../components/SEOMeta';

export default function ApplyLoanPage() {
  const location = useLocation();
  const defaultLoan = location.state?.defaultLoanType || 'Home Loan';

  const loanTypes = [
    'Home Loan', 'Business Loan', 'Mortgage Loan', 'Education Loan',
    'Personal Loan', 'Balance Transfer', 'Credit Card', 'Car Loan',
    'Two Wheeler Loan', 'Agriculture OD', 'OD/CC/DOD', 'Insurance Policy'
  ];

  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    loanType: defaultLoan,
    loanAmount: '',
    loanTenureYears: '',
    message: ''
  });

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [leadId, setLeadId] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setDocuments(Array.from(e.target.files));
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

    documents.forEach(doc => {
      payload.append('documents', doc);
    });

    try {
      const response = await axios.post('http://localhost:5000/api/leads/apply', payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        setSuccess(true);
        setLeadId(response.data.lead._id || 'VIBHUTI-REF-LEAD');
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0d9488', '#14b8a6', '#FFFFFF']
        });
      } else {
        setError(response.data.message || 'Error submitting application.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed connecting to servers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOMeta
        title="Apply Loan"
        description="Submit your loan or credit line application securely to Vibhuti Enterprise."
      />

      <div className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          {success ? (
            <div className="card p-10 border-teal-500/30 bg-gradient-to-br from-charcoal-900 to-charcoal-950 text-center space-y-6">
              <div className="w-14 h-14 rounded-full bg-teal-500/10 border border-teal-500/50 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-teal-400" />
              </div>

              <div className="space-y-2">
                <h2 className="font-heading text-2xl font-bold">Application Received</h2>
                <p className="text-sm text-charcoal-400">
                  Thank you, {formData.customerName}. Your application has been forwarded to our team.
                </p>
              </div>

              <div className="p-4 bg-charcoal-800 border border-charcoal-700 rounded-xl max-w-sm mx-auto font-mono text-xs text-charcoal-300">
                <span className="text-charcoal-500 block uppercase font-medium tracking-wider mb-1">Reference ID</span>
                <span className="text-sm text-teal-400 font-bold">{leadId}</span>
              </div>

              <p className="text-xs text-charcoal-500">
                We will contact you at {formData.phone} or {formData.email} within 2-4 business hours.
              </p>

              <div className="pt-4">
                <button
                  onClick={() => {
                    setSuccess(false);
                    setFormData({
                      customerName: '', email: '', phone: '',
                      loanType: defaultLoan, loanAmount: '', loanTenureYears: '', message: ''
                    });
                    setDocuments([]);
                  }}
                  className="btn-secondary mx-auto text-sm"
                >
                  Submit Another Application
                </button>
              </div>
            </div>
          ) : (
            <div className="card p-8 border-charcoal-700/50 space-y-6">
              <div className="text-center space-y-2">
                <h1 className="font-heading text-2xl font-bold">
                  Loan <span className="text-gradient">Application</span>
                </h1>
                <p className="text-sm text-charcoal-400">
                  Provide your details and submit your application securely.
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/30 flex items-center gap-3 text-red-400 text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-charcoal-500 uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      name="customerName"
                      required
                      value={formData.customerName}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      className="w-full bg-charcoal-800 border border-charcoal-700 rounded-lg px-3 py-2.5 text-sm text-charcoal-100 placeholder-charcoal-500 focus:outline-none focus:border-teal-500/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-charcoal-500 uppercase tracking-wider">Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@domain.com"
                      className="w-full bg-charcoal-800 border border-charcoal-700 rounded-lg px-3 py-2.5 text-sm text-charcoal-100 placeholder-charcoal-500 focus:outline-none focus:border-teal-500/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-charcoal-500 uppercase tracking-wider">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 99999 88888"
                      className="w-full bg-charcoal-800 border border-charcoal-700 rounded-lg px-3 py-2.5 text-sm text-charcoal-100 placeholder-charcoal-500 focus:outline-none focus:border-teal-500/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-charcoal-500 uppercase tracking-wider">Loan Type</label>
                    <select
                      name="loanType"
                      value={formData.loanType}
                      onChange={handleChange}
                      className="w-full bg-charcoal-800 border border-charcoal-700 rounded-lg px-3 py-2.5 text-sm text-charcoal-100 focus:outline-none focus:border-teal-500/50"
                    >
                      {loanTypes.map(type => (
                        <option key={type} value={type} className="bg-charcoal-900 text-charcoal-100">{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-charcoal-500 uppercase tracking-wider">Amount (INR)</label>
                    <input
                      type="number"
                      name="loanAmount"
                      required
                      value={formData.loanAmount}
                      onChange={handleChange}
                      placeholder="e.g. 500000"
                      className="w-full bg-charcoal-800 border border-charcoal-700 rounded-lg px-3 py-2.5 text-sm text-charcoal-100 placeholder-charcoal-500 focus:outline-none focus:border-teal-500/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-charcoal-500 uppercase tracking-wider">Tenure (Years)</label>
                    <input
                      type="number"
                      name="loanTenureYears"
                      required
                      value={formData.loanTenureYears}
                      onChange={handleChange}
                      placeholder="e.g. 15"
                      className="w-full bg-charcoal-800 border border-charcoal-700 rounded-lg px-3 py-2.5 text-sm text-charcoal-100 placeholder-charcoal-500 focus:outline-none focus:border-teal-500/50"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-charcoal-500 uppercase tracking-wider">Notes</label>
                  <textarea
                    name="message"
                    rows="3"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Additional details about your requirements"
                    className="w-full bg-charcoal-800 border border-charcoal-700 rounded-lg px-3 py-2.5 text-sm text-charcoal-100 placeholder-charcoal-500 focus:outline-none focus:border-teal-500/50 resize-none"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs text-charcoal-500 uppercase tracking-wider block">
                    Upload Documents (PDF/Images)
                  </label>

                  <div className="border-2 border-dashed border-charcoal-700 rounded-lg p-6 hover:border-teal-500/30 transition-all flex flex-col items-center justify-center bg-charcoal-800/50 cursor-pointer relative">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Upload className="w-6 h-6 text-teal-400 mb-2" />
                    <span className="text-sm text-charcoal-400 font-medium mb-1">Click to upload files</span>
                    <span className="text-xs text-charcoal-500">Aadhaar, PAN, ITR, salary slips</span>
                  </div>

                  {documents.length > 0 && (
                    <div className="space-y-2 mt-3">
                      <p className="text-xs text-teal-400 font-medium">Selected files:</p>
                      {documents.map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm text-charcoal-300 bg-charcoal-800 px-3 py-2 border border-charcoal-700 rounded-lg">
                          <span className="truncate max-w-[250px]">{doc.name}</span>
                          <span className="text-xs text-charcoal-500 font-mono">{(doc.size / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2.5 p-3 rounded-lg border border-teal-500/10 bg-teal-500/5 text-xs text-charcoal-400 leading-normal">
                  <Landmark className="w-4 h-4 text-teal-400 flex-shrink-0" />
                  <span>By submitting, you authorize Vibhuti Enterprise to verify your credit profile. Your data is kept confidential.</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-accent w-full text-sm"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
