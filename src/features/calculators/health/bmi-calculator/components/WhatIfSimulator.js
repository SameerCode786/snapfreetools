import React, { useState } from 'react';
import { calculateWhatIfBMI } from '../utils/calculations';
import { formatBMI, formatWeight, safeParseFloat } from '../utils/formatting';
import { Calculator } from 'lucide-react';

export default function WhatIfSimulator({ result }) {
  const [whatIfWeight, setWhatIfWeight] = useState('');

  if (!result || result.isEmpty || result.isMinor) return null;

  const weightLabel = result.unit === 'metric' ? 'kg' : 'lb';
  const parsed = safeParseFloat(whatIfWeight);
  const whatIfResult = !isNaN(parsed) && parsed > 0 ? calculateWhatIfBMI(result, parsed) : null;

  const diffText = whatIfResult
    ? whatIfResult.diff > 0
      ? `+${formatBMI(whatIfResult.diff)} BMI increase`
      : whatIfResult.diff < 0
        ? `${formatBMI(whatIfResult.diff)} BMI decrease`
        : 'No change in BMI'
    : null;

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 mb-8 border border-slate-200 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
        <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
          <Calculator size={18} />
        </span>
        What-If Simulator
      </h3>
      <p className="text-sm text-slate-500 mb-6">
        Adjust weight to see how your BMI would change — without affecting your main calculation.
      </p>

      <div className="flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[160px]">
          <label htmlFor="whatif-weight" className="block text-sm font-bold text-slate-700 mb-2">
            Hypothetical Weight ({weightLabel})
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="decimal"
              id="whatif-weight"
              value={whatIfWeight}
              onChange={(e) => setWhatIfWeight(e.target.value)}
              placeholder={`e.g., ${result.unit === 'metric' ? '65' : '143'}`}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-lg rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-4 pr-14 transition-all"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium pointer-events-none">
              {weightLabel}
            </div>
          </div>
        </div>
      </div>

      {whatIfResult && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-2xl border border-blue-100 p-5">
            <div className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1">Hypothetical BMI</div>
            <div className="text-3xl font-black text-blue-900">{formatBMI(whatIfResult.bmi)}</div>
          </div>
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Category</div>
            <div className="text-2xl font-black text-slate-900">{whatIfResult.category?.label}</div>
          </div>
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">BMI Change</div>
            <div className={`text-2xl font-black ${whatIfResult.diff > 0 ? 'text-amber-600' : whatIfResult.diff < 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
              {diffText}
            </div>
          </div>
        </div>
      )}

      {whatIfWeight !== '' && !whatIfResult && (
        <p className="mt-4 text-sm text-red-500">Please enter a valid positive weight.</p>
      )}
    </div>
  );
}
