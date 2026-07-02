import React, { useState } from 'react';
import axios from 'axios';
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import SEOMeta from '../components/SEOMeta';
import { API_BASE_URL } from '../config';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/leads/apply`, {
        ...formData,
        loanType: 'General Inquiry',
        loanAmount: 0,
        loanTenureYears: 0
      });

      if (response.data.success) {
        setSuccess(true);
        setFormData({ customerName: '', email: '', phone: '', message: '' });
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOMeta
        title="Contact Us"
        description="Get in touch with Vibhuti Enterprise. Call, email, or visit our Surat office."
      />

      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h1 className="font-heading text-4xl sm:text-5xl font-bold">
              Get in <span className="text-gradient">Touch</span>
            </h1>
            <p className="text-charcoal-400">
              Have questions about our services? Reach out to us directly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">

            <div className="lg:col-span-5 space-y-5">
              <div className="card p-6 border-charcoal-700/50 space-y-5">
                <h3 className="font-display font-semibold text-charcoal-100">Contact Information</h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-teal-900/60 border border-teal-700/40 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-teal-400" />
                    </div>
                    <div>
                      <p className="text-xs text-charcoal-500 uppercase font-medium tracking-wider">Phone</p>
                      <a href="tel:+919409126965" className="text-sm text-charcoal-100 hover:text-teal-400 transition-colors">
                        +91 94091 26965
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-teal-900/60 border border-teal-700/40 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-4 h-4 text-teal-400" />
                    </div>
                    <div>
                      <p className="text-xs text-charcoal-500 uppercase font-medium tracking-wider">WhatsApp</p>
                      <a
                        href="https://wa.me/917862808887?text=Hello%20Vibhuti%20Enterprise"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-teal-400 hover:text-teal-500 transition-colors"
                      >
                        Start Chat
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-teal-900/60 border border-teal-700/40 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-teal-400" />
                    </div>
                    <div>
                      <p className="text-xs text-charcoal-500 uppercase font-medium tracking-wider">Email</p>
                      <a href="mailto:vibhutienterprise5608@gmail.com" className="text-sm text-charcoal-100 hover:text-teal-400 transition-colors">
                        vibhutienterprise5608@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-teal-900/60 border border-teal-700/40 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-teal-400" />
                    </div>
                    <div>
                      <p className="text-xs text-charcoal-500 uppercase font-medium tracking-wider">Office</p>
                      <p className="text-sm text-charcoal-300 leading-relaxed">
                        Shop No. 115, Nidhi Complex,<br />
                        1st Floor, Opp. Chowpati,<br />
                        Nana Varachha, Surat, Gujarat
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="card p-6 border-charcoal-700/50">
                {success ? (
                  <div className="text-center py-10 space-y-4">
                    <div className="w-10 h-10 rounded-full bg-teal-500/20 border border-teal-500 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-5 h-5 text-teal-400" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-charcoal-100">Message Sent</h3>
                    <p className="text-sm text-charcoal-400 max-w-sm mx-auto">
                      We'll review your inquiry and get back to you shortly.
                    </p>
                    <button
                      onClick={() => setSuccess(false)}
                      className="btn-secondary text-sm !px-4 !py-2 mx-auto"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <h3 className="font-display font-semibold text-charcoal-100">Send us a Message</h3>

                    {error && (
                      <div className="p-3 rounded bg-red-950/30 border border-red-800/30 text-red-400 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="text-xs text-charcoal-500 uppercase tracking-wider">Name</label>
                      <input
                        type="text"
                        name="customerName"
                        required
                        value={formData.customerName}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className="w-full bg-charcoal-800 border border-charcoal-700 rounded-lg px-3 py-2.5 text-sm text-charcoal-100 placeholder-charcoal-500 focus:outline-none focus:border-teal-500/50"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs text-charcoal-500 uppercase tracking-wider">Email</label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="email@domain.com"
                          className="w-full bg-charcoal-800 border border-charcoal-700 rounded-lg px-3 py-2.5 text-sm text-charcoal-100 placeholder-charcoal-500 focus:outline-none focus:border-teal-500/50"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-charcoal-500 uppercase tracking-wider">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Your contact number"
                          className="w-full bg-charcoal-800 border border-charcoal-700 rounded-lg px-3 py-2.5 text-sm text-charcoal-100 placeholder-charcoal-500 focus:outline-none focus:border-teal-500/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-charcoal-500 uppercase tracking-wider">Message</label>
                      <textarea
                        name="message"
                        rows={4}
                        required
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="How can we help you?"
                        className="w-full bg-charcoal-800 border border-charcoal-700 rounded-lg px-3 py-2.5 text-sm text-charcoal-100 placeholder-charcoal-500 focus:outline-none focus:border-teal-500/50 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-accent w-full"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                        <><Send className="w-4 h-4" /> Send Message</>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>

          <div className="rounded-xl overflow-hidden border border-charcoal-700">
            <iframe
              title="Vibhuti Enterprise Surat"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.6457187498363!2d72.887208!3d21.206254!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04f479f64bfcb%3A0xbd86dc5a6d516246!2sNidhi%20Complex!5e0!3m2!1sen!2sin!4v1718567119280!5m2!1sen!2sin"
              width="100%"
              height="300"
              style={{ border: 0, borderRadius: '12px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-xl"
            />
          </div>

        </div>
      </div>
    </>
  );
}
