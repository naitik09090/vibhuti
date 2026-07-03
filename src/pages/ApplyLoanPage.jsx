import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import confetti from 'canvas-confetti';
import { Landmark, FileText, Upload, CheckCircle2, Loader2, AlertCircle, CheckCircle, X, Trash2 } from 'lucide-react';
import SEOMeta from '../components/SEOMeta';
import { API_BASE_URL } from '../config';

const requiredDocsByLoanType = {
  'Home Loan': ['Aadhaar & PAN Card', '3 Months Payslips', '6 Months Bank Statements', 'Property Valuation Documents'],
  'Business Loan': ['KYC (PAN/Aadhaar) of Directors', '3 Years Audited Financial Statements', '1 Year Current Account Statement', 'Company Registration & GST Certificate'],
  'Mortgage Loan': ['PAN & Aadhaar Certificate', 'Original Property Title Deeds & Search Report', '3 Years Personal & Corporate ITR', '6 Months Savings & Current Statements'],
  'Education Loan': ['Student KYC & Academic Marksheets', 'Co-borrower Income Proofs & ITR', 'Admission Offer Letter from Institute', 'Detailed Course Fee Structure'],
  'Personal Loan': ['PAN & Aadhaar Card', '3 Months Salary Payslips', '3 Months Bank Statements', 'Office ID & Address Proof'],
  'Balance Transfer': ['Existing Loan Sanction Letter', 'Foreclosure & Amortization Statement', 'KYC & Last 6 Months Bank Statement', 'Property Document Copies'],
  'Credit Card': ['PAN & Aadhaar Card copy', 'Salary Slip / Last 2 Years ITR', 'Current Residence Address Proof'],
  'Car Loan': ['PAN & Aadhaar Card details', 'Salary Slip or Form 16', '6 Months Bank Statements', 'Official Vehicle Proforma Invoice'],
  'Two Wheeler Loan': ['PAN & Aadhaar Card', 'Salary Slips or Bank Account Statement', 'Vehicle Invoice Quotation'],
  'Agriculture OD': ['PAN & Aadhaar Card', 'Land ownership 7/12 & 8A Records', 'Agriculture Income Certificate', 'Bank Statements'],
  'OD/CC/DOD': ['Corporate KYC & Company PAN', '3 Years Audited Financial Reports', 'GST Return Filing (GSTR-3B) logs', 'Stock and Book Debtors Statement'],
  'Insurance Policy': ['KYC Identity Documents', 'Age & Current Address Proof', 'Income Declarations & ITR', 'Medical Checkup Records (if applicable)'],
};

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
  const [docError, setDocError] = useState(false);
  const [leadId, setLeadId] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setDocuments(files);
    if (files.length > 0) setDocError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (documents.length === 0) {
      setDocError(true);
      const uploadSection = document.getElementById('doc-upload-section');
      if (uploadSection) uploadSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
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
      const response = await axios.post(`${API_BASE_URL}/leads/apply`, payload, {
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

  const requiredDocs = requiredDocsByLoanType[formData.loanType] || [];

  // Edit documents modal state
  const [showEditDocs, setShowEditDocs] = useState(false);
  const [editDocs, setEditDocs] = useState([]);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);
  const [existingDocs, setExistingDocs] = useState([]);
  const [docsLoading, setDocsLoading] = useState(false);
  const [deletingIdx, setDeletingIdx] = useState(null);

  const fetchExistingDocs = async (id) => {
    setDocsLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/leads/${id}/documents`);
      if (res.data.success) setExistingDocs(res.data.documents || []);
    } catch (_) {}
    setDocsLoading(false);
  };

  const handleOpenEditModal = () => {
    setShowEditDocs(true);
    setEditError(null);
    setEditDocs([]);
    fetchExistingDocs(leadId);
  };

  const handleAddDocuments = async () => {
    if (editDocs.length === 0) {
      setEditError('Please select at least one document to upload.');
      return;
    }
    setEditLoading(true);
    setEditError(null);
    const payload = new FormData();
    editDocs.forEach(doc => payload.append('documents', doc));
    try {
      const response = await axios.patch(`${API_BASE_URL}/leads/${leadId}/documents`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        setEditDocs([]);
        await fetchExistingDocs(leadId);
      } else {
        setEditError(response.data.message || 'Upload failed.');
      }
    } catch (err) {
      setEditError(err.response?.data?.message || 'Failed to upload documents. Please try again.');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteDoc = async (idx) => {
    setDeletingIdx(idx);
    try {
      const res = await axios.delete(`${API_BASE_URL}/leads/${leadId}/documents/${idx}`);
      if (res.data.success) {
        setExistingDocs(res.data.documents || []);
      } else {
        setEditError(res.data.message || 'Delete failed.');
      }
    } catch (err) {
      setEditError(err.response?.data?.message || 'Failed to delete document.');
    } finally {
      setDeletingIdx(null);
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
            <>
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

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={handleOpenEditModal}
                    className="btn-primary text-sm flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Edit / Add Documents
                  </button>
                  <button
                    onClick={() => {
                      setSuccess(false);
                      setFormData({
                        customerName: '', email: '', phone: '',
                        loanType: defaultLoan, loanAmount: '', loanTenureYears: '', message: ''
                      });
                      setDocuments([]);
                    }}
                    className="btn-secondary text-sm"
                  >
                    Submit Another Application
                  </button>
                </div>
              </div>

              {/* Edit Documents Modal */}
              {showEditDocs && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                  <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowEditDocs(false)} />
                  <div className="relative z-10 w-full max-w-md rounded-2xl border border-charcoal-700/60 bg-charcoal-900 shadow-2xl p-6 space-y-4" style={{ animation: 'fadeInScale 0.2s ease-out' }}>
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-teal-400" />
                        <h3 className="font-display font-bold text-charcoal-100 text-base">Manage Documents</h3>
                      </div>
                      <button onClick={() => setShowEditDocs(false)} className="text-charcoal-500 hover:text-charcoal-200 transition-colors bg-transparent border-0 cursor-pointer">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Reference */}
                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-charcoal-800 border border-charcoal-700">
                      <span className="text-[10px] text-charcoal-500 uppercase tracking-wider font-medium">Ref ID:</span>
                      <span className="text-xs text-teal-400 font-mono font-bold truncate">{leadId}</span>
                    </div>

                    {/* Error */}
                    {editError && (
                      <p className="text-xs text-red-400 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {editError}
                      </p>
                    )}

                    {/* Existing Documents */}
                    <div className="space-y-2">
                      <p className="text-[10px] text-charcoal-500 uppercase tracking-wider font-medium">
                        Uploaded Documents {existingDocs.length > 0 && `(${existingDocs.length})`}
                      </p>
                      {docsLoading ? (
                        <div className="flex items-center gap-2 text-xs text-charcoal-500 py-2">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading documents...
                        </div>
                      ) : existingDocs.length === 0 ? (
                        <p className="text-xs text-charcoal-600 italic py-1">No documents uploaded yet.</p>
                      ) : (
                        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                          {existingDocs.map((url, idx) => {
                            const fileName = url.split('/').pop();
                            const ext = fileName.split('.').pop().toLowerCase();
                            const isImage = ['jpg','jpeg','png','webp'].includes(ext);
                            return (
                              <div key={idx} className="flex items-center gap-2 bg-charcoal-800 border border-charcoal-700 rounded-lg px-3 py-2 group">
                                <div className="w-7 h-7 rounded-md bg-teal-900/40 border border-teal-700/30 flex items-center justify-center flex-shrink-0">
                                  <FileText className="w-3.5 h-3.5 text-teal-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs text-charcoal-200 truncate font-medium">{decodeURIComponent(fileName)}</p>
                                  <p className="text-[10px] text-charcoal-500 uppercase">{ext} file</p>
                                </div>
                                {isImage && (
                                  <a href={`${API_BASE_URL.replace('/api', '')}${url}`} target="_blank" rel="noreferrer" className="text-[10px] text-teal-400 hover:text-teal-300 flex-shrink-0 hidden group-hover:block">
                                    View
                                  </a>
                                )}
                                <button
                                  onClick={() => handleDeleteDoc(idx)}
                                  disabled={deletingIdx === idx}
                                  className="w-7 h-7 rounded-md flex items-center justify-center text-charcoal-500 hover:text-red-400 hover:bg-red-900/20 transition-colors flex-shrink-0 bg-transparent border-0 cursor-pointer disabled:opacity-50"
                                  title="Delete document"
                                >
                                  {deletingIdx === idx
                                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    : <Trash2 className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Divider */}
                    <div className="border-t border-charcoal-800" />

                    {/* Add More Documents */}
                    <div className="space-y-2">
                      <p className="text-[10px] text-charcoal-500 uppercase tracking-wider font-medium">Add More Documents</p>
                      <div className={`border-2 border-dashed rounded-xl p-4 transition-all flex flex-col items-center justify-center cursor-pointer relative ${editDocs.length > 0 ? 'border-teal-500/50 bg-teal-500/5' : 'border-charcoal-700 hover:border-teal-500/30 bg-charcoal-800/50'}`}>
                        <input type="file" multiple onChange={(e) => { setEditDocs(Array.from(e.target.files)); setEditError(null); }} className="absolute inset-0 opacity-0 cursor-pointer" accept=".pdf,.jpg,.jpeg,.png,.webp" />
                        <Upload className="w-5 h-5 text-teal-400 mb-1" />
                        <span className="text-xs text-charcoal-400 font-medium">Click to select files</span>
                        <span className="text-[10px] text-charcoal-500 mt-0.5">PDF, JPG, PNG, WEBP</span>
                      </div>

                      {editDocs.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-xs text-teal-400 font-medium">{editDocs.length} file(s) selected:</p>
                          {editDocs.map((f, i) => (
                            <div key={i} className="flex items-center justify-between text-xs text-charcoal-300 bg-charcoal-800 px-3 py-1.5 border border-charcoal-700 rounded-lg">
                              <span className="truncate max-w-[180px]">{f.name}</span>
                              <span className="text-charcoal-500 font-mono">{(f.size / 1024 / 1024).toFixed(2)} MB</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3 pt-1">
                      <button onClick={() => setShowEditDocs(false)} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-charcoal-300 bg-charcoal-800 hover:bg-charcoal-700 border border-charcoal-700 transition-colors cursor-pointer">
                        Close
                      </button>
                      <button onClick={handleAddDocuments} disabled={editLoading || editDocs.length === 0} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-teal-600 hover:bg-teal-500 border border-teal-500/40 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40">
                        {editLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</> : <><Upload className="w-4 h-4" /> Upload</>}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
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

                {/* Dynamic Required Documents Panel */}
                {requiredDocs.length > 0 && (
                  <div className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-4 space-y-2.5">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="w-4 h-4 text-teal-400 flex-shrink-0" />
                      <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
                        Required Documents — {formData.loanType}
                      </span>
                    </div>
                    <ul className="space-y-1.5">
                      {requiredDocs.map((doc, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-charcoal-300">
                          <CheckCircle className="w-3.5 h-3.5 text-teal-500 flex-shrink-0 mt-0.5" />
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-[10px] text-charcoal-500 pt-1.5 border-t border-charcoal-700/50">
                      Please keep the above documents ready before uploading below.
                    </p>
                  </div>
                )}

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

                <div id="doc-upload-section" className="space-y-3">
                  <label className="text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <span className={docError ? 'text-red-400' : 'text-charcoal-500'}>Upload Documents (PDF/Images)</span>
                    <span className="text-red-400 font-bold">*</span>
                    <span className="text-charcoal-600 font-normal normal-case tracking-normal">(Required)</span>
                  </label>

                  <div className={`border-2 border-dashed rounded-lg p-6 transition-all flex flex-col items-center justify-center bg-charcoal-800/50 cursor-pointer relative ${docError
                      ? 'border-red-500/60 hover:border-red-400/80'
                      : 'border-charcoal-700 hover:border-teal-500/30'
                    }`}>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      accept=".pdf,.jpg,.jpeg,.png,.webp"
                    />
                    <Upload className="w-6 h-6 text-teal-400 mb-2" />
                    <span className="text-sm text-charcoal-400 font-medium mb-1">Click to upload files</span>
                    <span className="text-xs text-charcoal-500 text-center">
                      {requiredDocs.length > 0
                        ? requiredDocs.slice(0, 2).join(', ') + (requiredDocs.length > 2 ? ` +${requiredDocs.length - 2} more` : '')
                        : 'Aadhaar, PAN, ITR, salary slips'}
                    </span>
                  </div>

                  {docError && (
                    <p className="text-xs text-red-400 flex items-center gap-1.5 mt-1">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      Please upload at least one document to proceed with your application.
                    </p>
                  )}

                  {documents.length > 0 && (
                    <div className="space-y-2 mt-3">
                      <p className="text-xs text-teal-400 font-medium">Selected files ({documents.length}):</p>
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
