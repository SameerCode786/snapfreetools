"use client";

import React, { useState, useEffect } from 'react';
import CalculatorLayout from "@/features/student-hub/shared/components/CalculatorLayout";

import ModeSwitcher from './components/ModeSwitcher';
import PercentageInputForm from './components/PercentageInputForm';
import PercentageResultDashboard from './components/PercentageResultDashboard';
import FormulaExplanation from './components/FormulaExplanation';
import VisualAnalysis from './components/VisualAnalysis';
import WhatIfAnalysis from './components/WhatIfAnalysis';
import SharePreview from './components/SharePreview';

import { 
  validatePercentageOfNumber, 
  validateWhatPercent, 
  validateChange, 
  validateDifference, 
  validateReverse,
  validateDiscount,
  validateTax,
  validateTip,
  validatePoints 
} from './utils/validation';

import { 
  calculatePercentageOfNumber, 
  calculateWhatPercent, 
  calculatePercentageIncrease, 
  calculatePercentageDecrease, 
  calculatePercentageDifference, 
  calculateReverse, 
  calculateChange,
  calculateDiscount,
  calculateTax,
  calculateTip,
  calculatePoints
} from './utils/calculations';

import { EDUCATIONAL_CONTENT } from './content/educationalContent';
import { Copy, CheckCircle2 } from 'lucide-react';
import { formatNumber, formatCurrency, formatPercent } from './utils/formatting';

export default function PercentageCalculatorFeature({ faqs }) {
  const [mode, setMode] = useState('percentageOf');
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [data, setData] = useState({
    percentage: '', number: '',
    part: '', whole: '',
    original: '', newNumber: '',
    valA: '', valB: '',
    amount: '',
    price: '', discountPercent: '', taxPercent: '',
    bill: '', tipPercent: '', people: '1',
    start: '', end: ''
  });

  const [result, setResult] = useState(null);

  useEffect(() => {
    setResult(null);
    setErrorMsg('');
    setCopied(false);
  }, [mode]);

  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleSwap = () => {
    setData(prev => {
      if (mode === 'percentageOf') return { ...prev, percentage: prev.number, number: prev.percentage };
      if (mode === 'whatPercent') return { ...prev, part: prev.whole, whole: prev.part };
      if (mode === 'increase' || mode === 'decrease' || mode === 'change') return { ...prev, original: prev.newNumber, newNumber: prev.original };
      if (mode === 'difference') return { ...prev, valA: prev.valB, valB: prev.valA };
      if (mode === 'points') return { ...prev, start: prev.end, end: prev.start };
      return prev;
    });
  };

  const handleReset = () => {
    setData({
      percentage: '', number: '', part: '', whole: '',
      original: '', newNumber: '', valA: '', valB: '', amount: '',
      price: '', discountPercent: '', taxPercent: '',
      bill: '', tipPercent: '', people: '1', start: '', end: ''
    });
    setResult(null);
    setErrorMsg('');
  };

  useEffect(() => {
    let isValid = false;
    let newResult = null;
    let msg = '';

    if (mode === 'percentageOf') {
      const v = validatePercentageOfNumber(data.percentage, data.number);
      if (v.isValid) { newResult = calculatePercentageOfNumber(v.p, v.n); isValid = true; } else msg = v.message;
    } else if (mode === 'whatPercent') {
      const v = validateWhatPercent(data.part, data.whole);
      if (v.isValid) { newResult = calculateWhatPercent(v.p, v.w); isValid = true; } else msg = v.message;
    } else if (mode === 'increase') {
      const v = validateChange(data.original, data.newNumber);
      if (v.isValid) { newResult = calculatePercentageIncrease(v.o, v.n); isValid = true; } else msg = v.message;
    } else if (mode === 'decrease') {
      const v = validateChange(data.original, data.newNumber);
      if (v.isValid) { newResult = calculatePercentageDecrease(v.o, v.n); isValid = true; } else msg = v.message;
    } else if (mode === 'difference') {
      const v = validateDifference(data.valA, data.valB);
      if (v.isValid) { newResult = calculatePercentageDifference(v.a, v.b, v.average); isValid = true; } else msg = v.message;
    } else if (mode === 'reverse') {
      const v = validateReverse(data.percentage, data.amount);
      if (v.isValid) { newResult = calculateReverse(v.p, v.a); isValid = true; } else msg = v.message;
    } else if (mode === 'change') {
      const v = validateChange(data.original, data.newNumber);
      if (v.isValid) { newResult = calculateChange(v.o, v.n); isValid = true; } else msg = v.message;
    } else if (mode === 'discount') {
      const v = validateDiscount(data.price, data.discountPercent);
      if (v.isValid) { newResult = calculateDiscount(v.p, v.d); isValid = true; } else msg = v.message;
    } else if (mode === 'tax') {
      const v = validateTax(data.price, data.taxPercent);
      if (v.isValid) { newResult = calculateTax(v.p, v.t, 'add'); isValid = true; } else msg = v.message;
    } else if (mode === 'tip') {
      const v = validateTip(data.bill, data.tipPercent, data.people);
      if (v.isValid) { newResult = calculateTip(v.b, v.t, v.p); isValid = true; } else msg = v.message;
    } else if (mode === 'points') {
      const v = validatePoints(data.start, data.end);
      if (v.isValid) { newResult = calculatePoints(v.s, v.e); isValid = true; } else msg = v.message;
    }

    // Only set error message if inputs are not completely empty
    const hasInputs = Object.values(data).some(v => v !== '' && v !== '1');
    if (!isValid && hasInputs && msg && !msg.includes('enter both') && !msg.includes('all values')) {
      setErrorMsg(msg);
      setResult(null);
    } else if (isValid) {
      setErrorMsg('');
      setResult(newResult);
    } else {
      setErrorMsg('');
      setResult(null);
    }
  }, [data, mode]);

  const handleCopy = () => {
    if (!result || result.isEmpty) return;
    
    let text = `Percentage Calculation\n\n`;
    if (mode === 'percentageOf') text += `${data.percentage}% of ${data.number} = ${formatNumber(result.result, 4)}`;
    else if (mode === 'whatPercent') text += `${data.part} is ${formatNumber(result.result, 2)}% of ${data.whole}`;
    else if (mode === 'increase') text += `Increase from ${data.original} to ${data.newNumber} is ${formatNumber(result.percentChange, 2)}%`;
    else if (mode === 'decrease') text += `Decrease from ${data.original} to ${data.newNumber} is ${formatNumber(result.percentChange, 2)}%`;
    else if (mode === 'difference') text += `Difference between ${data.valA} and ${data.valB} is ${formatNumber(result.percentDiff, 2)}%`;
    else if (mode === 'reverse') text += `Original number if ${data.percentage}% is ${data.amount} = ${formatNumber(result.original, 4)}`;
    else if (mode === 'change') text += `Change from ${data.original} to ${data.newNumber} is ${formatNumber(Math.abs(result.percentChange), 2)}%`;
    else if (mode === 'discount') text += `Price: ${data.price}, Discount: ${data.discountPercent}%, Final: ${formatNumber(result.finalPrice, 2)}`;
    else if (mode === 'tax') text += `Price: ${data.price}, Tax: ${data.taxPercent}%, Final: ${formatNumber(result.finalPrice, 2)}`;
    else if (mode === 'tip') text += `Bill: ${data.bill}, Tip: ${data.tipPercent}%, Total: ${formatNumber(result.totalBill, 2)}`;
    else if (mode === 'points') text += `From ${data.start}% to ${data.end}% is ${formatNumber(result.pointChange, 4)} points`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const activeResult = (result && !result.isEmpty) ? {
    summary: `Percentage Calculation: Result = ${result.result !== undefined ? formatNumber(result.result, 4) : result.percentChange !== undefined ? `${formatNumber(result.percentChange, 2)}%` : 'Completed'}`
  } : null;

  return (
    <CalculatorLayout 
      title="Percentage Calculator"
      description="Calculate percentages, percentage change, discounts, taxes, tips, and more with our free online percentage calculator."
      currentSlug="percentage-calculator"
      activeResult={activeResult}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Calculators", href: "/calculators" },
        { label: "Percentage Calculator", href: "/percentage-calculator" },
      ]}
      educationalContent={<EDUCATIONAL_CONTENT />}
      faqs={faqs}
      relatedTools={['investment-calculator', 'savings-calculator', 'loan-calculator', 'emi-calculator', 'gpa-calculator']}
    >
      <div className="max-w-4xl mx-auto">
        
        <ModeSwitcher activeMode={mode} setMode={setMode} onReset={handleReset} />
        
        <PercentageInputForm 
          mode={mode} 
          data={data} 
          handleChange={handleChange} 
          onSwap={handleSwap} 
        />

        {errorMsg && (
          <div className="bg-red-50 text-red-600 border border-red-200 p-4 rounded-xl mb-8 font-medium">
            {errorMsg}
          </div>
        )}

        <PercentageResultDashboard result={result} mode={mode} />
        <VisualAnalysis mode={mode} data={data} result={result} />
        <WhatIfAnalysis mode={mode} data={data} result={result} />
        <FormulaExplanation mode={mode} data={data} result={result} />

        <div className="flex justify-end pt-4">
          <button 
            onClick={handleCopy}
            disabled={!result || result.isEmpty}
            className={`w-full sm:w-auto font-bold py-3.5 px-8 rounded-xl border flex items-center justify-center gap-2 transition-colors ${
              !result || result.isEmpty 
                ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed' 
                : copied 
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
            {copied ? 'Copied!' : 'Copy Result'}
          </button>
        </div>

      </div>
    </CalculatorLayout>
  );
}
