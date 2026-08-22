import React from 'react';
import { Activity } from 'lucide-react';
import { formatBMI, formatWeight } from '../utils/formatting';

export default function BMIResultDashboard({ result }) {
  if (!result || result.isEmpty) {
    return (
      <div className="bg-slate-50 rounded-[2rem] p-12 mb-8 border border-slate-200 border-dashed flex flex-col items-center justify-center text-center min-h-[280px]">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
          <Activity size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-400 mb-2">Ready to Calculate</h3>
        <p className="text-slate-500 font-medium">Enter your height and weight to calculate your BMI.</p>
      </div>
    );
  }

  if (result.isMinor) {
    return (
      <div className="bg-blue-50 rounded-[2rem] p-10 mb-8 border border-blue-200 text-center">
        <div className="text-4xl mb-4">ℹ️</div>
        <h3 className="text-xl font-bold text-blue-900 mb-3">Age-Specific Interpretation Required</h3>
        <p className="text-blue-700 leading-relaxed max-w-lg mx-auto">
          For children and teenagers under 18, adult BMI categories (underweight, healthy, overweight, obese) cannot be applied directly. A BMI-for-age percentile chart specific to your age and sex is required. Please consult a healthcare professional for an accurate assessment.
        </p>
      </div>
    );
  }

  const { bmi, category, weightKg, weightLb, minHealthyWeight, maxHealthyWeight, unit } = result;
  const weightLabel = unit === 'metric' ? 'kg' : 'lb';
  const currentWeight = unit === 'metric' ? weightKg : weightLb;

  return (
    <div className="mb-8">
      {/* Primary BMI Card */}
      <div
        className="rounded-[2rem] p-8 sm:p-10 mb-6 text-white shadow-lg relative overflow-hidden"
        style={{ backgroundColor: category.color }}
      >
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_white_0%,_transparent_70%)]" />
        <div className="relative z-10">
          <div className="text-sm font-bold uppercase tracking-widest opacity-80 mb-2">Your BMI</div>
          <div className="text-7xl sm:text-8xl font-black leading-none mb-3">
            {formatBMI(bmi)}
          </div>
          <div className="text-2xl font-bold opacity-90">{category.label}</div>
          <div className="text-sm opacity-70 mt-1">Standard adult BMI classification</div>
        </div>
      </div>

      {/* Supporting Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Your Weight</div>
          <div className="text-2xl font-black text-slate-900">{formatWeight(currentWeight, weightLabel)}</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Healthy BMI Range</div>
          <div className="text-2xl font-black text-slate-900">18.5 – 24.9</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Healthy Weight Range</div>
          <div className="text-2xl font-black text-slate-900">
            {formatWeight(minHealthyWeight, weightLabel)} – {formatWeight(maxHealthyWeight, weightLabel)}
          </div>
        </div>
      </div>
    </div>
  );
}
