import React from 'react';
import { formatNumber, formatCurrency, formatPercent } from '../utils/formatting';
const MetricCard = ({ label, value, highlight = false, isCurrency = false, isPercent = false, subtext = null }) => (
  <div className={`p-6 rounded-2xl border ${highlight ? 'bg-amber-600 border-amber-700 text-white' : 'bg-white border-slate-200 text-slate-900'} shadow-sm`}>
    <div className={`text-sm font-bold uppercase tracking-wider mb-2 ${highlight ? 'text-amber-200' : 'text-slate-400'}`}>
      {label}
    </div>
    <div className={`text-3xl sm:text-4xl font-black ${highlight ? 'text-white' : 'text-slate-900'}`}>
      {isCurrency ? formatCurrency(value, 'USD') : isPercent ? formatPercent(value, 4) : formatNumber(value, 4)}
    </div>
    {subtext && (
      <div className={`mt-2 text-sm font-medium ${highlight ? 'text-amber-200' : 'text-slate-500'}`}>
        {subtext}
      </div>
    )}
  </div>
);

export default function PercentageResultDashboard({ result, mode }) {
  if (!result || result.isEmpty) {
    return (
      <div className="bg-slate-50 rounded-[2rem] p-12 mb-8 border border-slate-200 border-dashed flex flex-col items-center justify-center text-center min-h-[300px]">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="M12 12v9"></path><path d="m8 17 4 4 4-4"></path></svg>
        </div>
        <h3 className="text-xl font-bold text-slate-400 mb-2">Ready to Calculate</h3>
        <p className="text-slate-500 font-medium">Enter your values above to see the percentage result.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      
      {mode === 'percentageOf' && (
        <MetricCard label="Result" value={result.result} highlight />
      )}

      {mode === 'whatPercent' && (
        <MetricCard label="Percentage" value={result.result} isPercent highlight />
      )}

      {(mode === 'increase' || mode === 'decrease') && (
        <>
          <MetricCard label="Absolute Change" value={result.absoluteChange} />
          <MetricCard label={`Percentage ${mode === 'increase' ? 'Increase' : 'Decrease'}`} value={result.percentChange} isPercent highlight />
        </>
      )}

      {mode === 'difference' && (
        <>
          <MetricCard label="Difference" value={result.absoluteDiff} />
          <MetricCard label="Percentage Difference" value={result.percentDiff} isPercent highlight />
        </>
      )}

      {mode === 'reverse' && (
        <MetricCard label="Original Number" value={result.original} highlight />
      )}

      {mode === 'change' && (
        <>
          <MetricCard label="Absolute Change" value={Math.abs(result.absoluteChange)} />
          <MetricCard 
            label="Percentage Change" 
            value={Math.abs(result.percentChange)} 
            isPercent 
            highlight 
            subtext={result.percentChange === 0 ? 'No Change' : result.isIncrease ? 'Increase' : 'Decrease'}
          />
        </>
      )}

      {mode === 'discount' && (
        <>
          <MetricCard label="Discount Amount" value={result.discountAmount} isCurrency />
          <MetricCard label="Final Price" value={result.finalPrice} isCurrency highlight />
        </>
      )}

      {mode === 'tax' && (
        <>
          <MetricCard label="Tax Amount" value={result.taxAmount} isCurrency />
          <MetricCard label="Final Price" value={result.finalPrice} isCurrency highlight />
        </>
      )}

      {mode === 'tip' && (
        <>
          <MetricCard label="Tip Amount" value={result.tipAmount} isCurrency />
          <MetricCard label="Total Bill" value={result.totalBill} isCurrency highlight />
          {result.perPerson < result.totalBill && (
            <MetricCard label="Per Person" value={result.perPerson} isCurrency subtext={`Tip per person: ${formatCurrency(result.tipPerPerson)}`} />
          )}
        </>
      )}

      {mode === 'points' && (
        <>
          <MetricCard label="Percentage Points" value={result.pointChange} subtext="absolute difference" highlight />
          <MetricCard label="Relative Change" value={result.relativeChange} isPercent subtext="percentage growth" />
        </>
      )}

    </div>
  );
}
