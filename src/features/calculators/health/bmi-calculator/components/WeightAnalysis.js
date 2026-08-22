import React from 'react';
import { formatWeight } from '../utils/formatting';

export default function WeightAnalysis({ result }) {
  if (!result || result.isEmpty || result.isMinor) return null;

  const { weightStatus, weightDiff, minHealthyWeight, maxHealthyWeight, unit, category } = result;
  const weightLabel = unit === 'metric' ? 'kg' : 'lb';

  let statusMessage = '';
  let statusColor = 'text-emerald-700';
  let bgColor = 'bg-emerald-50 border-emerald-200';

  if (weightStatus === 'within') {
    statusMessage = 'Your current weight is within the standard BMI healthy-weight range for your height.';
    statusColor = 'text-emerald-700';
    bgColor = 'bg-emerald-50 border-emerald-200';
  } else if (weightStatus === 'below') {
    statusMessage = `Your current weight is approximately ${formatWeight(weightDiff, weightLabel)} below the lower end of the standard BMI healthy-weight range for your height.`;
    statusColor = 'text-blue-700';
    bgColor = 'bg-blue-50 border-blue-200';
  } else {
    statusMessage = `Your current weight is approximately ${formatWeight(weightDiff, weightLabel)} above the upper end of the standard BMI healthy-weight range for your height.`;
    statusColor = 'text-amber-700';
    bgColor = 'bg-amber-50 border-amber-200';
  }

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 mb-8 border border-slate-200 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 mb-6">Healthy Weight Analysis</h3>

      <div className={`p-5 rounded-2xl border mb-6 ${bgColor}`}>
        <p className={`font-medium leading-relaxed ${statusColor}`}>{statusMessage}</p>
      </div>

      {/* Weight bar comparison */}
      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <div className="w-32 text-xs font-bold text-slate-500 uppercase tracking-wide shrink-0">Min Healthy</div>
          <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div className="bg-emerald-400 h-full rounded-full" style={{ width: '0%' }} />
          </div>
          <div className="text-sm font-bold text-slate-700 w-20 text-right">{formatWeight(minHealthyWeight, weightLabel)}</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-32 text-xs font-bold text-slate-500 uppercase tracking-wide shrink-0">Max Healthy</div>
          <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full" style={{ width: '100%' }} />
          </div>
          <div className="text-sm font-bold text-slate-700 w-20 text-right">{formatWeight(maxHealthyWeight, weightLabel)}</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-32 text-xs font-bold text-slate-500 uppercase tracking-wide shrink-0">Your Weight</div>
          <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                backgroundColor: category?.color || '#64748b',
                width: `${Math.min(100, Math.max(5, ((unit === 'metric' ? result.weightKg : result.weightLb) / (maxHealthyWeight * 1.5)) * 100))}%`
              }}
            />
          </div>
          <div className="text-sm font-bold text-slate-700 w-20 text-right">
            {formatWeight(unit === 'metric' ? result.weightKg : result.weightLb, weightLabel)}
          </div>
        </div>
      </div>
    </div>
  );
}
