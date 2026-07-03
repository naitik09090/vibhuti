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
import AdminLogin from './pages/AdminLogin';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Login from './pages/Login';

// Helper component: Scroll page to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    // Stop Lenis animation, jump DOM scroll to 0 instantly, then restart
    if (window.__lenis) {
      window.__lenis.stop();
      // Directly reset DOM scroll — no animation, instant
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      window.__lenis.scrollTo(0, { immediate: true });
      window.__lenis.start();
    } else {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, [pathname]);
  return null;
}

// Routes where Footer and FloatingActions should be hidden
const NO_FOOTER_ROUTES = ['/login', '/admin/login', '/admin'];

function LayoutExtras() {
  const { pathname } = useLocation();
  const hideExtras = NO_FOOTER_ROUTES.includes(pathname);
  if (hideExtras) return null;
  return (
    <>
      <FloatingActions />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <LenisWrapper>
        {/* Global Conversion Popup */}
        <LoanInquiryPopup />

        <div className="flex flex-col min-h-screen bg-charcoal-950 pb-16">
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
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/login" element={<Login />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
            </Routes>
          </main>

          {/* Footer and FloatingActions (hidden on login/admin pages) */}
          <LayoutExtras />
        </div>
      </LenisWrapper>
    </Router>
  );
}
