import React, { useState, useEffect } from "react";
import { Icons } from "@/lib/lucide-icons";
import { safeFormatNumber, safeParseNumber, calculateSavingsGrowth } from "../utils/calculations";

export default function WhatIfSimulator({ baseData, baseResult, currencySymbol }) {
  const [whatIfData, setWhatIfData] = useState({
    monthlyContribution: "",
    annualRate: "",
    years: ""
  });

  useEffect(() => {
    if (baseData) {
      setWhatIfData({
        monthlyContribution: baseData.monthlyContribution,
        annualRate: baseData.annualRate,
        years: baseData.years
      });
    }
  }, [baseData]);

  if (!baseResult || baseResult.isEmpty || !baseResult.isValid) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setWhatIfData({ ...whatIfData, [name]: value });
    }
  };

  // Perform what-if calculation without overwriting main state
  const whatIfResult = calculateSavingsGrowth({
    ...baseData,
    monthly: whatIfData.monthlyContribution,
    annualRate: whatIfData.annualRate,
    years: whatIfData.years
  });

  const isValidWhatIf = whatIfResult && whatIfResult.isValid && !whatIfResult.isEmpty;
  
  const diffFutureValue = isValidWhatIf ? (whatIfResult.futureValue - baseResult.futureValue) : 0;
  const isPositive = diffFutureValue > 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
      <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex items-center gap-2">
        <Icons.Wand2 size={20} className="text-indigo-500" />
        <h2 className="text-lg font-bold text-slate-800">What-If Simulator</h2>
      </div>

      <div className="p-6">
        <p className="text-sm text-slate-500 mb-6">
          Adjust the values below to see how changes affect your savings without losing your original calculation.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-slate-700 mb-2">Monthly Contribution</label>
            <div className="relative flex items-center">
              <div className="absolute left-4 text-slate-400 font-semibold pointer-events-none">{currencySymbol}</div>
              <input 
                type="text" 
                inputMode="decimal"
                name="monthlyContribution"
                value={whatIfData.monthlyContribution}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all py-3 pl-8 pr-4"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-slate-700 mb-2">Annual Interest Rate</label>
            <div className="relative flex items-center">
              <input 
                type="text" 
                inputMode="decimal"
                name="annualRate"
                value={whatIfData.annualRate}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all py-3 pl-4 pr-10"
              />
              <div className="absolute right-4 text-slate-400 font-bold pointer-events-none">%</div>
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-slate-700 mb-2">Years</label>
            <div className="relative flex items-center">
              <input 
                type="text" 
                inputMode="decimal"
                name="years"
                value={whatIfData.years}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all py-3 pl-4 pr-14"
              />
              <div className="absolute right-4 text-slate-400 font-bold pointer-events-none">Years</div>
            </div>
          </div>
        </div>

        {isValidWhatIf ? (
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 flex flex-col gap-1 w-full text-center md:text-left">
              <span className="text-sm font-semibold text-slate-500">New Future Savings</span>
              <span className="text-3xl font-black text-slate-800">{currencySymbol}{safeFormatNumber(whatIfResult.futureValue, 0)}</span>
            </div>
            
            {diffFutureValue !== 0 && (
              <div className={`flex-1 flex flex-col justify-center items-center p-4 rounded-lg border w-full ${
                isPositive ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  {isPositive ? <Icons.TrendingUp size={20} /> : <Icons.TrendingDown size={20} />}
                  <span className="font-bold">{isPositive ? 'Increase' : 'Decrease'}</span>
                </div>
                <span className="text-xl font-black">
                  {isPositive ? '+' : '-'}{currencySymbol}{safeFormatNumber(Math.abs(diffFutureValue), 0)}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center p-6 bg-amber-50 text-amber-700 rounded-xl border border-amber-100 font-medium">
            Please enter valid numbers to see the simulation.
          </div>
        )}
      </div>
    </div>
  );
}
