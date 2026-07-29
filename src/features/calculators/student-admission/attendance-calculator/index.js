"use client";

import React, { useState, useEffect } from "react";
import CalculatorLayout from "@/features/student-hub/shared/components/CalculatorLayout";
import ResultCard from "@/features/student-hub/shared/components/ResultCard";
import FAQSection from "@/features/student-hub/shared/components/FAQSection";
import { Icons } from "@/lib/lucide-icons";
import { 
  calculateCurrentAttendance, 
  calculateRequiredClasses, 
  calculateSafeAbsences, 
  calculateProjection 
} from "./utils/calculateAttendance";
import { buildShareText } from "./utils/buildShareText";
import ShareResultButton from "./components/ShareResultButton";
import AttendanceModeSelector from "./components/AttendanceModeSelector";
import AttendanceStatusCard from "./components/AttendanceStatusCard";

const TARGET_PRESETS = [60, 65, 70, 75, 80, 85, 90];

export default function AttendanceCalculatorFeature({ faqs }) {
  const [mode, setMode] = useState("current"); // current, reach, safe, project
  
  // State
  const [totalClasses, setTotalClasses] = useState("");
  const [inputType, setInputType] = useState("attended"); // attended, missed
  const [classesAttended, setClassesAttended] = useState("");
  const [classesMissed, setClassesMissed] = useState("");
  
  const [targetAttendance, setTargetAttendance] = useState("75");
  
  // Project Mode
  const [futureAttend, setFutureAttend] = useState("");
  const [futureMiss, setFutureMiss] = useState("");

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Validate inputs
  const total = parseInt(totalClasses, 10);
  const attended = inputType === "attended" ? parseInt(classesAttended, 10) : total - parseInt(classesMissed, 10);
  const target = parseFloat(targetAttendance);

  useEffect(() => {
    // Reset errors
    setError(null);
    setResult(null);

    // Validation
    if (!totalClasses) return;
    if (isNaN(total) || total <= 0) {
      setError("Total classes must be greater than 0");
      return;
    }

    if (inputType === "attended") {
      if (classesAttended && (isNaN(attended) || attended < 0)) {
        setError("Classes attended cannot be negative");
        return;
      }
      if (classesAttended && attended > total) {
        setError("Attended classes cannot exceed total classes");
        return;
      }
    } else {
      const missed = parseInt(classesMissed, 10);
      if (classesMissed && (isNaN(missed) || missed < 0)) {
        setError("Classes missed cannot be negative");
        return;
      }
      if (classesMissed && missed > total) {
        setError("Missed classes cannot exceed total classes");
        return;
      }
    }

    if (mode === "reach" || mode === "safe") {
      if (isNaN(target) || target <= 0 || target > 100) {
        setError("Target percentage must be between 1 and 100");
        return;
      }
    }

    if (mode === "project") {
      const fAttend = parseInt(futureAttend, 10) || 0;
      const fMiss = parseInt(futureMiss, 10) || 0;
      if (fAttend < 0 || fMiss < 0) {
        setError("Future classes cannot be negative");
        return;
      }
    }

    // Only calculate if we have attended value explicitly provided
    if ((inputType === "attended" && !classesAttended) || (inputType === "missed" && !classesMissed)) return;

    // Run Calculations
    try {
      const currentResult = calculateCurrentAttendance(total, attended);
      
      let finalResult = { current: currentResult };
      
      if (mode === "current") {
        setResult({ ...currentResult });
      } else if (mode === "reach") {
        const reqResult = calculateRequiredClasses(total, attended, target / 100);
        setResult({ current: currentResult, required: reqResult });
      } else if (mode === "safe") {
        const safeResult = calculateSafeAbsences(total, attended, target / 100);
        setResult({ current: currentResult, safe: safeResult });
      } else if (mode === "project") {
        const fAttend = parseInt(futureAttend, 10) || 0;
        const fMiss = parseInt(futureMiss, 10) || 0;
        const projResult = calculateProjection(total, attended, fAttend, fMiss);
        setResult({ current: currentResult, projection: projResult });
      }
    } catch (e) {
      setError("Calculation error");
    }
  }, [mode, totalClasses, inputType, classesAttended, classesMissed, targetAttendance, futureAttend, futureMiss]);

  const handleReset = () => {
    setTotalClasses("");
    setClassesAttended("");
    setClassesMissed("");
    setFutureAttend("");
    setFutureMiss("");
    setTargetAttendance("75");
    setResult(null);
    setError(null);
  };

  return (
    <CalculatorLayout
      title="Attendance Calculator"
      subtitle="Calculate your attendance percentage, find how many classes you need to attend, and see how many absences you can safely take."
      category="Student & Admission Tools"
      currentSlug="attendance-calculator"
    >
      <div className="max-w-4xl mx-auto space-y-12">
        <section className="scroll-mt-32">
          
          <AttendanceModeSelector currentMode={mode} onChange={setMode} />

          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm relative z-10 space-y-8">
            {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded-2xl flex items-center gap-3 text-sm font-bold">
                <Icons.AlertTriangle size={18} className="shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 block">Total Classes Held</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={totalClasses}
                  onChange={(e) => setTotalClasses(e.target.value)}
                  placeholder="e.g. 100"
                  className="w-full h-14 bg-slate-50 border-2 border-slate-200 rounded-2xl px-4 font-bold text-slate-700 outline-none focus:border-emerald-500 focus:bg-white transition-all text-lg"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-slate-700">
                    {inputType === "attended" ? "Classes Attended" : "Classes Missed"}
                  </label>
                  <button
                    onClick={() => {
                      setInputType(inputType === "attended" ? "missed" : "attended");
                      setClassesAttended("");
                      setClassesMissed("");
                    }}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    Enter classes {inputType === "attended" ? "missed" : "attended"} instead
                  </button>
                </div>
                {inputType === "attended" ? (
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={classesAttended}
                    onChange={(e) => setClassesAttended(e.target.value)}
                    placeholder="e.g. 78"
                    className="w-full h-14 bg-slate-50 border-2 border-slate-200 rounded-2xl px-4 font-bold text-slate-700 outline-none focus:border-emerald-500 focus:bg-white transition-all text-lg"
                  />
                ) : (
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={classesMissed}
                    onChange={(e) => setClassesMissed(e.target.value)}
                    placeholder="e.g. 22"
                    className="w-full h-14 bg-slate-50 border-2 border-slate-200 rounded-2xl px-4 font-bold text-slate-700 outline-none focus:border-emerald-500 focus:bg-white transition-all text-lg"
                  />
                )}
              </div>
            </div>

            {(mode === "reach" || mode === "safe") && (
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <label className="text-sm font-bold text-slate-700 block">Target Attendance Percentage (%)</label>
                
                <div className="flex flex-wrap gap-2">
                  {TARGET_PRESETS.map((p) => (
                    <button
                      key={p}
                      onClick={() => setTargetAttendance(p.toString())}
                      className={`px-4 py-2 rounded-xl font-bold text-sm transition-all border-2 ${
                        targetAttendance === p.toString()
                          ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                          : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {p}%
                    </button>
                  ))}
                  <input
                    type="number"
                    min="1"
                    max="100"
                    step="1"
                    value={targetAttendance}
                    onChange={(e) => setTargetAttendance(e.target.value)}
                    placeholder="Custom %"
                    className="w-24 h-[40px] bg-slate-50 border-2 border-slate-200 rounded-xl px-3 font-bold text-slate-700 outline-none focus:border-emerald-500 focus:bg-white transition-all text-sm"
                  />
                </div>
              </div>
            )}

            {mode === "project" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 block">Future Classes to Attend</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={futureAttend}
                    onChange={(e) => setFutureAttend(e.target.value)}
                    placeholder="e.g. 5"
                    className="w-full h-14 bg-emerald-50/50 border-2 border-slate-200 rounded-2xl px-4 font-bold text-slate-700 outline-none focus:border-emerald-500 focus:bg-emerald-50 transition-all text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 block">Future Classes to Miss</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={futureMiss}
                    onChange={(e) => setFutureMiss(e.target.value)}
                    placeholder="e.g. 1"
                    className="w-full h-14 bg-red-50/50 border-2 border-slate-200 rounded-2xl px-4 font-bold text-slate-700 outline-none focus:border-red-400 focus:bg-red-50 transition-all text-lg"
                  />
                </div>
              </div>
            )}
            
            {/* Action Bar */}
            <div className="flex justify-between items-center pt-4">
              <button
                onClick={handleReset}
                className="text-slate-500 hover:text-slate-800 font-bold text-sm transition-colors flex items-center gap-2"
              >
                <Icons.CheckSquare size={16} />
                Clear Form
              </button>
            </div>
          </div>

          {result && !error && (
            <div className="mt-8 space-y-6">
              
              {mode === "current" && result.percentage !== undefined && (
                <>
                  <AttendanceStatusCard 
                    percentage={result.percentage} 
                    total={result.total}
                    attended={result.attended}
                    missed={result.missed}
                  />
                  <div className="flex justify-center pt-2">
                    <ShareResultButton shareText={buildShareText(mode, { target }, result)} />
                  </div>
                </>
              )}

              {mode === "reach" && result.required && (
                <>
                  <AttendanceStatusCard 
                    percentage={result.current.percentage} 
                    total={result.current.total}
                    attended={result.current.attended}
                    missed={result.current.missed}
                    target={target}
                  />
                  
                  <div className="bg-emerald-500 rounded-3xl p-8 text-white shadow-xl flex flex-col items-center text-center">
                    <span className="text-sm font-extrabold uppercase tracking-widest text-emerald-100 mb-2">
                      Required Action
                    </span>
                    {result.required.required > 0 ? (
                      <>
                        <div className="text-5xl md:text-6xl font-black mb-4">
                          {result.required.required} <span className="text-3xl">classes</span>
                        </div>
                        <p className="text-emerald-50 font-bold max-w-lg text-lg">
                          You need to attend the next {result.required.required} consecutive classes without missing any to reach {target}%.
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="text-5xl md:text-6xl font-black mb-4">
                          Target Reached!
                        </div>
                        <p className="text-emerald-50 font-bold max-w-lg text-lg">
                          Your current attendance is {result.current.percentageFormatted}%, which is already at or above your {target}% target.
                        </p>
                      </>
                    )}
                  </div>
                  <div className="flex justify-center pt-2">
                    <ShareResultButton shareText={buildShareText(mode, { target }, result)} />
                  </div>
                </>
              )}

              {mode === "safe" && result.safe && (
                <>
                  <AttendanceStatusCard 
                    percentage={result.current.percentage} 
                    total={result.current.total}
                    attended={result.current.attended}
                    missed={result.current.missed}
                    target={target}
                  />
                  
                  <div className={`rounded-3xl p-8 text-white shadow-xl flex flex-col items-center text-center ${result.safe.safeAbsences > 0 ? 'bg-blue-600' : 'bg-red-500'}`}>
                    <span className="text-sm font-extrabold uppercase tracking-widest text-white/80 mb-2">
                      Safe Absences
                    </span>
                    {result.safe.safeAbsences > 0 ? (
                      <>
                        <div className="text-5xl md:text-6xl font-black mb-4">
                          {result.safe.safeAbsences} <span className="text-3xl">classes</span>
                        </div>
                        <p className="text-blue-50 font-bold max-w-lg text-lg">
                          You can miss up to {result.safe.safeAbsences} more {result.safe.safeAbsences === 1 ? 'class' : 'classes'} and remain at or above {target}%. Missing {result.safe.safeAbsences + 1} will drop you below the target.
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="text-5xl md:text-6xl font-black mb-4 flex items-center gap-4">
                          <Icons.AlertTriangle size={48} className="text-red-200" />
                          None
                        </div>
                        <p className="text-red-50 font-bold max-w-lg text-lg">
                          You cannot miss any more classes. You must attend your upcoming classes to recover or maintain your {target}% target.
                        </p>
                      </>
                    )}
                  </div>
                  <div className="flex justify-center pt-2">
                    <ShareResultButton shareText={buildShareText(mode, { target }, result)} />
                  </div>
                </>
              )}

              {mode === "project" && result.projection && (
                <>
                  <AttendanceStatusCard 
                    percentage={result.projection.projectedPercentage} 
                    total={result.projection.projectedTotal}
                    attended={result.projection.projectedAttended}
                    missed={result.projection.projectedMissed}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ResultCard
                      label="Current Attendance"
                      value={`${result.current.percentageFormatted}%`}
                      color="blue"
                      hideShare={true}
                    />
                    <ResultCard
                      label="Projected Attendance"
                      value={`${result.projection.projectedPercentageFormatted}%`}
                      color={result.projection.projectedPercentage >= result.current.percentage ? "emerald" : "amber"}
                      hideShare={true}
                      subtext={`After attending ${futureAttend || 0} and missing ${futureMiss || 0} classes.`}
                    />
                  </div>
                  <div className="flex justify-center pt-6">
                    <ShareResultButton shareText={buildShareText(mode, { futureAttend: futureAttend || 0, futureMiss: futureMiss || 0 }, result)} />
                  </div>
                </>
              )}
              
              <div className="text-[10px] text-slate-400 font-semibold text-center mt-4">
                Disclaimer: This calculator provides mathematical estimates only. Your institution’s official attendance rules, rounding method, approved leave policy, and subject-wise requirements may differ.
              </div>
            </div>
          )}
        </section>

        {faqs && faqs.length > 0 && (
          <FAQSection faqs={faqs} />
        )}
      </div>
    </CalculatorLayout>
  );
}
