import React from 'react';

const COMMON_PERCENTAGES = [1, 5, 10, 15, 20, 25, 50, 75, 100];
const TIP_PERCENTAGES = [10, 15, 18, 20, 25];

export default function QuickPercentageButtons({ onSelect, mode }) {
  const options = mode === 'tip' ? TIP_PERCENTAGES : COMMON_PERCENTAGES;

  return (
    <div className="mt-6 flex flex-wrap items-center gap-2">
      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2">Quick:</span>
      {options.map((pct) => (
        <button
          key={pct}
          onClick={(e) => {
            e.preventDefault();
            onSelect(pct.toString());
          }}
          className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 font-medium text-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          {pct}%
        </button>
      ))}
    </div>
  );
}
