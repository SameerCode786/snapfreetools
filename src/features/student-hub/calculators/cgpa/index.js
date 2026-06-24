"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import CalculatorLayout from "../../shared/components/CalculatorLayout";
import ResultCard from "../../shared/components/ResultCard";
import GeoAnswerCard from "../../shared/components/GeoAnswerCard";
import FormulaCard from "../../shared/components/FormulaCard";
import ExampleGrid from "../../shared/components/ExampleGrid";
import FAQSection from "../../shared/components/FAQSection";
import { calculateCGPA } from "../../utils/formulaEngine";

export default function CGPACalculatorFeature({ faqs }) {
  const [mounted, setMounted] = useState(false);
  const [semesters, setSemesters] = useState([
    { id: "1", name: "Semester 1", gpa: "3.50", credits: "15" },
    { id: "2", name: "Semester 2", gpa: "3.20", credits: "16" }
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const addSemester = () => {
    setSemesters([...semesters, { id: Math.random().toString(), name: `Semester ${semesters.length + 1}`, gpa: "3.00", credits: "15" }]);
  };

  const removeSemester = (id) => {
    if (semesters.length > 1) {
      setSemesters(semesters.filter(s => s.id !== id));
    }
  };

  if (!mounted) {
    return (
      <CalculatorLayout 
        title="CGPA Calculator" 
        description="Calculate your overall Cumulative Grade Point Average (CGPA) by aggregating semester scores and credits."
        currentSlug="cgpa-calculator"
      >
        <div className="animate-pulse space-y-8">
          <div className="bg-slate-100 h-96 rounded-3xl" />
        </div>
      </CalculatorLayout>
    );
  }

  const updateSemester = (id, field, value) => {
    setSemesters(semesters.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const resetCalculator = () => {
    setSemesters([
      { id: "1", name: "Semester 1", gpa: "3.00", credits: "15" }
    ]);
  };

  const cgpa = calculateCGPA(semesters);

  const examples = [
    {
      scenario: "I got a 3.60 GPA in my first semester (16 credits) and a 3.20 GPA in my second semester (15 credits). What is my cumulative CGPA?",
      solution: "Semester 1 grade points = 3.60 * 16 = 57.6. Semester 2 grade points = 3.20 * 15 = 48.0. Total points = 57.6 + 48.0 = 105.6. Total Credits = 16 + 15 = 31. Cumulative CGPA = 105.6 / 31 = 3.41.",
      steps: [
        "Multiply each semester GPA by that semester's total credits.",
        "Sum the cumulative grade points together.",
        "Divide cumulative grade points by total cumulative credits."
      ]
    }
  ];

  return (
    <CalculatorLayout 
      title="CGPA Calculator" 
      description="Calculate your overall Cumulative Grade Point Average (CGPA) by aggregating semester scores and credits."
      currentSlug="cgpa-calculator"
    >
      <div className="space-y-8">
        {/* Input Card */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900">CGPA Calculator</h1>
            <p className="text-slate-500 text-sm font-semibold">Enter your past semester GPA averages and corresponding credit loads.</p>
          </div>

          <div className="hidden md:grid grid-cols-12 gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest px-4 border-b border-slate-100 pb-2">
            <div className="col-span-6">Semester Descriptor</div>
            <div className="col-span-3">Semester GPA</div>
            <div className="col-span-2">Earned Credits</div>
            <div className="col-span-1"></div>
          </div>

          <div className="space-y-4">
            {semesters.map((sem) => (
              <div 
                key={sem.id} 
                className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-50 md:bg-transparent p-4 md:p-0 rounded-2xl md:px-4"
              >
                <div className="col-span-1 md:col-span-6">
                  <input
                    type="text"
                    value={sem.name}
                    onChange={(e) => updateSemester(sem.id, "name", e.target.value)}
                    className="w-full bg-white md:bg-slate-50 border border-slate-200 md:border-transparent rounded-xl px-4 py-2.5 focus:bg-white focus:border-amber-400 focus:outline-none transition-all text-sm font-semibold text-slate-700"
                  />
                </div>
                <div className="col-span-1 md:col-span-3">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="5"
                    placeholder="GPA"
                    value={sem.gpa}
                    onChange={(e) => updateSemester(sem.id, "gpa", e.target.value)}
                    className="w-full bg-white md:bg-slate-50 border border-slate-200 md:border-transparent rounded-xl px-4 py-2.5 focus:bg-white focus:border-amber-400 focus:outline-none transition-all text-sm font-semibold text-slate-700"
                  />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <input
                    type="number"
                    min="1"
                    placeholder="Credits"
                    value={sem.credits}
                    onChange={(e) => updateSemester(sem.id, "credits", e.target.value)}
                    className="w-full bg-white md:bg-slate-50 border border-slate-200 md:border-transparent rounded-xl px-4 py-2.5 focus:bg-white focus:border-amber-400 focus:outline-none transition-all text-sm font-semibold text-slate-700"
                  />
                </div>
                <div className="col-span-1 md:col-span-1 text-center">
                  <button
                    onClick={() => removeSemester(sem.id)}
                    disabled={semesters.length === 1}
                    className="text-slate-300 hover:text-red-500 disabled:opacity-30 disabled:hover:text-slate-300 transition-colors p-2"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <button
              onClick={addSemester}
              className="bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-100 font-bold px-5 py-2.5 rounded-xl text-sm transition-all flex items-center gap-1.5"
            >
              <Plus size={16} /> Add Semester
            </button>
          </div>
        </div>

        {/* Results Banner */}
        <ResultCard 
          value={cgpa} 
          label="Cumulative CGPA"
          subtext={`Calculated from ${semesters.length} semesters and a total of ${semesters.reduce((acc, s) => acc + (parseFloat(s.credits) || 0), 0)} cumulative credits.`}
          onReset={resetCalculator} 
          onShare={async () => {
            const semesterCount = semesters.length;
            const totalCredits = semesters.reduce((acc, s) => acc + (parseFloat(s.credits) || 0), 0);
            const text = `My calculated CGPA is ${cgpa}. Calculated from ${semesterCount} semesters with ${totalCredits} total credit hours.`;
            const url = window.location.href;
            if (navigator.share) {
              try {
                await navigator.share({
                  title: "CGPA Calculator Result",
                  text: text,
                  url: url
                });
                return { success: true, message: "Result shared successfully" };
              } catch (err) {
                if (err.name === "AbortError") {
                  return { success: false, cancelled: true };
                }
              }
            }
            try {
              const fullText = `${text} ${url}`;
              await navigator.clipboard.writeText(fullText);
              return { success: true, message: "Result copied to clipboard" };
            } catch (err) {
              return { success: false, error: "Unable to share result." };
            }
          }}
        />

        {/* GEO Quick Answer */}
        <GeoAnswerCard 
          question="What is the difference between GPA and CGPA?"
          answer="GPA (Grade Point Average) represents the academic standing for a single term or semester. CGPA (Cumulative Grade Point Average) is the overall average of all GPAs combined across all terms from your enrollment. It is calculated by dividing total cumulative grade points earned by the sum of all cumulative credit hours."
        />

        {/* Formula */}
        <FormulaCard 
          formula="CGPA = \sum (Semester GPA \times Semester Credits) / \sum (Semester Credits)"
          explanation="Multiply each semester's GPA by its credit load to find the term grade points. Sum these points and divide by the cumulative credit hours of all semesters."
        />

        {/* Examples */}
        <ExampleGrid examples={examples} />

        {/* FAQs */}
        <FAQSection faqs={faqs} />
      </div>
    </CalculatorLayout>
  );
}
