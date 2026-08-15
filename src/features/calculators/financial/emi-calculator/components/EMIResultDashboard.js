import CircularProgressRing from "@/features/calculators/student-admission/attendance-calculator/components/CircularProgressRing";
import { formatCurrency } from "../utils/currency";
import { safeFormatNumber } from "../utils/validation";

export default function EMIResultDashboard({ result, mode, currencyCode }) {
  if (!result || result.isEmpty) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8 p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">Your EMI Results</h3>
        <p className="text-sm text-slate-500 max-w-sm">Enter your loan details above to calculate your estimated payment and total loan cost.</p>
      </div>
    );
  }

  const StatCard = ({ label, value, subtext }) => (
    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col items-center text-center">
      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{label}</span>
      <span className="text-xl sm:text-2xl font-black text-slate-800">{value}</span>
      {subtext && <span className="text-xs font-medium text-slate-400 mt-1">{subtext}</span>}
    </div>
  );

  if (mode === 'affordability') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-5">
          <h3 className="text-lg font-bold text-white">Affordability Estimate</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard 
              label="Max Monthly EMI" 
              value={formatCurrency(result.maxEmi, currencyCode)} 
            />
            <StatCard 
              label="Est. Affordable Loan" 
              value={formatCurrency(result.affordableLoan, currencyCode)} 
            />
            <StatCard 
              label="Estimated DTI" 
              value={`${safeFormatNumber(result.dti, 1)}%`} 
              subtext={result.isAffordable ? "Within limits" : "Exceeds target"}
            />
            <StatCard 
              label="Remaining Monthly Income" 
              value={formatCurrency(result.remainingIncome, currencyCode)} 
            />
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'reverse') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-5">
          <h3 className="text-lg font-bold text-white">Reverse EMI Estimate</h3>
        </div>
        <div className="p-6">
          <div className="text-center mb-8">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Estimated Maximum Loan</span>
            <div className="text-4xl md:text-5xl font-black text-indigo-600 mt-2 mb-2">
              {formatCurrency(result.maxLoan, currencyCode)}
            </div>
            <span className="text-sm text-slate-500">Based on an EMI of {formatCurrency(result.emi, currencyCode)}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatCard 
              label="Total Interest" 
              value={formatCurrency(result.totalInterest, currencyCode)} 
            />
            <StatCard 
              label="Total Amount Payable" 
              value={formatCurrency(result.totalPayment, currencyCode)} 
            />
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'required') {
    if (!result.achievable) {
      return (
        <div className="bg-red-50 rounded-xl shadow-sm border border-red-200 mb-8 p-8 flex flex-col items-center text-center">
          <svg className="w-12 h-12 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-lg font-bold text-red-800 mb-2">Unachievable Goal</h3>
          <p className="text-sm text-red-600 max-w-md">{result.reason}</p>
        </div>
      );
    }
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-5">
          <h3 className="text-lg font-bold text-white">Target Loan Required Tenure</h3>
        </div>
        <div className="p-6">
          <div className="text-center mb-8">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Required Loan Tenure</span>
            <div className="text-4xl md:text-5xl font-black text-indigo-600 mt-2 mb-2">
              {safeFormatNumber(result.requiredYears, 1)} <span className="text-2xl text-slate-500">Years</span>
            </div>
            <span className="text-sm text-slate-500">({safeFormatNumber(result.requiredPeriods, 0)} payments)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatCard 
              label="Total Interest" 
              value={formatCurrency(result.totalInterest, currencyCode)} 
            />
            <StatCard 
              label="Total Amount Payable" 
              value={formatCurrency(result.totalPayment, currencyCode)} 
            />
          </div>
        </div>
      </div>
    );
  }

  // Standard Output (Standard mode and Prepayment base)
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8 overflow-hidden">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-5">
        <h3 className="text-lg font-bold text-white">Repayment Summary</h3>
      </div>
      
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
          
          <div className="flex-1 w-full text-center lg:text-left">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Monthly EMI</span>
            <div className="text-5xl font-black text-indigo-600 mt-2 mb-6">
              {formatCurrency(result.monthlyPayment, currencyCode)}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Interest</span>
                <span className="block text-xl font-bold text-slate-800">{formatCurrency(result.totalInterest, currencyCode)}</span>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Payable</span>
                <span className="block text-xl font-bold text-slate-800">{formatCurrency(result.totalPayment, currencyCode)}</span>
              </div>
            </div>
          </div>
          
          <div className="w-full max-w-[240px] flex-shrink-0 flex flex-col items-center">
            <div className="flex flex-col items-center mb-6">
              <CircularProgressRing 
                percentage={result.principalPercentage || 0} 
                size={140}
                colorClass="text-emerald-500" 
                trackColorClass="text-emerald-50"
                strokeWidth={12} 
              />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-4">Principal</span>
            </div>
            
            <div className="w-full bg-slate-50 rounded-xl p-4 border border-slate-100">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 text-center">Cost Breakdown</h4>
              <div className="space-y-2 text-sm text-slate-700 font-medium">
                <div className="flex justify-between">
                  <span>Principal ({safeFormatNumber(result.principalPercentage, 1)}%)</span>
                  <span>{formatCurrency(result.principal, currencyCode)}</span>
                </div>
                <div className="flex justify-between font-semibold border-t border-slate-200 pt-2 text-indigo-700">
                  <span>Interest ({safeFormatNumber(result.interestPercentage, 1)}%)</span>
                  <span>{formatCurrency(result.totalInterest, currencyCode)}</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
