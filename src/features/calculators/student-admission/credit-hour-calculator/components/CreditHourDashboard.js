import CircularProgressRing from "@/features/calculators/student-admission/attendance-calculator/components/CircularProgressRing";
import { BookOpen, CalendarRange, GraduationCap, CheckCircle2 } from "lucide-react";

export default function CreditHourDashboard({ mode, result, simulation }) {
  const activeResult = simulation || result;

  if (activeResult.isEmpty) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 mb-8 flex flex-col min-h-0">
      <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-b border-slate-200 dark:border-slate-800">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          {mode === "degree" ? (
            <><GraduationCap className="w-5 h-5 text-indigo-500" /> Degree Progress Result</>
          ) : mode === "semester" ? (
            <><CalendarRange className="w-5 h-5 text-emerald-500" /> Semester Workload</>
          ) : (
            <><BookOpen className="w-5 h-5 text-blue-500" /> Total Credit Hours</>
          )}
        </h3>
      </div>
      
      <div className="p-6">
        {(mode === "core" || mode === "semester") && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800">
            <StatCard 
              label={mode === "semester" ? "Semester Credits" : "Total Credits"}
              value={activeResult.totalCredits.toFixed(1).replace(/\.0$/, '')}
              subtext={`${activeResult.numCourses} Courses`}
            />
            <StatCard 
              label="Avg. Credits / Course"
              value={activeResult.averageCredits.toFixed(1)}
            />
            {activeResult.workload && (
              <div className="flex flex-col items-center justify-center p-4 sm:p-0">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Workload Level</span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${activeResult.workload.bg} ${activeResult.workload.color} border border-opacity-50 border-current`}>
                  {activeResult.workload.label}
                </span>
              </div>
            )}
          </div>
        )}

        {mode === "degree" && (
          <div className="flex flex-col xl:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <CircularProgressRing 
                percentage={activeResult.completionPercentage} 
                size={160} 
                strokeWidth={14} 
              />
            </div>
            
            <div className="flex-grow w-full">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-x divide-slate-100 dark:divide-slate-800 mb-6">
                <StatCard label="Total Earned" value={activeResult.totalWithCurrent} />
                <StatCard label="Required" value={activeResult.target} />
                <StatCard label="Remaining" value={activeResult.remainingCredits} />
                <StatCard 
                  label="Avg. Required" 
                  value={activeResult.requiredAveragePerSemester > 0 ? activeResult.requiredAveragePerSemester.toFixed(1) : "0"} 
                />
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
                <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${activeResult.completionPercentage >= 100 ? 'text-emerald-500' : 'text-slate-400'}`} />
                <div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                    {activeResult.completionPercentage >= 100 
                      ? "Degree requirements completed!" 
                      : `You have completed ${activeResult.completionPercentage.toFixed(1)}% of your degree.`}
                  </p>
                  {activeResult.remainingCredits > 0 && activeResult.remainingSemesters > 0 && (
                    <p className="text-xs text-slate-500 mt-1">
                      Taking ~{activeResult.requiredAveragePerSemester.toFixed(1)} credits across {activeResult.remainingSemesters} remaining semesters.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {simulation && (
        <div className="bg-amber-50 px-6 py-3 border-t border-amber-100 text-sm font-medium text-amber-800 text-center flex justify-center items-center gap-2 mt-auto">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
          Viewing What-If Simulation
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, subtext }) {
  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-0">
      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">{label}</span>
      <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">{value}</span>
      {subtext && <span className="text-xs text-slate-400 mt-1">{subtext}</span>}
    </div>
  );
}
