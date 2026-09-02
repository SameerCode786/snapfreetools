"use client";

import React from 'react';
import { formatCurrency, formatPercent } from '../utils/formatting';
import { ShareResultCard } from '@/components/share';

function buildShareText(mode, result) {
  if (!result || result.isEmpty) return '';

  let body = '';
  if (mode === 'basic') {
    body = `• Original Price: ${formatCurrency(result.original)}\n• Discount: ${formatPercent(result.discount, 2)}\n• You Save: ${formatCurrency(result.savingsAmount)}\n• Final Price: ${formatCurrency(result.finalPrice)}`;
  } else if (mode === 'reverse') {
    body = `• Original Price: ${formatCurrency(result.original)}\n• Sale Price: ${formatCurrency(result.sale)}\n• Discount Amount: ${formatCurrency(result.discountAmount)}\n• Discount %: ${formatPercent(result.discount, 2)}`;
  } else if (mode === 'findOriginal') {
    body = `• Sale Price: ${formatCurrency(result.sale)}\n• Discount: ${formatPercent(result.discount, 2)}\n• Original Price: ${formatCurrency(result.original)}\n• Amount Discounted: ${formatCurrency(result.discountAmount)}`;
  } else if (mode === 'stacked') {
    body = `• Original Price: ${formatCurrency(result.original)}\n• Discounts Applied: ${result.d1}% → ${result.d2}%${result.d3 > 0 ? ` → ${result.d3}%` : ''}\n• Total Savings: ${formatCurrency(result.totalSavings)}\n• Final Price: ${formatCurrency(result.finalPrice)}\n• Effective Discount: ${formatPercent(result.effectiveDiscount, 2)}`;
  } else if (mode === 'tax') {
    body = `• Original Price: ${formatCurrency(result.original)}\n• Price After Discount: ${formatCurrency(result.discountedPrice)}\n• Tax Amount: ${formatCurrency(result.taxAmount)}\n• Final Total: ${formatCurrency(result.finalPrice)}`;
  } else if (mode === 'tip') {
    body = `• Original Bill: ${formatCurrency(result.bill)}\n• Price After Discount: ${formatCurrency(result.discountedBill)}\n• Tip Amount: ${formatCurrency(result.tipAmount)}\n• Final Bill: ${formatCurrency(result.finalBill)}\n• Per Person: ${formatCurrency(result.perPerson)}`;
  } else if (mode === 'compare') {
    body = `• Option A Final Price: ${formatCurrency(result.finalPriceA)} (saves ${formatCurrency(result.savingsA)})\n• Option B Final Price: ${formatCurrency(result.finalPriceB)} (saves ${formatCurrency(result.savingsB)})\n• Better Deal: Option ${result.bestDeal === 'none' ? 'Tied' : result.bestDeal}\n• Savings Difference: ${formatCurrency(result.difference)}`;
  } else if (mode === 'target') {
    body = `• Original Price: ${formatCurrency(result.original)}\n• Desired Final Price: ${formatCurrency(result.target)}\n• Required Discount: ${formatPercent(result.requiredDiscount, 2)}\n• Amount to Save: ${formatCurrency(result.savingsAmount)}`;
  }

  return `Check out this free Discount Calculator on SnapFreeTools:\nhttps://www.snapfreetools.com/discount-calculator\n\nMy Result:\n${body}\n\nTry it yourself:\nhttps://www.snapfreetools.com/discount-calculator`;
}

export default function SharePreview({ mode, result }) {
  if (!result || result.isEmpty) return null;

  return (
    <ShareResultCard
      toolName="Discount Calculator"
      toolUrl="discount-calculator"
      result={result}
      customFormatter={() => buildShareText(mode, result)}
    />
  );
}
