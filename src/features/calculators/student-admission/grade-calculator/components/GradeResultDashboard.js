import React from "react";
import CircularProgressRing from "@/features/calculators/student-admission/attendance-calculator/components/CircularProgressRing";
import SmartProgressBar from "@/features/calculators/student-admission/attendance-calculator/components/SmartProgressBar";

export default function GradeResultDashboard({ result, mode, recommendation }) {
  if (!result) return null;

  const isPass = result.isPass;
  const statusColor = isPass ? "text-emerald-500" : "text-rose-500";
  const statusBg = isPass ? "bg-emerald-50" : "bg-rose-50";

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden">
        {/* Pass/Fail Badge */}
        <div className={`absolute top-6 right-6 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase ${statusBg} ${statusColor}`}>
          {isPass ? "Pass" : "Fail"}
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col 2xl:flex-row items-center gap-8">
          <div className="flex-shrink-0">
            <CircularProgressRing 
              percentage={result.percentage} 
              size={140} 
              strokeWidth={12}
              colorClass={statusColor}
              ariaLabel={`Grade is ${result.letterGrade} at ${result.percentage}%`}
            />
          </div>

          <div className="flex-1 text-center sm:text-left lg:text-center 2xl:text-left space-y-4 w-full">
            <div>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-1">Your Grade</p>
              <div className="flex items-baseline justify-center sm:justify-start lg:justify-center 2xl:justify-start gap-3">
                <h2 className="text-5xl font-black text-slate-800 tracking-tight">
                  {result.letterGrade}
                </h2>
                {result.gpa !== undefined && (
                  <span className="text-xl font-bold text-slate-400">
                    ({result.gpa.toFixed(1)} GPA)
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap justify-center sm:justify-start lg:justify-center 2xl:justify-start gap-x-8 gap-y-4 pt-4 border-t border-slate-100">
              {(mode === "single" || mode === "multiple") && (
                <div>
                  <p className="text-slate-400 font-semibold text-xs uppercase tracking-wider mb-1">Obtained / Total</p>
                  <p className="text-lg font-bold text-slate-700">
                    {result.marksObtained ?? 0} 
                    <span className="text-slate-400 font-medium mx-1">/</span> 
                    {result.totalMarks ?? 0}
                  </p>
                </div>
              )}
              {mode === "single" && (
                <div>
                  <p className="text-slate-400 font-semibold text-xs uppercase tracking-wider mb-1">Marks Lost</p>
                  <p className="text-lg font-bold text-rose-500">{result.marksLost}</p>
                </div>
              )}
              {mode === "multiple" && (
                <div>
                  <p className="text-slate-400 font-semibold text-xs uppercase tracking-wider mb-1">Subjects</p>
                  <p className="text-lg font-bold text-slate-700">{result.subjectCount}</p>
                </div>
              )}
              {mode === "weighted" && (
                <div>
                  <p className="text-slate-400 font-semibold text-xs uppercase tracking-wider mb-1">Total Weight</p>
                  <p className="text-lg font-bold text-slate-700">{result.totalWeight.toFixed(1)}%</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {recommendation && (
        <div className={`border rounded-2xl p-6 ${recommendation.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-amber-50 border-amber-100 text-amber-800'}`}>
          <div className="flex flex-col gap-4">
            <p className="font-semibold text-[15px] leading-relaxed">
              {recommendation.message}
            </p>
            {recommendation.nextGrade && (
              <div className="pt-4 border-t border-amber-200/50">
                <SmartProgressBar 
                  currentPercentage={result.percentage}
                  targetPercentage={recommendation.nextGradeMin}
                  showTarget={true}
                  colorClass={isPass ? "bg-emerald-500" : "bg-rose-500"}
                />
                {recommendation.marksNeeded !== null && recommendation.marksNeeded > 0 && (
                  <p className="text-sm font-medium mt-4 text-amber-700/80">
                    You need approximately <strong className="text-amber-800">{recommendation.marksNeeded}</strong> more marks to reach a {recommendation.nextGrade}.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
