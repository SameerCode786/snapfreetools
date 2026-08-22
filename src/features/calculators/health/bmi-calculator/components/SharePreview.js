"use client";

import React from 'react';
import { formatBMI, formatWeight } from '../utils/formatting';
import ShareResultButton from '@/features/calculators/student-admission/attendance-calculator/components/ShareResultButton';

function buildShareText(result) {
  if (!result || result.isEmpty) return '';
  if (result.isMinor) return '';

  const wLabel = result.unit === 'metric' ? 'kg' : 'lb';
  const currentWeight = result.unit === 'metric' ? result.weightKg : result.weightLb;

  return `My BMI Result\n\nBMI: ${formatBMI(result.bmi)}\nCategory: ${result.category?.label}\nHealthy BMI Range: 18.5 – 24.9\nHealthy Weight Range: ${formatWeight(result.minHealthyWeight, wLabel)} – ${formatWeight(result.maxHealthyWeight, wLabel)}\nYour Weight: ${formatWeight(currentWeight, wLabel)}\n\nCalculated with SnapFreeTools BMI Calculator.\nhttps://www.snapfreetools.com/bmi-calculator`;
}

export default function SharePreview({ result }) {
  if (!result || result.isEmpty || result.isMinor) return null;

  const shareText = buildShareText(result);
  if (!shareText) return null;

  return (
    <ShareResultButton
      shareText={shareText}
      title="BMI Calculator Result"
      url="https://www.snapfreetools.com/bmi-calculator"
      shortText={`My BMI is ${formatBMI(result.bmi)} (${result.category?.label}). Calculated with SnapFreeTools!`}
    />
  );
}
