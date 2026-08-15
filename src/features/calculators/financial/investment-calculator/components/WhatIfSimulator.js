import React, { useState, useEffect } from "react";
import { formatCurrency } from "@/features/calculators/financial/emi-calculator/utils/currency";
import { calculateInvestmentGrowth } from "../utils/calculations";

export default function WhatIfSimulator({ originalData, originalResult, currencyCode }) {
  const [simData, setSimData] = useState({
    monthlyContribution: '',
    annualRate: '',
    years: ''
  });

  const [simResult, setSimResult] = useState(null);

  // Initialize simulator with original data when it changes
  useEffect(() => {
    if (originalData) {
      setSimData({
        monthlyContribution: originalData.monthlyContribution || '',
        annualRate: originalData.annualRate || '',
        years: originalData.years || ''
      });
    }
  }, [originalData]);

  // Run simulation whenever simData changes
  useEffect(() => {
    if (!originalData) return;
    
    // We only simulate growth using the original principal and compounding frequency
    const res = calculateInvestmentGrowth(
      originalData.principal,
      simData.monthlyContribution,
      simData.annualRate,
      simData.years,
      originalData.frequency || 'monthly'
    );
    
    setSimResult(res);
  }, [simData, originalData]);

  if (!originalResult || originalResult.isEmpty || !simResult || simResult.isEmpty) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setSimData({ ...simData, [name]: value });
    }
  };

  const diffFV = simResult.futureValue - originalResult.futureValue;
  const diffGrowth = simResult.totalGrowth - originalResult.totalGrowth;
  
  const isFVPositive = diffFV > 0;
  const isFVNegative = diffFV < 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
      <div className="bg-slate-800 px-6 py-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          What-If Simulator
        </h3>
        <span className="text-xs font-bold bg-white/20 text-white px-2 py-1 rounded">Experiment safely</span>
      </div>
      
      <div className="p-6">
        <p className="text-sm text-slate-500 mb-6">Temporarily adjust your contribution, rate, or time horizon to see how it impacts your final projected value without changing your main inputs.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="flex flex-col">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Monthly Contribution</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
              <input 
                type="text"
                inputMode="decimal"
                name="monthlyContribution"
                value={simData.monthlyContribution}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-lg py-2.5 pl-7 pr-3 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>
          
          <div className="flex flex-col">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Annual Return</label>
            <div className="relative">
              <input 
                type="text"
                inputMode="decimal"
                name="annualRate"
                value={simData.annualRate}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-lg py-2.5 px-3 pr-7 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
            </div>
          </div>
          
          <div className="flex flex-col">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Years</label>
            <input 
              type="text"
              inputMode="numeric"
              name="years"
              value={simData.years}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>
        
        <div className="bg-slate-50 rounded-xl border border-slate-100 p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Simulated Future Value</div>
            <div className="text-3xl font-black text-slate-800">{formatCurrency(simResult.futureValue, currencyCode)}</div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Difference</div>
              <div className={`text-lg font-bold flex items-center justify-end gap-1 ${isFVPositive ? 'text-emerald-600' : isFVNegative ? 'text-red-500' : 'text-slate-500'}`}>
                {isFVPositive && '+'}
                {isFVNegative && '-'}
                {!isFVPositive && !isFVNegative && ''}
                {formatCurrency(Math.abs(diffFV), currencyCode)}
              </div>
            </div>
            
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${isFVPositive ? 'bg-emerald-100 text-emerald-600' : isFVNegative ? 'bg-red-100 text-red-500' : 'bg-slate-200 text-slate-400'}`}>
              {isFVPositive ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
              ) : isFVNegative ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" /></svg>
              )}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
