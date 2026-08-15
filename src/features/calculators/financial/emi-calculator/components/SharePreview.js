import ShareResultButton from "@/features/calculators/student-admission/attendance-calculator/components/ShareResultButton";
import { formatCurrency } from "../utils/currency";

export default function SharePreview({ result, resultB, mode, currencyCode }) {
  if (!result || result.isEmpty || (mode === 'comparison' && (!resultB || resultB.isEmpty)) || (mode === 'required' && !result.achievable)) {
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
    let text = `EMI Calculator Result\n\n`;
    
    if (mode === 'affordability') {
      text += `Max Affordable EMI: ${formatCurrency(result.maxEmi, currencyCode)}\n`;
      text += `Estimated Loan: ${formatCurrency(result.affordableLoan, currencyCode)}\n`;
    } else if (mode === 'reverse') {
      text += `Target EMI: ${formatCurrency(result.emi, currencyCode)}\n`;
      text += `Max Possible Loan: ${formatCurrency(result.maxLoan, currencyCode)}\n`;
    } else if (mode === 'required') {
      text += `Target Loan Amount: ${formatCurrency(result.totalPayment - result.totalInterest, currencyCode)}\n`;
      text += `Max Affordable EMI: ${formatCurrency(result.emi, currencyCode)}\n`;
      text += `Required Tenure: ${result.requiredYears.toFixed(1)} years\n`;
    } else if (mode === 'comparison' && resultB) {
      text += `Loan A EMI: ${formatCurrency(result.monthlyPayment, currencyCode)}\n`;
      text += `Loan A Total Interest: ${formatCurrency(result.totalInterest, currencyCode)}\n`;
      text += `Loan B EMI: ${formatCurrency(resultB.monthlyPayment, currencyCode)}\n`;
      text += `Loan B Total Interest: ${formatCurrency(resultB.totalInterest, currencyCode)}\n`;
    } else if (mode === 'prepayment') {
      text += `Original EMI: ${formatCurrency(result.monthlyPayment, currencyCode)}\n`;
      text += `Original Total Interest: ${formatCurrency(result.totalInterest, currencyCode)}\n`;
      text += `Check out my prepayment savings!\n`;
    } else {
      text += `Loan Amount: ${formatCurrency(result.principal, currencyCode)}\n`;
      text += `Interest Rate: ${result.annualRate}%\n`;
      text += `Tenure: ${result.numberOfPayments / result.periodsPerYear} years\n`;
      text += `Monthly EMI: ${formatCurrency(result.monthlyPayment, currencyCode)}\n`;
      text += `Total Interest: ${formatCurrency(result.totalInterest, currencyCode)}\n`;
      text += `Total Payable: ${formatCurrency(result.totalPayment, currencyCode)}\n`;
    }
    
    text += `\nCalculated with SnapFreeTools`;
    return text;
  };

  return (
    <ShareResultButton 
      title="My EMI Calculation"
      shareText={getShareText()}
      url="https://www.snapfreetools.com/emi-calculator"
      shortText="I calculated my loan repayment and EMI using SnapFreeTools!"
    />
  );
}
