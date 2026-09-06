"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import CalculatorLayout from "@/features/student-hub/shared/components/CalculatorLayout";
import { Tag, ExternalLink } from 'lucide-react';

import ModeSwitcher from './components/ModeSwitcher';
import DiscountInputForm from './components/DiscountInputForm';
import DiscountResultDashboard from './components/DiscountResultDashboard';
import VisualPriceBreakdown from './components/VisualPriceBreakdown';
import FormulaExplanation from './components/FormulaExplanation';
import DiscountInsights from './components/DiscountInsights';
import WhatIfAnalysis from './components/WhatIfAnalysis';
import SharePreview from './components/SharePreview';

import {
  validateBasicDiscount,
  validateReverseDiscount,
  validateFindOriginal,
  validateStackedDiscounts,
  validateDiscountAndTax,
  validateDiscountAndTip,
  validateCompareDiscounts,
  validateTargetPrice
} from './utils/validation';

import {
  calculateBasicDiscount,
  calculateReverseDiscount,
  calculateFindOriginal,
  calculateStackedDiscounts,
  calculateDiscountAndTax,
  calculateDiscountAndTip,
  calculateCompareDiscounts,
  calculateTargetPrice
} from './utils/calculations';

export default function DiscountCalculatorFeature({ faqs }) {
  const [mode, setMode] = useState('basic');
  const [errorMsg, setErrorMsg] = useState('');
  
  const [data, setData] = useState({
    original: '', discount: '', sale: '',
    d1: '', d2: '', d3: '',
    tax: '', bill: '', tip: '', people: '1',
    priceA: '', discountA: '', priceB: '', discountB: '',
    target: ''
  });

  const [result, setResult] = useState(null);

  useEffect(() => {
    setResult(null);
    setErrorMsg('');
  }, [mode]);

  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setData({
      original: '', discount: '', sale: '',
      d1: '', d2: '', d3: '',
      tax: '', bill: '', tip: '', people: '1',
      priceA: '', discountA: '', priceB: '', discountB: '',
      target: ''
    });
    setResult(null);
    setErrorMsg('');
  };

  useEffect(() => {
    let isValid = false;
    let newResult = null;
    let msg = '';

    if (mode === 'basic') {
      const v = validateBasicDiscount(data.original, data.discount);
      if (v.isValid) { newResult = calculateBasicDiscount(v.original, v.discount); isValid = true; } else msg = v.message;
    } else if (mode === 'reverse') {
      const v = validateReverseDiscount(data.original, data.sale);
      if (v.isValid) { newResult = calculateReverseDiscount(v.original, v.sale); isValid = true; } else msg = v.message;
    } else if (mode === 'findOriginal') {
      const v = validateFindOriginal(data.sale, data.discount);
      if (v.isValid) { newResult = calculateFindOriginal(v.sale, v.discount); isValid = true; } else msg = v.message;
    } else if (mode === 'stacked') {
      const v = validateStackedDiscounts(data.original, data.d1, data.d2, data.d3);
      if (v.isValid) { newResult = calculateStackedDiscounts(v.original, v.d1, v.d2, v.d3); isValid = true; } else msg = v.message;
    } else if (mode === 'tax') {
      const v = validateDiscountAndTax(data.original, data.discount, data.tax);
      if (v.isValid) { newResult = calculateDiscountAndTax(v.original, v.discount, v.tax); isValid = true; } else msg = v.message;
    } else if (mode === 'tip') {
      const v = validateDiscountAndTip(data.bill, data.discount, data.tip, data.people);
      if (v.isValid) { newResult = calculateDiscountAndTip(v.bill, v.discount, v.tip, v.people); isValid = true; } else msg = v.message;
    } else if (mode === 'compare') {
      const v = validateCompareDiscounts(data.priceA, data.discountA, data.priceB, data.discountB);
      if (v.isValid) { newResult = calculateCompareDiscounts(v.pa, v.da, v.pb, v.db); isValid = true; } else msg = v.message;
    } else if (mode === 'target') {
      const v = validateTargetPrice(data.original, data.target);
      if (v.isValid) { newResult = calculateTargetPrice(v.original, v.target); isValid = true; } else msg = v.message;
    }

    // Only show validation error if user has entered something
    const hasInputs = Object.values(data).some(v => v !== '' && v !== '1');
    if (isValid && newResult) {
      setResult(newResult);
      setErrorMsg('');
    } else if (!isValid && hasInputs && msg && !msg.includes('Please enter')) {
      setResult(null);
      setErrorMsg(msg);
    } else if (isValid === false && hasInputs && msg) {
      setResult(null);
      // Only show specific error messages (like "cannot be zero", "100% discount"), not generic "please enter" messages
      if (!msg.toLowerCase().includes('please enter')) {
        setErrorMsg(msg);
      } else {
        setErrorMsg('');
      }
    } else {
      setResult(null);
      setErrorMsg('');
    }
  }, [data, mode]);

  const activeResult = (result && !result.isEmpty) ? {
    summary: `Discount Calculation: Final Price is ${result.finalPrice !== undefined ? `$${result.finalPrice}` : 'calculated'}`
  } : null;

  return (
    <CalculatorLayout
      title="Discount Calculator"
      description="Calculate sale prices, percentage discounts, stacked discounts, and total savings instantly. Free and accurate."
      currentSlug="discount-calculator"
      activeResult={activeResult}
    >
      <div className="max-w-4xl mx-auto">
        
        {/* Calculator H1 + intro */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-full border border-amber-200 mb-4">
            <Tag size={14} />
            Utility Calculators
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3 leading-tight">
            Discount Calculator & Pricing Analysis
          </h1>
          <p className="text-slate-500 text-base leading-relaxed max-w-2xl">
            Calculate sale prices, discount amounts, and total savings instantly. Supports stacked discounts, tax after discount, tip splitting, comparison, and finding the original price.
          </p>
        </div>

        <ModeSwitcher 
          activeMode={mode} 
          setMode={setMode} 
          onReset={handleReset} 
        />

        <DiscountInputForm 
          mode={mode} 
          data={data} 
          handleChange={handleChange} 
        />

        {errorMsg && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 flex items-center mb-8">
            <span className="mr-2">⚠️</span> {errorMsg}
          </div>
        )}

        <DiscountResultDashboard 
          mode={mode} 
          result={result} 
        />

        <VisualPriceBreakdown 
          mode={mode} 
          result={result} 
        />

        <FormulaExplanation 
          mode={mode} 
          result={result} 
        />

        <DiscountInsights 
          mode={mode} 
          result={result} 
        />

        <WhatIfAnalysis 
          mode={mode} 
          data={data} 
          result={result} 
        />

      </div>
    </CalculatorLayout>
  );
}
