import React from "react";
import ShareResultButton from "@/features/calculators/student-admission/attendance-calculator/components/ShareResultButton";
import { formatCurrency } from "@/features/calculators/financial/emi-calculator/utils/currency";

export default function SharePreview({ result, resultB, mode, currencyCode }) {
  if (!result || result.isEmpty || (mode === 'comparison' && (!resultB || resultB.isEmpty)) || (mode === 'goal' && !result.achievable)) {
    return (
      <button 
        disabled 
        className="w-full bg-slate-100 text-slate-400 font-bold py-3.5 px-6 rounded-xl border border-slate-200 flex items-center justify-center gap-2 cursor-not-allowed"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
        Share Result
      </button>
    );
  }

  const getShareText = () => {
    let text = `Investment Calculator Result\n\n`;
    
    if (mode === 'goal') {
      text += `Target Goal: ${formatCurrency(result.targetAmount, currencyCode)}\n`;
      text += `Initial Investment: ${formatCurrency(result.initialInvestment, currencyCode)}\n`;
      text += `Required Monthly Contribution: ${formatCurrency(result.requiredMonthlyContribution, currencyCode)}\n`;
    } else if (mode === 'inflation') {
      text += `Nominal Future Value: ${formatCurrency(result.nominalFutureValue, currencyCode)}\n`;
      text += `Inflation Rate: ${result.inflationRate}%\n`;
      text += `Present Value Equivalent: ${formatCurrency(result.presentValueEquivalent, currencyCode)}\n`;
    } else if (mode === 'comparison' && resultB) {
      text += `Scenario A Future Value: ${formatCurrency(result.futureValue, currencyCode)}\n`;
      text += `Scenario B Future Value: ${formatCurrency(resultB.futureValue, currencyCode)}\n`;
    } else {
      text += `Total Invested: ${formatCurrency(result.totalInvested, currencyCode)}\n`;
      text += `Total Growth: ${formatCurrency(result.totalGrowth, currencyCode)}\n`;
      text += `Future Value: ${formatCurrency(result.futureValue, currencyCode)}\n`;
    }
    
    text += `\nCalculated with SnapFreeTools`;
    return text;
  };

  return (
    <ShareResultButton 
      title="My Investment Calculation"
      shareText={getShareText()}
      url="https://www.snapfreetools.com/investment-calculator"
      shortText="I calculated my investment growth projection using SnapFreeTools!"
    />
  );
}
