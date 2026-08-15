import React from "react";
import { formatCurrency } from "@/features/calculators/financial/emi-calculator/utils/currency";

export default function InvestmentInsights({ result, mode, currencyCode }) {
  if (!result || result.isEmpty || mode === 'comparison' || mode === 'goal' || mode === 'inflation') return null;

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 md:p-8 border border-indigo-100 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <h3 className="text-lg font-bold text-slate-800">Key Insights</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="text-indigo-600 mb-2">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h4 className="font-bold text-slate-800 mb-1">Profit Ratio</h4>
          <p className="text-sm text-slate-600">
            <strong>{Number(result.growthPercentage).toFixed(1)}%</strong> of your final projected value comes entirely from investment growth, while {Number(100 - result.growthPercentage).toFixed(1)}% comes from your direct contributions.
          </p>
        </div>
        
        {result.monthlyContribution > 0 && (
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
            <div className="text-emerald-500 mb-2">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </div>
            <h4 className="font-bold text-slate-800 mb-1">The Power of Consistency</h4>
            <p className="text-sm text-slate-600">
              By contributing {formatCurrency(result.monthlyContribution, currencyCode)} monthly, you add {formatCurrency(result.totalContributions, currencyCode)} to your principal over {result.investmentPeriod} years, massively accelerating compound growth.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
