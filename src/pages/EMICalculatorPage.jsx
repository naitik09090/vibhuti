import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Download } from 'lucide-react';
import SEOMeta from '../components/SEOMeta';

export default function EMICalculatorPage() {
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(10);

  const [monthlyEmi, setMonthlyEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    const p = loanAmount;
    const r = (interestRate / 100) / 12;
    const n = tenureYears * 12;

    if (p > 0 && r > 0 && n > 0) {
      const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalAmount = emi * n;
      const interest = totalAmount - p;

      setMonthlyEmi(Math.round(emi));
      setTotalInterest(Math.round(interest));
      setTotalPayment(Math.round(totalAmount));

      let balance = p;
      const yearlySchedule = [];

      for (let year = 1; year <= tenureYears; year++) {
        let interestPaidInYear = 0;
        let principalPaidInYear = 0;

        for (let month = 1; month <= 12; month++) {
          const interestForMonth = balance * r;
          const principalForMonth = emi - interestForMonth;
          interestPaidInYear += interestForMonth;
          principalPaidInYear += principalForMonth;
          balance -= principalForMonth;
        }

        yearlySchedule.push({
          year,
          openingBalance: Math.round(balance + principalPaidInYear),
          emiPaid: Math.round(emi * 12),
          principalPaid: Math.round(principalPaidInYear),
          interestPaid: Math.round(interestPaidInYear),
          closingBalance: Math.max(0, Math.round(balance)),
        });
      }
      setSchedule(yearlySchedule);
    }
  }, [loanAmount, interestRate, tenureYears]);

  const chartData = [
    { name: 'Principal', value: loanAmount, color: '#111111' },
    { name: 'Interest', value: totalInterest, color: '#666666' },
  ];

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Year,Opening Balance (INR),EMI Paid (INR),Principal Paid (INR),Interest Paid (INR),Closing Balance (INR)\n";
    schedule.forEach(row => {
      csvContent += `${row.year},${row.openingBalance},${row.emiPaid},${row.principalPaid},${row.interestPaid},${row.closingBalance}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Vibhuti_Amortization_${loanAmount}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <SEOMeta
        title="EMI Calculator"
        description="Estimate monthly installments and interest breakdowns using the Vibhuti Enterprise EMI calculator."
      />

      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center max-w-2xl mx-auto mb-12 space-y-4"
          >
            <h1 className="font-heading text-4xl font-bold">
              EMI <span className="text-gradient">Calculator</span>
            </h1>
            <p className="text-charcoal-400">
              Adjust the sliders to calculate your monthly installment and view the breakdown.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="lg:col-span-6 space-y-6 card p-6"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-charcoal-500 font-medium uppercase tracking-wider">Loan Amount</label>
                  <span className="text-sm font-semibold text-charcoal-100 font-mono">
                    ₹{loanAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="50000000"
                  step="50000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full accent-charcoal-100 cursor-pointer bg-charcoal-700 h-1.5 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-xs text-charcoal-500 font-mono">
                  <span>₹50K</span>
                  <span>₹5Cr</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-charcoal-500 font-medium uppercase tracking-wider">Interest Rate</label>
                  <span className="text-sm font-semibold text-charcoal-100 font-mono">
                    {interestRate}% p.a.
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="20"
                  step="0.05"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full accent-charcoal-100 cursor-pointer bg-charcoal-700 h-1.5 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-xs text-charcoal-500 font-mono">
                  <span>5%</span>
                  <span>20%</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-charcoal-500 font-medium uppercase tracking-wider">Tenure</label>
                  <span className="text-sm font-semibold text-charcoal-100 font-mono">
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
                  className="w-full accent-charcoal-100 cursor-pointer bg-charcoal-700 h-1.5 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-xs text-charcoal-500 font-mono">
                  <span>1 Year</span>
                  <span>30 Years</span>
                </div>
              </div>
            </motion.div>

            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="card p-6 flex flex-col justify-between"
              >
                <div className="space-y-6">
                  <div>
                    <span className="text-[10px] text-charcoal-500 block font-medium uppercase tracking-widest">Monthly EMI</span>
                    <div className="w-10 h-0.5 bg-charcoal-50 mt-2 mb-3" />
                    <span className="text-3xl font-bold text-charcoal-100 block font-mono tracking-tight">
                      ₹{monthlyEmi.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-charcoal-700/50">
                    <div>
                      <span className="text-[10px] text-charcoal-500 block uppercase tracking-wider mb-1">Total Interest</span>
                      <span className="text-sm font-semibold text-charcoal-200 font-mono">
                        ₹{totalInterest.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-charcoal-500 block uppercase tracking-wider mb-1">Total Amount</span>
                      <span className="text-sm font-semibold text-charcoal-200 font-mono">
                        ₹{totalPayment.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="card p-6 flex flex-col items-center justify-center min-h-[220px]"
              >
                <ResponsiveContainer width="100%" height={140}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={36}
                      outerRadius={50}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val) => `₹${val.toLocaleString('en-IN')}`}
                      contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px', color: '#374151' }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div className="flex gap-4 justify-center text-xs mt-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#111111]" />
                    <span className="text-charcoal-400">Principal</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#666666]" />
                    <span className="text-charcoal-400">Interest</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="card p-6"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
              <div>
                <h3 className="font-display font-semibold text-charcoal-100">Amortization Schedule</h3>
                <p className="text-xs text-charcoal-500 mt-0.5">Year-by-year breakdown of principal and interest.</p>
              </div>
              <button
                onClick={handleExportCSV}
                className="btn-secondary text-xs !px-4 !py-2"
              >
                <Download className="w-4 h-4 text-charcoal-400" />
                Export CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-charcoal-700 text-charcoal-500 uppercase font-medium tracking-wider">
                    <th className="py-3 px-3">Year</th>
                    <th className="py-3 px-3">Opening</th>
                    <th className="py-3 px-3">Paid (Annual)</th>
                    <th className="py-3 px-3">Principal</th>
                    <th className="py-3 px-3">Interest</th>
                    <th className="py-3 px-3 text-right">Closing</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal-800/60 text-charcoal-300 font-mono">
                  {schedule.map(row => (
                    <tr key={row.year} className="hover:bg-charcoal-800/30 transition-colors">
                      <td className="py-3 px-3 font-semibold text-charcoal-100">{row.year}</td>
                      <td className="py-3 px-3">₹{row.openingBalance.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3">₹{row.emiPaid.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3 text-charcoal-200">₹{row.principalPaid.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3 text-charcoal-400">₹{row.interestPaid.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3 text-right font-bold text-charcoal-100">₹{row.closingBalance.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
