import { ShareResultCard } from "@/components/share";
import { formatNumber } from "../utils/formatting";

export default function SharePreview({ result, data, mode }) {
  if (!result || result.isEmpty) {
    return null;
  }

  const getCustomShareText = () => {
    let text = `Check out this free Percentage Calculator on SnapFreeTools:\nhttps://www.snapfreetools.com/percentage-calculator\n\nMy Result:\n`;
    
    if (mode === 'percentageOf') {
      text += `• ${data.percentage}% of ${data.number} = ${formatNumber(result.result, 4)}\n`;
    } else if (mode === 'whatPercent') {
      text += `• ${data.part} is ${formatNumber(result.result, 2)}% of ${data.whole}\n`;
    } else if (mode === 'increase') {
      text += `• ${data.original} increased to ${data.newNumber}\n`;
      text += `• Percentage Increase: ${formatNumber(result.percentChange, 2)}%\n`;
    } else if (mode === 'decrease') {
      text += `• ${data.original} decreased to ${data.newNumber}\n`;
      text += `• Percentage Decrease: ${formatNumber(result.percentChange, 2)}%\n`;
    } else if (mode === 'difference') {
      text += `• Difference between ${data.valA} and ${data.valB}\n`;
      text += `• Percentage Difference: ${formatNumber(result.percentDiff, 2)}%\n`;
    } else if (mode === 'reverse') {
      text += `• If ${data.percentage}% is ${data.amount}\n`;
      text += `• The original number is: ${formatNumber(result.original, 4)}\n`;
    } else if (mode === 'change') {
      text += `• Change from ${data.original} to ${data.newNumber}\n`;
      text += `• ${result.isIncrease ? 'Growth' : 'Decrease'}: ${formatNumber(Math.abs(result.percentChange), 2)}%\n`;
    } else if (mode === 'discount') {
      text += `• Original Price: ${data.price}\n`;
      text += `• Discount: ${data.discountPercent}%\n`;
      text += `• Final Price: ${formatNumber(result.finalPrice, 2)}\n`;
    } else if (mode === 'tax') {
      text += `• Price: ${data.price}\n`;
      text += `• Tax: ${data.taxPercent}%\n`;
      text += `• Final Price: ${formatNumber(result.finalPrice, 2)}\n`;
    } else if (mode === 'tip') {
      text += `• Bill: ${data.bill}\n`;
      text += `• Tip: ${data.tipPercent}% (${formatNumber(result.tipAmount, 2)})\n`;
      text += `• Total: ${formatNumber(result.totalBill, 2)}\n`;
      if (parseFloat(data.people) > 1) {
        text += `• Per Person (${data.people}): ${formatNumber(result.perPerson, 2)}\n`;
      }
    } else if (mode === 'points') {
      text += `• Changed from ${data.start}% to ${data.end}%\n`;
      text += `• Points Change: ${formatNumber(result.pointChange, 4)} percentage points\n`;
      text += `• Relative Change: ${formatNumber(result.relativeChange, 2)}%\n`;
    }
    
    text += `\nTry it yourself:\nhttps://www.snapfreetools.com/percentage-calculator`;
    return text;
  };

  return (
    <ShareResultCard 
      toolName="Percentage Calculator"
      toolUrl="percentage-calculator"
      result={result}
      customFormatter={getCustomShareText}
    />
  );
}
