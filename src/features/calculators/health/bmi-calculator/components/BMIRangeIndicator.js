import React from 'react';
import { BMI_CATEGORIES } from '../utils/calculations';
import { formatBMI } from '../utils/formatting';

export default function BMIRangeIndicator({ result }) {
  if (!result || result.isEmpty || result.isMinor) return null;

  const { bmi } = result;

  // Map BMI value to a % position on a 10–45 scale for display
  const clampedBMI = Math.max(10, Math.min(45, bmi));
  const markerPercent = ((clampedBMI - 10) / 35) * 100;

  // Segment widths on the 10-45 scale
  // Underweight: 10-18.5 = 8.5 / 35 = 24.3%
  // Healthy: 18.5-25 = 6.5 / 35 = 18.6%
  // Overweight: 25-30 = 5/35 = 14.3%
  // Obesity I: 30-35 = 5/35 = 14.3%
  // Obesity II: 35-40 = 5/35 = 14.3%
  // Obesity III: 40-45 = 5/35 = 14.3%
  const segments = [
    { label: 'Underweight', shortLabel: '<18.5', pct: 24.3, color: '#3b82f6' },
    { label: 'Healthy', shortLabel: '18.5–25', pct: 18.6, color: '#22c55e' },
    { label: 'Overweight', shortLabel: '25–30', pct: 14.3, color: '#f59e0b' },
    { label: 'Obesity I', shortLabel: '30–35', pct: 14.3, color: '#f97316' },
    { label: 'Obesity II', shortLabel: '35–40', pct: 14.3, color: '#ef4444' },
    { label: 'Obesity III', shortLabel: '40+', pct: 14.3, color: '#dc2626' },
  ];

  const currentCategory = result.category;

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 mb-8 border border-slate-200 shadow-sm overflow-hidden">
      <h3 className="text-lg font-bold text-slate-800 mb-6">BMI Range</h3>

      {/* Segmented bar */}
      <div className="relative mb-8">
        <div className="flex w-full h-4 rounded-full overflow-hidden">
          {segments.map((seg, i) => (
            <div
              key={i}
              style={{ width: `${seg.pct}%`, backgroundColor: seg.color }}
              title={`${seg.label} (${seg.shortLabel})`}
            />
          ))}
        </div>

        {/* Marker */}
        <div
          className="absolute top-0 -translate-x-1/2 flex flex-col items-center"
          style={{ left: `${markerPercent}%` }}
          aria-label={`Your BMI: ${formatBMI(bmi)}`}
        >
          <div
            className="w-5 h-5 rounded-full border-2 border-white shadow-lg -mt-0.5"
            style={{ backgroundColor: currentCategory?.color || '#64748b' }}
          />
          <div
            className="mt-2 px-2 py-1 rounded-lg text-xs font-black text-white shadow-md whitespace-nowrap"
            style={{ backgroundColor: currentCategory?.color || '#64748b' }}
          >
            {formatBMI(bmi)}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
        {segments.map((seg, i) => {
          const isActive = BMI_CATEGORIES[i] && currentCategory?.label === BMI_CATEGORIES[i]?.label;
          return (
            <div
              key={i}
              className={`flex items-center gap-2 p-2 rounded-xl text-xs transition-all ${
                isActive ? 'ring-2 ring-offset-1' : ''
              }`}
              style={isActive ? { ringColor: seg.color } : {}}
            >
              <div
                className="w-3 h-3 rounded-sm shrink-0"
                style={{ backgroundColor: seg.color }}
                aria-hidden="true"
              />
              <div>
                <div className="font-bold text-slate-700">{seg.label}</div>
                <div className="text-slate-400">{seg.shortLabel}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
