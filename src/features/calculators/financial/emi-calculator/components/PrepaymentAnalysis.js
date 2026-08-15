import { formatCurrency } from "../utils/currency";
import { safeFormatNumber } from "../utils/validation";

export default function PrepaymentAnalysis({ baseResult, prepaymentResult, currencyCode }) {
  if (!baseResult || baseResult.isEmpty) return null;
  
  const noImpact = !prepaymentResult || prepaymentResult.isEmpty;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8 overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 px-6 py-5">
        <h3 className="text-lg font-bold text-white">Prepayment Impact</h3>
      </div>
      
      {noImpact ? (
        <div className="p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Prepayment Analysis</h3>
          <p className="text-sm text-slate-500 max-w-sm">Enter an extra monthly payment or one-time prepayment amount to see how much interest and time you could save.</p>
        </div>
      ) : (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            
            {/* Before */}
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-lg border border-slate-100">
                <span className="font-bold text-slate-600">Original Plan</span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-end border-b border-slate-100 pb-2">
                  <span className="text-sm font-bold text-slate-500 uppercase">Monthly EMI</span>
                  <span className="text-xl font-bold text-slate-800">{formatCurrency(baseResult.monthlyPayment, currencyCode)}</span>
                </div>
                <div className="flex justify-between items-end border-b border-slate-100 pb-2">
                  <span className="text-sm font-bold text-slate-500 uppercase">Total Interest</span>
                  <span className="text-xl font-bold text-slate-800">{formatCurrency(baseResult.totalInterest, currencyCode)}</span>
                </div>
                <div className="flex justify-between items-end border-b border-slate-100 pb-2">
                  <span className="text-sm font-bold text-slate-500 uppercase">Total Time</span>
                  <span className="text-xl font-bold text-slate-800">{safeFormatNumber(baseResult.numberOfPayments, 0)} months</span>
                </div>
              </div>
            </div>
            
            {/* After */}
            <div className="pt-6 md:pt-0 md:pl-8 space-y-6">
              <div className="flex items-center justify-between bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                <span className="font-bold text-emerald-700">With Prepayments</span>
                <span className="text-xs font-bold bg-emerald-200 text-emerald-800 px-2 py-1 rounded-md">New Plan</span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-end border-b border-slate-100 pb-2">
                  <span className="text-sm font-bold text-slate-500 uppercase">Total Interest</span>
                  <span className="text-xl font-bold text-emerald-600">{formatCurrency(prepaymentResult.totalInterest, currencyCode)}</span>
                </div>
                <div className="flex justify-between items-end border-b border-slate-100 pb-2">
                  <span className="text-sm font-bold text-slate-500 uppercase">New Time</span>
                  <span className="text-xl font-bold text-emerald-600">{safeFormatNumber(prepaymentResult.numberOfPayments, 0)} months</span>
                </div>
              </div>
              
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-xs font-bold text-emerald-600/70 uppercase mb-1">Interest Saved</span>
                    <span className="block text-2xl font-black text-emerald-700">
                      {formatCurrency(baseResult.totalInterest - prepaymentResult.totalInterest, currencyCode)}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-emerald-600/70 uppercase mb-1">Time Saved</span>
                    <span className="block text-2xl font-black text-emerald-700">
                      {safeFormatNumber(baseResult.numberOfPayments - prepaymentResult.numberOfPayments, 0)} mos
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-400">
              Disclaimer: Actual prepayment rules, penalties, and lender policies may vary. Check with your lender before making extra payments.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
