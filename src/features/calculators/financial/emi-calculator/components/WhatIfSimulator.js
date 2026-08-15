import { useState, useEffect } from 'react';
import { formatCurrency } from "../utils/currency";
import { safeFormatNumber, safeParseNumber } from "../utils/validation";
import { calculateStandardEMI } from "../utils/calculations";

export default function WhatIfSimulator({ originalData, originalResult, currencyCode }) {
  const [simData, setSimData] = useState({
    amount: '',
    rate: '',
    tenure: '',
    tenureUnit: 'years',
    frequency: 'monthly'
  });
  
  const [simResult, setSimResult] = useState(null);

  // Sync with original inputs initially
  useEffect(() => {
    if (originalData) {
      setSimData({
        amount: originalData.amount || '',
        rate: originalData.rate || '',
        tenure: originalData.tenure || '',
        tenureUnit: originalData.tenureUnit || 'years',
        frequency: originalData.frequency || 'monthly'
      });
    }
  }, [originalData]);

  // Recalculate simulation on change
  useEffect(() => {
    const amount = safeParseNumber(simData.amount);
    const rate = safeParseNumber(simData.rate);
    const tenure = safeParseNumber(simData.tenure);
    
    if (amount > 0 && rate >= 0 && tenure > 0) {
      const res = calculateStandardEMI(simData.amount, simData.rate, simData.tenure, simData.tenureUnit, simData.frequency);
      setSimResult(res.isEmpty ? null : res);
    } else {
      setSimResult(null);
    }
  }, [simData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setSimData(prev => ({ ...prev, [name]: value }));
    }
  };

  const InputSlider = ({ label, name, value, min, max, step, onChange, suffix = "" }) => (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <label className="text-xs font-bold text-slate-500 uppercase">{label}</label>
        <span className="font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded text-sm">
          {value || 0}{suffix}
        </span>
      </div>
      <input
        type="range"
        name={name}
        min={min}
        max={max}
        step={step}
        value={value || min}
        onChange={onChange}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
      />
    </div>
  );

  if (!originalResult || originalResult.isEmpty) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8 p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">What-If Simulator</h3>
        <p className="text-sm text-slate-500 max-w-sm">Complete your loan details above to explore different repayment scenarios.</p>
      </div>
    );
  }

  const diffEmi = simResult ? simResult.monthlyPayment - originalResult.monthlyPayment : 0;
  const diffInterest = simResult ? simResult.totalInterest - originalResult.totalInterest : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5">
        <h3 className="text-lg font-bold text-white">What-If Simulator</h3>
      </div>
      
      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Sliders */}
        <div className="space-y-6">
          <InputSlider 
            label="Interest Rate"
            name="rate"
            value={simData.rate}
            min={0}
            max={30}
            step={0.1}
            onChange={handleChange}
            suffix="%"
          />
          <InputSlider 
            label={`Loan Tenure (${simData.tenureUnit})`}
            name="tenure"
            value={simData.tenure}
            min={1}
            max={simData.tenureUnit === 'months' ? 360 : 30}
            step={1}
            onChange={handleChange}
          />
          <InputSlider 
            label="Loan Amount"
            name="amount"
            value={simData.amount}
            min={1000}
            max={safeParseNumber(originalData.amount) * 2 || 1000000}
            step={1000}
            onChange={handleChange}
          />
          <div className="pt-4 text-center">
             <button 
                onClick={() => setSimData({
                  amount: originalData.amount || '',
                  rate: originalData.rate || '',
                  tenure: originalData.tenure || '',
                  tenureUnit: originalData.tenureUnit || 'years',
                  frequency: originalData.frequency || 'monthly'
                })}
                className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase"
             >
               Reset to Original
             </button>
          </div>
        </div>

        {/* Results Comparison */}
        <div className="bg-slate-50 rounded-xl border border-slate-100 p-6 flex flex-col justify-center">
          {simResult ? (
            <div className="space-y-6">
              
              <div>
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Monthly EMI Change</span>
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-black text-slate-800">{formatCurrency(simResult.monthlyPayment, currencyCode)}</span>
                  {diffEmi !== 0 && (
                    <span className={`text-sm font-bold px-2 py-1 rounded-md flex items-center gap-1 ${diffEmi > 0 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {diffEmi > 0 ? '+' : ''}{formatCurrency(diffEmi, currencyCode)}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                <div>
                  <span className="block text-xs font-bold text-slate-500 uppercase mb-1">New Total Interest</span>
                  <span className="block text-lg font-bold text-slate-700">{formatCurrency(simResult.totalInterest, currencyCode)}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-500 uppercase mb-1">Interest Difference</span>
                  <span className={`block text-lg font-bold ${diffInterest > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                    {diffInterest > 0 ? '+' : ''}{formatCurrency(diffInterest, currencyCode)}
                  </span>
                </div>
              </div>
              
            </div>
          ) : (
            <div className="text-center py-8">
              <span className="text-sm text-slate-500 font-medium">Adjust the sliders to see simulation results</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
