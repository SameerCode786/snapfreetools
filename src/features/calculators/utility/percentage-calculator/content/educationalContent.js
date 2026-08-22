import React from "react";
import Link from "next/link";
import { Calculator, Percent, TrendingUp, Info, Lightbulb, Tag } from "lucide-react";

export const EDUCATIONAL_CONTENT = () => {
  return (
    <div className="space-y-12">
      <section className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">
            <Percent size={24} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">What Is a Percentage?</h2>
        </div>
        
        <div className="prose prose-slate max-w-none prose-p:leading-relaxed">
          <p>
            A percentage is a way of expressing a number as a fraction of 100. The word "percent" comes from the Latin phrase <em>per centum</em>, which translates literally to "by the hundred." It is universally indicated using the percent sign (<strong>%</strong>).
          </p>
          <p>
            For example, 45% represents 45 out of 100, or the fraction 45/100, which can also be written as the decimal 0.45.
          </p>
          <p>
            Percentages are heavily used in finance, business, and everyday life to make comparisons easier. Whether you are calculating discounts at a store, figuring out sales tax, evaluating a tip for a meal, or looking at the interest rate on a <Link href="/loan-calculator" className="text-amber-600 hover:underline">loan</Link>, percentages provide a standardized way to understand proportions.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-slate-50 border border-slate-200 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Calculator className="text-slate-400" size={20} />
            <h3 className="text-xl font-bold text-slate-900">The Basic Percentage Formula</h3>
          </div>
          <p className="text-slate-600 mb-6">
            To calculate a percentage, you usually divide the part by the whole and multiply the result by 100.
          </p>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center shadow-sm">
            <span className="text-lg font-mono font-bold text-slate-700">Percentage = (Part ÷ Whole) × 100</span>
          </div>
        </section>

        <section className="bg-slate-50 border border-slate-200 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="text-slate-400" size={20} />
            <h3 className="text-xl font-bold text-slate-900">Percentage Change Formula</h3>
          </div>
          <p className="text-slate-600 mb-6">
            To find out how much a value has grown or shrunk relative to its original size:
          </p>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center shadow-sm">
            <span className="text-lg font-mono font-bold text-slate-700">Change = ((New - Old) ÷ Old) × 100</span>
          </div>
        </section>
      </div>

      <section className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm">
        <h2 className="text-2xl font-black text-slate-900 mb-8">Percentage Points vs. Percentage Change</h2>
        
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 mb-8 flex gap-4">
          <Info className="text-amber-600 flex-shrink-0" size={24} />
          <div>
            <p className="text-amber-900 font-medium m-0">
              This is one of the most common mathematical confusions in news and finance!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h4 className="text-lg font-bold text-slate-900 mb-3">Percentage Points</h4>
            <p className="text-slate-600">
              A percentage point is the simple numerical difference between two percentages.
            </p>
            <p className="text-slate-600 mt-2">
              <strong>Example:</strong> If a mortgage rate increases from 4% to 5%, it has increased by <strong>1 percentage point</strong> (5 - 4 = 1).
            </p>
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-900 mb-3">Percentage Change</h4>
            <p className="text-slate-600">
              Percentage change is the relative difference. It tells you how much the value grew relative to its starting point.
            </p>
            <p className="text-slate-600 mt-2">
              <strong>Example:</strong> That same increase from 4% to 5% is a <strong>25% relative increase</strong> ((5 - 4) / 4 × 100 = 25%).
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center">
            <Tag size={24} />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Real-World Uses of Percentages</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-slate-100 bg-slate-50 p-6 rounded-2xl">
            <h4 className="font-bold text-slate-900 mb-2">Discounts & Sales</h4>
            <p className="text-sm text-slate-600">When an item is "20% off," you multiply the original price by 0.20 to find your savings, then subtract it.</p>
          </div>
          <div className="border border-slate-100 bg-slate-50 p-6 rounded-2xl">
            <h4 className="font-bold text-slate-900 mb-2">Investing & Saving</h4>
            <p className="text-sm text-slate-600">Savings accounts and investments yield returns expressed as a percentage, often <Link href="/investment-calculator" className="text-amber-600 hover:underline">compounding</Link> over time.</p>
          </div>
          <div className="border border-slate-100 bg-slate-50 p-6 rounded-2xl">
            <h4 className="font-bold text-slate-900 mb-2">Taxes & Tips</h4>
            <p className="text-sm text-slate-600">Sales tax and restaurant tips are added to your base total as a direct percentage of the original amount.</p>
          </div>
        </div>
      </section>
      
      <section className="bg-slate-900 rounded-3xl p-8 sm:p-12 shadow-md text-white text-center">
        <h2 className="text-2xl font-black mb-4">How to Use This Calculator</h2>
        <p className="text-slate-300 max-w-2xl mx-auto mb-8">
          Our tool features 11 distinct modes to handle any percentage scenario. Simply select the mode you need from the tab navigation, enter your numbers, and the tool will instantly provide the result along with the mathematical formula used.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left max-w-3xl mx-auto">
          <div className="bg-slate-800 p-4 rounded-xl">
            <div className="text-amber-400 font-bold mb-1">Step 1</div>
            <div className="text-sm text-slate-300">Select Mode</div>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl">
            <div className="text-amber-400 font-bold mb-1">Step 2</div>
            <div className="text-sm text-slate-300">Enter Values</div>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl">
            <div className="text-amber-400 font-bold mb-1">Step 3</div>
            <div className="text-sm text-slate-300">View Result</div>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl">
            <div className="text-amber-400 font-bold mb-1">Step 4</div>
            <div className="text-sm text-slate-300">Share or Copy</div>
          </div>
        </div>
      </section>
    </div>
  );
};
