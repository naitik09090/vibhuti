import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingActions from './components/FloatingActions';
import LoanInquiryPopup from './components/LoanInquiryPopup';
import LenisWrapper from './layouts/LenisWrapper';
import './styles/index.css';
import './styles/App.css';

// Page Imports
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Services from './pages/Services';
import LoanCalculatorPage from './pages/LoanCalculatorPage';
import EMICalculatorPage from './pages/EMICalculatorPage';
import ApplyLoanPage from './pages/ApplyLoanPage';
import Blog from './pages/Blog';
import ContactUs from './pages/ContactUs';
import AdminDashboard from './pages/AdminDashboard';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

// Helper component: Scroll page to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <LenisWrapper>
        {/* Global Conversion Popup */}
        <LoanInquiryPopup />

        <div className="flex flex-col min-h-screen bg-charcoal-950 pb-16 md:pb-0">
          {/* Navigation Bar */}
          <Navbar />

          {/* Main Content Area */}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/services" element={<Services />} />
              <Route path="/loan-calculator" element={<LoanCalculatorPage />} />
              <Route path="/emi-calculator" element={<EMICalculatorPage />} />
              <Route path="/apply-loan" element={<ApplyLoanPage />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
            </Routes>
          </main>

          {/* Floating Actions (Direct Call, WhatsApp, and Apply CTA) */}
          <FloatingActions />

          {/* Footer component */}
          <Footer />
        </div>
      </LenisWrapper>
    </Router>
  );
}
