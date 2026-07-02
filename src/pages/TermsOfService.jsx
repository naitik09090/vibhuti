import React, { useState } from 'react';
import { 
  ShieldCheck, HelpCircle, FileText, ChevronDown, Landmark, 
  Mail, Phone, MapPin, ArrowRight, Lock, CheckCircle2, Scale, Info,
  UserCheck, MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SEOMeta from '../components/SEOMeta';

export default function TermsOfService() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const termsFaqs = [
    {
      q: 'Does Vibhuti Enterprise guarantee loan approval?',
      a: 'No. Vibhuti Enterprise is a premier financial consulting and debt facilitation firm, not a direct bank or licensed lender. Final credit approvals, interest rates, margins, and sanction terms are decided solely by the respective bank or NBFC credit committee based on their internal underwriting standards and risk policies.'
    },
    {
      q: 'What happens if a user submits inaccurate or fraudulent documents?',
      a: 'Under our Terms of Service, users are legally bound to submit 100% accurate, true, and original records (including salary slips, bank statements, and tax audits). Submitting altered or fake documents is a violation of our terms and will result in the immediate termination of our advisory service, file cancellation, and potential reports to credit bureaus or law enforcement.'
    },
    {
      q: 'Are consulting terms and fee agreements agreed upon upfront?',
      a: 'Yes, absolutely. We maintain a policy of full transparency. Any service terms, consulting milestones, or facilitation fee coordinates are agreed upon in writing beforehand. Banks also declare processing charges and statutory stamp duties clearly inside their official sanction letters, ensuring no hidden surprises.'
    },
    {
      q: 'Which jurisdiction applies in case of a dispute?',
      a: 'All transactions, consulting agreements, and terms of service are governed by the laws of India. Any disputes, claims, or legal proceedings arising between users and Vibhuti Enterprise are subject to the exclusive jurisdiction of the competent courts located in Surat, Gujarat.'
    }
  ];

  return (
    <>
      <SEOMeta
        title="Terms of Service | Vibhuti Enterprise Surat"
        description="Read the official Terms of Service of Vibhuti Enterprise, Surat. Understand our financial advisory scope, user obligations, fees, and legal disclaimers."
      />

      <div className="py-20 max-w-3xl mx-auto px-6 text-charcoal-400 text-sm leading-relaxed space-y-12">
        
        {/* Header Hero */}
        <div className="space-y-4 text-center border-b border-charcoal-800/40 pb-10">
          <div className="section-label mx-auto w-fit">
            <Scale className="w-3.5 h-3.5" />
            Legal Terms
          </div>
          <h1 className="font-heading text-4xl font-bold text-charcoal-100">
            Terms of Service
          </h1>
          <p className="text-xs text-charcoal-500">
            Effective Date: July 1, 2026. These comprehensive terms and conditions govern your use of the website, financial tools, and loan consulting services provided by Vibhuti Enterprise.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          
          <div className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-charcoal-100 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-teal-400" />
              1. Acceptance of Terms
            </h2>
            <p>
              These Terms of Service (referred to as the "Agreement") form a legally binding contract between you (whether an individual borrower, a proprietary business owner, partnership firm, or corporate director) and Vibhuti Enterprise, a financial consulting agency based in Nana Varachha, Surat, Gujarat. This Agreement governs your usage of our website, the mortgage calculation engines, loan eligibility evaluation checkers, contact endpoints, and any financial advisory services we coordinate.
            </p>
            <p>
              By accessing our digital interfaces, submitting loan inquiries, or providing your personal documentation, you acknowledge that you have read, understood, and agreed to be bound by these terms. If you do not accept all clauses outlined in this Agreement, you must immediately cease using our website and digital tools.
            </p>
            <p>
              We reserve the right to modify these terms at any time to reflect changing banking regulations or legal compliance updates. Your continued use of the website or consulting services after such revisions indicates your explicit agreement to the updated clauses.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-charcoal-100 flex items-center gap-2">
              <Landmark className="w-5 h-5 text-teal-400" />
              2. Scope of Financial Advisory &amp; Loan Disclaimers
            </h2>
            <p>
              Vibhuti Enterprise operates strictly as a credit facilitator and financial consultant. We coordinate direct channels with 100+ public sector banks, private nationalized banks, and NBFC networks to find optimized rates and tenures.
            </p>
            <p>
              <strong className="text-teal-400">CRITICAL LEGAL NOTICE:</strong> Vibhuti Enterprise is NOT a bank, NBFC, microfinance institution, or direct lender. We do not issue loans, issue guarantees, or hold credit accounts. All credit assessments, document reviews, and structural packaging we perform are meant to match your files with institutional lenders.
            </p>
            <p>
              The final power to sanction a loan, determine interest rates, apply processing fees, or reject an application lies exclusively with the underwriting and credit committees of the respective banks. We are not liable for any delays in bank CPUs, changes in loan valuations, or files rejected by banks.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-charcoal-100 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-teal-400" />
              3. User Obligations
            </h2>
            <p>
              To use our advisory services and submit loan files, you must satisfy the following criteria:
            </p>
            <ul className="space-y-2 pl-4 border-l border-teal-500/20 py-1">
              <li>You must be at least 18 years of age and possess the legal capacity to enter binding financial contracts.</li>
              <li>You warrant that all personal identity documents, GST registers, salary slips, and property deeds submitted are 100% accurate, complete, and legally valid.</li>
              <li>You agree not to upload, email, or transfer any forged or altered financial statements. Submission of fake documents violates terms, terminates our relationship, and may be reported.</li>
              <li>You are responsible for keeping your contact information updated so our relationship managers can coordinate bank updates.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-charcoal-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-400" />
              4. Credit Authorization
            </h2>
            <p>
              By submitting a loan inquiry or document files to Vibhuti Enterprise, you grant us explicit authority to:
            </p>
            <p>
              Perform soft credit checks to verify your credit score. Pulling this information is necessary to recommend the best loan product and does not negatively affect your CIBIL score.
            </p>
            <p>
              Share your documents and verifications with our partner banks and NBFCs for formal loan processing. We will discuss and finalize the list of banks with you before submitting your files. You also authorize these banks to run formal hard inquiries on your credit history.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-charcoal-100 flex items-center gap-2">
              <Scale className="w-5 h-5 text-teal-400" />
              5. Fees &amp; Charges
            </h2>
            <p>
              We believe in clear financial terms. The fee structures related to our advisory services are governed by the following clauses:
            </p>
            <p>
              Our initial loan assessments, EMI estimates, and basic document reviews are offered completely free of charge. Any consulting fees for high-value corporate limits, overdraft setups, or complex restructuring are agreed upon in writing before processing.
            </p>
            <p>
              All bank processing fees, legal search fees, property valuation fees, stamp duties, and registration costs are charged directly by the respective bank. Vibhuti Enterprise has no control over these bank charges and does not collect or markup bank fees.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-charcoal-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-400" />
              6. Intellectual Property
            </h2>
            <p>
              All content displayed on the Vibhuti Enterprise website—including layout styles, brand logos, code snippets, visual calculators, text content, and graphics—is the intellectual property of Vibhuti Enterprise and protected by copyright laws.
            </p>
            <p>
              You are granted a limited license to access pages and download document templates for personal use. You may not republish, distribute, copy, or use our digital calculators or text copy for commercial brokerage purposes without our written consent.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-charcoal-100 flex items-center gap-2">
              <Lock className="w-5 h-5 text-teal-400" />
              7. Limitation of Liability
            </h2>
            <p>
              Vibhuti Enterprise and its directors, partners, or employees shall not be liable for any direct, indirect, accidental, or consequential damages resulting from:
            </p>
            <p>
              Rejections of loan files by banks, adjustments in bank interest rates, reductions in property valuation limits, or delays inside bank processing units.
            </p>
            <p>
              Decisions made by banks regarding loan pricing, foreclosing charges, or floating markups. Any agreements you sign are strictly between you and the lending bank. Vibhuti Enterprise is not a party to your loan agreements and holds no liability.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-charcoal-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-400" />
              8. Indemnification
            </h2>
            <p>
              You agree to protect, indemnify, and hold harmless Vibhuti Enterprise and its advisors from any legal claims, penalties, losses, or expenses (including attorney fees) arising from:
            </p>
            <p>
              Your violation of these terms, your submission of false financial files or incorrect identity credentials, or any disputes between you and the lending bank during the repayment lifecycle.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-charcoal-100 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-teal-400" />
              9. Governing Law &amp; Dispute Resolutions
            </h2>
            <p>
              These Terms of Service, along with any consulting agreements, are governed by the laws of India. Any disputes arising between you and Vibhuti Enterprise shall be settled amicably through arbitration. In case a resolution is not reached, the dispute shall be subject to the exclusive jurisdiction of the competent courts in Surat, Gujarat.
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
            <h2 className="font-heading text-2xl font-bold text-charcoal-100">Service Agreement FAQs</h2>
            <p className="text-xs text-charcoal-500">Important legal and service parameters clarified for borrowers.</p>
          </div>

          <div className="space-y-4">
            {termsFaqs.map((faq, idx) => (
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
          <h2 className="font-heading text-2xl font-bold text-charcoal-100">Transparent Credit Facilitation</h2>
          <p className="text-xs text-charcoal-400 max-w-md mx-auto">
            Read our terms and proceed with confidence. We match you with the best lenders in India.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button onClick={() => navigate('/loan-calculator')} className="btn-accent text-xs">
              Check Loan Eligibility
            </button>
            <button onClick={() => navigate('/contact')} className="btn-secondary text-xs">
              Connect With Advisors
            </button>
          </div>
        </div>

      </div>
    </>
  );
}
