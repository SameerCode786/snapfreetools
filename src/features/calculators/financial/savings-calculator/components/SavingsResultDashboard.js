import React from "react";
import { Icons } from "@/lib/lucide-icons";
import { safeFormatNumber } from "../utils/calculations";
import CircularProgressRing from "@/features/calculators/student-admission/attendance-calculator/components/CircularProgressRing";

export default function SavingsResultDashboard({ result, mode, currencySymbol }) {
  if (!result || result.isEmpty || !result.isValid) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center flex flex-col items-center justify-center min-h-[300px] h-full">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
          <Icons.Calculator size={32} className="text-slate-300" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Enter Savings Details</h3>
        <p className="text-slate-500 max-w-md mx-auto">
          {mode === 'emergency' 
            ? "Enter your monthly expenses to calculate your recommended emergency fund size."
            : "Enter your savings details to see your projected growth, interest earned, contributions, and timeline."}
        </p>
      </div>
    );
  }

  const { futureValue, totalContributions, totalInterest, growthPercentage, isReached, requiredMonthly, targetFund, currentFund, remaining, currentCoverageMonths, progressPercentage, months, years } = result;

  const MetricCard = ({ label, value, subLabel, highlight = false, isCurrency = true }) => (
    <div className={`p-5 rounded-xl ${highlight ? 'bg-indigo-50 border border-indigo-100' : 'bg-slate-50 border border-slate-100'}`}>
      <div className="text-sm font-semibold text-slate-500 mb-1">{label}</div>
      <div className={`text-2xl lg:text-3xl font-black ${highlight ? 'text-indigo-600' : 'text-slate-800'}`}>
        {isCurrency ? currencySymbol : ''}{safeFormatNumber(value, 0)}
      </div>
      {subLabel && <div className="text-xs text-slate-400 mt-1 font-medium">{subLabel}</div>}
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-full">
      <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex items-center gap-2">
        <Icons.PieChart size={20} className="text-indigo-500" />
        <h2 className="text-lg font-bold text-slate-800">Savings Analysis</h2>
      </div>

      <div className="p-6">
        {mode === 'goal' && (
          <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">
                {isReached ? "Goal Reached!" : "Time to Reach Goal"}
              </h3>
              <p className="text-sm text-slate-500">
                {isReached 
                  ? "You have already reached or exceeded your target savings amount." 
                  : `It will take approximately ${years} years to reach your goal.`}
              </p>
            </div>
            {!isReached && (
              <div className="text-center bg-white py-2 px-6 rounded-lg border border-slate-200 shadow-sm shrink-0">
                <span className="block text-2xl font-black text-indigo-600">{months}</span>
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Months</span>
              </div>
            )}
          </div>
        )}

        {mode === 'required' && (
          <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">Required Monthly Savings</h3>
              <p className="text-sm text-slate-500">To reach your goal in {safeFormatNumber(result.totalMonths, 0)} months.</p>
            </div>
            <div className="text-center bg-white py-2 px-6 rounded-lg border border-slate-200 shadow-sm shrink-0">
              <span className="block text-2xl font-black text-indigo-600">{currencySymbol}{safeFormatNumber(requiredMonthly, 0)}</span>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Per Month</span>
            </div>
          </div>
        )}

        {mode === 'emergency' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <MetricCard label="Recommended Target" value={targetFund} highlight />
            <MetricCard label="Current Fund" value={currentFund} />
            <MetricCard label="Shortfall / Gap" value={remaining} />
            <MetricCard label="Months Covered" value={currentCoverageMonths} isCurrency={false} subLabel="Based on monthly expenses" />
          </div>
        )}

        {mode !== 'emergency' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <MetricCard label="Future Savings" value={futureValue} highlight />
            <MetricCard label="Total Contributions" value={totalContributions} />
            <MetricCard label="Interest Earned" value={totalInterest} />
            <MetricCard label="Effective Growth" value={growthPercentage} isCurrency={false} subLabel="% of total contributions" />
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mt-8 border-t border-slate-100 pt-8">
          <div className="w-full max-w-[220px] flex-shrink-0 flex flex-col items-center">
            <CircularProgressRing 
              percentage={mode === 'emergency' ? progressPercentage : growthPercentage} 
              size={180}
              strokeWidth={16}
              primaryColor="#4f46e5"
              secondaryColor="#f1f5f9"
            />
            <div className="mt-4 text-center">
              <span className="block text-3xl font-black text-slate-800">
                {safeFormatNumber(mode === 'emergency' ? progressPercentage : growthPercentage, 1)}%
              </span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {mode === 'emergency' ? 'Funded' : 'Growth'}
              </span>
            </div>
          </div>
          
          <div className="flex-1 w-full flex flex-col gap-3">
            {mode === 'emergency' ? (
              <>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                    <span className="text-sm font-semibold text-slate-600">Target</span>
                  </div>
                  <span className="font-bold text-slate-800">{currencySymbol}{safeFormatNumber(targetFund, 0)}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                    <span className="text-sm font-semibold text-slate-600">Saved</span>
                  </div>
                  <span className="font-bold text-slate-800">{currencySymbol}{safeFormatNumber(currentFund, 0)}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                    <span className="text-sm font-semibold text-slate-600">Contributions</span>
                  </div>
                  <span className="font-bold text-slate-800">{currencySymbol}{safeFormatNumber(totalContributions, 0)}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                    <span className="text-sm font-semibold text-slate-600">Interest Earned</span>
                  </div>
                  <span className="font-bold text-slate-800">{currencySymbol}{safeFormatNumber(totalInterest, 0)}</span>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
