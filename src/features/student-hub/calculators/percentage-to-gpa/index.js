"use client";

import { useState } from "react";
import CalculatorLayout from "../../shared/components/CalculatorLayout";
import ResultCard from "../../shared/components/ResultCard";
import GeoAnswerCard from "../../shared/components/GeoAnswerCard";
import FormulaCard from "../../shared/components/FormulaCard";
import ExampleGrid from "../../shared/components/ExampleGrid";
import FAQSection from "../../shared/components/FAQSection";
import { percentageToGPAMath } from "../../utils/formulaEngine";

export default function PercentageToGPAFeature({ faqs }) {
  const [percent, setPercent] = useState("85");
  const [maxScale, setMaxScale] = useState("4.0");
  const [method, setMethod] = useState("linear"); // "linear" or "proportional"

  const gpaResult = percentageToGPAMath(percent, parseFloat(maxScale) || 4.0, method);
  const formattedGpa = gpaResult.toFixed(2);

  const resetCalculator = () => {
    setPercent("80");
    setMaxScale("4.0");
    setMethod("linear");
  };

  const examples = [
    {
      scenario: "Convert a grade of 85% to a standard 4.0 GPA scale using the linear conversion formula.",
      solution: `Linear Formula: GPA = (Percentage - 20) / 20. Plugging in: (85 - 20) / 20 = 65 / 20 = 3.25.`,
      steps: [
        "Subtract 20 from the class percentage.",
        "Divide the difference by 20 to get the 4.0 GPA equivalent."
      ]
    },
    {
      scenario: "Convert 85% to a 4.0 GPA scale using the direct proportional ratio.",
      solution: `Proportional Formula: GPA = (Percentage / 100) * Max GPA. Plugging in: (85 / 100) * 4.0 = 0.85 * 4 = 3.40.`,
      steps: [
        "Divide the percentage by 100.",
        "Multiply the decimal by the scale maximum (4.0)."
      ]
    }
  ];

  return (
    <CalculatorLayout 
      title="Percentage to GPA Calculator" 
      description="Convert academic grade percentages into standard 4.0 or 5.0 scale GPA values."
      currentSlug="percentage-to-gpa"
    >
      <div className="space-y-8">
        {/* Forms Card */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Percentage to GPA Calculator</h1>
            <p className="text-slate-500 text-sm font-semibold">Enter your grade percentage and choose conversion rules.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Grade Percentage (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={percent}
                onChange={(e) => setPercent(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-400 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:outline-none transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Target GPA Scale
              </label>
              <select
                value={maxScale}
                onChange={(e) => {
                  setMaxScale(e.target.value);
                  if (parseFloat(e.target.value) !== 4.0) {
                    setMethod("proportional");
                  }
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:bg-white focus:border-amber-400 focus:outline-none transition-all cursor-pointer appearance-none"
              >
                <option value="4.0">4.0 Scale</option>
                <option value="5.0">5.0 Scale</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Conversion Method
              </label>
              <select
                value={method}
                disabled={parseFloat(maxScale) !== 4.0}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:bg-white focus:border-amber-400 focus:outline-none transition-all cursor-pointer appearance-none"
              >
                <option value="linear">Standard Linear ((Percent - 20) / 20)</option>
                <option value="proportional">Simple Ratio ((Percent / 100) * Max)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Card */}
        <ResultCard 
          value={formattedGpa} 
          label="Converted GPA Score"
          subtext={`Converted ${percent}% to the ${maxScale} scale using the ${method === "linear" ? "Linear" : "Proportional"} method.`}
          onReset={resetCalculator} 
        />

        {/* GEO Card */}
        <GeoAnswerCard 
          question="How do I convert my grade percentage to a GPA?"
          answer={`To convert a class percentage score to a 4.0 GPA, you can use the standard linear formula: GPA = (Percentage - 20) / 20. For example, 90% converts to a 3.5 GPA, and 80% to a 3.0. Alternatively, the proportional ratio formula computes GPA = (Percentage / 100) * Max GPA. This calculates a 90% grade directly as a 3.6 GPA equivalent.`}
        />

        {/* Formula */}
        <FormulaCard 
          formula={method === "linear" && maxScale === "4.0" ? "GPA = (Percentage - 20) / 20" : "GPA = (Percentage / 100) \\times Max GPA"}
          explanation={method === "linear" && maxScale === "4.0" 
            ? "The standard linear formula reflects US academic parameters where passing boundaries are adjusted to fit standard 4.0 letter grade points."
            : "The proportional ratio formula translates your percentage score directly into a decimal grade point representing the same fraction of the scale."
          }
        />

        {/* Examples */}
        <ExampleGrid examples={examples} />

        {/* FAQs */}
        <FAQSection faqs={faqs} />
      </div>
    </CalculatorLayout>
  );
}
