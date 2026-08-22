import React from 'react';
import { Lightbulb } from 'lucide-react';
import { formatCurrency, formatPercent } from '../utils/formatting';

export default function DiscountInsights({ mode, result }) {
  if (!result || result.isEmpty) return null;

  let insights = [];

  if (mode === 'basic') {
    insights.push(`You save exactly ${formatCurrency(result.savingsAmount)} with this discount.`);
    insights.push(`The final price is ${formatPercent(100 - result.discount, 2)} of the original price.`);
    if (result.discount >= 50) {
      insights.push(`This is a high discount (half price or better).`);
    }
  }

  if (mode === 'reverse') {
    insights.push(`The absolute price reduction is ${formatCurrency(result.discountAmount)}.`);
    insights.push(`The percentage discount applied is ${formatPercent(result.discount, 2)}.`);
  }

  if (mode === 'findOriginal') {
    insights.push(`Before the ${formatPercent(result.discount, 2)} discount, the item cost ${formatCurrency(result.original)}.`);
    insights.push(`You saved ${formatCurrency(result.discountAmount)} on this purchase.`);
  }

  if (mode === 'stacked') {
    const rawSum = result.d1 + result.d2 + result.d3;
    const discountList = [result.d1, result.d2, result.d3].filter(d => d > 0);
    insights.push(`A ${discountList.join('%, ')}% discount applied sequentially results in an effective discount of ${formatPercent(result.effectiveDiscount, 2)}.`);
    if (rawSum > 0 && Math.abs(result.effectiveDiscount - rawSum) > 0.01) {
      insights.push(`Adding the percentages gives ${rawSum}%, but the true effective discount is ${formatPercent(result.effectiveDiscount, 2)} because subsequent discounts apply to the already-reduced price.`);
    }
    insights.push(`Total money saved: ${formatCurrency(result.totalSavings)}.`);
  }

  if (mode === 'tax') {
    insights.push(`The discount saves you ${formatCurrency(result.discountAmount)}.`);
    insights.push(`The tax adds ${formatCurrency(result.taxAmount)} back to your cost.`);
    const netSavings = result.discountAmount - result.taxAmount;
    if (netSavings > 0) {
      insights.push(`Overall, your net savings after tax is ${formatCurrency(netSavings)} compared to the original price.`);
    } else {
      insights.push(`The tax amount is greater than or equal to the discount, so you pay more than the original price.`);
    }
  }
  
  if (mode === 'target') {
    insights.push(`To drop the price from ${formatCurrency(result.original)} down to ${formatCurrency(result.target)}, you need exactly a ${formatPercent(result.requiredDiscount, 2)} discount.`);
    insights.push(`This requires a price reduction of ${formatCurrency(result.savingsAmount)}.`);
  }

  if (insights.length === 0) return null;

  return (
    <div className="bg-amber-50 rounded-3xl p-6 md:p-8 mb-8 border border-amber-100 shadow-sm">
      <h3 className="text-lg font-bold text-amber-900 mb-4 flex items-center gap-2">
        <span className="w-8 h-8 rounded-lg bg-amber-200 text-amber-700 flex items-center justify-center text-sm">
          <Lightbulb size={18} />
        </span>
        Your Savings Analysis
      </h3>
      <ul className="space-y-3">
        {insights.map((insight, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <span className="text-amber-500 mt-1">•</span>
            <span className="text-amber-800 font-medium leading-relaxed">{insight}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
