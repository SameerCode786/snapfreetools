import React from 'react';
import { formatNumber, formatCurrency, formatPercent } from '../utils/formatting';
import { ArrowRight, ArrowDown, Plus, Minus, Equal } from 'lucide-react';

export default function VisualAnalysis({ mode, data, result }) {
  if (!result || result.isEmpty) return null;

  // We only show Visual Analysis for modes where it adds clarity
  if (!['percentageOf', 'increase', 'decrease', 'discount', 'tax'].includes(mode)) return null;

  return (
    <div className="bg-slate-900 rounded-[2rem] p-6 sm:p-10 mb-8 text-white text-center shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>
      
      <h3 className="text-lg font-bold text-slate-300 mb-8 relative z-10">Visual Flow</h3>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 relative z-10">
        
        {mode === 'percentageOf' && (
          <>
            <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 min-w-[120px]">
              <div className="text-slate-400 text-sm font-bold mb-1">Whole</div>
              <div className="text-2xl font-black">{formatNumber(data.number)}</div>
            </div>
            <ArrowRight className="text-slate-500 hidden sm:block" size={24} />
            <ArrowDown className="text-slate-500 sm:hidden" size={24} />
            <div className="bg-amber-500/20 text-amber-300 p-4 rounded-2xl border border-amber-500/30 min-w-[120px]">
              <div className="text-amber-200/60 text-sm font-bold mb-1">{data.percentage}% Part</div>
              <div className="text-2xl font-black">{formatNumber(result.result)}</div>
            </div>
          </>
        )}

        {(mode === 'increase' || mode === 'decrease') && (
          <>
            <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 min-w-[120px]">
              <div className="text-slate-400 text-sm font-bold mb-1">Original</div>
              <div className="text-2xl font-black">{formatNumber(data.original)}</div>
            </div>
            <ArrowRight className="text-slate-500 hidden sm:block" size={24} />
            <ArrowDown className="text-slate-500 sm:hidden" size={24} />
            <div className={`p-4 rounded-2xl border min-w-[120px] ${mode === 'increase' ? 'bg-green-500/20 border-green-500/30 text-green-300' : 'bg-red-500/20 border-red-500/30 text-red-300'}`}>
              <div className="text-sm font-bold mb-1 opacity-60">
                {mode === 'increase' ? '+' : ''}{formatNumber(result.percentChange, 2)}%
              </div>
              <div className="text-2xl font-black">{formatNumber(data.newNumber)}</div>
            </div>
          </>
        )}

        {mode === 'discount' && (
          <>
            <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 min-w-[120px]">
              <div className="text-slate-400 text-sm font-bold mb-1">Price</div>
              <div className="text-2xl font-black">{formatCurrency(data.price)}</div>
            </div>
            <Minus className="text-slate-500" size={24} />
            <div className="bg-red-500/20 text-red-300 p-4 rounded-2xl border border-red-500/30 min-w-[120px]">
              <div className="text-red-200/60 text-sm font-bold mb-1">Discount ({data.discountPercent}%)</div>
              <div className="text-2xl font-black">{formatCurrency(result.discountAmount)}</div>
            </div>
            <Equal className="text-slate-500" size={24} />
            <div className="bg-amber-500/20 text-amber-300 p-4 rounded-2xl border border-amber-500/30 min-w-[120px]">
              <div className="text-amber-200/60 text-sm font-bold mb-1">Final Price</div>
              <div className="text-2xl font-black">{formatCurrency(result.finalPrice)}</div>
            </div>
          </>
        )}

        {mode === 'tax' && (
          <>
            <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 min-w-[120px]">
              <div className="text-slate-400 text-sm font-bold mb-1">Base Price</div>
              <div className="text-2xl font-black">{formatCurrency(data.price)}</div>
            </div>
            <Plus className="text-slate-500" size={24} />
            <div className="bg-blue-500/20 text-blue-300 p-4 rounded-2xl border border-blue-500/30 min-w-[120px]">
              <div className="text-blue-200/60 text-sm font-bold mb-1">Tax ({data.taxPercent}%)</div>
              <div className="text-2xl font-black">{formatCurrency(result.taxAmount)}</div>
            </div>
            <Equal className="text-slate-500" size={24} />
            <div className="bg-amber-500/20 text-amber-300 p-4 rounded-2xl border border-amber-500/30 min-w-[120px]">
              <div className="text-amber-200/60 text-sm font-bold mb-1">Final Total</div>
              <div className="text-2xl font-black">{formatCurrency(result.finalPrice)}</div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
