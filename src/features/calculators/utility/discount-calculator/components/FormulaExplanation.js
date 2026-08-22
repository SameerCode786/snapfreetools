import React from 'react';
import { Calculator } from 'lucide-react';
import { formatCurrency, formatPercent, formatNumber } from '../utils/formatting';

export default function FormulaExplanation({ mode, result }) {
  if (!result || result.isEmpty) return null;

  return (
    <div className="bg-slate-900 rounded-3xl p-6 md:p-8 mb-8 text-white shadow-xl">
      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
        <span className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center text-sm">
          <Calculator size={18} />
        </span>
        Calculation Breakdown
      </h3>
      
      <div className="space-y-6 font-mono text-sm md:text-base text-slate-300">
        
        {mode === 'basic' && (
          <>
            <div>
              <div className="text-slate-500 text-xs mb-1 uppercase tracking-wider font-sans font-bold">Discount Amount</div>
              <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                {formatCurrency(result.original)} × ({formatPercent(result.discount, 0, false)} ÷ 100) = <span className="text-emerald-400 font-bold">{formatCurrency(result.discountAmount)}</span>
              </div>
            </div>
            <div>
              <div className="text-slate-500 text-xs mb-1 uppercase tracking-wider font-sans font-bold">Final Price</div>
              <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                {formatCurrency(result.original)} − {formatCurrency(result.discountAmount)} = <span className="text-amber-400 font-bold">{formatCurrency(result.finalPrice)}</span>
              </div>
            </div>
          </>
        )}

        {mode === 'reverse' && (
          <>
            <div>
              <div className="text-slate-500 text-xs mb-1 uppercase tracking-wider font-sans font-bold">Discount Amount</div>
              <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                {formatCurrency(result.original)} − {formatCurrency(result.sale)} = <span className="text-emerald-400 font-bold">{formatCurrency(result.discountAmount)}</span>
              </div>
            </div>
            <div>
              <div className="text-slate-500 text-xs mb-1 uppercase tracking-wider font-sans font-bold">Discount %</div>
              <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                ({formatCurrency(result.discountAmount)} ÷ {formatCurrency(result.original)}) × 100 = <span className="text-amber-400 font-bold">{formatPercent(result.discount, 2)}</span>
              </div>
            </div>
          </>
        )}

        {mode === 'findOriginal' && (
          <>
            <div>
              <div className="text-slate-500 text-xs mb-1 uppercase tracking-wider font-sans font-bold">Original Price</div>
              <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                {formatCurrency(result.sale)} ÷ (1 − ({formatPercent(result.discount, 0, false)} ÷ 100)) = <span className="text-amber-400 font-bold">{formatCurrency(result.original)}</span>
              </div>
            </div>
          </>
        )}

        {mode === 'stacked' && (
          <>
            <div>
              <div className="text-slate-500 text-xs mb-1 uppercase tracking-wider font-sans font-bold">Effective Discount</div>
              <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700 break-words">
                ({formatCurrency(result.totalSavings)} Savings ÷ {formatCurrency(result.original)} Original) × 100 = <span className="text-amber-400 font-bold">{formatPercent(result.effectiveDiscount, 2)}</span>
              </div>
            </div>
          </>
        )}

        {mode === 'tax' && (
          <>
            <div>
              <div className="text-slate-500 text-xs mb-1 uppercase tracking-wider font-sans font-bold">Tax Amount (Applied after discount)</div>
              <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                {formatCurrency(result.discountedPrice)} × ({formatNumber(result.tax, 2)} ÷ 100) = <span className="text-emerald-400 font-bold">{formatCurrency(result.taxAmount)}</span>
              </div>
            </div>
            <div>
              <div className="text-slate-500 text-xs mb-1 uppercase tracking-wider font-sans font-bold">Final Total</div>
              <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                {formatCurrency(result.discountedPrice)} + {formatCurrency(result.taxAmount)} = <span className="text-amber-400 font-bold">{formatCurrency(result.finalPrice)}</span>
              </div>
            </div>
          </>
        )}
        
        {mode === 'target' && (
          <>
            <div>
              <div className="text-slate-500 text-xs mb-1 uppercase tracking-wider font-sans font-bold">Required Discount</div>
              <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                ({formatCurrency(result.savingsAmount)} ÷ {formatCurrency(result.original)}) × 100 = <span className="text-amber-400 font-bold">{formatPercent(result.requiredDiscount, 2)}</span>
              </div>
            </div>
          </>
        )}
        
        {(mode === 'compare' || mode === 'tip') && (
          <div className="text-slate-400 text-sm">
            Calculation breakdown is handled automatically in the flow.
          </div>
        )}

      </div>
    </div>
  );
}
