import React, { useState } from 'react';
import { 
  ShieldCheck, HelpCircle, FileText, ChevronDown, Landmark, 
  Mail, Phone, MapPin, ArrowRight, Lock, CheckCircle2, Eye, UserCheck,
  Users, MessageSquare, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SEOMeta from '../components/SEOMeta';

export default function PrivacyPolicy() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const policyFaqs = [
    {
      q: 'Does Vibhuti Enterprise sell my financial data to third-party telemarketers?',
      a: 'Absolutely not. Vibhuti Enterprise maintains a strict zero-sharing policy with external marketing agencies or credit brokers. Your personal, professional, and financial files are collected solely to evaluate your loan eligibility and are shared exclusively with selected banks and NBFC partners that you authorize for loan processing.'
    },
    {
      q: 'How is my Aadhaar and PAN data secured during the verification process?',
      a: 'We utilize bank-grade encryption protocols to process all highly sensitive government identification files. Aadhaar numbers are masked where required by law, and PAN verifications are processed directly through licensed credit information companies (like NSDL or bank APIs) to ensure your credentials are never exposed to unauthorized entities.'
    },
    {
      q: 'Can I request Vibhuti Enterprise to permanently delete my documents?',
      a: 'Yes, you have the absolute right to request the deletion of your personal data. If your loan has been processed, rejected, or you choose not to proceed, you can email us at info@vibhutienterprise.com to request the permanent removal of all submitted soft copies, except for records we are legally required to maintain under national financial compliance laws.'
    },
    {
      q: 'Does pulling my credit score through Vibhuti Enterprise count as a hard inquiry?',
      a: 'Our initial eligibility assessments utilize a soft inquiry model, which does not negatively impact your CIBIL score. However, once you select a lending bank and authorize them to proceed with a formal loan application, that bank will execute a hard inquiry on your credit profile as part of their standard underwriting procedures.'
    }
  ];

  return (
    <>
      <SEOMeta
        title="Privacy Policy | Vibhuti Enterprise Surat"
        description="Read the official Privacy Policy of Vibhuti Enterprise, Surat. Learn how we collect, process, share, and protect your financial files and personal data."
      />

      <div className="py-20 max-w-3xl mx-auto px-6 text-charcoal-400 text-sm leading-relaxed space-y-12">
        
        {/* Header Hero */}
        <div className="space-y-4 text-center border-b border-charcoal-800/40 pb-10">
          <div className="section-label mx-auto w-fit">
            <Lock className="w-3.5 h-3.5" />
            Data Protection
          </div>
          <h1 className="font-heading text-4xl font-bold text-charcoal-100">
            Privacy Policy
          </h1>
          <p className="text-xs text-charcoal-500">
            Effective Date: July 1, 2026. This comprehensive privacy blueprint outlines how Vibhuti Enterprise manages, secures, and routes your financial information and personal documentation.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          
          <div className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-charcoal-100 flex items-center gap-2">
              <Eye className="w-5 h-5 text-teal-400" />
              1. Introduction &amp; Scope of Policy
            </h2>
            <p>
              Welcome to Vibhuti Enterprise, located at Shop No. 115, Nidhi Complex, 1st Floor, Opp. Chowpati, Nana Varachha, Surat, Gujarat. We function as a premier loan advisory and credit consulting firm. Our legacy is built on direct relationships with major Indian banks and NBFC networks, allowing us to source customized financing solutions for individual home buyers, SMEs, and large corporate houses. In our line of credit consulting, we routinely gather, evaluate, structure, and submit sensitive financial files, personal identification details, and business income records.
            </p>
            <p>
              This comprehensive Privacy Policy document details our methods for handling data. It defines the categories of data we gather, how we process it, with whom we share it to coordinate your bank sanctions, and the security blueprints we utilize to protect it from leaks. By using our website, submitting inquiries, or transferring your financial documents to our credit relationship managers (via online registers, email, or physical copies), you explicitly consent to the data collection and sharing systems described herein.
            </p>
            <p>
              Our data policies comply with national banking verifications, Aadhaar OTP policies, PAN status checks, and general IT guidelines of India. This policy is written transparently to ensure you are fully informed and secure at every step of your borrowing journey.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-charcoal-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-400" />
              2. Information We Collect
            </h2>
            <p>
              To accurately evaluate loan eligibility, construct files for bank credit processing units (CPUs), and calculate estimated EMI options, we must collect multiple data elements. The categories of information we collect include:
            </p>
            <ul className="space-y-2 pl-4 border-l border-teal-500/20 py-1">
              <li>
                <strong className="text-charcoal-200">Personal Identification Data:</strong> Full legal name, date of birth, gender, marital status, Aadhaar card number, Permanent Account Number (PAN), passport copy, voter ID, driving license, and utility bills showing address status.
              </li>
              <li>
                <strong className="text-charcoal-200">Contact Specifications:</strong> Email address, mobile telephone numbers (primary and secondary), permanent residence address, and current corporate office address.
              </li>
              <li>
                <strong className="text-charcoal-200">Income &amp; Professional Records:</strong> Salary slips for the last 3 to 6 months, salary bank account statements, Form 16 details, and Income Tax Returns (ITR) complete with computation statements for at least 2 to 3 years.
              </li>
              <li>
                <strong className="text-charcoal-200">Business &amp; Firm Information:</strong> Shop &amp; Establishment License (Gumasta / Udyam registration), Partnership Deeds, GST certificates, audited balance sheets, profit and loss logs, tax audit reports, and company bank statements.
              </li>
              <li>
                <strong className="text-charcoal-200">Credit Score &amp; Existing Debt Records:</strong> CIBIL score histories, active sanction letters, repayment track records, outstanding loan statements, and monthly EMI configurations.
              </li>
              <li>
                <strong className="text-charcoal-200">Property Details:</strong> Copy of land deed registry, builder agreements, building maps, search reports, property tax receipts, and valuation details (for mortgage, LAP, and home loans).
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-charcoal-100 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-teal-400" />
              3. Methods of Collection
            </h2>
            <p>
              Vibhuti Enterprise collects data through multiple voluntary channels. You supply this data directly to us, or we pull it with your explicit consent:
            </p>
            <ul className="space-y-2 pl-4 border-l border-teal-500/20 py-1">
              <li>
                <strong className="text-charcoal-200">Direct Digital Submissions:</strong> Forms filled on our website, including the loan application registry, EMI calculator logs, and blog comment forms.
              </li>
              <li>
                <strong className="text-charcoal-200">Relationship Coordination:</strong> Documents sent to our relationship managers via email or secured WhatsApp lines, and physical copies handed over to our Surat team.
              </li>
              <li>
                <strong className="text-charcoal-200">Authorized Third-Party Pulls:</strong> Credit check agencies (like TransUnion CIBIL) to verify credit score parameters with your authorization.
              </li>
              <li>
                <strong className="text-charcoal-200">Technical Analytics:</strong> Device IP addresses, cookies, browser types, and landing page patterns collected during your website visits to improve our SEO ranking structure.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-charcoal-100 flex items-center gap-2">
              <Landmark className="w-5 h-5 text-teal-400" />
              4. How We Use Your Information
            </h2>
            <p>
              Vibhuti Enterprise utilizes your data to process credit applications, optimize client experiences, and maintain operations:
            </p>
            <ul className="space-y-1.5 pl-4 border-l border-teal-500/20 py-1">
              <li>To verify your identity and validate the authenticity of tax and income records.</li>
              <li>To calculate credit limits, evaluate eligibility parameters, and determine suitable loan tenures.</li>
              <li>To structure clean files and submit them directly to bank CPUs for processing.</li>
              <li>To respond to your inquiries regarding home loans, business limits, and mortgage refinancing.</li>
              <li>To provide notifications on interest rate drops, renewal of OD limits, and premium updates.</li>
              <li>To optimize our website layout, search rankings, and digital infrastructure based on user trends.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-charcoal-100 flex items-center gap-2">
              <Users className="w-5 h-5 text-teal-400" />
              5. Information Sharing
            </h2>
            <p>
              As financial consultants, we act as a bridge between borrowers and lenders. We share data only with authorized institutions to process your application:
            </p>
            <p>
              We share your financial details and KYC credentials with our network of public, private, and NBFC banking partners. The list of banks is decided during consultations and is authorized by you before we submit your files. These banks utilize the data strictly to process credit inquiries and prepare formal sanction letters.
            </p>
            <p>
              We may also disclose information to comply with Indian banking regulations, court warrants, audit demands, or government investigations. We do not sell, trade, or distribute your personal contact lists or financial statements to third-party telemarketers or external brokers.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-charcoal-100 flex items-center gap-2">
              <Lock className="w-5 h-5 text-teal-400" />
              6. Data Security &amp; Storage
            </h2>
            <p>
              Vibhuti Enterprise implements high-end physical and digital security controls to protect client files:
            </p>
            <p>
              Digital records (scanned PDFs, tax reports, balance sheets) are stored on encrypted servers with restricted access controls. Only authorized credit managers can view these files during processing. Physical folders are kept in lock-and-key storage inside our Surat office.
            </p>
            <p>
              We retain information as long as necessary to process your loan application or fulfill compliance reviews. If you decide not to proceed with an application, you can submit a written request to permanently delete your digital records.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-charcoal-100 flex items-center gap-2">
              <Star className="w-5 h-5 text-teal-400" />
              7. Cookies &amp; Tracking Technologies
            </h2>
            <p>
              We use cookies and similar tracking tools (like web beacons and browser logs) to analyze website traffic, remember calculator inputs, and optimize our pages.
            </p>
            <p>
              Cookies help us understand which loan products (e.g. business loans, OD limits, home loans) are most popular in different regions of Surat, allowing us to customize content and improve our local search engine results. You can disable cookies in your browser settings, but some features (such as saved EMI calculations) may not function properly as a result.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-charcoal-100 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-teal-400" />
              8. Your Rights &amp; Choices
            </h2>
            <p>
              As a valued client of Vibhuti Enterprise, you retain full control over your personal data:
            </p>
            <ul className="space-y-1.5 pl-4 border-l border-teal-500/20 py-1">
              <li>You have the right to request a copy of the personal and financial records we have on file.</li>
              <li>You can request corrections to incomplete information, CIBIL mismatches, or outdated records.</li>
              <li>You can withdraw your consent for bank submissions or request the permanent deletion of your files.</li>
              <li>You can opt-out of receiving interest rate updates or promotional emails by clicking 'unsubscribe'.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-charcoal-100 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-teal-400" />
              9. Contact Details &amp; Compliance Office
            </h2>
            <p>
              For questions about this policy, data access requests, or document removal requests, contact our compliance officer at Vibhuti Enterprise:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
              <div className="p-4 rounded-xl border border-charcoal-800 bg-charcoal-900/30">
                <MapPin className="w-4 h-4 text-teal-400 mb-2" />
                <h4 className="font-display font-semibold text-charcoal-100 text-xs uppercase tracking-wider mb-1">Office Address</h4>
                <p className="text-xs text-charcoal-400 leading-relaxed">
                  Shop No. 115, Nidhi Complex,<br />
                  1st Floor, Opp. Chowpati,<br />
                  Nana Varachha, Surat, Gujarat
                </p>
              </div>
              <div className="p-4 rounded-xl border border-charcoal-800 bg-charcoal-900/30">
                <Phone className="w-4 h-4 text-teal-400 mb-2" />
                <h4 className="font-display font-semibold text-charcoal-100 text-xs uppercase tracking-wider mb-1">Direct Contacts</h4>
                <p className="text-xs text-charcoal-400 leading-relaxed font-mono">
                  +91 94091 26965<br />
                  +91 78628 08887
                </p>
              </div>
              <div className="p-4 rounded-xl border border-charcoal-800 bg-charcoal-900/30">
                <Mail className="w-4 h-4 text-teal-400 mb-2" />
                <h4 className="font-display font-semibold text-charcoal-100 text-xs uppercase tracking-wider mb-1">Email Inquiry</h4>
                <p className="text-xs text-charcoal-400 leading-relaxed">
                  info@vibhutienterprise.com<br />
                  support@vibhutienterprise.com
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* FAQs */}
        <div className="space-y-6 border-t border-charcoal-800/40 pt-10">
          <div className="text-center md:text-left space-y-2">
            <h2 className="font-heading text-2xl font-bold text-charcoal-100">Data Security &amp; Legal FAQs</h2>
            <p className="text-xs text-charcoal-500">Critical answers on how we handle personal documentation, secure credit score pulls, and comply with banking guidelines.</p>
          </div>

          <div className="space-y-4">
            {policyFaqs.map((faq, idx) => (
              <div key={idx} className="border border-charcoal-800 rounded-xl bg-charcoal-900/20 overflow-hidden">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 text-left flex justify-between items-center gap-4 cursor-pointer hover:bg-charcoal-850 transition-colors"
                >
                  <span className="font-display font-semibold text-sm text-charcoal-100 hover:text-teal-400 transition-colors">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-charcoal-400 flex-shrink-0 transition-transform duration-300 ${openFaq === idx ? 'rotate-180 text-teal-400' : ''}`} />
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 pt-0 border-t border-charcoal-800/40 text-xs text-charcoal-400 leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="border-t border-charcoal-800/40 pt-10 text-center space-y-4">
          <h2 className="font-heading text-2xl font-bold text-charcoal-100">Secure Credit Processing</h2>
          <p className="text-xs text-charcoal-400 max-w-md mx-auto">
            Applying for a loan through Vibhuti Enterprise is safe. Check rates and borrow with confidence.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button onClick={() => navigate('/apply-loan')} className="btn-accent text-xs">
              Start Loan Inquiry
            </button>
            <a 
              href="https://wa.me/917862808887?text=Hello%20Vibhuti%20Enterprise" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white transition-all shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              WhatsApp Secure Chat
            </a>
          </div>
        </div>

      </div>
    </>
  );
}
