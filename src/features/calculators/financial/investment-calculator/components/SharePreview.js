import React from "react";
import { ShareResultCard } from "@/components/share";
import { formatCurrency } from "@/features/calculators/financial/emi-calculator/utils/currency";

export default function SharePreview({ result, resultB, mode, currencyCode }) {
  if (!result || result.isEmpty || (mode === 'comparison' && (!resultB || resultB.isEmpty)) || (mode === 'goal' && !result.achievable)) {
    return null;
  }

  const getCustomShareText = () => {
    let text = `Check out this free Investment Calculator on SnapFreeTools:\nhttps://www.snapfreetools.com/investment-calculator\n\nMy Result:\n`;
    
    if (mode === 'goal') {
      text += `• Target Goal: ${formatCurrency(result.targetAmount, currencyCode)}\n`;
      text += `• Initial Investment: ${formatCurrency(result.initialInvestment, currencyCode)}\n`;
      text += `• Required Monthly Contribution: ${formatCurrency(result.requiredMonthlyContribution, currencyCode)}\n`;
    } else if (mode === 'inflation') {
      text += `• Nominal Future Value: ${formatCurrency(result.nominalFutureValue, currencyCode)}\n`;
      text += `• Inflation Rate: ${result.inflationRate}%\n`;
      text += `• Present Value Equivalent: ${formatCurrency(result.presentValueEquivalent, currencyCode)}\n`;
    } else if (mode === 'comparison' && resultB) {
      text += `• Scenario A Future Value: ${formatCurrency(result.futureValue, currencyCode)}\n`;
      text += `• Scenario B Future Value: ${formatCurrency(resultB.futureValue, currencyCode)}\n`;
    } else {
      text += `• Total Invested: ${formatCurrency(result.totalInvested, currencyCode)}\n`;
      text += `• Total Growth: ${formatCurrency(result.totalGrowth, currencyCode)}\n`;
      text += `• Future Value: ${formatCurrency(result.futureValue, currencyCode)}\n`;
    }
    
    text += `\nTry it yourself:\nhttps://www.snapfreetools.com/investment-calculator`;
    return text;
  };

  return (
    <ShareResultCard 
      toolName="Investment Calculator"
      toolUrl="investment-calculator"
      result={result}
      customFormatter={getCustomShareText}
    />
  );
}
