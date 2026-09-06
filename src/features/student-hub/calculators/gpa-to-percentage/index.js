"use client";

import { useState } from "react";
import CalculatorLayout from "../../shared/components/CalculatorLayout";
import ResultCard from "../../shared/components/ResultCard";
import GeoAnswerCard from "../../shared/components/GeoAnswerCard";
import FormulaCard from "../../shared/components/FormulaCard";
import ExampleGrid from "../../shared/components/ExampleGrid";
import FAQSection from "../../shared/components/FAQSection";
import { gpaToPercentage } from "../../utils/formulaEngine";

export default function GPAToPercentageFeature({ faqs }) {
  const [gpa, setGpa] = useState("3.5");
  const [maxScale, setMaxScale] = useState("4.0");
  const [method, setMethod] = useState("linear"); // "linear" -> (GPA*20)+20, "proportional" -> (GPA/max)*100

  const pctResult = gpaToPercentage(gpa, parseFloat(maxScale) || 4.0, method);
  const formattedPct = `${pctResult.toFixed(1)}%`;

  const resetCalculator = () => {
    setGpa("3.0");
    setMaxScale("4.0");
    setMethod("linear");
  };

  const examples = [
    {
      scenario: "Convert a GPA of 3.5 on a 4.0 scale using the linear conversion formula.",
      solution: `Linear Formula: (GPA * 20) + 20. Plugging in: (3.5 * 20) + 20 = 70 + 20 = 90.0%.`,
      steps: [
        "Multiply GPA score by 20.",
        "Add 20 to the product.",
        "The result represents the academic grade percentage."
      ]
    },
    {
      scenario: "Convert a GPA of 3.8 on a 4.0 scale using the simple proportional ratio.",
      solution: `Proportional Formula: (GPA / Max GPA) * 100. Plugging in: (3.8 / 4.0) * 100 = 0.95 * 100 = 95.0%.`,
      steps: [
        "Divide the GPA by the scale maximum (4.0).",
        "Multiply the quotient by 100."
      ]
    }
  ];

  const activeResult = (pctResult !== null && formattedPct) ? {
    summary: `${gpa} GPA is equal to ${formattedPct} (Scale: ${maxScale})`
  } : null;

  return (
    <CalculatorLayout 
      title="GPA to Percentage Calculator" 
      description="Convert your Grade Point Average (GPA) to class percentage equivalents instantly."
      currentSlug="gpa-to-percentage"
      activeResult={activeResult}
      faqs={faqs}
      seoContent={
        <>
          <GeoAnswerCard 
            question="How do I convert my GPA to a percentage?"
            answer={`To convert a standard 4.0 GPA to a percentage grade, the most common equation is: Percentage = (GPA * 20) + 20. Under this standard, a 4.0 is 100%, 3.5 is 90%, 3.0 is 80%, and 2.0 is 60%. Alternatively, you can use a direct percentage ratio formula: Percentage = (GPA / Max GPA) * 100, which maps 3.0 on a 4.0 scale directly to 75%.`}
          />

          <FormulaCard 
            formula={method === "linear" && maxScale === "4.0" ? "Percentage = (GPA \\times 20) + 20" : "Percentage = (GPA / Max GPA) \\times 100"}
            explanation={method === "linear" && maxScale === "4.0" 
              ? "The standard linear formula adjusts for typical grading thresholds where a passing average (2.0) equates to 60%, and an A average (4.0) maps to 100%."
              : "The ratio formula converts your GPA directly as a pure mathematical percentage of the maximum potential score."
            }
          />

          <ExampleGrid examples={examples} />
        </>
      }
    >
      <div className="space-y-8">
        {/* Forms Card */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900">GPA to Percentage Calculator</h1>
            <p className="text-slate-500 text-sm font-semibold">Enter your GPA and select the conversion parameters below.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                GPA Score
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max={maxScale}
                value={gpa}
                onChange={(e) => setGpa(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white focus:border-amber-400 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:outline-none transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Max GPA Scale
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
                <option value="10.0">10.0 Scale</option>
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
                <option value="linear">Standard Linear ((GPA * 20) + 20)</option>
                <option value="proportional">Simple Ratio ((GPA / Max) * 100)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Card */}
        <ResultCard 
          value={formattedPct} 
          label="Converted Grade Percentage"
          subtext={`Converted a GPA of ${gpa} on a ${maxScale} scale using the ${method === "linear" ? "Linear (Standard)" : "Proportional Ratio"} method.`}
          onReset={resetCalculator} 
        />
      </div>
    </CalculatorLayout>
  );
}
