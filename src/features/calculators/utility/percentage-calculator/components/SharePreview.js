import ShareResultButton from "@/features/calculators/student-admission/attendance-calculator/components/ShareResultButton";
import { formatNumber, formatCurrency } from "../utils/formatting";

export default function SharePreview({ result, data, mode }) {
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
    let text = `Percentage Calculation\n\n`;
    
    if (mode === 'percentageOf') {
      text += `${data.percentage}% of ${data.number} = ${formatNumber(result.result, 4)}\n`;
    } else if (mode === 'whatPercent') {
      text += `${data.part} is ${formatNumber(result.result, 2)}% of ${data.whole}\n`;
    } else if (mode === 'increase') {
      text += `${data.original} increased to ${data.newNumber}\n`;
      text += `Percentage Increase: ${formatNumber(result.percentChange, 2)}%\n`;
    } else if (mode === 'decrease') {
      text += `${data.original} decreased to ${data.newNumber}\n`;
      text += `Percentage Decrease: ${formatNumber(result.percentChange, 2)}%\n`;
    } else if (mode === 'difference') {
      text += `Difference between ${data.valA} and ${data.valB}\n`;
      text += `Percentage Difference: ${formatNumber(result.percentDiff, 2)}%\n`;
    } else if (mode === 'reverse') {
      text += `If ${data.percentage}% is ${data.amount}\n`;
      text += `The original number is: ${formatNumber(result.original, 4)}\n`;
    } else if (mode === 'change') {
      text += `Change from ${data.original} to ${data.newNumber}\n`;
      text += `${result.isIncrease ? 'Growth' : 'Decrease'}: ${formatNumber(Math.abs(result.percentChange), 2)}%\n`;
    } else if (mode === 'discount') {
      text += `Original Price: ${data.price}\n`;
      text += `Discount: ${data.discountPercent}%\n`;
      text += `Final Price: ${formatNumber(result.finalPrice, 2)}\n`;
    } else if (mode === 'tax') {
      text += `Price: ${data.price}\n`;
      text += `Tax: ${data.taxPercent}%\n`;
      text += `Final Price: ${formatNumber(result.finalPrice, 2)}\n`;
    } else if (mode === 'tip') {
      text += `Bill: ${data.bill}\n`;
      text += `Tip: ${data.tipPercent}% (${formatNumber(result.tipAmount, 2)})\n`;
      text += `Total: ${formatNumber(result.totalBill, 2)}\n`;
      if (parseFloat(data.people) > 1) {
        text += `Per Person (${data.people}): ${formatNumber(result.perPerson, 2)}\n`;
      }
    } else if (mode === 'points') {
      text += `Changed from ${data.start}% to ${data.end}%\n`;
      text += `Points Change: ${formatNumber(result.pointChange, 4)} percentage points\n`;
      text += `Relative Change: ${formatNumber(result.relativeChange, 2)}%\n`;
    }
    
    text += `\nCalculated with SnapFreeTools Percentage Calculator.`;
    return text;
  };

  return (
    <ShareResultButton 
      title="My Percentage Calculation"
      shareText={getShareText()}
      url="https://www.snapfreetools.com/percentage-calculator"
      shortText="I calculated percentages using SnapFreeTools!"
    />
  );
}
