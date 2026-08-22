import React from 'react';

export default function UnitSwitcher({ unit, setUnit }) {
  return (
    <div className="flex items-center gap-1 bg-slate-100 rounded-2xl p-1 w-fit">
      <button
        onClick={() => setUnit('metric')}
        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
          unit === 'metric'
            ? 'bg-white text-slate-900 shadow-sm'
            : 'text-slate-500 hover:text-slate-700'
        }`}
        aria-pressed={unit === 'metric'}
        type="button"
      >
        Metric
        <span className="ml-1.5 text-xs font-normal opacity-60">kg / cm</span>
      </button>
      <button
        onClick={() => setUnit('imperial')}
        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
          unit === 'imperial'
            ? 'bg-white text-slate-900 shadow-sm'
            : 'text-slate-500 hover:text-slate-700'
        }`}
        aria-pressed={unit === 'imperial'}
        type="button"
      >
        Imperial
        <span className="ml-1.5 text-xs font-normal opacity-60">lb / ft</span>
      </button>
    </div>
  );
}
