import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Briefcase, Key, GraduationCap, User, CreditCard,
  Car, Shield, Droplet, Layers, HelpCircle, ArrowRight, Search, FileText, 
  ArrowLeftRight, Calculator, X, Check, Landmark, Star, Clock, Sparkles, CheckCircle2
} from 'lucide-react';
import SEOMeta from '../components/SEOMeta';

export default function Services() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  
  // Advanced Functionality States
  const [compareList, setCompareList] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState('docs'); // 'docs' or 'calc'
  const [calcAmount, setCalcAmount] = useState(1000000);
  const [calcTenure, setCalcTenure] = useState(10);
  const [emiOutput, setEmiOutput] = useState({ emi: 0, interest: 0, total: 0 });

  const navigate = useNavigate();

  const services = [
    {
      id: 'home-loan', title: 'Home Loan', category: 'personal', icon: Home,
      interest: '8.40% - 9.15% p.a.', rateValue: 8.4,
      tenure: 'Up to 30 years', maxTenureYears: 30, defaultAmount: 3000000,
      desc: 'Purchase or construct your dream home with flexible EMIs.',
      documents: ['Aadhaar & PAN Card', '3 Months Payslips', '6 Months Bank Statements', 'Property Valuation Documents']
    },
    {
      id: 'business-loan', title: 'Business Loan', category: 'business', icon: Briefcase,
      interest: '11.50% - 16.00% p.a.', rateValue: 11.5,
      tenure: 'Up to 7 years', maxTenureYears: 7, defaultAmount: 1500000,
      desc: 'Unsecured and secured funds to expand operations or manage business cashflow.',
      documents: ['KYC (PAN/Aadhaar) of Directors', '3 Years Audited Financial Statements', '1 Year Current Account Statement', 'Company Registration & GST Certificate']
    },
    {
      id: 'machinery-loan', title: 'Machinery Loan', category: 'business', icon: Briefcase,
      interest: '9.50% - 12.00% p.a.', rateValue: 9.5,
      tenure: 'Up to 7 years', maxTenureYears: 7, defaultAmount: 2500000,
      desc: 'Acquire high-tech machinery, textile looms, or embroidery setups with structured equipment financing.',
      documents: ['KYC of Promoters & Business Entity', 'Proforma Invoice / Quotation of Machinery', '3 Years Audited Financials & Tax Computations', '1 Year Bank Current Account Statement']
    },
    {
      id: 'mortgage-loan', title: 'Mortgage Loan', category: 'business', icon: Key,
      interest: '9.25% - 11.00% p.a.', rateValue: 9.25,
      tenure: 'Up to 15 years', maxTenureYears: 15, defaultAmount: 2000000,
      desc: 'Unlock equity from your residential or commercial property for business or personal needs.',
      documents: ['PAN & Aadhaar Certificate', 'Original Property Title Deeds & Search Report', '3 Years Personal & Corporate ITR', '6 Months Savings & Current Statements']
    },
    {
      id: 'education-loan', title: 'Education Loan', category: 'personal', icon: GraduationCap,
      interest: '9.50% - 12.50% p.a.', rateValue: 9.5,
      tenure: 'Up to 15 years', maxTenureYears: 15, defaultAmount: 1000000,
      desc: 'Finance studies at top universities covering tuition fees, accommodation, and travel.',
      documents: ['Student KYC & Academic Marksheets', 'Co-borrower Income Proofs & ITR', 'Admission Offer Letter from Institute', 'Detailed Course Fee Structure']
    },
    {
      id: 'personal-loan', title: 'Personal Loan', category: 'personal', icon: User,
      interest: '10.99% - 15.50% p.a.', rateValue: 10.99,
      tenure: 'Up to 5 years', maxTenureYears: 5, defaultAmount: 500000,
      desc: 'Collateral-free funds for medical emergencies, weddings, home repairs, or travel.',
      documents: ['PAN & Aadhaar Card', '3 Months Salary Payslips', '3 Months Bank Statements', 'Office ID & Address Proof']
    },
    {
      id: 'balance-transfer', title: 'Balance Transfer', category: 'limits', icon: ArrowLeftRight,
      interest: 'Starts @ 8.20% p.a.', rateValue: 8.2,
      tenure: 'Flexible outstanding', maxTenureYears: 20, defaultAmount: 2000000,
      desc: 'Transfer high-interest loans to partner banks at lower interest rates.',
      documents: ['Existing Loan Sanction Letter', 'Foreclosure & Amortization Statement', 'KYC & Last 6 Months Bank Statement', 'Property Document Copies']
    },
    {
      id: 'credit-card', title: 'Credit Card', category: 'cards', icon: CreditCard,
      interest: '0% up to 45 Days', rateValue: 0,
      tenure: 'Revolving Credit', maxTenureYears: 1, defaultAmount: 100000,
      desc: 'Premium credit cards with rewards, airport lounge access, and concierge services.',
      documents: ['PAN & Aadhaar Card copy', 'Salary Slip / Last 2 Years ITR', 'Current Residence Address Proof']
    },
    {
      id: 'car-loan', title: 'Car Loan', category: 'personal', icon: Car,
      interest: '8.65% - 9.80% p.a.', rateValue: 8.65,
      tenure: 'Up to 7 years', maxTenureYears: 7, defaultAmount: 800000,
      desc: 'Finance new or pre-owned vehicles with competitive rates.',
      documents: ['PAN & Aadhaar Card details', 'Salary Slip or Form 16', '6 Months Bank Statements', 'Official Vehicle Proforma Invoice']
    },
    {
      id: 'two-wheeler-loan', title: 'Two Wheeler Loan', category: 'personal', icon: Car,
      interest: '10.50% - 13.00% p.a.', rateValue: 10.5,
      tenure: 'Up to 4 years', maxTenureYears: 4, defaultAmount: 80000,
      desc: 'Finance bikes and scooters with minimal down payment requirements.',
      documents: ['PAN & Aadhaar Card', 'Salary Slips or Bank Account Statement', 'Vehicle Invoice Quotation']
    },
    {
      id: 'agriculture-od', title: 'Agriculture OD', category: 'limits', icon: Droplet,
      interest: '7.00% - 9.50% p.a.', rateValue: 7.0,
      tenure: 'Renewable Annually', maxTenureYears: 1, defaultAmount: 500000,
      desc: 'Overdraft facilities for farmers to purchase seeds, crops, and agricultural machinery.',
      documents: ['PAN & Aadhaar Card', 'Land ownership 7/12 & 8A Records', 'Agriculture Income Certificate', 'Bank Statements']
    },
    {
      id: 'od-cc-dod', title: 'OD / CC / DOD', category: 'limits', icon: Layers,
      interest: '8.99% - 11.50% p.a.', rateValue: 8.99,
      tenure: 'Renewable Annually', maxTenureYears: 1, defaultAmount: 5000000,
      desc: 'Overdraft and cash credit channels for working capital and inventory management.',
      documents: ['Corporate KYC & Company PAN', '3 Years Audited Financial Reports', 'GST Return Filing (GSTR-3B) logs', 'Stock and Book Debtors Statement']
    },
    {
      id: 'insurance-policy', title: 'Insurance Policy', category: 'cards', icon: Shield,
      interest: 'Starts @ ₹499/mo', rateValue: 0,
      tenure: 'Flexible Premium', maxTenureYears: 20, defaultAmount: 10000,
      desc: 'Life, health, property, and corporate insurance from top providers.',
      documents: ['KYC Identity Documents', 'Age & Current Address Proof', 'Income Declarations & ITR', 'Medical Checkup Records (if applicable)']
    }
  ];

  // Recalculate EMI whenever variables change
  useEffect(() => {
    if (selectedService) {
      const rate = selectedService.rateValue;
      if (rate === 0) {
        setEmiOutput({ emi: 0, interest: 0, total: 0 });
        return;
      }
      const P = calcAmount;
      const r = (rate / 100) / 12;
      const n = calcTenure * 12;

      if (P > 0 && r > 0 && n > 0) {
        const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        const total = emi * n;
        const interest = total - P;
        setEmiOutput({
          emi: Math.round(emi),
          interest: Math.round(interest),
          total: Math.round(total)
        });
      }
    }
  }, [calcAmount, calcTenure, selectedService]);

  // Pre-fill inputs when a service is selected
  const openServiceDetails = (service) => {
    setSelectedService(service);
    setCalcAmount(service.defaultAmount);
    setCalcTenure(Math.min(service.maxTenureYears, 10)); // Cap initial display tenure at 10 or max
    setActiveModalTab('docs');
  };

  const handleApply = (serviceName) => {
    navigate('/apply-loan', { state: { defaultLoanType: serviceName } });
  };

  // Compare List Handlers
  const handleCompareToggle = (e, service) => {
    e.stopPropagation();
    const exist = compareList.find(item => item.id === service.id);
    if (exist) {
      setCompareList(compareList.filter(item => item.id !== service.id));
    } else {
      if (compareList.length >= 3) {
        alert('You can compare a maximum of 3 services at a time.');
        return;
      }
      setCompareList([...compareList, service]);
    }
  };

  const filteredServices = services.filter(service => {
    const matchesTab = activeTab === 'all' || service.category === activeTab;
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const tabs = [
    { label: 'All Services', value: 'all' },
    { label: 'Personal Loans', value: 'personal' },
    { label: 'Business & Commercial', value: 'business' },
    { label: 'Limits & Overdrafts', value: 'limits' },
    { label: 'Cards & Insurance', value: 'cards' }
  ];

  return (
    <>
      <SEOMeta
        title="Comprehensive Financial Services | Vibhuti Enterprise Surat"
        description="Explore home loans, business loans, CC/OD limits, and insurance consulting at Vibhuti Enterprise Surat. Calculate EMIs and check documents required online."
      />

      <div className="py-20 bg-gradient-to-b from-charcoal-950 via-charcoal-900/50 to-charcoal-950 relative overflow-hidden">
        {/* Soft glowing ambient background elements */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-teal-700/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-teal-900/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Heading */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="section-label mx-auto">
              <Sparkles className="w-3.5 h-3.5" />
              What We Offer
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold">
              Our Financial <span className="text-gradient">Solutions Suite</span>
            </h1>
            <p className="text-charcoal-400 text-sm">
              Tailored credit lines, term loans, working capital limits, and insurance consulting. Filter categories or compare loan structures side-by-side.
            </p>
          </div>

          {/* Search, Filter Tabs & Compare Tray Info */}
          <div className="flex flex-col lg:flex-row gap-5 justify-between items-center mb-12">
            <div className="w-full lg:w-80 flex items-center bg-charcoal-900 border border-charcoal-800 rounded-xl px-3 py-2.5 focus-within:border-teal-500/50 transition-colors">
              <Search className="w-4 h-4 text-charcoal-500 mr-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search home loan, business, OD..."
                className="bg-transparent border-0 text-charcoal-100 placeholder-charcoal-500 focus:outline-none w-full text-xs"
              />
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {tabs.map(tab => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    activeTab === tab.value
                      ? 'bg-gradient-to-r from-teal-500/20 to-teal-500/5 border-teal-500/30 text-teal-400 font-bold shadow-lg shadow-teal-500/[0.03]'
                      : 'bg-charcoal-900/60 border-charcoal-800 text-charcoal-400 hover:text-charcoal-200 hover:border-charcoal-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service, idx) => {
              const IconComp = service.icon;
              const isComparing = compareList.some(item => item.id === service.id);
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05, ease: "easeOut" }}
                  className="card p-7 flex flex-col h-full bg-gradient-to-br from-charcoal-900/80 to-charcoal-950/80 border-charcoal-800 hover:border-charcoal-600/60 hover:shadow-xl hover:shadow-teal-500/[0.02] transition-all duration-500 group relative overflow-hidden"
                >
                  <div className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-teal-500 via-teal-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 left-0" />

                  {/* Watermark Index */}
                  <span className="text-[10px] font-mono text-charcoal-600 mb-3 block tracking-wider uppercase group-hover:text-teal-500/30 transition-colors">
                    [{(idx + 1).toString().padStart(2, '0')}]
                  </span>

                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-teal-500/20 group-hover:border-teal-400/40 transition-colors">
                      <IconComp className="w-6 h-6 text-teal-400" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-charcoal-500 block mb-0.5">
                        {service.category}
                      </span>
                      <h3 className="font-heading text-lg font-bold text-charcoal-100 group-hover:text-teal-400 transition-colors duration-300 leading-tight">
                        {service.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs text-charcoal-400 leading-relaxed mb-6 flex-1 group-hover:text-charcoal-300 transition-colors duration-300">
                    {service.desc}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] mb-6 py-2.5 px-3 bg-charcoal-900/50 border border-charcoal-800 rounded-lg font-mono">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-charcoal-500 uppercase text-[9px] tracking-wider">Interest Rate</span>
                      <span className="font-semibold text-charcoal-200">{service.interest}</span>
                    </div>
                    <span className="w-px h-5 bg-charcoal-800" />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-charcoal-500 uppercase text-[9px] tracking-wider">Max Tenure</span>
                      <span className="font-semibold text-charcoal-200">{service.tenure}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex gap-3">
                      <button
                        onClick={() => openServiceDetails(service)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-charcoal-900 border border-charcoal-800 hover:border-charcoal-700 text-xs text-charcoal-300 hover:text-charcoal-100 transition-colors cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Details &amp; Docs
                      </button>
                      <button
                        onClick={() => handleApply(service.title)}
                        className="btn-accent flex-1 text-xs !py-2.5 justify-center shadow-md shadow-teal-500/5"
                      >
                        Apply Now
                      </button>
                    </div>

                    <button
                      onClick={(e) => handleCompareToggle(e, service)}
                      className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        isComparing
                          ? 'bg-teal-500/10 border-teal-500/40 text-teal-400'
                          : 'bg-transparent border-charcoal-800 text-charcoal-500 hover:text-charcoal-300 hover:border-charcoal-700'
                      }`}
                    >
                      {isComparing ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Added to Compare
                        </>
                      ) : (
                        <>
                          <ArrowLeftRight className="w-3.5 h-3.5" />
                          Compare Product
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-16 card max-w-lg mx-auto">
              <HelpCircle className="w-10 h-10 text-charcoal-400 mx-auto mb-3" />
              <h3 className="font-display font-medium text-charcoal-100 mb-1">No matches found</h3>
              <p className="text-sm text-charcoal-500">Try different keywords or filters.</p>
            </div>
          )}

        </div>
      </div>

      {/* Floating Compare Tray at the bottom */}
      <AnimatePresence>
        {compareList.length > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="fixed bottom-4 left-4 right-4 z-40 max-w-4xl mx-auto"
          >
            <div className="bg-charcoal-900/90 backdrop-blur-md border border-teal-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center">
                  <ArrowLeftRight className="w-4 h-4 text-teal-400 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-charcoal-100">Comparing Services ({compareList.length}/3)</h4>
                  <p className="text-[10px] text-charcoal-500">Select up to 3 loan options to analyze rates and parameters side-by-side.</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {compareList.map(item => (
                    <div key={item.id} className="w-8 h-8 rounded-full bg-charcoal-950 border-2 border-charcoal-900 flex items-center justify-center text-[10px] font-bold text-teal-400 font-mono" title={item.title}>
                      {item.title[0]}
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={() => setShowCompareModal(true)}
                  disabled={compareList.length < 2}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    compareList.length >= 2
                      ? 'bg-teal-500 hover:bg-teal-600 text-charcoal-950 shadow-md shadow-teal-500/10'
                      : 'bg-charcoal-800 text-charcoal-500 border border-charcoal-700 cursor-not-allowed'
                  }`}
                >
                  Compare Now
                </button>

                <button
                  onClick={() => setCompareList([])}
                  className="p-2 rounded-lg hover:bg-charcoal-800 text-charcoal-500 hover:text-charcoal-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Details & Interactive EMI Calculator Modal */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
              onClick={() => setSelectedService(null)} 
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-gradient-to-br from-charcoal-900 to-charcoal-950 border border-charcoal-800/80 rounded-2xl max-w-lg w-full p-6 relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6"
            >
              <div className="flex justify-between items-center border-b border-charcoal-800/60 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                    {React.createElement(selectedService.icon, { className: "w-5 h-5 text-teal-400" })}
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-charcoal-100">{selectedService.title}</h3>
                    <p className="text-[10px] text-charcoal-500 uppercase font-mono tracking-wider">Interest Starts @ {selectedService.interest.split(' ')[0]}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedService(null)}
                  className="p-1.5 rounded-lg bg-charcoal-900 border border-charcoal-800 hover:border-charcoal-700 text-charcoal-400 hover:text-charcoal-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Tabs */}
              <div className="flex gap-2 border-b border-charcoal-800/60 pb-2">
                <button
                  onClick={() => setActiveModalTab('docs')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    activeModalTab === 'docs'
                      ? 'bg-teal-500/10 border border-teal-500/20 text-teal-400'
                      : 'text-charcoal-400 hover:text-charcoal-200'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  Required Documents
                </button>
                {selectedService.rateValue > 0 && (
                  <button
                    onClick={() => setActiveModalTab('calc')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      activeModalTab === 'calc'
                        ? 'bg-teal-500/10 border border-teal-500/20 text-teal-400'
                        : 'text-charcoal-400 hover:text-charcoal-200'
                    }`}
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    Quick EMI Calculator
                  </button>
                )}
              </div>

              {/* Modal Contents */}
              <div className="min-h-[220px]">
                {activeModalTab === 'docs' ? (
                  <div className="space-y-3">
                    <p className="text-xs text-charcoal-400">Please prepare these soft copies / documents to secure a fast verification process:</p>
                    <div className="space-y-2">
                      {selectedService.documents.map((doc, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-xs text-charcoal-300 bg-charcoal-900/50 border border-charcoal-800 p-3.5 rounded-xl">
                          <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" />
                          <span>{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {/* Amount Slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-charcoal-400">Expected Loan Amount</span>
                        <span className="font-semibold text-teal-400 font-mono bg-teal-500/10 px-2 py-0.5 rounded">₹{calcAmount.toLocaleString('en-IN')}</span>
                      </div>
                      <input
                        type="range"
                        min={selectedService.id === 'two-wheeler-loan' ? "10000" : "100000"}
                        max={selectedService.id === 'home-loan' || selectedService.id === 'mortgage-loan' ? "10000000" : "5000000"}
                        step="10000"
                        value={calcAmount}
                        onChange={(e) => setCalcAmount(Number(e.target.value))}
                        className="w-full accent-teal-500 cursor-pointer bg-charcoal-800 h-1.5 rounded"
                      />
                    </div>

                    {/* Tenure Slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-charcoal-400">Repayment Tenure</span>
                        <span className="font-semibold text-teal-400 font-mono bg-teal-500/10 px-2 py-0.5 rounded">{calcTenure} Years</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max={selectedService.maxTenureYears}
                        step="1"
                        value={calcTenure}
                        onChange={(e) => setCalcTenure(Number(e.target.value))}
                        className="w-full accent-teal-500 cursor-pointer bg-charcoal-800 h-1.5 rounded"
                      />
                    </div>

                    {/* Results Box */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-charcoal-900/50 border border-charcoal-800 rounded-xl font-mono">
                      <div>
                        <span className="text-[10px] text-charcoal-500 block uppercase tracking-wider">Estimated EMI</span>
                        <span className="text-lg font-bold text-teal-400">₹{emiOutput.emi.toLocaleString('en-IN')}/mo</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-charcoal-500 block uppercase tracking-wider">Interest Payable</span>
                        <span className="text-sm font-semibold text-charcoal-200">₹{emiOutput.interest.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal CTAs */}
              <div className="flex gap-3 pt-4 border-t border-charcoal-800/60">
                <button
                  onClick={() => setSelectedService(null)}
                  className="flex-1 py-3 rounded-xl bg-charcoal-900 border border-charcoal-800 hover:border-charcoal-700 text-xs font-semibold text-charcoal-400 hover:text-charcoal-200 transition-colors"
                >
                  Close Details
                </button>
                <button
                  onClick={() => {
                    const title = selectedService.title;
                    setSelectedService(null);
                    handleApply(title);
                  }}
                  className="btn-accent flex-1 text-xs justify-center shadow-lg shadow-teal-500/10"
                >
                  Proceed to Apply
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Side-by-Side Comparison Modal */}
      <AnimatePresence>
        {showCompareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm" 
              onClick={() => setShowCompareModal(false)} 
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-charcoal-900 border border-charcoal-800 rounded-2xl max-w-4xl w-full p-6 relative z-10 shadow-2xl overflow-x-auto max-h-[90vh] space-y-6"
            >
              <div className="flex justify-between items-center border-b border-charcoal-800 pb-4">
                <div className="flex items-center gap-2">
                  <ArrowLeftRight className="w-5 h-5 text-teal-400 animate-pulse" />
                  <h3 className="font-heading text-lg font-bold text-charcoal-100">Loan Products Side-by-Side Comparison</h3>
                </div>
                <button
                  onClick={() => setShowCompareModal(false)}
                  className="p-1.5 rounded-lg bg-charcoal-950 border border-charcoal-800 hover:border-charcoal-700 text-charcoal-400 hover:text-charcoal-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Comparison Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-charcoal-800 text-charcoal-500 uppercase tracking-wider text-[10px] font-mono">
                      <th className="py-3 px-4 w-1/4">Parameters</th>
                      {compareList.map(item => (
                        <th key={item.id} className="py-3 px-4 w-1/4 text-teal-400 font-bold">{item.title}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-charcoal-850 hover:bg-charcoal-850/20">
                      <td className="py-3.5 px-4 font-semibold text-charcoal-300">Category</td>
                      {compareList.map(item => (
                        <td key={item.id} className="py-3.5 px-4 capitalize font-medium text-charcoal-400">{item.category}</td>
                      ))}
                    </tr>
                    <tr className="border-b border-charcoal-850 hover:bg-charcoal-850/20">
                      <td className="py-3.5 px-4 font-semibold text-charcoal-300">Interest Rates</td>
                      {compareList.map(item => (
                        <td key={item.id} className="py-3.5 px-4 font-mono font-bold text-charcoal-200">{item.interest}</td>
                      ))}
                    </tr>
                    <tr className="border-b border-charcoal-850 hover:bg-charcoal-850/20">
                      <td className="py-3.5 px-4 font-semibold text-charcoal-300">Max Tenure</td>
                      {compareList.map(item => (
                        <td key={item.id} className="py-3.5 px-4 font-mono text-charcoal-400">{item.tenure}</td>
                      ))}
                    </tr>
                    <tr className="border-b border-charcoal-850 hover:bg-charcoal-850/20">
                      <td className="py-3.5 px-4 font-semibold text-charcoal-300">Key Features</td>
                      {compareList.map(item => (
                        <td key={item.id} className="py-3.5 px-4 text-charcoal-400 leading-relaxed max-w-[200px]">{item.desc}</td>
                      ))}
                    </tr>
                    <tr className="border-b border-charcoal-850 hover:bg-charcoal-850/20">
                      <td className="py-3.5 px-4 font-semibold text-charcoal-300">Required Documents</td>
                      {compareList.map(item => (
                        <td key={item.id} className="py-3.5 px-4">
                          <ul className="space-y-1.5 list-disc list-inside text-charcoal-400">
                            {item.documents.map((doc, dIdx) => (
                              <li key={dIdx} className="leading-tight text-[11px] truncate" title={doc}>{doc}</li>
                            ))}
                          </ul>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-4 px-4 font-semibold text-charcoal-300">Actions</td>
                      {compareList.map(item => (
                        <td key={item.id} className="py-4 px-4">
                          <button
                            onClick={() => {
                              setShowCompareModal(false);
                              handleApply(item.title);
                            }}
                            className="btn-accent !px-3.5 !py-2 text-[10px] w-full justify-center"
                          >
                            Apply Now
                          </button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end pt-4 border-t border-charcoal-800">
                <button
                  onClick={() => setShowCompareModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-800 hover:border-charcoal-700 text-xs font-semibold text-charcoal-400 hover:text-charcoal-200 transition-colors cursor-pointer"
                >
                  Close Comparison
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
