"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Calculator, ArrowRight, Info, RotateCcw } from "lucide-react";
import CalculatorLayout from "@/features/student-hub/shared/components/CalculatorLayout";
import CalculatorInput from "@/features/student-hub/shared/components/CalculatorInput";
import { GRADING_SCALES, PASS_THRESHOLDS } from "./constants/gradingScales";
import GradeModeSelector from "./components/GradeModeSelector";
import SubjectInputRow from "./components/SubjectInputRow";
import GradeResultDashboard from "./components/GradeResultDashboard";
import WhatIfSimulator from "./components/WhatIfSimulator";
import { 
  calculateSingleGrade, 
  calculateMultipleSubjects, 
  calculateWeighted, 
  calculateRequired 
} from "./utils/calculations";
import { generateRecommendations, getMultipleSubjectsRecommendations } from "./utils/recommendations";

export default function GradeCalculatorFeature({ faqs = [] }) {
  const [mode, setMode] = useState("single"); // single, multiple, weighted, required
  const [scaleKey, setScaleKey] = useState("standard");
  const [passThreshold, setPassThreshold] = useState(60);
  
  // Single Mode State
  const [singleObtained, setSingleObtained] = useState("");
  const [singleTotal, setSingleTotal] = useState("");
  
  // Multiple & Weighted State
  const [subjects, setSubjects] = useState([
    { id: 1, name: "", obtained: "", total: "", weight: "" },
    { id: 2, name: "", obtained: "", total: "", weight: "" }
  ]);

  // Required Mode State
  const [reqCurrentObtained, setReqCurrentObtained] = useState("");
  const [reqCurrentTotal, setReqCurrentTotal] = useState("");
  const [reqRemainingTotal, setReqRemainingTotal] = useState("");
  const [reqTargetPercent, setReqTargetPercent] = useState("");

  const [result, setResult] = useState(null);
  const [simulatedResult, setSimulatedResult] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [error, setError] = useState(null);

  const resultsRef = useRef(null);

  const handleCalculate = () => {
    setError(null);
    setSimulatedResult(null);
    setRecommendation(null);
    let calcResult = null;
    const scale = GRADING_SCALES[scaleKey];

    try {
      if (mode === "single") {
        const obtained = parseFloat(singleObtained);
        const total = parseFloat(singleTotal);
        if (isNaN(obtained) || isNaN(total) || total <= 0) {
          throw new Error("Please enter valid marks.");
        }
        if (obtained > total) {
          throw new Error("Obtained marks cannot be greater than total marks.");
        }
        calcResult = calculateSingleGrade(obtained, total, scale, passThreshold);
        if (calcResult) {
          setRecommendation(generateRecommendations(calcResult.percentage, scale, total));
        }
      } 
      else if (mode === "multiple") {
        calcResult = calculateMultipleSubjects(subjects.map(s => ({...s, obtained: parseFloat(s.obtained), total: parseFloat(s.total)})), scale, passThreshold);
        if (!calcResult) throw new Error("Please enter valid subjects with marks.");
        
        const rec = generateRecommendations(calcResult.percentage, scale, calcResult.totalMarks);
        const subRecs = getMultipleSubjectsRecommendations(calcResult);
        setRecommendation({
          ...rec,
          message: `${rec.message} ${subRecs.length > 0 ? subRecs[0].message : ""}`
        });
      }
      else if (mode === "weighted") {
        const mappedSubjects = subjects.map(s => ({...s, score: parseFloat(s.obtained), maxScore: parseFloat(s.total), weight: parseFloat(s.weight)}));
        
        const totalWeight = mappedSubjects.reduce((sum, s) => sum + (isNaN(s.weight) ? 0 : s.weight), 0);
        if (Math.abs(totalWeight - 100) > 0.001) {
          throw new Error(`Total weights must exactly equal 100%. Current sum: ${totalWeight}%`);
        }

        calcResult = calculateWeighted(mappedSubjects, scale, passThreshold);
        if (calcResult) {
          setRecommendation(generateRecommendations(calcResult.percentage, scale, 100));
        }
      }
      else if (mode === "required") {
        calcResult = calculateRequired(
          parseFloat(reqCurrentObtained), 
          parseFloat(reqCurrentTotal), 
          parseFloat(reqRemainingTotal), 
          parseFloat(reqTargetPercent)
        );
        if (!calcResult) throw new Error("Please enter valid positive numbers for required marks calculation.");
      }

      setResult(calcResult);
      
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);

    } catch (err) {
      setError(err.message);
    }
  };

  const handleSimulate = (newObtained, newTotal) => {
    const scale = GRADING_SCALES[scaleKey];
    let calcResult = null;

    if (mode === "single") {
      calcResult = calculateSingleGrade(newObtained, newTotal, scale, passThreshold);
    } else if (mode === "multiple") {
      // In multiple mode, if simulated, we treat it as an overall shift
      calcResult = calculateSingleGrade(newObtained, newTotal, scale, passThreshold);
    }

    if (calcResult) {
      setSimulatedResult(calcResult);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const buildShareText = () => {
    const activeResult = simulatedResult || result;
    if (!activeResult || typeof activeResult.mode !== 'string') return "";

    let text = `SnapFreeTools Grade Calculator Result\n\n`;
    const resMode = activeResult.mode;

    if (resMode === "single" || resMode === "multiple" || resMode === "weighted") {
      if (typeof activeResult.percentage !== 'number') return "";
      
      text += `Percentage: ${activeResult.percentage.toFixed(2)}%\n`;
      text += `Grade: ${activeResult.letterGrade}\n`;
      text += `Status: ${activeResult.isPass ? "Pass" : "Fail"}\n`;
      
      if ((resMode === "single" || resMode === "multiple") && typeof activeResult.marksObtained === 'number' && typeof activeResult.totalMarks === 'number') {
        text += `Marks: ${activeResult.marksObtained.toFixed(1)} / ${activeResult.totalMarks.toFixed(1)}\n`;
      }
    } else if (resMode === "required") {
      if (typeof activeResult.marksNeeded !== 'number') return "";
      
      text += `Target Grade Achievable: ${activeResult.isAchievable ? "Yes" : "No"}\n`;
      text += `Marks Needed: ${activeResult.marksNeeded.toFixed(1)}\n`;
      text += `Difficulty: ${activeResult.difficulty}\n`;
    }

    text += `\nCalculate your grade here: https://www.snapfreetools.com/grade-calculator`;
    return text;
  };

  const resetCalculator = () => {
    setSingleObtained("");
    setSingleTotal("");
    setSubjects([
      { id: 1, name: "", obtained: "", total: "", weight: "" },
      { id: 2, name: "", obtained: "", total: "", weight: "" }
    ]);
    setReqCurrentObtained("");
    setReqCurrentTotal("");
    setReqRemainingTotal("");
    setReqTargetPercent("");
    setResult(null);
    setSimulatedResult(null);
    setRecommendation(null);
    setError(null);
  };

  const activeResult = (result && !result.isEmpty) ? {
    summary: mode === 'target' 
      ? `Target Grade Goal: ${reqTargetPercent}% (Marks Needed: ${result.marksNeeded ? result.marksNeeded.toFixed(1) : ''})`
      : `Calculated Class Grade: ${result.percentage ? result.percentage.toFixed(2) : ''}% (${result.letterGrade || ''})`
  } : null;

  return (
    <CalculatorLayout
      title="Grade Calculator"
      description="Calculate your current class grade, weighted average, and required final score."
      currentSlug="grade-calculator"
      activeResult={activeResult}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-8">
          
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
            <GradeModeSelector activeMode={mode} onChange={(m) => {
              setMode(m);
              setResult(null);
              setSimulatedResult(null);
              setError(null);
            }} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pb-8 border-b border-slate-100">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Grading Scale</label>
                <div className="relative">
                  <select
                    value={scaleKey}
                    onChange={(e) => setScaleKey(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:bg-white focus:border-amber-400 focus:outline-none transition-all appearance-none cursor-pointer"
                  >
                    {Object.keys(GRADING_SCALES).map((key) => (
                      <option key={key} value={key}>{GRADING_SCALES[key].name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Pass Threshold</label>
                <div className="relative">
                  <select
                    value={passThreshold}
                    onChange={(e) => setPassThreshold(parseInt(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:bg-white focus:border-amber-400 focus:outline-none transition-all appearance-none cursor-pointer"
                  >
                    {PASS_THRESHOLDS.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl font-medium text-sm flex items-start gap-3">
                <Info size={18} className="mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {mode === "single" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <CalculatorInput
                  label="Marks Obtained"
                  type="number"
                  placeholder="e.g. 85"
                  value={singleObtained}
                  onChange={(e) => setSingleObtained(e.target.value)}
                  min="0"
                />
                <CalculatorInput
                  label="Total Marks"
                  type="number"
                  placeholder="e.g. 100"
                  value={singleTotal}
                  onChange={(e) => setSingleTotal(e.target.value)}
                  min="0"
                />
              </div>
            )}

            {(mode === "multiple" || mode === "weighted") && (
              <SubjectInputRow 
                subjects={subjects} 
                setSubjects={setSubjects} 
                mode={mode} 
              />
            )}

            {mode === "required" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <CalculatorInput
                  label="Current Marks Obtained"
                  type="number"
                  placeholder="e.g. 150"
                  value={reqCurrentObtained}
                  onChange={(e) => setReqCurrentObtained(e.target.value)}
                />
                <CalculatorInput
                  label="Current Total So Far"
                  type="number"
                  placeholder="e.g. 200"
                  value={reqCurrentTotal}
                  onChange={(e) => setReqCurrentTotal(e.target.value)}
                />
                <CalculatorInput
                  label="Remaining Exam Total Marks"
                  type="number"
                  placeholder="e.g. 100"
                  value={reqRemainingTotal}
                  onChange={(e) => setReqRemainingTotal(e.target.value)}
                />
                <CalculatorInput
                  label="Target Percentage (%)"
                  type="number"
                  placeholder="e.g. 80"
                  value={reqTargetPercent}
                  onChange={(e) => setReqTargetPercent(e.target.value)}
                />
              </div>
            )}

            <div className="mt-8 flex gap-4">
              <button
                onClick={handleCalculate}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm shadow-amber-500/20"
              >
                <Calculator size={20} />
                Calculate Grade
              </button>
              
              <button
                onClick={resetCalculator}
                className="px-6 py-4 border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 font-bold rounded-xl transition-colors"
                aria-label="Reset Calculator"
              >
                <RotateCcw size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5" ref={resultsRef}>
          {(result || simulatedResult) ? (
            <div className="sticky top-6">
              
              {mode !== "required" ? (
                <>
                  <GradeResultDashboard 
                    result={simulatedResult || result} 
                    mode={mode} 
                    recommendation={recommendation}
                  />

                  {simulatedResult && (
                    <div className="mt-4 flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-xl">
                      <span className="font-semibold text-amber-800 text-sm">Viewing Simulated Scenario</span>
                      <button onClick={() => setSimulatedResult(null)} className="text-xs font-bold uppercase tracking-wider text-amber-600 hover:text-amber-800">Clear</button>
                    </div>
                  )}

                  <WhatIfSimulator 
                    currentObtained={result.marksObtained || 0}
                    currentTotal={result.totalMarks || 100}
                    onSimulate={handleSimulate}
                    mode={mode}
                  />
                </>
              ) : (
                <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
                  <h3 className="font-bold text-slate-800 text-xl mb-6">Required Marks Result</h3>
                  <div className="space-y-6">
                    <div>
                      <p className="text-slate-400 font-semibold text-xs uppercase tracking-wider mb-1">Target Achievable</p>
                      <p className={`text-2xl font-black ${result.isAchievable ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {result.isAchievable ? 'Yes' : 'No'}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-semibold text-xs uppercase tracking-wider mb-1">Marks Needed</p>
                      <p className="text-3xl font-black text-slate-800">{result.marksNeeded.toFixed(1)} <span className="text-sm font-bold text-slate-400">/ {reqRemainingTotal}</span></p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-semibold text-xs uppercase tracking-wider mb-1">Difficulty</p>
                      <p className="text-lg font-bold text-slate-700">{result.difficulty}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="sticky top-6">
              <div className="bg-slate-50 border border-slate-200 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-center h-[400px]">
                <Calculator size={48} className="text-slate-300 mb-4" />
                <h3 className="text-lg font-bold text-slate-700 mb-2">Ready to Calculate</h3>
                <p className="text-slate-500 max-w-[250px]">Enter your marks and click calculate to see your detailed grade analysis.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </CalculatorLayout>
  );
}
