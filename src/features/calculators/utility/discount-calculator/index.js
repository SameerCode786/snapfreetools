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

  return (
    <CalculatorLayout
      title="Discount Calculator"
      description="Calculate sale prices, percentage discounts, stacked discounts, and total savings instantly. Free and accurate."
      currentSlug="discount-calculator"
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

        {result && !result.isEmpty && (
          <SharePreview 
            mode={mode} 
            result={result} 
          />
        )}

        {/* Educational Content */}
        <div className="space-y-10 mt-12">

          <section className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">
                <Tag size={24} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">What Is a Discount Calculator?</h2>
            </div>
            <div className="prose prose-slate max-w-none">
              <p>A discount calculator is a utility tool that helps you quickly determine the final price of an item after a discount has been applied. Instead of doing the arithmetic manually, you simply enter the original price and the discount percentage, and the calculator instantly shows you the sale price, the amount you save, and the effective discount percentage.</p>
              <p>Our Discount Calculator goes beyond a simple price-reduction tool. It supports <strong>stacked discounts</strong>, <strong>reverse discount calculations</strong>, <strong>finding original prices</strong>, <strong>discount + tax</strong>, <strong>discount + tip splitting</strong>, <strong>comparison shopping</strong>, and <strong>target price planning</strong> — making it useful for shoppers, business owners, marketers, and students alike.</p>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="bg-slate-50 border border-slate-200 rounded-3xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Discount Formula</h3>
              <p className="text-slate-600 mb-4">To calculate a discount amount and final price:</p>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center shadow-sm font-mono text-sm text-slate-700 space-y-2">
                <div>Discount Amount = Price × (Discount% ÷ 100)</div>
                <div className="text-slate-400">—</div>
                <div>Sale Price = Price − Discount Amount</div>
              </div>
            </section>
            <section className="bg-slate-50 border border-slate-200 rounded-3xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Reverse Discount Formula</h3>
              <p className="text-slate-600 mb-4">To find the original price before discount:</p>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center shadow-sm font-mono text-sm text-slate-700 space-y-2">
                <div>Discount% = ((Original − Sale) ÷ Original) × 100</div>
                <div className="text-slate-400">—</div>
                <div>Original = Sale ÷ (1 − Discount% ÷ 100)</div>
              </div>
            </section>
          </div>

          <section className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900 mb-6">How Stacked Discounts Work</h2>
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 mb-6">
              <p className="text-amber-900 font-bold">⚠️ Common Misconception: Stacked discounts are NOT simply added together.</p>
            </div>
            <p className="text-slate-600 mb-4">When a retailer applies a 20% discount followed by an additional 10% discount, the effective total is <strong>not</strong> 30%. The second discount is applied to the already-reduced price.</p>
            <div className="bg-slate-50 rounded-2xl p-6 font-mono text-sm text-slate-700 space-y-2">
              <div>$100 → 20% off → $80</div>
              <div>$80 → 10% off → $72</div>
              <div className="text-amber-700 font-bold">Effective Discount: 28% (not 30%)</div>
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900 mb-6">Discount + Tax Explained</h2>
            <p className="text-slate-600 mb-4">When an item is both discounted and subject to sales tax, the tax is almost always calculated <strong>after</strong> the discount has been applied, not before. This benefits the buyer because the taxable amount is smaller.</p>
            <div className="bg-slate-50 rounded-2xl p-6 font-mono text-sm text-slate-700 space-y-2">
              <div>$100 original price</div>
              <div>→ 20% discount = $80 after discount</div>
              <div>→ 8% tax on $80 = $6.40 tax</div>
              <div className="text-amber-700 font-bold">→ Final total = $86.40</div>
            </div>
          </section>

          {/* Internal links */}
          <section className="bg-slate-50 border border-slate-200 rounded-3xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Related SnapFreeTools Calculators</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: 'Percentage Calculator', href: '/percentage-calculator', desc: 'Calculate any percentage, percentage change, or reverse percentage.' },
                { name: 'Savings Calculator', href: '/savings-calculator', desc: 'Track how savings grow with compound interest over time.' },
                { name: 'Investment Calculator', href: '/investment-calculator', desc: 'Calculate ROI and compound investment returns.' },
                { name: 'EMI Calculator', href: '/emi-calculator', desc: 'Calculate equated monthly installments for loans.' },
              ].map(({ name, href, desc }) => (
                <Link key={href} href={href} className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-slate-200 hover:border-amber-200 hover:bg-amber-50/30 transition-all group">
                  <ExternalLink size={16} className="text-amber-500 mt-1 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-800 group-hover:text-amber-700 text-sm">{name}</div>
                    <div className="text-slate-500 text-xs mt-0.5 leading-relaxed">{desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

        </div>

        {/* FAQ Section */}
        {faqs && faqs.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-black text-slate-900 mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <details key={idx} className="bg-white border border-slate-200 rounded-2xl p-6 group shadow-sm cursor-pointer open:ring-1 open:ring-amber-200 open:border-amber-200 transition-all">
                  <summary className="font-bold text-slate-800 text-base list-none flex items-center justify-between gap-4">
                    {faq.question}
                    <span className="text-slate-400 group-open:rotate-180 transition-transform shrink-0">▼</span>
                  </summary>
                  <p className="mt-4 text-slate-600 leading-relaxed">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}

      </div>
    </CalculatorLayout>
  );
}
