import React from 'react';
import { formatCurrency, formatPercent } from '../utils/formatting';
import { Tag } from 'lucide-react';

const MetricCard = ({ label, value, highlight = false, isCurrency = true, isPercent = false, subtext = null }) => (
  <div className={`p-6 rounded-2xl border ${highlight ? 'bg-amber-600 border-amber-700 text-white' : 'bg-white border-slate-200 text-slate-900'} shadow-sm flex flex-col justify-center min-h-[120px]`}>
    <div className={`text-sm font-bold uppercase tracking-wider mb-2 ${highlight ? 'text-amber-200' : 'text-slate-400'}`}>
      {label}
    </div>
    <div className={`text-3xl sm:text-4xl font-black ${highlight ? 'text-white' : 'text-slate-900'}`}>
      {isCurrency ? formatCurrency(value, 'USD') : isPercent ? formatPercent(value, 4) : value}
    </div>
    {subtext && (
      <div className={`mt-2 text-sm font-medium ${highlight ? 'text-amber-200' : 'text-slate-500'}`}>
        {subtext}
      </div>
    )}
  </div>
);

export default function DiscountResultDashboard({ result, mode }) {
  if (!result || result.isEmpty) {
    return (
      <div className="bg-slate-50 rounded-[2rem] p-12 mb-8 border border-slate-200 border-dashed flex flex-col items-center justify-center text-center min-h-[300px]">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
          <Tag size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-400 mb-2">Ready to Calculate</h3>
        <p className="text-slate-500 font-medium">Enter your price and discount to see your savings.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      
      {mode === 'basic' && (
        <>
          <MetricCard label="Final Price" value={result.finalPrice} highlight />
          <MetricCard label="Original Price" value={result.original} />
          <MetricCard label="You Save" value={result.savingsAmount} />
        </>
      )}

      {mode === 'reverse' && (
        <>
          <MetricCard label="Discount Amount" value={result.discountAmount} />
          <MetricCard label="Discount %" value={result.discount} isCurrency={false} isPercent highlight />
        </>
      )}

      {mode === 'findOriginal' && (
        <>
          <MetricCard label="Original Price" value={result.original} highlight />
          <MetricCard label="Amount Discounted" value={result.discountAmount} />
        </>
      )}

      {mode === 'stacked' && (
        <>
          <MetricCard label="Final Price" value={result.finalPrice} highlight />
          <MetricCard label="Total Savings" value={result.totalSavings} />
          <MetricCard label="Effective Discount" value={result.effectiveDiscount} isCurrency={false} isPercent subtext={`Not simply added`} />
        </>
      )}

      {mode === 'tax' && (
        <>
          <MetricCard label="Final Total" value={result.finalPrice} highlight />
          <MetricCard label="Tax Amount" value={result.taxAmount} />
          <MetricCard label="Price Before Tax" value={result.discountedPrice} subtext={`Original: ${formatCurrency(result.original)}`} />
        </>
      )}

      {mode === 'tip' && (
        <>
          <MetricCard label="Final Total" value={result.finalBill} highlight />
          <MetricCard label="Total Tip" value={result.tipAmount} />
          {result.perPerson < result.finalBill && (
            <MetricCard label="Per Person" value={result.perPerson} subtext={`Tip per person: ${formatCurrency(result.tipPerPerson)}`} />
          )}
        </>
      )}

      {mode === 'compare' && (
        <>
          <MetricCard label="Best Deal" value={result.bestDeal === 'none' ? 'Tie' : `Option ${result.bestDeal}`} isCurrency={false} highlight={result.bestDeal !== 'none'} />
          <MetricCard label="Savings Difference" value={result.difference} />
          <MetricCard label={result.bestDeal === 'A' ? "Option A Savings" : result.bestDeal === 'B' ? "Option B Savings" : "Savings"} value={result.bestDeal === 'A' ? result.savingsA : result.bestDeal === 'B' ? result.savingsB : result.savingsA} />
        </>
      )}

      {mode === 'target' && (
        <>
          <MetricCard label="Required Discount" value={result.requiredDiscount} isCurrency={false} isPercent highlight />
          <MetricCard label="Amount to Save" value={result.savingsAmount} />
        </>
      )}

    </div>
  );
}
