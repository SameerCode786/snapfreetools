"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import CalculatorLayout from "@/features/student-hub/shared/components/CalculatorLayout";
import { Activity, ExternalLink, AlertTriangle } from 'lucide-react';

import UnitSwitcher from './components/UnitSwitcher';
import BMIInputForm from './components/BMIInputForm';
import BMIResultDashboard from './components/BMIResultDashboard';
import BMIRangeIndicator from './components/BMIRangeIndicator';
import WeightAnalysis from './components/WeightAnalysis';
import WhatIfSimulator from './components/WhatIfSimulator';
import BMIInsights from './components/BMIInsights';
import FormulaExplanation from './components/FormulaExplanation';
import SharePreview from './components/SharePreview';

import { validateMetric, validateImperial } from './utils/validation';
import { calculateMetricBMI, calculateImperialBMI } from './utils/calculations';

export default function BMICalculatorFeature({ faqs }) {
  const [unit, setUnit] = useState('metric');
  const [errorMsg, setErrorMsg] = useState('');
  const [result, setResult] = useState(null);

  const [data, setData] = useState({
    heightCm: '', weightKg: '',
    heightFt: '', heightIn: '', weightLb: '',
    age: '', gender: ''
  });

  // Reset result on unit switch (don't corrupt values)
  useEffect(() => {
    setResult(null);
    setErrorMsg('');
  }, [unit]);

  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setData({ heightCm: '', weightKg: '', heightFt: '', heightIn: '', weightLb: '', age: '', gender: '' });
    setResult(null);
    setErrorMsg('');
  };

  // Auto-calculate on every input change
  useEffect(() => {
    const hasAnyInput = unit === 'metric'
      ? (data.heightCm !== '' || data.weightKg !== '')
      : (data.heightFt !== '' || data.weightLb !== '');

    if (!hasAnyInput) {
      setResult(null);
      setErrorMsg('');
      return;
    }

    if (unit === 'metric') {
      const v = validateMetric(data.weightKg, data.heightCm, data.age);
      if (v.isValid) {
        setResult(calculateMetricBMI(v));
        setErrorMsg('');
      } else {
        setResult(null);
        // Only show error if both weight and height have some content
        if (data.weightKg !== '' && data.heightCm !== '') setErrorMsg(v.message);
        else setErrorMsg('');
      }
    } else {
      const v = validateImperial(data.weightLb, data.heightFt, data.heightIn, data.age);
      if (v.isValid) {
        setResult(calculateImperialBMI(v));
        setErrorMsg('');
      } else {
        setResult(null);
        if (data.weightLb !== '' && data.heightFt !== '') setErrorMsg(v.message);
        else setErrorMsg('');
      }
    }
  }, [data, unit]);

  const activeResult = (result && !result.isEmpty && !result.isMinor) ? {
    summary: `BMI Result: ${result.bmi} (${result.category})`
  } : null;

  return (
    <CalculatorLayout
      title="BMI Calculator"
      description="Calculate your Body Mass Index (BMI), find your healthy weight range, and understand your result with our free, accurate BMI calculator."
      currentSlug="bmi-calculator"
      activeResult={activeResult}
      seoContent={
        <div className="space-y-12">
          {/* Educational Content */}
          <div className="space-y-8">
            <section className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                  <Activity size={24} />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">What Is BMI?</h2>
              </div>
              <div className="prose prose-slate max-w-none">
                <p>Body Mass Index (BMI) is a simple numerical value derived from a person's weight and height. It is widely used as a population-level screening measure to classify adults into weight categories. The standard adult BMI categories are defined by the World Health Organization (WHO) and adopted by health agencies worldwide.</p>
                <p>BMI does not directly measure body fat. Two people can have identical BMI values but very different body compositions — for example, an athlete with high muscle mass and a sedentary person with high body fat. For this reason, BMI is best used as one data point in a broader health assessment.</p>
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section className="bg-slate-50 border border-slate-200 rounded-3xl p-7 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Metric BMI Formula</h3>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center font-mono text-sm text-slate-700 mb-4 shadow-sm">
                  BMI = weight(kg) ÷ height(m)²
                </div>
                <p className="text-slate-500 text-sm">Example: 70 kg ÷ (1.75 × 1.75) = <strong>22.9</strong></p>
              </section>
              <section className="bg-slate-50 border border-slate-200 rounded-3xl p-7 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Imperial BMI Formula</h3>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center font-mono text-sm text-slate-700 mb-4 shadow-sm">
                  BMI = 703 × weight(lb) ÷ height(in)²
                </div>
                <p className="text-slate-500 text-sm">Example: 703 × 154 ÷ (69 × 69) = <strong>22.7</strong></p>
              </section>
            </div>

            <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <h2 className="text-2xl font-black text-slate-900 mb-6">BMI Categories (Adults)</h2>
              <div className="overflow-x-auto -mx-4 px-4">
                <table className="w-full text-left border-collapse min-w-[380px]">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 rounded-l-lg">BMI Range</th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Category</th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 rounded-r-lg">Classification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { range: 'Below 18.5', label: 'Underweight', color: 'text-blue-600 bg-blue-50' },
                      { range: '18.5 – 24.9', label: 'Healthy Weight', color: 'text-emerald-600 bg-emerald-50' },
                      { range: '25.0 – 29.9', label: 'Overweight', color: 'text-amber-600 bg-amber-50' },
                      { range: '30.0 – 34.9', label: 'Obesity Class I', color: 'text-orange-600 bg-orange-50' },
                      { range: '35.0 – 39.9', label: 'Obesity Class II', color: 'text-red-600 bg-red-50' },
                      { range: '40.0 and above', label: 'Obesity Class III', color: 'text-red-800 bg-red-100' },
                    ].map(({ range, label, color }) => (
                      <tr key={label} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-700 text-sm">{range}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${color}`}>{label}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-500 text-sm">WHO Standard</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <h2 className="text-2xl font-black text-slate-900 mb-4">Limitations of BMI</h2>
              <p className="text-slate-600 leading-relaxed mb-4">BMI is a useful population-level screening tool, but it has several important limitations:</p>
              <ul className="space-y-3 text-slate-600">
                {[
                  'BMI does not measure body fat directly — it cannot distinguish between muscle and fat mass.',
                  'Athletes and highly muscular individuals may be classified as overweight or obese despite low body fat.',
                  'Older adults may have lower BMI but higher body fat percentages than younger adults at the same BMI.',
                  'BMI does not account for fat distribution (e.g., visceral fat around the abdomen vs. subcutaneous fat).',
                  'The standard adult BMI categories are not appropriate for children and teenagers under 18.',
                ].map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-slate-400 mt-1 shrink-0">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Internal Links */}
            <section className="bg-slate-50 border border-slate-200 rounded-3xl p-7 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-5">Related SnapFreeTools Calculators</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { name: 'Percentage Calculator', href: '/percentage-calculator', desc: 'Calculate any percentage, change, or ratio.' },
                  { name: 'Discount Calculator', href: '/discount-calculator', desc: 'Calculate sale prices and savings amounts.' },
                  { name: 'Savings Calculator', href: '/savings-calculator', desc: 'Project compound savings growth over time.' },
                  { name: 'Investment Calculator', href: '/investment-calculator', desc: 'Calculate return on investment (ROI).' },
                ].map(({ name, href, desc }) => (
                  <Link key={href} href={href} className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-slate-200 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all group">
                    <ExternalLink size={16} className="text-emerald-500 mt-1 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-800 group-hover:text-emerald-700 text-sm">{name}</div>
                      <div className="text-slate-500 text-xs mt-0.5 leading-relaxed">{desc}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* FAQ Section */}
          {faqs && faqs.length > 0 && (
            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <details
                    key={idx}
                    className="bg-white border border-slate-200 rounded-2xl p-6 group shadow-sm cursor-pointer open:border-emerald-200 open:ring-1 open:ring-emerald-200 transition-all"
                  >
                    <summary className="font-bold text-slate-800 text-base list-none flex items-center justify-between gap-4">
                      {faq.question}
                      <span className="text-slate-400 group-open:rotate-180 transition-transform shrink-0 text-sm">▼</span>
                    </summary>
                    <p className="mt-4 text-slate-600 leading-relaxed text-sm">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          )}
        </div>
      }
    >
      <div className="max-w-4xl mx-auto">

        {/* H1 + intro */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-200 mb-4">
            <Activity size={14} />
            Health Calculators
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3 leading-tight">
            BMI Calculator & Body Mass Index Analysis
          </h1>
          <p className="text-slate-500 text-base leading-relaxed max-w-2xl">
            Calculate your Body Mass Index in metric (kg/cm) or imperial (lb/ft). See your BMI category, healthy weight range, and how to interpret your result.
          </p>
        </div>

        {/* Unit Switcher */}
        <div className="mb-6">
          <UnitSwitcher unit={unit} setUnit={setUnit} />
        </div>

        {/* Input Form */}
        <BMIInputForm unit={unit} data={data} handleChange={handleChange} />

        {/* Reset button */}
        {(result || errorMsg) && (
          <div className="mb-6 flex justify-end">
            <button
              onClick={handleReset}
              className="text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors underline underline-offset-4"
              type="button"
            >
              Reset calculator
            </button>
          </div>
        )}

        {/* Error message */}
        {errorMsg && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2 mb-8">
            <span>⚠️</span> {errorMsg}
          </div>
        )}

        {/* Results */}
        <BMIResultDashboard result={result} />
        <BMIRangeIndicator result={result} />
        <WeightAnalysis result={result} />
        <WhatIfSimulator result={result} />
        <BMIInsights result={result} />
        <FormulaExplanation result={result} />

        {/* Health Disclaimer */}
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 mb-10 flex items-start gap-3">
          <AlertTriangle size={20} className="text-slate-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-bold text-slate-700 mb-1">Important Disclaimer</div>
            <p className="text-sm text-slate-500 leading-relaxed">
              BMI is a screening measure and does not directly measure body fat or diagnose any health condition. Muscle mass, age, sex, and body composition can all affect how BMI should be interpreted. This calculator is for informational purposes only. For personal medical advice, please consult a qualified healthcare professional.
            </p>
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
}
