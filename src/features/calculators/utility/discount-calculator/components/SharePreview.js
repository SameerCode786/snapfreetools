"use client";

import React from 'react';
import { formatCurrency, formatPercent } from '../utils/formatting';
import ShareResultButton from '@/features/calculators/student-admission/attendance-calculator/components/ShareResultButton';

function buildShareText(mode, result) {
  if (!result || result.isEmpty) return '';

  if (mode === 'basic') {
    return `Discount Calculation\n\nOriginal Price: ${formatCurrency(result.original)}\nDiscount: ${formatPercent(result.discount, 2)}\nYou Save: ${formatCurrency(result.savingsAmount)}\nFinal Price: ${formatCurrency(result.finalPrice)}\n\nCalculated with SnapFreeTools Discount Calculator.\nhttps://www.snapfreetools.com/discount-calculator`;
  }
  if (mode === 'reverse') {
    return `Reverse Discount Calculation\n\nOriginal Price: ${formatCurrency(result.original)}\nSale Price: ${formatCurrency(result.sale)}\nDiscount Amount: ${formatCurrency(result.discountAmount)}\nDiscount %: ${formatPercent(result.discount, 2)}\n\nCalculated with SnapFreeTools Discount Calculator.\nhttps://www.snapfreetools.com/discount-calculator`;
  }
  if (mode === 'findOriginal') {
    return `Find Original Price Calculation\n\nSale Price: ${formatCurrency(result.sale)}\nDiscount: ${formatPercent(result.discount, 2)}\nOriginal Price: ${formatCurrency(result.original)}\nAmount Discounted: ${formatCurrency(result.discountAmount)}\n\nCalculated with SnapFreeTools Discount Calculator.\nhttps://www.snapfreetools.com/discount-calculator`;
  }
  if (mode === 'stacked') {
    return `Stacked Discount Calculation\n\nOriginal Price: ${formatCurrency(result.original)}\nDiscounts Applied: ${result.d1}% → ${result.d2}%${result.d3 > 0 ? ` → ${result.d3}%` : ''}\nTotal Savings: ${formatCurrency(result.totalSavings)}\nFinal Price: ${formatCurrency(result.finalPrice)}\nEffective Discount: ${formatPercent(result.effectiveDiscount, 2)}\n\nCalculated with SnapFreeTools Discount Calculator.\nhttps://www.snapfreetools.com/discount-calculator`;
  }
  if (mode === 'tax') {
    return `Discount + Tax Calculation\n\nOriginal Price: ${formatCurrency(result.original)}\nPrice After Discount: ${formatCurrency(result.discountedPrice)}\nTax Amount: ${formatCurrency(result.taxAmount)}\nFinal Total: ${formatCurrency(result.finalPrice)}\n\nCalculated with SnapFreeTools Discount Calculator.\nhttps://www.snapfreetools.com/discount-calculator`;
  }
  if (mode === 'tip') {
    return `Discount + Tip Calculation\n\nOriginal Bill: ${formatCurrency(result.bill)}\nPrice After Discount: ${formatCurrency(result.discountedBill)}\nTip Amount: ${formatCurrency(result.tipAmount)}\nFinal Bill: ${formatCurrency(result.finalBill)}\nPer Person: ${formatCurrency(result.perPerson)}\n\nCalculated with SnapFreeTools Discount Calculator.\nhttps://www.snapfreetools.com/discount-calculator`;
  }
  if (mode === 'compare') {
    return `Discount Comparison\n\nOption A Final Price: ${formatCurrency(result.finalPriceA)} (saves ${formatCurrency(result.savingsA)})\nOption B Final Price: ${formatCurrency(result.finalPriceB)} (saves ${formatCurrency(result.savingsB)})\nBetter Deal: Option ${result.bestDeal === 'none' ? 'Tied' : result.bestDeal}\nSavings Difference: ${formatCurrency(result.difference)}\n\nCalculated with SnapFreeTools Discount Calculator.\nhttps://www.snapfreetools.com/discount-calculator`;
  }
  if (mode === 'target') {
    return `Target Price Calculation\n\nOriginal Price: ${formatCurrency(result.original)}\nDesired Final Price: ${formatCurrency(result.target)}\nRequired Discount: ${formatPercent(result.requiredDiscount, 2)}\nAmount to Save: ${formatCurrency(result.savingsAmount)}\n\nCalculated with SnapFreeTools Discount Calculator.\nhttps://www.snapfreetools.com/discount-calculator`;
  }

  return '';
}

const MODE_TITLES = {
  basic: 'Discount Calculator Result',
  reverse: 'Reverse Discount Result',
  findOriginal: 'Original Price Calculator Result',
  stacked: 'Stacked Discount Result',
  tax: 'Discount + Tax Result',
  tip: 'Discount + Tip Result',
  compare: 'Discount Comparison Result',
  target: 'Target Price Result',
};

export default function SharePreview({ mode, result }) {
  if (!result || result.isEmpty) return null;

  const shareText = buildShareText(mode, result);
  if (!shareText) return null;

  return (
    <ShareResultButton
      shareText={shareText}
      title={MODE_TITLES[mode] || 'Discount Calculator Result'}
      url="https://www.snapfreetools.com/discount-calculator"
      shortText={`Check out this discount calculation I made with SnapFreeTools!`}
    />
  );
}
