import { ShareResultCard } from "@/components/share";
import { formatCurrency } from "../utils/currency";

export default function SharePreview({ result, resultB, mode, currencyCode }) {
  if (!result || result.isEmpty || (mode === 'comparison' && (!resultB || resultB.isEmpty)) || (mode === 'required' && !result.achievable)) {
    return null;
  }

  const getCustomShareText = () => {
    let text = `Check out this free EMI Calculator on SnapFreeTools:\nhttps://www.snapfreetools.com/emi-calculator\n\nMy Result:\n`;
    
    if (mode === 'affordability') {
      text += `• Max Affordable EMI: ${formatCurrency(result.maxEmi, currencyCode)}\n`;
      text += `• Estimated Loan: ${formatCurrency(result.affordableLoan, currencyCode)}\n`;
    } else if (mode === 'reverse') {
      text += `• Target EMI: ${formatCurrency(result.emi, currencyCode)}\n`;
      text += `• Max Possible Loan: ${formatCurrency(result.maxLoan, currencyCode)}\n`;
    } else if (mode === 'required') {
      text += `• Target Loan Amount: ${formatCurrency(result.totalPayment - result.totalInterest, currencyCode)}\n`;
      text += `• Max Affordable EMI: ${formatCurrency(result.emi, currencyCode)}\n`;
      text += `• Required Tenure: ${result.requiredYears.toFixed(1)} years\n`;
    } else if (mode === 'comparison' && resultB) {
      text += `• Loan A EMI: ${formatCurrency(result.monthlyPayment, currencyCode)}\n`;
      text += `• Loan A Total Interest: ${formatCurrency(result.totalInterest, currencyCode)}\n`;
      text += `• Loan B EMI: ${formatCurrency(resultB.monthlyPayment, currencyCode)}\n`;
      text += `• Loan B Total Interest: ${formatCurrency(resultB.totalInterest, currencyCode)}\n`;
    } else if (mode === 'prepayment') {
      text += `• Original EMI: ${formatCurrency(result.monthlyPayment, currencyCode)}\n`;
      text += `• Original Total Interest: ${formatCurrency(result.totalInterest, currencyCode)}\n`;
    } else {
      text += `• Loan Amount: ${formatCurrency(result.principal, currencyCode)}\n`;
      text += `• Interest Rate: ${result.annualRate}%\n`;
      text += `• Tenure: ${result.numberOfPayments / result.periodsPerYear} years\n`;
      text += `• Monthly EMI: ${formatCurrency(result.monthlyPayment, currencyCode)}\n`;
      text += `• Total Interest: ${formatCurrency(result.totalInterest, currencyCode)}\n`;
      text += `• Total Payable: ${formatCurrency(result.totalPayment, currencyCode)}\n`;
    }
    
    text += `\nTry it yourself:\nhttps://www.snapfreetools.com/emi-calculator`;
    return text;
  };

  return (
    <ShareResultCard 
      toolName="EMI Calculator"
      toolUrl="emi-calculator"
      result={result}
      customFormatter={getCustomShareText}
    />
  );
}
