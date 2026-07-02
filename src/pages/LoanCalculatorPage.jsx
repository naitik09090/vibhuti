import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, CheckCircle, Calculator } from 'lucide-react';
import SEOMeta from '../components/SEOMeta';

export default function LoanCalculatorPage() {
  const [monthlyIncome, setMonthlyIncome] = useState(50000);
  const [existingEmi, setExistingEmi] = useState(0);
  const [interestRate, setInterestRate] = useState(9.0);
  const [tenureYears, setTenureYears] = useState(15);

  const [eligibleEmi, setEligibleEmi] = useState(0);
  const [maxLoanAmount, setMaxLoanAmount] = useState(0);
  const [dtiRatio, setDtiRatio] = useState(0);

  useEffect(() => {
    const baseCapacity = monthlyIncome * 0.5;
    const capacityEmi = Math.max(0, baseCapacity - existingEmi);
    setEligibleEmi(capacityEmi);

    const totalObligations = existingEmi;
    const dti = monthlyIncome > 0 ? (totalObligations / monthlyIncome) * 100 : 0;
    setDtiRatio(Math.round(dti));

    if (capacityEmi > 0 && interestRate > 0) {
      const r = (interestRate / 100) / 12;
      const n = tenureYears * 12;
      const amount = capacityEmi * ((1 - Math.pow(1 + r, -n)) / r);
      setMaxLoanAmount(Math.round(amount));
    } else {
      setMaxLoanAmount(0);
    }
  }, [monthlyIncome, existingEmi, interestRate, tenureYears]);

  return (
    <>
      <SEOMeta
        title="Eligibility Checker"
        description="Check your loan eligibility online with Vibhuti Enterprise."
      />

      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
            <h1 className="font-heading text-4xl font-bold">
              Loan Eligibility <span className="text-gradient">Checker</span>
            </h1>
            <p className="text-charcoal-400">
              Calculate your borrowing capacity based on income and existing obligations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-6 card p-6 border-charcoal-700/50">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm text-charcoal-300">Monthly Income</label>
                  <span className="text-sm font-semibold text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded font-mono">
                    ₹{monthlyIncome.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min="15000"
                  max="1000000"
                  step="5000"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                  className="w-full accent-teal-500 cursor-pointer bg-charcoal-700 h-1.5 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-xs text-charcoal-500 font-mono">
                  <span>₹15K</span>
                  <span>₹10L</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm text-charcoal-300">Existing EMIs</label>
                  <span className="text-sm font-semibold text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded font-mono">
                    ₹{existingEmi.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="500000"
                  step="2000"
                  value={existingEmi}
                  onChange={(e) => setExistingEmi(Number(e.target.value))}
                  className="w-full accent-teal-500 cursor-pointer bg-charcoal-700 h-1.5 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-xs text-charcoal-500 font-mono">
                  <span>₹0</span>
                  <span>₹5L</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm text-charcoal-300">Interest Rate</label>
                  <span className="text-sm font-semibold text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded font-mono">
                    {interestRate}% p.a.
                  </span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="20"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full accent-teal-500 cursor-pointer bg-charcoal-700 h-1.5 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-xs text-charcoal-500 font-mono">
                  <span>6%</span>
                  <span>20%</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm text-charcoal-300">Tenure</label>
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
                  className="w-full accent-teal-500 cursor-pointer bg-charcoal-700 h-1.5 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-xs text-charcoal-500 font-mono">
                  <span>1 Year</span>
                  <span>30 Years</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-5">
              <div className="card p-6 border-teal-500/20 bg-gradient-to-br from-teal-900/40 to-charcoal-900">
                <h3 className="font-display font-semibold text-charcoal-100 mb-5 border-b border-charcoal-800 pb-3">
                  Your Eligibility
                </h3>

                <div className="space-y-5 mb-6">
                  <div>
                    <span className="text-xs text-charcoal-500 block font-medium uppercase tracking-wider">Estimated Loan Limit</span>
                    <span className="text-3xl font-bold text-teal-400 mt-1 block tracking-tight font-mono">
                      ₹{maxLoanAmount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-charcoal-800">
                    <div>
                      <span className="text-xs text-charcoal-500 block uppercase tracking-wider">Monthly EMI Capacity</span>
                      <span className="text-base font-semibold text-charcoal-100 mt-0.5 block font-mono">
                        ₹{eligibleEmi.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-charcoal-500 block uppercase tracking-wider">Debt-to-Income</span>
                      <span className={`text-base font-semibold mt-0.5 block ${dtiRatio > 50 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {dtiRatio}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-5 bg-charcoal-800/50 p-3 rounded-lg text-xs text-charcoal-400 leading-relaxed">
                  <div className="flex gap-2 items-start">
                    <CheckCircle className="w-3.5 h-3.5 text-teal-400 flex-shrink-0 mt-0.5" />
                    <span>DTI below 50% indicates good approval prospects.</span>
                  </div>
                  <div className="flex gap-2 items-start">
                    <CheckCircle className="w-3.5 h-3.5 text-teal-400 flex-shrink-0 mt-0.5" />
                    <span>Final limits depend on credit score and bank policies.</span>
                  </div>
                </div>

                <Link to="/apply-loan" className="btn-accent w-full text-sm">
                  Apply Now
                </Link>
              </div>

              <div className="card p-5 border-charcoal-700/50 text-sm text-charcoal-400 space-y-3">
                <h4 className="font-display font-semibold text-charcoal-100 flex items-center gap-2 text-sm">
                  <HelpCircle className="w-4 h-4 text-teal-400" />
                  How it works
                </h4>
                <p className="leading-relaxed">
                  Lenders typically cap total monthly EMI at 50% of net income. We use this to calculate your maximum eligible loan amount based on the selected tenure and interest rate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
