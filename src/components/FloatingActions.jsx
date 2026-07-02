import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Phone, MessageSquare, Send, X, ArrowUp } from 'lucide-react';

export default function FloatingActions() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showCallMenu, setShowCallMenu] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const contacts = [
    { name: "Naitik Raiyani", phone: "9409126965" },
    { name: "Gunjal Shiroya", phone: "7862808887" }
  ];

  const whatsappNumber = "917862808887";
  const whatsappMessage = encodeURIComponent("Hello Vibhuti Enterprise, I am looking for financial/loan consultation. Please guide me.");

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <button
        onClick={scrollToTop}
        className={`fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40 w-10 h-10 rounded-lg bg-charcoal-800 border border-charcoal-700 text-charcoal-400 hover:text-charcoal-100 hover:border-charcoal-400 flex items-center justify-center shadow-lg transition-all duration-300 ${showScrollTop ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'}`}
        title="Scroll to Top"
      >
        <ArrowUp className="w-4 h-4" />
      </button>

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-charcoal-950/95 backdrop-blur-md border-t border-charcoal-800 px-4 py-2.5 flex items-center justify-between gap-2">
        <button
          onClick={() => setShowCallMenu(!showCallMenu)}
          className="flex-1 py-2.5 rounded-lg bg-charcoal-800 border border-charcoal-700 text-charcoal-100 text-xs font-medium flex items-center justify-center gap-1.5"
        >
          <Phone className="w-3.5 h-3.5 text-teal-400" />
          Call Us
        </button>

        <button
          onClick={() => navigate('/apply-loan')}
          className="flex-[2] py-2.5 rounded-lg bg-teal-500 text-charcoal-950 text-xs font-semibold flex items-center justify-center gap-1.5"
        >
          <Send className="w-3.5 h-3.5" />
          Apply Now
        </button>

        <a
          href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2.5 rounded-lg bg-emerald-700 border border-emerald-600/40 text-white text-xs font-medium flex items-center justify-center gap-1.5"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          WhatsApp
        </a>

        {showCallMenu && (
          <>
            <div className="fixed inset-0 z-10 bg-black/50" onClick={() => setShowCallMenu(false)} />
            <div className="fixed bottom-20 left-4 right-4 bg-charcoal-900 border border-charcoal-700 rounded-xl p-4 z-20 shadow-xl">
              <div className="flex justify-between items-center border-b border-charcoal-800 pb-2 mb-3">
                <span className="text-xs font-semibold text-teal-400">Contact Advisors</span>
                <button onClick={() => setShowCallMenu(false)} className="text-charcoal-500 hover:text-charcoal-100">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                {contacts.map((contact, idx) => (
                  <a
                    key={idx}
                    href={`tel:${contact.phone}`}
                    onClick={() => setShowCallMenu(false)}
                    className="flex items-center justify-between p-3 bg-charcoal-800/50 rounded-lg hover:bg-charcoal-800 transition-colors"
                  >
                    <div>
                      <span className="block text-sm font-medium text-charcoal-100">{contact.name}</span>
                      <span className="text-xs text-charcoal-400">{contact.phone}</span>
                    </div>
                    <Phone className="w-4 h-4 text-teal-400" />
                  </a>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
