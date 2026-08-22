import React from 'react';

const QUICK_DISCOUNTS = [5, 10, 15, 20, 25, 30, 40, 50];

export default function QuickDiscountButtons({ onSelect }) {
  return (
    <div className="mt-4 pt-4 border-t border-slate-100">
      <div className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Quick Select</div>
      <div className="flex flex-wrap gap-2">
        {QUICK_DISCOUNTS.map(percent => (
          <button
            key={percent}
            onClick={() => onSelect(percent.toString())}
            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg text-sm font-medium transition-colors border border-slate-200"
            type="button"
          >
            {percent}%
          </button>
        ))}
      </div>
    </div>
  );
}
