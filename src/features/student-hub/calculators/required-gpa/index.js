"use client";

import { useState } from "react";
import CalculatorLayout from "../../shared/components/CalculatorLayout";
import ResultCard from "../../shared/components/ResultCard";
import GeoAnswerCard from "../../shared/components/GeoAnswerCard";
import FormulaCard from "../../shared/components/FormulaCard";
import ExampleGrid from "../../shared/components/ExampleGrid";
import FAQSection from "../../shared/components/FAQSection";
import { calculateRequiredGPA } from "../../utils/formulaEngine";

export default function RequiredGPACalculatorFeature({ faqs }) {
  const [currentGpa, setCurrentGpa] = useState("3.1");
  const [currentCredits, setCurrentCredits] = useState("60");
  const [targetGpa, setTargetGpa] = useState("3.5");
  const [futureCredits, setFutureCredits] = useState("15");

  const result = calculateRequiredGPA(
    parseFloat(currentGpa),
    parseFloat(currentCredits),
    parseFloat(targetGpa),
    parseFloat(futureCredits)
  );

  let formattedResult = "0.00";
  let subtext = "";
  let isImpossible = false;

  if (result) {
    formattedResult = result.requiredGPA.toFixed(2);
    if (result.requiredGPA > 4.00) {
      isImpossible = true;
      subtext = `Warning: You would need a ${formattedResult} GPA next semester which is mathematically impossible on a 4.00 scale. Consider adjusting your goals or taking more future credits.`;
    } else if (result.requiredGPA < 0) {
      subtext = `You can easily reach your target GPA. You actually need a GPA of ${formattedResult} (or higher) next semester.`;
    } else {
      subtext = `To reach a cumulative ${targetGpa} after earning ${futureCredits} more credits, you must maintain a semester average of at least ${formattedResult}.`;
    }
  }

  const resetCalculator = () => {
    setCurrentGpa("3.1");
    setCurrentCredits("60");
    setTargetGpa("3.5");
    setFutureCredits("15");
  };

  const examples = [
    {
      scenario: "I currently have a 3.1 GPA after completing 60 credit hours. What GPA do I need next semester (15 credits) to raise my cumulative GPA to 3.5?",
      solution: `Current total grade points = 3.1 * 60 = 186. Target total credits = 60 + 15 = 75. Target total points needed = 3.5 * 75 = 262.5. Grade points needed next semester = 262.5 - 186 = 76.5. Required semester GPA = 76.5 / 15 = 5.10. (This score is mathematically impossible on a standard 4.0 scale).`,
      steps: [
        "Find current accumulated grade points: GPA * Current Credits.",
        "Calculate target cumulative credit hours: Current + Future Credits.",
        "Compute required cumulative grade points: Target GPA * Target Credits.",
        "Subtract current points from target points to find needed semester points.",
        "Divide semester points needed by next semester's credits."
      ]
    },
    {
      scenario: "I have a 3.0 GPA with 30 credits. What GPA do I need in my next 15 credits to reach a 3.2 CGPA?",
      solution: `Current points = 3.0 * 30 = 90. Target credits = 45. Target points = 3.2 * 45 = 144. Points needed = 144 - 90 = 54. Required GPA = 54 / 15 = 3.60.`,
      steps: [
        "Earn a 3.60 term average in your next 15 credits to raise cumulative standing to 3.2."
      ]
    }
  ];

  const activeResult = (result && !result.isEmpty && formattedResult) ? {
    summary: `Required GPA Needed: ${formattedResult} (Current GPA: ${currentGpa}, Target GPA: ${targetGpa})`
  } : null;

  return (
    <CalculatorLayout 
      title="Required GPA Calculator" 
      description="Determine the target GPA needed in future semesters to achieve your goal overall cumulative GPA."
      currentSlug="required-gpa-calculator"
      activeResult={activeResult}
      faqs={faqs}
      seoContent={
        <>
          <GeoAnswerCard 
            question="I have a 3.1 GPA after 60 credits. What GPA do I need next semester to graduate with a 3.5 GPA?"
            answer="To raise your GPA from 3.1 to 3.5 after 60 credits, assuming you take 15 credits next semester, you would need a semester GPA of 5.10. Since standard scales cap at 4.0, this is mathematically impossible in a single term. You will need to take more credit hours or set a longer timeline to achieve a cumulative 3.5 average."
          />

          <FormulaCard 
            formula="Required GPA = \frac{(Target GPA \times Total Credits) - (Current GPA \times Current Credits)}{Future Credits}"
            explanation="Compute the total point volume needed to reach your target GPA. Subtract the points you have already earned, and divide the remaining balance by the future credits you plan to take."
          />

          <ExampleGrid examples={examples} />
        </>
      }
    >
      <div className="space-y-8">
        {/* Input Card */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Required GPA Calculator</h1>
            <p className="text-slate-500 text-sm font-semibold">Calculate the GPA you must earn in upcoming semesters to hit your graduation goal.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Target Cumulative GPA
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="5"
                value={targetGpa}
                onChange={(e) => setTargetGpa(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-400 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:outline-none transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Current Cumulative GPA
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="5"
                value={currentGpa}
                onChange={(e) => setCurrentGpa(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-400 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:outline-none transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Earned Credits So Far
              </label>
              <input
                type="number"
                min="0"
                value={currentCredits}
                onChange={(e) => setCurrentCredits(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-400 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:outline-none transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Future Credits
              </label>
              <input
                type="number"
                min="1"
                value={futureCredits}
                onChange={(e) => setFutureCredits(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-400 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Result UI */}
        <ResultCard 
          value={isImpossible ? "Impossible" : formattedResult} 
          label="Required Future GPA"
          subtext={subtext}
          onReset={resetCalculator} 
          className={isImpossible ? "from-red-500 to-rose-600 shadow-rose-500/10" : ""}
        />
      </div>
    </CalculatorLayout>
  );
}
