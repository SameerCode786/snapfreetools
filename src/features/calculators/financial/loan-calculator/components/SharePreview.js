import ShareResultButton from "@/features/calculators/student-admission/attendance-calculator/components/ShareResultButton";
import { formatCurrency } from "../utils/currency";

export default function SharePreview({ result, mode, currencyCode }) {
  if (!result || result.isEmpty) {
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
    let text = `Loan Calculator Result\n\n`;
    
    if (mode === 'standard' || mode === 'extra') {
      text += `Loan Amount: ${formatCurrency(result.principal, currencyCode)}\n`;
      text += `Regular Payment: ${formatCurrency(result.regularPayment, currencyCode)}\n`;
      text += `Total Interest: ${formatCurrency(result.totalInterest, currencyCode)}\n`;
      text += `Total Amount Paid: ${formatCurrency(result.totalAmountPaid, currencyCode)}\n`;
    } else if (mode === 'affordability') {
      text += `Max Monthly Payment: ${formatCurrency(result.maxMonthlyPayment, currencyCode)}\n`;
      text += `Est. Max Loan Amount: ${formatCurrency(result.maxLoanAmount, currencyCode)}\n`;
      text += `Affordable: ${result.isAffordable ? 'Yes' : 'No'}\n`;
    } else if (mode === 'reverse') {
      text += `Monthly Payment: ${formatCurrency(result.payment, currencyCode)}\n`;
      text += `Est. Loan Amount: ${formatCurrency(result.maxLoanAmount, currencyCode)}\n`;
      text += `Total Paid: ${formatCurrency(result.totalRepayment, currencyCode)}\n`;
    }

    text += `\nCalculated with SnapFreeTools:\nhttps://www.snapfreetools.com/loan-calculator`;
    return text;
  };

  return (
    <ShareResultButton 
      shareText={getShareText()} 
    />
  );
}
