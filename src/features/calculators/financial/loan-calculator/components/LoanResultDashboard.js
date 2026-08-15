import CircularProgressRing from "@/features/calculators/student-admission/attendance-calculator/components/CircularProgressRing";
import { formatCurrency } from "../utils/currency";
import { safeFormatNumber } from "../utils/validation";

export default function LoanResultDashboard({ result, mode, currencyCode }) {
  if (!result || result.isEmpty) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8 p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">Your Loan Results</h3>
        <p className="text-sm text-slate-500 max-w-sm">Enter your loan details above to calculate your estimated payment, total interest, and repayment schedule.</p>
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
              label="Max Monthly Payment" 
              value={formatCurrency(result.maxMonthlyPayment, currencyCode)} 
            />
            <StatCard 
              label="Est. Max Loan Amount" 
              value={formatCurrency(result.maxLoanAmount, currencyCode)} 
            />
            <StatCard 
              label="Current DTI" 
              value={`${safeFormatNumber(result.currentDti, 1)}%`} 
            />
            <StatCard 
              label="Est. New DTI" 
              value={`${safeFormatNumber(result.estimatedDti, 1)}%`} 
              subtext={result.isAffordable ? "Within limits" : "Exceeds target"}
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
          <h3 className="text-lg font-bold text-white">Reverse Calculation Result</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard 
              label="Est. Loan Amount" 
              value={formatCurrency(result.maxLoanAmount, currencyCode)} 
            />
            <StatCard 
              label="Total Interest" 
              value={formatCurrency(result.totalInterest, currencyCode)} 
            />
            <StatCard 
              label="Total Paid" 
              value={formatCurrency(result.totalRepayment, currencyCode)} 
            />
          </div>
        </div>
      </div>
    );
  }

  // Standard or Extra Payment Mode
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8 overflow-hidden flex flex-col">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
        <h3 className="text-lg font-bold text-slate-800">
          {mode === 'extra' ? 'Extra Payment Analysis' : 'Loan Summary'}
        </h3>
      </div>
      
      <div className="p-6">
        <div className="flex flex-col items-center gap-8">
          <div className="flex-shrink-0 flex flex-col items-center">
            <CircularProgressRing 
              percentage={result.principalPercentage || 0} 
              size={180} 
              strokeWidth={16} 
            />
            <div className="mt-4 flex gap-4 text-sm font-medium text-slate-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                Principal
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                Interest
              </div>
            </div>
          </div>
          
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <StatCard 
                label={mode === 'extra' ? "New Regular Payment" : "Regular Payment"}
                value={formatCurrency(result.actualPayment || result.regularPayment, currencyCode)} 
              />
              <StatCard 
                label="Total Interest" 
                value={formatCurrency(result.totalInterest, currencyCode)} 
              />
              <StatCard 
                label="Total Amount Paid" 
                value={formatCurrency(result.totalAmountPaid, currencyCode)} 
              />
              <StatCard 
                label="Total Payments" 
                value={result.totalPeriodsActual} 
                subtext={mode === 'extra' && result.totalPeriodsActual < result.originalPeriods 
                  ? `Saved ${result.originalPeriods - result.totalPeriodsActual} payments` 
                  : undefined}
              />
            </div>
            
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Cost Breakdown</h4>
              <div className="space-y-2 text-sm text-slate-700 font-medium">
                <div className="flex justify-between">
                  <span>Principal ({safeFormatNumber(result.principalPercentage, 1)}%)</span>
                  <span>{formatCurrency(result.principal, currencyCode)}</span>
                </div>
                <div className="flex justify-between font-semibold border-t border-slate-200 pt-2">
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
