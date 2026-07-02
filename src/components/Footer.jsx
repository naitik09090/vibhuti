import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Mail, MapPin, Landmark } from 'lucide-react';

export default function Footer() {
  const location = useLocation();
  const currentYear = new Date().getFullYear();

  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="border-t border-charcoal-800 bg-charcoal-950 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">

          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg">
                <Landmark className="w-4 h-4 text-charcoal-950" />
              </div>
              <div>
                <span className="font-heading text-lg tracking-wider font-bold text-charcoal-100 group-hover:text-teal-400 transition-colors">
                  VIBHUTI
                </span>
                <span className="block font-sans text-[8px] tracking-[0.25em] text-teal-400 uppercase -mt-1 font-semibold">
                  Enterprise
                </span>
              </div>
            </Link>
            <p className="text-sm text-charcoal-400 leading-relaxed">
              Your trusted financial partner providing customized lending solutions and mortgage consulting with leading banking networks.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold text-charcoal-100 text-sm mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/services" className="text-charcoal-400 hover:text-teal-400 transition-colors">Home & Business Loans</Link></li>
              <li><Link to="/services" className="text-charcoal-400 hover:text-teal-400 transition-colors">Mortgage & Personal Loans</Link></li>
              <li><Link to="/services" className="text-charcoal-400 hover:text-teal-400 transition-colors">Education & Car Loans</Link></li>
              <li><Link to="/services" className="text-charcoal-400 hover:text-teal-400 transition-colors">OD, CC & Agriculture Loans</Link></li>
              <li><Link to="/services" className="text-charcoal-400 hover:text-teal-400 transition-colors">Insurance Consulting</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-charcoal-100 text-sm mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/emi-calculator" className="text-charcoal-400 hover:text-teal-400 transition-colors">EMI Calculator</Link></li>
              <li><Link to="/loan-calculator" className="text-charcoal-400 hover:text-teal-400 transition-colors">Eligibility Checker</Link></li>
              <li><Link to="/apply-loan" className="text-charcoal-400 hover:text-teal-400 transition-colors">Apply for Loan</Link></li>
              <li><Link to="/blog" className="text-charcoal-400 hover:text-teal-400 transition-colors">Blog & Insights</Link></li>
              <li><Link to="/about" className="text-charcoal-400 hover:text-teal-400 transition-colors">About Us</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-display font-semibold text-charcoal-100 text-sm mb-4">Contact</h4>
            <div className="flex items-start gap-2.5 text-sm text-charcoal-400">
              <MapPin className="w-4 h-4 text-teal-400 mt-0.5 flex-shrink-0" />
              <span>
                Shop No. 115, Nidhi Complex, 1st Floor,<br />
                Opp. Chowpati, Nana Varachha,<br />
                Surat, Gujarat
              </span>
            </div>
            <div className="space-y-1.5 text-sm">
              <a href="tel:9409126965" className="flex items-center gap-2 text-charcoal-400 hover:text-teal-400 transition-colors">
                <Phone className="w-3.5 h-3.5 text-teal-400" />
                Naitik Raiyani: +91 94091 26965
              </a>
              <a href="tel:7862808887" className="flex items-center gap-2 text-charcoal-400 hover:text-teal-400 transition-colors">
                <Phone className="w-3.5 h-3.5 text-teal-400" />
                Gunjal Shiroya: +91 78628 08887
              </a>
            </div>
            <a href="mailto:vibhutienterprise5608@gmail.com" className="flex items-center gap-2 text-sm text-charcoal-400 hover:text-teal-400 transition-colors">
              <Mail className="w-3.5 h-3.5 text-teal-400" />
              vibhutienterprise5608@gmail.com
            </a>
          </div>
        </div>

        <div className="border-t border-charcoal-800 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-charcoal-500">
          <p>&copy; {currentYear} Vibhuti Enterprise. All rights reserved.</p>
          <div className="flex gap-4 mt-3 md:mt-0">
            <Link to="/privacy-policy" className="hover:text-teal-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-teal-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
