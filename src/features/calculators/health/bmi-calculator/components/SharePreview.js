"use client";

import React from 'react';
import { formatBMI, formatWeight } from '../utils/formatting';
import { ShareResultCard } from "@/components/share";

function buildShareText(result) {
  if (!result || result.isEmpty || result.isMinor) return '';

  const wLabel = result.unit === 'metric' ? 'kg' : 'lb';
  const currentWeight = result.unit === 'metric' ? result.weightKg : result.weightLb;

  return `Check out this free BMI Calculator on SnapFreeTools:\nhttps://www.snapfreetools.com/bmi-calculator\n\nMy Result:\n• BMI: ${formatBMI(result.bmi)}\n• Category: ${result.category?.label}\n• Healthy BMI Range: 18.5 – 24.9\n• Healthy Weight Range: ${formatWeight(result.minHealthyWeight, wLabel)} – ${formatWeight(result.maxHealthyWeight, wLabel)}\n• Your Weight: ${formatWeight(currentWeight, wLabel)}\n\nTry it yourself:\nhttps://www.snapfreetools.com/bmi-calculator`;
}

export default function SharePreview({ result }) {
  if (!result || result.isEmpty || result.isMinor) return null;

  return (
    <ShareResultCard
      toolName="BMI Calculator"
      toolUrl="bmi-calculator"
      result={result}
      customFormatter={() => buildShareText(result)}
    />
  );
}
