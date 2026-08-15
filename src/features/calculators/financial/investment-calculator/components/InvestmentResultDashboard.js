import React from "react";
import { formatCurrency } from "@/features/calculators/financial/emi-calculator/utils/currency";
import { safeFormatNumber } from "../utils/calculations";
import CircularProgressRing from "@/features/calculators/student-admission/attendance-calculator/components/CircularProgressRing";

export default function InvestmentResultDashboard({ result, mode, currencyCode }) {
  if (!result || result.isEmpty) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 flex flex-col items-center justify-center text-center mb-8 h-full min-h-[300px]">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Your Investment Projection</h3>
        <p className="text-slate-500 max-w-md">Enter your investment details above to see your projected growth, total contributions, and future value over time.</p>
      </div>
    );
  }

  const StatCard = ({ label, value, highlight = false }) => (
    <div className={`p-4 rounded-xl border ${highlight ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50 border-slate-100'}`}>
      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</div>
      <div className={`text-xl md:text-2xl font-black ${highlight ? 'text-indigo-700' : 'text-slate-800'}`}>
        {value}
      </div>
    </div>
  );

  if (mode === 'goal') {
    if (!result.achievable) {
      return (
        <div className="bg-red-50 rounded-2xl shadow-sm border border-red-100 p-8 flex flex-col items-center text-center mb-8">
          <svg className="w-12 h-12 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-lg font-bold text-red-800 mb-2">Goal Unachievable via Contributions</h3>
          <p className="text-sm text-red-600 max-w-md">{result.reason}</p>
        </div>
      );
    }
    
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
          <h3 className="text-lg font-bold text-white">Target Goal Requirements</h3>
        </div>
        <div className="p-8">
          <div className="text-center mb-10">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Required Monthly Contribution</span>
            <div className="text-5xl font-black text-indigo-600 mt-2 mb-2">
              {formatCurrency(result.requiredMonthlyContribution, currencyCode)}
            </div>
            <span className="text-sm text-slate-500">To reach {formatCurrency(result.targetAmount, currencyCode)}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatCard label="Total Contributions Required" value={formatCurrency(result.totalContributions, currencyCode)} />
            <StatCard label="Estimated Growth (Profit)" value={formatCurrency(result.totalGrowth, currencyCode)} highlight={true} />
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'inflation') {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4">
          <h3 className="text-lg font-bold text-white">Inflation Adjusted Value</h3>
        </div>
        <div className="p-8">
          <div className="text-center mb-10">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Present Value Equivalent</span>
            <div className="text-5xl font-black text-emerald-600 mt-2 mb-2">
              {formatCurrency(result.presentValueEquivalent, currencyCode)}
            </div>
            <span className="text-sm text-slate-500">Purchasing power in today's money</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatCard label="Nominal Future Value" value={formatCurrency(result.nominalFutureValue, currencyCode)} />
            <StatCard label="Purchasing Power Lost" value={formatCurrency(result.purchasingPowerReduction, currencyCode)} />
          </div>
        </div>
      </div>
    );
  }

  // Standard Modes (Growth, Compound, SIP)
  const principalPercentage = result.totalInvested > 0 ? (result.totalInvested / result.futureValue) * 100 : 0;
  const growthPercentage = result.totalInvested > 0 ? (result.totalGrowth / result.futureValue) * 100 : 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4">
        <h3 className="text-lg font-bold text-white">Investment Projection</h3>
      </div>
      
      <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 md:gap-12">
        <div className="flex-1 w-full text-center md:text-left">
          <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Estimated Future Value</span>
          <div className="text-5xl md:text-6xl font-black text-indigo-600 mt-2 mb-4">
            {formatCurrency(result.futureValue, currencyCode)}
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 mb-1 justify-center md:justify-start">
                <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Invested</span>
              </div>
              <div className="text-xl font-bold text-slate-800">{formatCurrency(result.totalInvested, currencyCode)}</div>
            </div>
            
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
              <div className="flex items-center gap-2 mb-1 justify-center md:justify-start">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Growth</span>
              </div>
              <div className="text-xl font-bold text-emerald-700">{formatCurrency(result.totalGrowth, currencyCode)}</div>
            </div>
          </div>
        </div>
        <div className="w-full max-w-[220px] flex-shrink-0 flex flex-col items-center">
          <div className="flex flex-col items-center mb-6">
            <CircularProgressRing 
              percentage={growthPercentage} 
              size={180}
              colorClass="text-emerald-500" 
              trackColorClass="text-slate-200"
              strokeWidth={14} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
