import React from 'react';
import { formatCurrency, formatPercent } from '../utils/formatting';
import { ArrowDown } from 'lucide-react';

export default function VisualPriceBreakdown({ result, mode }) {
  if (!result || result.isEmpty) return null;

  const FlowItem = ({ label, value, isNegative = false, isFinal = false }) => (
    <div className={`flex flex-col items-center justify-center p-4 rounded-xl border ${isFinal ? 'bg-amber-50 border-amber-200' : isNegative ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'} min-w-[140px] shadow-sm`}>
      <span className={`text-xs font-bold uppercase tracking-wider mb-1 ${isFinal ? 'text-amber-600' : isNegative ? 'text-emerald-600' : 'text-slate-500'}`}>{label}</span>
      <span className={`text-xl font-black ${isFinal ? 'text-amber-700' : isNegative ? 'text-emerald-700' : 'text-slate-700'}`}>
        {isNegative ? '-' : ''}{formatCurrency(value)}
      </span>
    </div>
  );

  const Arrow = () => (
    <div className="flex items-center justify-center text-slate-300 md:rotate-270 py-2 md:py-0 md:px-2">
      <ArrowDown size={24} className="md:-rotate-90" />
    </div>
  );

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 mb-8 border border-slate-100 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
        <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center text-sm">Flow</span>
        Visual Breakdown
      </h3>
      
      <div className="flex flex-col md:flex-row items-center justify-center w-full">
        
        {(mode === 'basic' || mode === 'reverse' || mode === 'findOriginal' || mode === 'target') && (
          <>
            <FlowItem label="Original Price" value={result.original} />
            <Arrow />
            <FlowItem label={`Discount (${formatPercent(result.discount || result.requiredDiscount, 2)})`} value={result.discountAmount || result.savingsAmount} isNegative />
            <Arrow />
            <FlowItem label="Final Price" value={result.finalPrice || result.sale || result.target} isFinal />
          </>
        )}

        {mode === 'stacked' && (
          <>
            <FlowItem label="Original" value={result.original} />
            <Arrow />
            <FlowItem label="Total Savings" value={result.totalSavings} isNegative />
            <Arrow />
            <FlowItem label="Final Price" value={result.finalPrice} isFinal />
          </>
        )}

        {mode === 'tax' && (
          <>
            <FlowItem label="Original" value={result.original} />
            <Arrow />
            <FlowItem label={`Discount`} value={result.discountAmount} isNegative />
            <Arrow />
            <FlowItem label="Tax" value={result.taxAmount} />
            <Arrow />
            <FlowItem label="Final Total" value={result.finalPrice} isFinal />
          </>
        )}

        {mode === 'tip' && (
          <>
            <FlowItem label="Original" value={result.bill} />
            <Arrow />
            <FlowItem label={`Discount`} value={result.discountAmount} isNegative />
            <Arrow />
            <FlowItem label="Tip" value={result.tipAmount} />
            <Arrow />
            <FlowItem label="Final Bill" value={result.finalBill} isFinal />
          </>
        )}

        {mode === 'compare' && (
          <div className="text-center text-slate-500 font-medium">
            Visual flow is not available for comparisons.
          </div>
        )}
      </div>
    </div>
  );
}
