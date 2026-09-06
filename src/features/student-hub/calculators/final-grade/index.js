"use client";

import { useState } from "react";
import CalculatorLayout from "../../shared/components/CalculatorLayout";
import ResultCard from "../../shared/components/ResultCard";
import GeoAnswerCard from "../../shared/components/GeoAnswerCard";
import FormulaCard from "../../shared/components/FormulaCard";
import ExampleGrid from "../../shared/components/ExampleGrid";
import FAQSection from "../../shared/components/FAQSection";
import { calculateFinalGradeNeeded } from "../../utils/formulaEngine";

export default function FinalGradeCalculatorFeature({ faqs }) {
  const [currentGrade, setCurrentGrade] = useState("85");
  const [targetGrade, setTargetGpa] = useState("90");
  const [finalWeight, setFinalWeight] = useState("20");

  const neededScore = calculateFinalGradeNeeded(
    parseFloat(currentGrade),
    parseFloat(targetGrade),
    parseFloat(finalWeight)
  );

  let formattedResult = "0.00%";
  let subtext = "";
  let isImpossible = false;

  if (neededScore !== null) {
    formattedResult = `${neededScore.toFixed(1)}%`;
    if (neededScore > 100) {
      isImpossible = true;
      subtext = `Warning: You need a score of ${formattedResult} which is higher than 100%. You cannot achieve your target grade in this course unless extra credit is offered.`;
    } else if (neededScore <= 0) {
      subtext = `Excellent! You can score 0% (or get a negative grade) on the final and still achieve your target class grade.`;
    } else {
      subtext = `To get a ${targetGrade}% overall in the class, you need to score at least ${formattedResult} on your final exam.`;
    }
  }

  const resetCalculator = () => {
    setCurrentGrade("80");
    setTargetGpa("90");
    setFinalWeight("25");
  };

  const examples = [
    {
      scenario: "My current class grade is 85%, my target overall grade is 90%, and the final exam represents 20% of my total grade. What do I need on the final?",
      solution: `Formula: Exam Score = [Target - Current * (1 - Weight)] / Weight. Plugging in: [90 - 85 * (1 - 0.20)] / 0.20 = [90 - 85 * 0.80] / 0.20 = [90 - 68] / 0.20 = 22 / 0.20 = 110.0%. (Impossible without extra credit).`,
      steps: [
        "Find the current grade percentage contribution: Grade * (1 - Final Weight).",
        "Subtract this contribution from the target grade.",
        "Divide the difference by the final exam weight to find the target score."
      ]
    },
    {
      scenario: "My class grade is 78%, my target is 80%, and final exam is weighted at 25%. What score is needed?",
      solution: `Points accumulated = 78 * 0.75 = 58.5. Points needed on final = 80 - 58.5 = 21.5. Final exam score needed = 21.5 / 0.25 = 86.0%.`,
      steps: [
        "Score at least an 86.0% on the final to secure a B (80%) average."
      ]
    }
  ];

  const activeResult = (neededScore !== null && formattedResult) ? {
    summary: `Required Final Exam Score: ${formattedResult} (Current Grade: ${currentGrade}%, Target Grade: ${targetGrade}%, Final Weight: ${finalWeight}%)`
  } : null;

  return (
    <CalculatorLayout 
      title="Final Grade Calculator" 
      description="Find out exactly what score you must earn on your final exam to pass your class or reach an A average."
      currentSlug="final-grade-calculator"
      activeResult={activeResult}
      faqs={faqs}
      seoContent={
        <>
          <GeoAnswerCard 
            question="I have an 85% in my class. What score do I need on the final exam (weighted 20%) to get a 90%?"
            answer="To get a 90% overall grade in the class when your current score is 85% and the final represents 20% of your grade, you would need to score a 110% on the final exam. Since this exceeds 100%, it is impossible without extra credit."
          />

          <FormulaCard 
            formula="Exam Score = \frac{Target Grade - (Current Grade \times (1 - Weight))}{Weight}"
            explanation="Compute the contribution of your current coursework grades (Current Grade * (1 - Weight)). Subtract this from your target class percentage to determine points needed, and divide by the final exam weight."
          />

          <ExampleGrid examples={examples} />
        </>
      }
    >
      <div className="space-y-8">
        {/* Form Panel */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Final Grade Calculator</h1>
            <p className="text-slate-500 text-sm font-semibold">Enter your current class grade, target average, and exam weight details.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Current Grade (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={currentGrade}
                onChange={(e) => setCurrentGrade(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-400 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:outline-none transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Target Class Grade (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={targetGrade}
                onChange={(e) => setTargetGpa(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-400 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:outline-none transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Final Exam Weight (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="100"
                value={finalWeight}
                onChange={(e) => setFinalWeight(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-400 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Results Banner */}
        <ResultCard 
          value={isImpossible ? "Impossible" : formattedResult} 
          label="Required Final Exam Score"
          subtext={subtext}
          onReset={resetCalculator} 
          className={isImpossible ? "from-red-500 to-rose-600 shadow-rose-500/10" : ""}
        />
      </div>
    </CalculatorLayout>
  );
}
