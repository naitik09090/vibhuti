import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CountUpImport from 'react-countup';
const CountUp = typeof CountUpImport === 'function' ? CountUpImport : (CountUpImport.default || CountUpImport);
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import {
  Landmark, ArrowRight, ShieldCheck, Award, TrendingUp, Users, CheckCircle2,
  Phone, MessageSquare, Briefcase, GraduationCap, CreditCard,
  Car, Droplet, Star, Calculator, Sparkles, FileText, Clipboard, Banknote,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import SEOMeta from '../components/SEOMeta';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const navigate = useNavigate();
  const timelineRef = useRef(null);
  const progressLineRef = useRef(null);
  const triggerRefs = useRef([]);

  const [loanAmount, setLoanAmount] = useState(2500000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(15);
  const [emiOutputs, setEmiOutputs] = useState({ emi: 0, interest: 0, total: 0 });

  const featuredServices = [
    { title: 'Home Loan', description: 'Purchase or construct your dream home with flexible EMIs up to ₹10Cr and repayment tenure up to 30 years.', rate: '8.40% p.a.', icon: Landmark },
    { title: 'Business Loan', description: 'Unsecured & secured funding up to ₹50Cr for working capital, expansion, or new business ventures.', rate: '11.50% p.a.', icon: Briefcase },
    { title: 'Mortgage Loan', description: 'Unlock equity from your property at competitive rates for business or personal needs.', rate: '9.25% p.a.', icon: ShieldCheck },
    { title: 'Overdraft / CC', description: 'Flexible credit limits for working capital with interest charged only on the amount you use.', rate: '8.99% p.a.', icon: TrendingUp },
    { title: 'Personal Loan', description: 'Collateral-free funds up to ₹25L for medical emergencies, weddings, or travel.', rate: '10.99% p.a.', icon: CreditCard },
    { title: 'Education Loan', description: 'Finance studies at top institutions covering tuition, accommodation, and travel expenses.', rate: '8.50% p.a.', icon: GraduationCap }
  ];

  const highlights = [
    { title: 'Quick Approval', desc: 'Pre-approval within hours through our streamlined process.' },
    { title: '100+ Bank Partners', desc: 'Access to leading public and private banking networks.' },
    { title: 'Competitive Rates', desc: 'Best-in-class interest rates tailored to your profile.' },
    { title: 'Expert Guidance', desc: 'Dedicated advisors to guide you from application to disbursement.' },
    { title: 'Transparent Process', desc: 'No hidden charges. Full disclosure at every step.' },
    { title: 'End-to-End Support', desc: 'Complete assistance covering documentation to fund release.' }
  ];

  const testimonials = [
    { name: 'Aditya Birla', role: 'Infrastructure Developer', text: 'Vibhuti Enterprise simplified our corporate cash credit processing, accelerating our plant expansion timelines.', rating: 5 },
    { name: 'Dr. Meera Sen', role: 'Healthcare Consultant', text: 'The customized mortgage consulting saved me lakhs in interest. Extremely transparent and professional service.', rating: 5 },
    { name: 'Rajesh Varachha', role: 'Textile Exporter, Surat', text: 'Securing an OD limit for our division was a bottleneck. Vibhuti Enterprise bypassed standard banking loops seamlessly.', rating: 5 },
    { name: 'Anjali Shah', role: 'Homeowner', text: 'The team was available late hours, guiding me through the registration and ITR checklist. Excellent support.', rating: 5 }
  ];

  useEffect(() => {
    const P = loanAmount;
    const r = (interestRate / 100) / 12;
    const n = tenureYears * 12;

    if (P > 0 && r > 0 && n > 0) {
      const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalAmt = emi * n;
      const totalInt = totalAmt - P;
      setEmiOutputs({
        emi: Math.round(emi),
        interest: Math.round(totalInt),
        total: Math.round(totalAmt)
      });
    }
  }, [loanAmount, interestRate, tenureYears]);

  useEffect(() => {
    if (timelineRef.current && progressLineRef.current) {
      const line = progressLineRef.current;
      gsap.fromTo(line, { scaleY: 0 }, {
        scaleY: 1, ease: "none",
        scrollTrigger: {
          trigger: timelineRef.current,
          start: "top 35%",
          end: "bottom 15%",
          scrub: 1.2,
        }
      });
    }
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <>
      <SEOMeta
        title="Home"
        description="Premium financial services by Vibhuti Enterprise. Access Home Loans, Business Loans, Mortgages, OD/CC, and Insurance policies with trusted banking partnerships."
      />

      <section className="relative min-h-[90vh] flex items-center pt-20 pb-12 overflow-hidden">
        <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-teal-700/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            <motion.div
              className="lg:col-span-7 space-y-7"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="section-label">
                <ShieldCheck className="w-3.5 h-3.5" />
                Trusted Financial Partner — Since 2015
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.15] text-charcoal-100">
                Your Trusted Partner for<br />
                <span className="text-gradient">Home &amp; Business Loans</span>
              </h1>

              <p className="text-charcoal-400 text-base md:text-lg leading-relaxed max-w-2xl">
                We connect you with India's top banks to secure the best loan options —
                from home loans and business financing to mortgages and insurance.
                Expert guidance at every step.
              </p>

              <div className="flex flex-wrap gap-3 pt-1">
                <button
                  onClick={() => navigate('/apply-loan')}
                  className="btn-accent"
                >
                  Apply For Loan <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/services')}
                  className="btn-secondary"
                >
                  Explore Services
                </button>
              </div>

              <div className="flex items-center gap-6 pt-4 border-t border-charcoal-700/50 max-w-md">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1.5">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-300 to-teal-500 border-2 border-charcoal-900 flex items-center justify-center">
                        <span className="text-[8px] font-bold text-charcoal-950">{(i * 2).toString()}</span>
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-charcoal-500">Trusted by 5,000+ clients</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="lg:col-span-5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="card p-6 relative">
                <h3 className="font-display font-semibold text-charcoal-100 text-sm mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                  How It Works
                </h3>

                <div className="relative">
                  <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-charcoal-600/50" />

                  {[
                    { num: '01', icon: Clipboard, title: 'Apply Online', desc: 'Submit your details in minutes through our simple application form.' },
                    { num: '02', icon: CheckCircle2, title: 'We Evaluate', desc: 'Our experts match you with the best lender and negotiate terms.' },
                    { num: '03', icon: Banknote, title: 'Get Disbursed', desc: 'Funds are transferred to your account — fast and hassle-free.' },
                  ].map((step, i) => (
                    <div key={i} className="flex gap-4 pb-6 last:pb-0 relative">
                      <div className="relative z-10 w-8 h-8 rounded-full bg-teal-50 border-2 border-teal-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <step.icon className="w-3.5 h-3.5 text-teal-600" />
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-semibold text-teal-500 font-mono">{step.num}</span>
                          <h4 className="font-display font-semibold text-charcoal-100 text-sm">{step.title}</h4>
                        </div>
                        <p className="text-xs text-charcoal-400 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 pt-4 border-t border-charcoal-700/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-3.5 h-3.5 text-teal-400 fill-teal-400" />
                    <Star className="w-3.5 h-3.5 text-teal-400 fill-teal-400" />
                    <Star className="w-3.5 h-3.5 text-teal-400 fill-teal-400" />
                    <Star className="w-3.5 h-3.5 text-teal-400 fill-teal-400" />
                    <Star className="w-3.5 h-3.5 text-teal-400 fill-teal-400" />
                  </div>
                  <span className="text-xs text-charcoal-500">4.9 / 5.0</span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      <section className="py-20 border-t border-charcoal-800/60 bg-gradient-to-b from-charcoal-950 to-charcoal-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <div className="section-label justify-center">
              <Briefcase className="w-3.5 h-3.5" />
              What We Offer
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold">
              Our <span className="text-gradient">Services</span>
            </h2>
            <p className="text-charcoal-400 text-sm">
              Tailored lending solutions designed to match your financial goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={index}
                  className="card p-5 group cursor-pointer relative overflow-hidden hover:border-teal-400/30 hover:shadow-md transition-all"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => navigate('/services')}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-bl-full -mr-8 -mt-8 group-hover:bg-teal-500/10 transition-colors" />
                  <div className="w-11 h-11 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-4 group-hover:bg-teal-500/20 group-hover:border-teal-500/40 group-hover:shadow-sm transition-all">
                    <Icon className="w-5.5 h-5.5 text-teal-400" />
                  </div>
                  <h3 className="font-display font-semibold text-charcoal-100 mb-2 group-hover:text-teal-400 transition-colors text-lg">
                    {service.title}
                  </h3>
                  <p className="text-sm text-charcoal-400 leading-relaxed mb-5 min-h-[40px]">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between border-t border-charcoal-700/50 pt-4 mt-auto">
                    <span className="text-xs text-charcoal-500">Starting from</span>
                    <span className="text-xs font-semibold text-teal-400 bg-teal-500/10 px-3 py-1 rounded">
                      {service.rate}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <button
              onClick={() => navigate('/services')}
              className="btn-secondary text-sm"
            >
              View All Services <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-charcoal-800/60 bg-gradient-to-b from-charcoal-950 to-charcoal-900/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-teal-700/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <div className="section-label justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Why Us
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold">
              Why <span className="text-gradient">Choose Us</span>
            </h2>
            <p className="text-charcoal-400 text-sm">
              We leverage direct banking relationships to secure optimized funding solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {highlights.map((h, idx) => {
              const icons = [Award, TrendingUp, ShieldCheck, Users, Clipboard, Star];
              const IconComp = icons[idx];
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="card p-6 group cursor-default relative overflow-hidden"
                  whileHover={{ y: -3 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-[10px] font-mono text-charcoal-500 mb-3 block">
                    {(idx + 1).toString().padStart(2, '0')}
                  </span>
                  <div className="w-11 h-11 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-4 group-hover:bg-teal-500/20 group-hover:border-teal-500/40 group-hover:shadow-sm transition-all">
                    <IconComp className="w-5.5 h-5.5 text-teal-400" />
                  </div>
                  <h3 className="font-display font-semibold text-charcoal-100 mb-2 group-hover:text-teal-400 transition-colors">
                    {h.title}
                  </h3>
                  <p className="text-sm text-charcoal-400 leading-relaxed">
                    {h.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section ref={timelineRef} className="py-20 border-t border-charcoal-800/60 bg-gradient-to-b from-charcoal-950 to-charcoal-900/20 relative overflow-hidden">
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <div className="section-label justify-center">
              <Clipboard className="w-3.5 h-3.5" />
              Process
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold">
              How It <span className="text-gradient">Works</span>
            </h2>
            <p className="text-charcoal-400 text-sm">
              A straightforward process to get you from application to disbursement.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="absolute left-[24px] md:left-1/2 top-0 bottom-0 w-[2px] bg-charcoal-800 -translate-x-1/2 z-0" />
            <div
              ref={progressLineRef}
              className="absolute left-[24px] md:left-1/2 top-0 w-[2px] bg-gradient-to-b from-teal-500 via-teal-400 to-teal-500 -translate-x-1/2 origin-top z-0 shadow-[0_0_10px_rgba(20,184,166,0.4)]"
              style={{ height: '100%', transformOrigin: 'top' }}
            />

            {[
              { step: '01', title: 'Apply Online', text: 'Choose your loan type, check eligibility, and submit your inquiry in minutes.', icon: Clipboard },
              { step: '02', title: 'Submit Documents', text: 'Upload your KYC documents, income proof, and statements securely.', icon: FileText },
              { step: '03', title: 'Approval', text: 'Our team verifies your profile and obtains approval within 24 hours.', icon: CheckCircle2 },
              { step: '04', title: 'Disbursement', text: 'Review the terms, sign the agreement, and receive your funds.', icon: Banknote }
            ].map((item, idx) => {
              const StepIcon = item.icon;
              return (
                <motion.div
                  key={idx}
                  ref={el => triggerRefs.current[idx] = el}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: idx * 0.15, ease: "easeOut" }}
                  className={`flex flex-col md:flex-row items-start gap-6 mb-14 relative z-10 group ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  <div className="absolute left-0 md:left-1/2 top-6 w-12 h-12 md:-translate-x-1/2 z-10">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: idx * 0.15 + 0.25, type: "spring", stiffness: 250, damping: 14 }}
                      className="w-full h-full rounded-full bg-charcoal-900/90 border border-teal-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(20,184,166,0.05)] group-hover:border-teal-400 group-hover:shadow-[0_0_20px_rgba(20,184,166,0.25)] group-hover:scale-110 transition-all duration-300 backdrop-blur-sm"
                    >
                      <StepIcon className="w-5 h-5 text-teal-400 group-hover:text-teal-300 drop-shadow-[0_0_4px_rgba(20,184,166,0.3)] transition-colors" />
                    </motion.div>
                  </div>

                  <div className={`hidden md:block w-1/2 ${idx % 2 === 0 ? 'md:pl-14' : 'md:pr-14'}`} />

                  <div className={`w-full md:w-1/2 pl-16 md:pl-0 ${idx % 2 === 0 ? 'md:pr-14' : 'md:pl-14'}`}>
                    <div className="card p-6 hover:border-teal-500/30 hover:shadow-xl hover:shadow-teal-500/[0.02] transition-all duration-500 group relative overflow-hidden bg-gradient-to-br from-charcoal-900/80 to-charcoal-950/80 backdrop-blur-md border border-charcoal-800/80">
                      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className={`absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-teal-500 via-teal-500/40 to-transparent transition-opacity duration-500 ${idx % 2 === 0 ? 'right-0' : 'left-0'}`} />

                      <div className={`absolute -bottom-6 font-heading text-8xl font-black text-charcoal-800/10 select-none pointer-events-none group-hover:text-teal-500/5 transition-colors duration-500 ${idx % 2 === 0 ? 'left-6' : 'right-6'}`}>
                        {item.step}
                      </div>

                      <div className="relative z-10 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold tracking-widest text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2.5 py-0.5 rounded-full uppercase">
                            Step {item.step}
                          </span>
                        </div>
                        <h3 className="font-heading text-xl font-bold text-charcoal-100 group-hover:text-teal-400 transition-colors duration-300">{item.title}</h3>
                        <p className="text-sm text-charcoal-400 leading-relaxed group-hover:text-charcoal-300 transition-colors duration-300">{item.text}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-charcoal-950 to-charcoal-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <div className="section-label justify-center">
              <Calculator className="w-3.5 h-3.5" />
              EMI Calculator
            </div>
            <h2 className="font-heading text-3xl font-bold">
              Estimate Your <span className="text-gradient">Monthly Payments</span>
            </h2>
            <p className="text-sm text-charcoal-400">Adjust the parameters below to calculate your estimated EMI instantly.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            <div className="lg:col-span-5 space-y-6">
              <div className="card p-6 space-y-6 border-charcoal-700/50 shadow-sm">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-charcoal-300">Loan Amount</span>
                    <span className="text-sm font-semibold text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded font-mono">
                      ₹{loanAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="100000"
                    max="10000000"
                    step="50000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full accent-teal-500 cursor-pointer bg-charcoal-700 h-2 rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-xs text-charcoal-500 font-mono">
                    <span>₹1L</span>
                    <span>₹1Cr</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-charcoal-300">Interest Rate</span>
                    <span className="text-sm font-semibold text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded font-mono">
                      {interestRate}% p.a.
                    </span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="18"
                    step="0.05"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full accent-teal-500 cursor-pointer bg-charcoal-700 h-2 rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-xs text-charcoal-500 font-mono">
                    <span>6%</span>
                    <span>18%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-charcoal-300">Tenure</span>
                    <span className="text-sm font-semibold text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded font-mono">
                      {tenureYears} Years
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={tenureYears}
                    onChange={(e) => setTenureYears(Number(e.target.value))}
                    className="w-full accent-teal-500 cursor-pointer bg-charcoal-700 h-2 rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-xs text-charcoal-500 font-mono">
                    <span>1 Year</span>
                    <span>30 Years</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="card p-6 border-teal-500/20 bg-gradient-to-br from-charcoal-800/80 to-charcoal-900 flex flex-col justify-between space-y-5">
                <div>
                  <span className="text-xs text-charcoal-500 block font-medium uppercase tracking-wider mb-2">Monthly EMI</span>
                  <span className="text-4xl font-bold text-teal-400 font-mono block tracking-tight">
                    ₹{emiOutputs.emi.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="space-y-3 pt-4 border-t border-charcoal-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-charcoal-500 uppercase tracking-wider">Interest Payable</span>
                    <span className="text-base font-semibold text-charcoal-100 font-mono">
                      ₹{emiOutputs.interest.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-charcoal-500 uppercase tracking-wider">Total Amount</span>
                    <span className="text-base font-semibold text-charcoal-100 font-mono">
                      ₹{emiOutputs.total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="card p-6 border-charcoal-700/50 flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <span className="text-xs text-charcoal-500 font-medium uppercase tracking-wider block">Principal vs Interest</span>

                  <div className="w-full space-y-2">
                    <div className="w-full h-3.5 rounded-full bg-charcoal-800 overflow-hidden flex">
                      <div
                        className="h-full bg-teal-600 transition-all duration-500"
                        style={{ width: `${(loanAmount / emiOutputs.total) * 100}%` }}
                      />
                      <div
                        className="h-full bg-teal-500 transition-all duration-500"
                        style={{ width: `${(emiOutputs.interest / emiOutputs.total) * 100}%` }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-xs font-mono">
                      <div className="flex items-center gap-1.5 text-teal-400">
                        <div className="w-2 h-2 rounded-full bg-teal-600" />
                        <span>Principal: {Math.round((loanAmount / emiOutputs.total) * 100)}%</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-teal-400">
                        <div className="w-2 h-2 rounded-full bg-teal-500" />
                        <span>Interest: {Math.round((emiOutputs.interest / emiOutputs.total) * 100)}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/apply-loan')}
                  className="btn-accent w-full text-sm !py-2.5"
                >
                  Apply Now
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="py-20 border-t border-charcoal-800/60 bg-gradient-to-b from-charcoal-950 to-charcoal-900/20 relative overflow-hidden">
        <div className="absolute top-0 left-1/3 w-[300px] h-[300px] bg-charcoal-600/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <div className="section-label justify-center">
              <Star className="w-3.5 h-3.5" />
              Testimonials
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold">
              What Our <span className="text-gradient">Clients Say</span>
            </h2>
            <p className="text-charcoal-400 text-sm">
              Real feedback from the people we've helped.
            </p>
          </div>

          <div className="max-w-4xl mx-auto relative">
            <Swiper
              modules={[Autoplay, Pagination, Navigation]}
              spaceBetween={24}
              slidesPerView={1}
              breakpoints={{ 768: { slidesPerView: 2 } }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              navigation={{
                prevEl: '.swiper-btn-prev',
                nextEl: '.swiper-btn-next',
              }}
              className="px-4 md:px-0 pb-16 [&_.swiper-pagination-bullet]:bg-charcoal-600/40 [&_.swiper-pagination-bullet-active]:bg-charcoal-400 [&_.swiper-pagination-bullet]:w-2.5 [&_.swiper-pagination-bullet]:h-2.5 [&_.swiper-pagination-bullet]:rounded-full"
            >
              {testimonials.map((t, idx) => {
                const initials = t.name.split(' ').map(n => n[0]).join('');
                return (
                  <SwiperSlide key={idx}>
                    <div className="bg-charcoal-900 border border-charcoal-600/40 rounded-2xl p-7 hover:border-charcoal-400/60 hover:shadow-[0_8px_25px_rgba(0,0,0,0.04)] transition-all duration-300 flex flex-col justify-between min-h-[260px] group">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="flex gap-0.5">
                            {[...Array(t.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-charcoal-400 text-charcoal-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-charcoal-400 text-sm leading-relaxed italic">
                          "{t.text}"
                        </p>
                      </div>
                      {/* <div className="flex items-center gap-3 pt-5 mt-4 border-t border-charcoal-600/20">
                        <div className="w-9 h-9 rounded-full bg-charcoal-950 border border-charcoal-600/30 flex items-center justify-center flex-shrink-0 group-hover:bg-charcoal-100 group-hover:border-charcoal-400 transition-all">
                          <span className="text-[11px] font-semibold text-charcoal-400 group-hover:text-charcoal-600 transition-colors">{initials}</span>
                        </div>
                        <div>
                          <h4 className="font-display font-semibold text-charcoal-100 text-sm">{t.name}</h4>
                          <p className="text-xs text-charcoal-400 mt-0.5">{t.role}</p>
                        </div>
                      </div> */}
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>

            <div className="flex items-center justify-center gap-3 mt-6">
              <button className="swiper-btn-prev w-10 h-10 rounded-full bg-charcoal-900 border border-charcoal-600/40 flex items-center justify-center hover:border-charcoal-400/60 hover:shadow-md transition-all cursor-pointer shadow-sm">
                <ChevronLeft className="w-4 h-4 text-charcoal-400" />
              </button>
              <button className="swiper-btn-next w-10 h-10 rounded-full bg-charcoal-900 border border-charcoal-600/40 flex items-center justify-center hover:border-charcoal-400/60 hover:shadow-md transition-all cursor-pointer shadow-sm">
                <ChevronRight className="w-4 h-4 text-charcoal-400" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-charcoal-600/30 bg-gradient-to-b from-charcoal-950 to-charcoal-900/20 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-charcoal-600/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <div className="section-label justify-center">
              <Sparkles className="w-3.5 h-3.5" />
              Contact
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold">
              Get in <span className="text-gradient">Touch</span>
            </h2>
            <p className="text-charcoal-400 text-sm">
              Visit our Surat office or contact our advisors directly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-5 bg-charcoal-900 border border-charcoal-500/30 rounded-2xl p-7 hover:border-charcoal-400/60 transition-all duration-300 flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                <div className="flex items-center gap-3 pb-4 border-b border-charcoal-500/20">
                  <div className="w-10 h-10 rounded-xl bg-charcoal-950 border border-charcoal-500/30 flex items-center justify-center">
                    <Landmark className="w-5 h-5 text-charcoal-400" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-charcoal-100">Our Office</h3>
                    <p className="text-xs text-charcoal-400">Visit us in person</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-sm text-charcoal-400">
                  <div className="w-8 h-8 rounded-lg bg-charcoal-950 border border-charcoal-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Landmark className="w-4 h-4 text-charcoal-400" />
                  </div>
                  <span className="leading-relaxed">
                    Shop No. 115, Nidhi Complex,<br />
                    1st Floor, Opp. Chowpati,<br />
                    Nana Varachha, Surat, Gujarat
                  </span>
                </div>

                <div className="space-y-3">
                  <a href="tel:9409126965" className="flex items-center gap-3 text-sm text-charcoal-400 hover:text-charcoal-600 transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-charcoal-950 border border-charcoal-500/30 flex items-center justify-center flex-shrink-0 group-hover:bg-charcoal-100 group-hover:border-charcoal-400 transition-all">
                      <Phone className="w-4 h-4 text-charcoal-400" />
                    </div>
                    <span>Naitik Raiyani: <span className="font-mono text-charcoal-300">+91 94091 26965</span></span>
                  </a>
                  <a href="tel:7862808887" className="flex items-center gap-3 text-sm text-charcoal-400 hover:text-charcoal-600 transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-charcoal-950 border border-charcoal-500/30 flex items-center justify-center flex-shrink-0 group-hover:bg-charcoal-100 group-hover:border-charcoal-400 transition-all">
                      <Phone className="w-4 h-4 text-charcoal-400" />
                    </div>
                    <span>Gunjal Shiroya: <span className="font-mono text-charcoal-300">+91 78628 08887</span></span>
                  </a>
                </div>
              </div>

              <a
                href="https://wa.me/917862808887?text=Hello%20Vibhuti%20Enterprise"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-charcoal-950 border border-charcoal-500/30 text-sm font-semibold text-charcoal-300 hover:bg-charcoal-100 hover:border-charcoal-400 hover:text-charcoal-600 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                WhatsApp Support
              </a>
            </div>

            <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-charcoal-500/30 h-[350px] lg:h-auto min-h-[300px]">
              <iframe
                title="Vibhuti Enterprise Surat Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.6457187498363!2d72.887208!3d21.206254!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04f479f64bfcb%3A0xbd86dc5a6d516246!2sNidhi%20Complex!5e0!3m2!1sen!2sin!4v1718567119280!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card p-8 md:p-10 bg-gradient-to-br from-teal-800/40 via-charcoal-900 to-charcoal-950 border-teal-500/20 text-center space-y-5">
            <h2 className="font-heading text-2xl md:text-3xl font-bold">
              Ready to Get <span className="text-gradient">Started?</span>
            </h2>
            <p className="text-charcoal-400 text-sm max-w-lg mx-auto leading-relaxed">
              Connect with Vibhuti Enterprise today. Get expert guidance and find the right loan solution for your needs.
            </p>
            <div className="flex justify-center gap-3 flex-wrap pt-1">
              <button
                onClick={() => navigate('/apply-loan')}
                className="btn-accent"
              >
                Apply for Loan
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="btn-secondary"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
