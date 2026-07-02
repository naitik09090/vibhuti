import React, { useState } from 'react';
import { 
  ShieldCheck, Sparkles, Award, UserCheck, Landmark, CheckCircle2, 
  ArrowRight, Phone, MessageSquare, HelpCircle, FileText, 
  ChevronRight, Building, Home, Briefcase, GraduationCap, CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SEOMeta from '../components/SEOMeta';

export default function AboutUs() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('salaried');

  const pillars = [
    {
      icon: ShieldCheck,
      title: 'Premium Data Security',
      desc: 'Your private financial files, tax returns, and bank statements are protected with advanced security pipelines.'
    },
    {
      icon: Sparkles,
      title: 'Dedicated Client Advisory',
      desc: 'Get matched with a dedicated credit manager who coordinates your process end-to-end with zero hidden fees.'
    },
    {
      icon: Award,
      title: 'Direct Banking Network',
      desc: 'We leverage established partnerships with 100+ public, private, and NBFC lenders for optimal negotiations.'
    },
    {
      icon: UserCheck,
      title: 'Accelerated Approval Path',
      desc: 'By utilizing pre-qualification checksheets, we bypass standard delay loops to secure faster disbursements.'
    }
  ];

  const loanDetails = [
    {
      icon: Home,
      title: 'Premium Home Loans',
      keyword: 'Best Home Loan in Surat',
      desc: 'Purchasing your first residential property, constructed bungalows, apartments, or seeking a plots-plus-construction loan requires careful interest rate analysis. We negotiate prime home loan terms with top public and private banks. Our services cover new purchases, balance transfers with top-up limits, and renovation financing, ensuring repayment tenures of up to 30 years and competitive floating rates starting from the lowest benchmark rates.',
      points: ['Home Purchase & Construction funding up to ₹10 Crores', 'Floating interest rates linked directly to Repo Rate benchmarks', 'Balance transfer facilities with high-value top-up loans', 'Flexible repayment tenures spanning up to 30 years']
    },
    {
      icon: Briefcase,
      title: 'Secured & Unsecured Business Loans',
      keyword: 'Business Loan Surat Nana Varachha',
      desc: 'Surat is a globally recognized manufacturing and commercial hub. From diamond processing plants to textile weaving units, businesses require customized capital injection. We specialize in structuring high-ticket business loans—both secured against collateral and unsecured business loans for working capital needs. We evaluate cash flows, balance sheets, and GST registers to present a clean credit file to banks, ensuring maximum loan-to-value ratio.',
      points: ['Unsecured corporate funding up to ₹50 Lakhs for business operations', 'Machinery and equipment finance for textile and manufacturing sectors', 'Minimal documentation with balance-sheet-backed cash flow loans', 'Quick turnaround timelines for urgent operational requirements']
    },
    {
      icon: Landmark,
      title: 'Overdraft (OD) & Cash Credit (CC) Limits',
      keyword: 'OD CC Limit Consultants Surat',
      desc: 'For Surat’s textile merchants, embroidery units, and diamond brokers, cash flow matching is critical. Standard fixed term-loans are often inefficient. We structure dedicated Cash Credit (CC) and Overdraft (OD) limits. Interest is calculated solely on the amount utilized, providing a highly cost-efficient working capital safety net. We arrange limits against property, inventories, or book debts to ensure your manufacturing cycles run smoothly.',
      points: ['Flexible working capital limits against stock, book-debt, and real estate', 'Interest charged only on the balance utilized, optimizing cash outflow', 'Annual renewal review coordination with simplified paperwork schedules', 'Fast limit setups and expansion limits matching scale dynamics']
    },
    {
      icon: Building,
      title: 'Loan Against Property (LAP) / Mortgages',
      keyword: 'Mortgage Loan against Property Surat',
      desc: 'Unlocking the capital tied up in residential, commercial, or industrial real estate is one of the most cost-effective ways to raise capital. A Loan Against Property (LAP) offers lower interest rates compared to unsecured personal or business loans. We work with leading banks to correctly value your property, navigate complex land titles, and secure high LTV ratios, ensuring you receive long tenure repayment terms to match business payback cycles.',
      points: ['Funding up to 75% of your property market valuation', 'Acceptance of commercial shops, industrial plots, and residential flats', 'Extended loan repayment tenures of up to 15 years to lower EMIs', 'Settle existing high-interest loans through smart mortgage debt consolidation']
    },
    {
      icon: CreditCard,
      title: 'Collateral-Free Personal Loans',
      keyword: 'Personal Loan Surat Salaried Self Employed',
      desc: 'When life demands quick financial access—whether for medical emergencies, weddings, children’s higher education, or sudden travel—our collateral-free personal loans bridge the gap. We help salaried individuals and self-employed professionals package their income profiles, credit scores (CIBIL), and banking track records to secure instant pre-approvals at lower interest rates from leading private lenders.',
      points: ['Collateral-free personal financing up to ₹25 Lakhs with instant approval', 'Flexible tenure configurations from 12 months up to 5 years', 'Digital onboarding pipelines for salaried professionals', 'Pre-payment options with minimal foreclosing fees']
    },
    {
      icon: GraduationCap,
      title: 'National & International Education Loans',
      keyword: 'Education Loan Surat Overseas Study',
      desc: 'Investing in education is investing in the future. We coordinate comprehensive education loans for students planning studies in India or abroad (USA, UK, Canada, Germany, Australia, etc.). Our consulting covers tuition fees, library fees, accommodation, travel tickets, and living expenses. We guide parents on co-borrower requirements and property pledging to secure lower-interest student loan schemes.',
      points: ['100% funding coverage including tuition, accommodation, and living costs', 'Pre-visa approval documentation and disbursement schedules', 'Moratorium periods covering study duration plus 12 months grace period', 'Tax benefits under Section 80E of the Income Tax Act']
    }
  ];

  const checklists = {
    salaried: [
      { category: 'Identity & Address Proof', items: ['Aadhaar Card (linked with Mobile Number)', 'PAN Card', 'Valid Passport / Voter ID / Driving License', 'Recent passport-sized photographs'] },
      { category: 'Income Documentation', items: ['Salary Slips for the last 3 to 6 months', 'Form 16 or Income Tax Returns (ITR) for the last 2 financial years', 'Detailed appointment letter or salary revision letters'] },
      { category: 'Banking & Financials', items: ['Salary Bank Account Statement for the last 6 months showing salary credits', 'Details of any existing loans (running EMIs, sanction letters)'] }
    ],
    selfEmployed: [
      { category: 'Identity & Business Proof', items: ['PAN Card of the Individual and the Business entity', 'Aadhaar Card of the proprietor / partners', 'Shop & Establishment License (Gumasta / Udyam registration)', 'GST Registration Certificate and last 1 year GST returns'] },
      { category: 'Financial Statements', items: ['Income Tax Returns (ITR) with complete computation for the last 3 financial years', 'Audited Balance Sheet & Profit & Loss Statement for the last 3 years', 'Provisional financial statements for the current running year'] },
      { category: 'Banking & Track Record', items: ['Current Account Statements for the last 12 months', 'Individual Savings Account Statements for the last 6 months', 'Repayment track records / sanction letters of all active and closed loans'] }
    ],
    corporate: [
      { category: 'Entity Constitution Proof', items: ['Certificate of Incorporation / Partnership Deed', 'Memorandum & Articles of Association (MOA / AOA)', 'PAN Card of the company, LLP, or partnership firm', 'Board Resolution authorizing the loan transaction'] },
      { category: 'Audited Financial Reports', items: ['Complete Audited financials (P&L, Balance Sheet, Schedules) for 3 financial years', 'Tax Audit Report (Form 3CD & 3CB) and ITR filings', 'Net worth certificates of Directors / Partners signed by a Chartered Accountant'] },
      { category: 'Operational Data', items: ['GST details (GSTR-1 & GSTR-3B) for the last 12 months', 'Projected financial balance sheets for the next 2 financial years (for large limits)', 'Key debtors and creditors aging schedules'] }
    ]
  };

  return (
    <>
      <SEOMeta
        title="Best Loan Consultant in Surat | About Vibhuti Enterprise"
        description="Discover Vibhuti Enterprise, Surat's top-rated financial and loan advisory firm. Learn about our home loans, business financing, OD/CC limits, and document checklists."
      />

      <div className="py-20 max-w-4xl mx-auto px-6 text-charcoal-400 text-sm leading-relaxed space-y-16">
        
        {/* Header Hero */}
        <div className="space-y-4 text-center">
          <div className="section-label mx-auto w-fit">
            <Landmark className="w-3.5 h-3.5" />
            Advisory Profile
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-charcoal-100">
            About <span className="text-gradient">Vibhuti Enterprise</span>
          </h1>
          <p className="text-base text-charcoal-400 max-w-2xl mx-auto">
            Since 2015, we have been helping Surat’s entrepreneurs, merchants, and families secure optimum credit solutions. Direct banking partnerships, absolute transparency, and customized consulting.
          </p>
        </div>

        {/* Story Section */}
        <div className="space-y-4 border-b border-charcoal-800/40 pb-10">
          <h2 className="font-heading text-2xl font-bold text-charcoal-100">Our Story &amp; Legacy</h2>
          <p>
            Vibhuti Enterprise was established in Surat, Gujarat with a single vision: to demystify the complex Indian banking and lending ecosystem for retail and corporate clients. Over the years, the credit requirements of growing industries and urban expansion have evolved. Navigating these requirements demands more than just submitting files to a local bank; it requires strategic credit structuring and deep banking alliances.
          </p>
          <p>
            Under our professional financial consulting banner, we analyze every applicant’s unique financial situation, tax returns, balance sheets, and CIBIL histories. We structure documents so they present a clean, bankable story. Our goal is to ensure you do not just get a loan, but secure the lowest possible cost of debt with flexible terms.
          </p>
          <p>
            Today, Vibhuti Enterprise stands as a leading loan consultant in Surat, servicing thousands of accounts across home loans, industrial business expansion, and overdraft boundaries. Our office in Nana Varachha coordinates files with all major public sector banks, private nationalized banks, and top-tier NBFCs in India, providing a single window for all capital needs.
          </p>
        </div>

        {/* Pillars / Values Grid */}
        <div className="space-y-6">
          <h2 className="font-heading text-2xl font-bold text-charcoal-100">Our Core Pillars</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div key={idx} className="flex gap-4 items-start p-4 rounded-xl border border-charcoal-800 bg-charcoal-900/30">
                  <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-5 h-5 text-teal-400" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-charcoal-100 text-sm mb-1">{p.title}</h3>
                    <p className="text-xs text-charcoal-400 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Service breakdown list */}
        <div className="space-y-8 border-t border-b border-charcoal-800/40 py-10">
          <h2 className="font-heading text-2xl font-bold text-charcoal-100">Our Financial Services Suite</h2>
          <div className="space-y-6">
            {loanDetails.map((loan, idx) => {
              const Icon = loan.icon;
              return (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-teal-400" />
                    <h3 className="font-heading text-lg font-bold text-charcoal-100">{loan.title}</h3>
                  </div>
                  <p className="text-xs text-charcoal-400 pl-6 leading-relaxed mb-3">{loan.desc}</p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-6">
                    {loan.points.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2 text-xs text-charcoal-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 flex-shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Checklists Tabs */}
        <div className="space-y-6">
          <h2 className="font-heading text-2xl font-bold text-charcoal-100">Document Checklist Checklist</h2>
          
          <div className="flex gap-2 border-b border-charcoal-800 pb-2">
            {[
              { id: 'salaried', label: 'Salaried Individuals' },
              { id: 'selfEmployed', label: 'Self-Employed' },
              { id: 'corporate', label: 'Corporate / LLP' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-b-2 border-teal-500 text-teal-400 font-bold'
                    : 'text-charcoal-400 hover:text-charcoal-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-charcoal-900/20 border border-charcoal-800 rounded-xl p-6 min-h-[250px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                {checklists[activeTab].map((cat, idx) => (
                  <div key={idx} className="space-y-2">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-charcoal-200">
                      {cat.category}
                    </h4>
                    <ul className="space-y-1.5">
                      {cat.items.map((item, itemIdx) => (
                        <li key={itemIdx} className="flex items-start gap-2 text-xs text-charcoal-400">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center border-t border-charcoal-800/40 pt-10">
          <div>
            <h3 className="font-heading text-2xl font-bold text-teal-400">10+ Years</h3>
            <p className="text-[10px] text-charcoal-500 uppercase tracking-wider mt-1">Experience</p>
          </div>
          <div>
            <h3 className="font-heading text-2xl font-bold text-teal-400">₹1500Cr+</h3>
            <p className="text-[10px] text-charcoal-500 uppercase tracking-wider mt-1">Disbursements</p>
          </div>
          <div>
            <h3 className="font-heading text-2xl font-bold text-teal-400">5000+</h3>
            <p className="text-[10px] text-charcoal-500 uppercase tracking-wider mt-1">Happy Clients</p>
          </div>
          <div>
            <h3 className="font-heading text-2xl font-bold text-teal-400">99%</h3>
            <p className="text-[10px] text-charcoal-500 uppercase tracking-wider mt-1">Success Ratio</p>
          </div>
        </div>

        {/* CTA */}
        <div className="border-t border-charcoal-800/40 pt-10 text-center space-y-4">
          <h2 className="font-heading text-2xl font-bold text-charcoal-100">Ready to Get Started?</h2>
          <p className="text-xs text-charcoal-400 max-w-md mx-auto">
            Connect with Vibhuti Enterprise today. Get expert guidance and find the right loan solution for your needs.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button onClick={() => navigate('/apply-loan')} className="btn-accent text-xs">
              Apply for Loan
            </button>
            <a 
              href="https://wa.me/917862808887?text=Hello%20Vibhuti%20Enterprise" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white transition-all shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              WhatsApp Support
            </a>
          </div>
        </div>

      </div>
    </>
  );
}
