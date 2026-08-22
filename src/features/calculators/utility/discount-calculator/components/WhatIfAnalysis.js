import React from 'react';
import { formatCurrency } from '../utils/formatting';
import { Calculator } from 'lucide-react';
import { calculateBasicDiscount } from '../utils/calculations';

export default function WhatIfAnalysis({ mode, data, result }) {
  // Only show what-if analysis when an original price is known
  if (!result || result.isEmpty) return null;
  
  let basePrice = 0;
  if (mode === 'basic' || mode === 'stacked' || mode === 'tax' || mode === 'target') {
    basePrice = result.original;
  } else if (mode === 'reverse') {
    basePrice = result.original;
  } else if (mode === 'findOriginal') {
    basePrice = result.original;
  }
  
  if (!basePrice || basePrice <= 0) return null;

  const scenarios = [5, 10, 15, 20, 25, 30, 40, 50, 60, 75];

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 mb-8 border border-slate-100 shadow-sm overflow-hidden">
      <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
        <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-sm">
          <Calculator size={18} />
        </span>
        What-If Discount Scenarios
      </h3>
      
      <p className="text-slate-500 text-sm mb-6">
        Compare how different discount percentages would affect the original price of <strong>{formatCurrency(basePrice)}</strong>.
      </p>

      <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
        <table className="w-full text-left border-collapse min-w-[400px]">
          <thead>
            <tr>
              <th className="py-3 px-4 bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider rounded-l-lg border-b border-slate-200">Discount</th>
              <th className="py-3 px-4 bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 text-right">You Save</th>
              <th className="py-3 px-4 bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider rounded-r-lg border-b border-slate-200 text-right">Final Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {scenarios.map(percent => {
              const res = calculateBasicDiscount(basePrice, percent);
              return (
                <tr key={percent} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-700">{percent}%</td>
                  <td className="py-3 px-4 text-emerald-600 font-medium text-right">{formatCurrency(res.discountAmount)}</td>
                  <td className="py-3 px-4 text-slate-900 font-bold text-right">{formatCurrency(res.finalPrice)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
