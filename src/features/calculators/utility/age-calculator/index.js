"use client";

import React, { useState, useEffect } from "react";
import CalculatorLayout from "@/features/student-hub/shared/components/CalculatorLayout";
import AgeCalculatorForm from "./components/AgeCalculatorForm";
import AgeResults from "./components/AgeResults";
import SharePreview from "./components/SharePreview";
import SEOContent from "./components/SEOContent";
import { calculateAge } from "./utils/ageCalculations";
import { AGE_CALCULATOR_FAQS } from "./content/faqs";

export default function AgeCalculatorFeature() {
  const [dob, setDob] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [result, setResult] = useState({ isEmpty: true });

  // Initialize targetDate to today's date on mount to avoid SSR hydration mismatch
  useEffect(() => {
    setTargetDate(new Date().toISOString().split("T")[0]);
  }, []);

  // Recalculate whenever inputs change
  useEffect(() => {
    if (!dob) {
      setResult({ isEmpty: true });
      return;
    }

    const currentTarget = targetDate || new Date().toISOString().split("T")[0];
    const calcResult = calculateAge(dob, currentTarget);
    setResult(calcResult);
  }, [dob, targetDate]);

  const activeResult = (result && !result.isEmpty) ? {
    summary: `Age: ${result.years} years, ${result.months} months, ${result.days} days old (${result.totalDays ? result.totalDays.toLocaleString() : ''} total days).`
  } : null;

  return (
    <CalculatorLayout
      title="Exact Age Calculator"
      description="Calculate your exact age in years, months, and days. Find out exactly how many days old you are and when your next birthday is."
      currentSlug="age-calculator"
      activeResult={activeResult}
      faqs={AGE_CALCULATOR_FAQS}
      seoContent={
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm mb-16">
          <SEOContent />
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
        
        {/* Left Column: Input Form */}
        <div className="lg:col-span-5 space-y-6">
          <AgeCalculatorForm 
            dob={dob} 
            setDob={setDob} 
            targetDate={targetDate} 
            setTargetDate={setTargetDate} 
          />
        </div>

        {/* Right Column: Results Dashboard */}
        <div className="lg:col-span-7">
          <AgeResults result={result} dob={dob} />
        </div>
      </div>
    </CalculatorLayout>
  );
}
