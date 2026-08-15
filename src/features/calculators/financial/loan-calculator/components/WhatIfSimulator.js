import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import { calculateStandardAmortization, getFrequencyDetails } from '../utils/calculations';
import { formatCurrency } from '../utils/currency';

export default function WhatIfSimulator({ originalData, originalResult, currencyCode }) {
  const [simState, setSimState] = useState({
    interestDiff: 0, // -2 to +2
    termDiff: 0, // -60 to +60 months
    extraPayment: 0
  });

  const [simResult, setSimResult] = useState(null);

  useEffect(() => {
    if (!originalData || !originalResult || originalResult.isEmpty) return;
    
    // Parse original inputs
    const p = Number(originalData.amount);
    let rAnnual = Number(originalData.interest) + simState.interestDiff;
    if (rAnnual < 0) rAnnual = 0;
    
    let n = Number(originalData.term);
    if (originalData.termUnit === 'years') n = n * 12;
    n = n + simState.termDiff;
    if (n <= 0) n = 1;
    
    const freq = getFrequencyDetails(originalData.frequency);
    
    const result = calculateStandardAmortization(p, rAnnual, n, freq.periodsPerYear, simState.extraPayment);
    setSimResult(result);
  }, [simState, originalData, originalResult]);

  if (!originalResult || originalResult.isEmpty) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8 p-8 text-center">
        <p className="text-sm font-medium text-slate-500">Complete the loan details above to explore what-if scenarios.</p>
      </div>
    );
  }

  const reset = () => {
    setSimState({ interestDiff: 0, termDiff: 0, extraPayment: 0 });
  };

  const hasChanges = simState.interestDiff !== 0 || simState.termDiff !== 0 || simState.extraPayment !== 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8 overflow-hidden">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-indigo-500" />
          What-If Simulator
        </h3>
        {hasChanges && (
          <button 
            onClick={reset}
            className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        )}
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Controls */}
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-semibold text-slate-700">Interest Rate Change</label>
                <span className="text-sm font-bold text-indigo-600">
                  {simState.interestDiff > 0 ? '+' : ''}{simState.interestDiff}%
                </span>
              </div>
              <input 
                type="range" 
                min="-5" max="5" step="0.1" 
                value={simState.interestDiff}
                onChange={(e) => setSimState(s => ({ ...s, interestDiff: Number(e.target.value) }))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1 font-medium">
                <span>-5%</span>
                <span>0</span>
                <span>+5%</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-semibold text-slate-700">Term Change (Months)</label>
                <span className="text-sm font-bold text-indigo-600">
                  {simState.termDiff > 0 ? '+' : ''}{simState.termDiff} mo
                </span>
              </div>
              <input 
                type="range" 
                min="-120" max="120" step="12" 
                value={simState.termDiff}
                onChange={(e) => setSimState(s => ({ ...s, termDiff: Number(e.target.value) }))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1 font-medium">
                <span>-120 mo</span>
                <span>0</span>
                <span>+120 mo</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Extra Monthly Payment</label>
              <input
                type="number"
                min="0"
                value={simState.extraPayment === 0 ? '' : simState.extraPayment}
                onChange={(e) => setSimState(s => ({ ...s, extraPayment: Number(e.target.value) || 0 }))}
                placeholder={`e.g., ${originalResult.regularPayment * 0.1}`}
                className="w-full h-11 px-4 rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 transition-colors shadow-sm"
              />
            </div>
          </div>

          {/* Results Comparison */}
          {simResult && (
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 flex flex-col justify-center">
              <h4 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4 text-center">Simulated Impact</h4>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                  <span className="text-sm font-medium text-slate-600">New Payment</span>
                  <div className="text-right">
                    <span className="block font-bold text-slate-800">{formatCurrency(simResult.actualPayment, currencyCode)}</span>
                    {simResult.actualPayment !== originalResult.actualPayment && (
                      <span className={`text-xs font-semibold ${simResult.actualPayment < originalResult.actualPayment ? 'text-green-600' : 'text-red-500'}`}>
                        {simResult.actualPayment < originalResult.actualPayment ? '-' : '+'}{formatCurrency(Math.abs(simResult.actualPayment - originalResult.actualPayment), currencyCode)}/mo
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                  <span className="text-sm font-medium text-slate-600">Total Interest</span>
                  <div className="text-right">
                    <span className="block font-bold text-slate-800">{formatCurrency(simResult.totalInterest, currencyCode)}</span>
                    {simResult.totalInterest !== originalResult.totalInterest && (
                      <span className={`text-xs font-semibold ${simResult.totalInterest < originalResult.totalInterest ? 'text-green-600' : 'text-red-500'}`}>
                        {simResult.totalInterest < originalResult.totalInterest ? '-' : '+'}{formatCurrency(Math.abs(simResult.totalInterest - originalResult.totalInterest), currencyCode)} overall
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600">Time to Payoff</span>
                  <div className="text-right">
                    <span className="block font-bold text-slate-800">{simResult.totalPeriodsActual} periods</span>
                    {simResult.totalPeriodsActual !== originalResult.totalPeriodsActual && (
                      <span className={`text-xs font-semibold ${simResult.totalPeriodsActual < originalResult.totalPeriodsActual ? 'text-green-600' : 'text-red-500'}`}>
                        {simResult.totalPeriodsActual < originalResult.totalPeriodsActual ? '-' : '+'}{Math.abs(simResult.totalPeriodsActual - originalResult.totalPeriodsActual)} periods
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
