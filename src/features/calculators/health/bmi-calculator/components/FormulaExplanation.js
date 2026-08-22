import React from 'react';
import { Calculator } from 'lucide-react';
import { formatBMI, formatWeight } from '../utils/formatting';

export default function FormulaExplanation({ result }) {
  if (!result || result.isEmpty || result.isMinor) return null;

  const { bmi, unit, weightKg, weightLb, heightM, totalInches } = result;

  return (
    <div className="bg-slate-900 rounded-3xl p-6 md:p-8 mb-8 text-white shadow-xl">
      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
        <span className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center">
          <Calculator size={18} />
        </span>
        Calculation Breakdown
      </h3>

      <div className="space-y-5 font-mono text-sm md:text-base text-slate-300">
        {unit === 'metric' && heightM && weightKg && (
          <>
            <div>
              <div className="text-slate-500 text-xs mb-1 uppercase tracking-wider font-sans font-bold">Formula</div>
              <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                BMI = weight(kg) ÷ height(m)²
              </div>
            </div>
            <div>
              <div className="text-slate-500 text-xs mb-1 uppercase tracking-wider font-sans font-bold">Your Calculation</div>
              <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                {formatWeight(weightKg, 'kg')} ÷ ({formatWeight(heightM, 'm')} × {formatWeight(heightM, 'm')}) = <span className="text-emerald-400 font-bold">{formatBMI(bmi)}</span>
              </div>
            </div>
          </>
        )}

        {unit === 'imperial' && totalInches && weightLb && (
          <>
            <div>
              <div className="text-slate-500 text-xs mb-1 uppercase tracking-wider font-sans font-bold">Formula</div>
              <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                BMI = 703 × weight(lb) ÷ height(in)²
              </div>
            </div>
            <div>
              <div className="text-slate-500 text-xs mb-1 uppercase tracking-wider font-sans font-bold">Your Calculation</div>
              <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                703 × {formatWeight(weightLb, 'lb')} ÷ ({totalInches}in × {totalInches}in) = <span className="text-emerald-400 font-bold">{formatBMI(bmi)}</span>
              </div>
            </div>
          </>
        )}

        <div>
          <div className="text-slate-500 text-xs mb-1 uppercase tracking-wider font-sans font-bold">Why the BMI Formula Works</div>
          <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700 text-xs leading-relaxed">
            BMI normalizes weight by height squared. Dividing by height² accounts for the fact that weight scales roughly with the square of height in three-dimensional bodies. The constant 703 in the imperial formula converts from lb/in² to the equivalent metric kg/m² scale.
          </div>
        </div>
      </div>
    </div>
  );
}
