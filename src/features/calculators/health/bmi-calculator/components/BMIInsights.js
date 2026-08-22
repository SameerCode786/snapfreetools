import React from 'react';
import { Lightbulb } from 'lucide-react';
import { formatBMI, formatWeight } from '../utils/formatting';

export default function BMIInsights({ result }) {
  if (!result || result.isEmpty || result.isMinor) return null;

  const { bmi, category, weightStatus, weightDiff, minHealthyWeight, maxHealthyWeight, unit } = result;
  const weightLabel = unit === 'metric' ? 'kg' : 'lb';

  const insights = [
    `Your BMI of ${formatBMI(bmi)} places you in the "${category.label}" category according to standard adult classification.`,
    `The standard BMI healthy-weight range for your height is ${formatWeight(minHealthyWeight, weightLabel)} to ${formatWeight(maxHealthyWeight, weightLabel)}.`,
    weightStatus === 'within'
      ? `Your current weight is within the standard BMI healthy-weight range for your height.`
      : weightStatus === 'below'
        ? `You are approximately ${formatWeight(weightDiff, weightLabel)} below the lower boundary of the standard healthy-weight range.`
        : `You are approximately ${formatWeight(weightDiff, weightLabel)} above the upper boundary of the standard healthy-weight range.`,
    `BMI is a screening measure calculated from height and weight alone. It does not directly measure body fat, muscle mass, or body composition.`,
    `For a complete health assessment, consult a qualified healthcare professional who can consider your full medical picture.`,
  ];

  return (
    <div className="bg-amber-50 rounded-3xl p-6 md:p-8 mb-8 border border-amber-100 shadow-sm">
      <h3 className="text-lg font-bold text-amber-900 mb-4 flex items-center gap-2">
        <span className="w-8 h-8 rounded-lg bg-amber-200 text-amber-700 flex items-center justify-center">
          <Lightbulb size={18} />
        </span>
        Your BMI Insights
      </h3>
      <ul className="space-y-3">
        {insights.map((insight, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <span className="text-amber-500 mt-1 shrink-0">•</span>
            <span className="text-amber-800 font-medium leading-relaxed">{insight}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
