import React from 'react';
import { formatNumber } from '../utils/formatting';
import { calculatePercentageOfNumber } from '../utils/calculations';

export default function WhatIfAnalysis({ mode, data, result }) {
  if (!result || result.isEmpty) return null;

  // We only show What-If for specific modes to keep it clean
  if (mode !== 'percentageOf' && mode !== 'discount' && mode !== 'tip') return null;

  const baseValue = mode === 'percentageOf' ? parseFloat(data.number) 
                  : mode === 'discount' ? parseFloat(data.price) 
                  : parseFloat(data.bill);

  if (isNaN(baseValue) || baseValue === 0) return null;

  const variations = [5, 10, 15, 20, 25, 30, 50];

  return (
    <div className="bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-8 mb-8 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-4">What If?</h3>
      <p className="text-slate-500 font-medium mb-6 text-sm">
        See how the result changes with different percentages applied to {formatNumber(baseValue)}.
      </p>

      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4">
          {variations.map(pct => {
            let res;
            if (mode === 'percentageOf' || mode === 'tip') {
               res = calculatePercentageOfNumber(pct, baseValue).result;
            } else if (mode === 'discount') {
               res = baseValue - calculatePercentageOfNumber(pct, baseValue).result;
            }
            
            return (
              <div key={pct} className="flex-shrink-0 bg-slate-50 border border-slate-200 rounded-2xl p-4 min-w-[120px]">
                <div className="text-sm font-bold text-slate-400 mb-1">{pct}%</div>
                <div className="text-lg font-black text-slate-700">{formatNumber(res, 2)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
