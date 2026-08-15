import React from "react";
import { formatCurrency } from "@/features/calculators/financial/emi-calculator/utils/currency";

export default function InvestmentComparison({ resultA, resultB, currencyCode }) {
  if (!resultA || resultA.isEmpty || !resultB || resultB.isEmpty) return null;

  const diffFV = resultA.futureValue - resultB.futureValue;
  const winner = diffFV > 0 ? 'A' : diffFV < 0 ? 'B' : 'Tie';
  
  const StatRow = ({ label, valA, valB, format = 'currency', highlight = false }) => {
    let dispA = valA;
    let dispB = valB;
    
    if (format === 'currency') {
      dispA = formatCurrency(valA, currencyCode);
      dispB = formatCurrency(valB, currencyCode);
    } else if (format === 'percent') {
      dispA = `${Number(valA).toFixed(2)}%`;
      dispB = `${Number(valB).toFixed(2)}%`;
    } else if (format === 'years') {
      dispA = `${valA} years`;
      dispB = `${valB} years`;
    }
    
    return (
      <div className={`flex items-center justify-between py-4 border-b border-slate-100 ${highlight ? 'bg-indigo-50/50 -mx-6 px-6' : ''}`}>
        <div className="w-1/3 font-semibold text-slate-700 text-sm md:text-base">{label}</div>
        <div className={`w-1/3 text-right font-bold ${highlight && winner === 'A' ? 'text-emerald-600' : 'text-slate-800'} text-sm md:text-base`}>{dispA}</div>
        <div className={`w-1/3 text-right font-bold ${highlight && winner === 'B' ? 'text-emerald-600' : 'text-slate-800'} text-sm md:text-base`}>{dispB}</div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4">
        <h3 className="text-lg font-bold text-white">Scenario Comparison</h3>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between pb-4 border-b-2 border-slate-200 mb-2">
          <div className="w-1/3"></div>
          <div className="w-1/3 text-right">
            <span className="inline-block bg-slate-100 text-slate-700 font-bold px-3 py-1 rounded-lg text-sm">Scenario A</span>
          </div>
          <div className="w-1/3 text-right">
            <span className="inline-block bg-slate-100 text-slate-700 font-bold px-3 py-1 rounded-lg text-sm">Scenario B</span>
          </div>
        </div>
        
        <StatRow label="Initial Investment" valA={resultA.totalInvested - resultA.totalContributions} valB={resultB.totalInvested - resultB.totalContributions} />
        <StatRow label="Monthly Contribution" valA={resultA.monthlyContribution} valB={resultB.monthlyContribution} />
        <StatRow label="Expected Return" valA={resultA.annualReturn} valB={resultB.annualReturn} format="percent" />
        <StatRow label="Time Horizon" valA={resultA.investmentPeriod} valB={resultB.investmentPeriod} format="years" />
        
        <div className="mt-6"></div>
        <StatRow label="Total Invested" valA={resultA.totalInvested} valB={resultB.totalInvested} />
        <StatRow label="Estimated Growth" valA={resultA.totalGrowth} valB={resultB.totalGrowth} />
        <StatRow label="Future Value" valA={resultA.futureValue} valB={resultB.futureValue} highlight={true} />
        
        {winner !== 'Tie' && (
          <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start gap-3">
            <div className="text-emerald-500 mt-0.5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-800">
                Scenario {winner} projects a higher future value by {formatCurrency(Math.abs(diffFV), currencyCode)}.
              </p>
              <p className="text-xs text-emerald-600 mt-1">
                Note: This is a purely mathematical projection. Higher returns typically require taking on more risk.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
