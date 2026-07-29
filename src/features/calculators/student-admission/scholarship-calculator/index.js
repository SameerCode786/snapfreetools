"use client";

import React, { useState } from "react";
import CalculatorLayout from "@/features/student-hub/shared/components/CalculatorLayout";
import ResultCard from "@/features/student-hub/shared/components/ResultCard";
import FAQSection from "@/features/student-hub/shared/components/FAQSection";
import { calculateScholarship } from "./utils/calculateScholarship";
import { buildShareText } from "./utils/buildShareText";
import ShareResultButton from "./components/ShareResultButton";
import { Icons } from "@/lib/lucide-icons";

const CURRENCIES = [
  { label: "USD ($)", value: "USD", symbol: "$" },
  { label: "PKR (Rs)", value: "PKR", symbol: "Rs " },
  { label: "GBP (£)", value: "GBP", symbol: "£" },
  { label: "EUR (€)", value: "EUR", symbol: "€" },
  { label: "CAD ($)", value: "CAD", symbol: "$" },
  { label: "AUD ($)", value: "AUD", symbol: "$" },
  { label: "INR (₹)", value: "INR", symbol: "₹" },
  { label: "SAR (SR)", value: "SAR", symbol: "SR " },
  { label: "AED (AED)", value: "AED", symbol: "AED " }
];

export default function ScholarshipCalculatorFeature({ faqs }) {
  const [tuitionFee, setTuitionFee] = useState("");
  const [feeCycle, setFeeCycle] = useState("year");
  const [scholarshipType, setScholarshipType] = useState("percentage");
  const [scholarshipValue, setScholarshipValue] = useState("");
  
  // Projection inputs
  const [monthsPerYear, setMonthsPerYear] = useState(12);
  const [semestersPerYear, setSemestersPerYear] = useState(2);
  const [totalSemesters, setTotalSemesters] = useState("");
  const [studyYears, setStudyYears] = useState("");

  const [currency, setCurrency] = useState(CURRENCIES[0]);
  
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleCalculate = (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    try {
      const res = calculateScholarship({
        tuitionFee,
        feeCycle,
        scholarshipType,
        scholarshipValue,
        monthsPerYear,
        semestersPerYear,
        totalSemesters: parseInt(totalSemesters) || 0,
        studyYears: parseInt(studyYears) || 0
      });
      setResult(res);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReset = () => {
    setTuitionFee("");
    setFeeCycle("year");
    setScholarshipType("percentage");
    setScholarshipValue("");
    setMonthsPerYear(12);
    setSemestersPerYear(2);
    setTotalSemesters("");
    setStudyYears("");
    setResult(null);
    setError("");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.value,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount).replace(currency.value, currency.symbol);
  };

  return (
    <CalculatorLayout 
      title="Scholarship Calculator" 
      description="Calculate your scholarship amount, remaining tuition fee, and estimated savings using a percentage or fixed award."
      currentSlug="scholarship-calculator"
    >
      <div className="space-y-8">
        
        {/* Header section */}
        <section className="text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto text-emerald-600 shadow-sm border border-emerald-100/50">
            <Icons.Coins size={28} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Scholarship Calculator
          </h1>
          <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto font-semibold leading-relaxed">
            Calculate your scholarship amount, remaining tuition fee, and estimated savings using a percentage or fixed award.
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 text-[10px] font-extrabold uppercase tracking-widest rounded-full border border-amber-200/50">
            <Icons.Shield size={10} /> Instant browser calculation
          </div>
        </section>

        {/* Main Calculator Card */}
        <section className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 space-y-8">
            <form onSubmit={handleCalculate} className="space-y-6">
              
              {/* Currency & Type Switchers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Currency
                  </label>
                  <select
                    value={currency.value}
                    onChange={(e) => setCurrency(CURRENCIES.find(c => c.value === e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 block p-3 outline-none font-semibold transition-all hover:bg-slate-100"
                  >
                    {CURRENCIES.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Scholarship Type
                  </label>
                  <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => { setScholarshipType("percentage"); setScholarshipValue(""); setError(""); }}
                      className={`flex-1 text-xs font-bold py-2 px-3 rounded-lg transition-all ${scholarshipType === "percentage" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                    >
                      Percentage (%)
                    </button>
                    <button
                      type="button"
                      onClick={() => { setScholarshipType("fixed"); setScholarshipValue(""); setError(""); }}
                      className={`flex-1 text-xs font-bold py-2 px-3 rounded-lg transition-all ${scholarshipType === "fixed" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                    >
                      Fixed Amount
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Base Tuition Fee
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 font-semibold">
                      {currency.symbol}
                    </div>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={tuitionFee}
                      onChange={(e) => setTuitionFee(e.target.value)}
                      placeholder="e.g. 20000"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 block p-3 pl-10 outline-none font-semibold transition-all hover:bg-slate-100"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Fee Cycle
                  </label>
                  <select
                    value={feeCycle}
                    onChange={(e) => setFeeCycle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 block p-3 outline-none font-semibold transition-all hover:bg-slate-100"
                  >
                    <option value="year">Per Year</option>
                    <option value="semester">Per Semester</option>
                    <option value="month">Per Month</option>
                    <option value="total">Total Program</option>
                  </select>
                </div>

                <div className="space-y-2.5 md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                    {scholarshipType === "percentage" ? "Scholarship Percentage (%)" : "Scholarship Amount"}
                  </label>
                  <div className="relative">
                    {scholarshipType === "fixed" && (
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 font-semibold">
                        {currency.symbol}
                      </div>
                    )}
                    <input
                      type="number"
                      step="any"
                      min="0"
                      max={scholarshipType === "percentage" ? "100" : undefined}
                      value={scholarshipValue}
                      onChange={(e) => setScholarshipValue(e.target.value)}
                      placeholder={scholarshipType === "percentage" ? "e.g. 50" : "e.g. 5000"}
                      className={`w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 block p-3 outline-none font-semibold transition-all hover:bg-slate-100 ${scholarshipType === "percentage" ? "pr-10" : "pl-10"}`}
                      required
                    />
                    {scholarshipType === "percentage" && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400 font-semibold">
                        %
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Optional Projection Inputs */}
              {feeCycle !== "total" && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 space-y-4">
                  <div className="flex items-center gap-2">
                    <Icons.TrendingUp size={16} className="text-amber-500" />
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Optional Projections</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {feeCycle === "month" && (
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">Months Per Year</label>
                        <input type="number" min="1" max="12" value={monthsPerYear} onChange={e => setMonthsPerYear(e.target.value)} className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-lg p-2 outline-none font-semibold" />
                      </div>
                    )}
                    {feeCycle === "semester" && (
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">Semesters Per Year</label>
                        <input type="number" min="1" max="4" value={semestersPerYear} onChange={e => setSemestersPerYear(e.target.value)} className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-lg p-2 outline-none font-semibold" />
                      </div>
                    )}
                    {feeCycle === "semester" && (
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">Total Semesters in Program</label>
                        <input type="number" min="1" value={totalSemesters} onChange={e => setTotalSemesters(e.target.value)} placeholder="e.g. 8" className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-lg p-2 outline-none font-semibold" />
                      </div>
                    )}
                    {(feeCycle === "year" || feeCycle === "month") && (
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">Total Study Years</label>
                        <input type="number" min="1" value={studyYears} onChange={e => setStudyYears(e.target.value)} placeholder="e.g. 4" className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-lg p-2 outline-none font-semibold" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm font-semibold rounded-xl border border-red-100 flex items-center gap-2">
                  <Icons.Info size={16} />
                  {error}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#08111F] hover:bg-slate-900 text-white font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Icons.Calculator size={18} />
                  Calculate Scholarship
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="sm:w-auto w-full bg-white hover:bg-slate-50 text-slate-700 font-bold py-3.5 px-6 rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-2"
                >
                  <Icons.ArrowRightLeft size={16} />
                  Reset
                </button>
              </div>
            </form>
          </div>
          
          {/* Results Area */}
          {result && (
            <div className="border-t border-slate-100 bg-slate-50/50 p-6 sm:p-8 space-y-6">
              
              <div className="text-center space-y-1 pb-2">
                <h3 className="text-xs font-extrabold text-emerald-500 uppercase tracking-widest">Calculation Result</h3>
                <p className="text-sm font-semibold text-slate-500">
                  You entered a tuition fee of <span className="text-slate-800">{formatCurrency(result.base.tuition)}</span> per {feeCycle} and a {scholarshipType === "percentage" ? `${parseFloat(scholarshipValue)}%` : formatCurrency(parseFloat(scholarshipValue))} scholarship. Your estimated scholarship is <span className="text-emerald-600 font-bold">{formatCurrency(result.base.scholarship)}</span>, leaving <span className="text-amber-600 font-bold">{formatCurrency(result.base.payable)}</span> payable per {feeCycle}.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <ResultCard
                  label="Scholarship Amount"
                  value={formatCurrency(result.base.scholarship)}
                  color="emerald"
                  hideShare={true}
                />
                <ResultCard
                  label="Fee After Scholarship"
                  value={formatCurrency(result.base.payable)}
                  color="amber"
                  hideShare={true}
                />
                <ResultCard
                  label="Effective Percentage"
                  value={`${result.base.effectivePercentage.toFixed(1)}%`}
                  color="blue"
                  hideShare={true}
                />
              </div>

              {(result.annual || result.program) && (
                <div className="pt-6 border-t border-slate-200/60 space-y-4">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                    <Icons.TrendingUp size={16} className="text-slate-400" />
                    Projections
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {result.annual && (
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Annual Estimate</span>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-500">Annual Scholarship Savings</span>
                            <span className="text-emerald-600">{formatCurrency(result.annual.scholarship)}</span>
                          </div>
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-500">Annual Payable Fee</span>
                            <span className="text-slate-800">{formatCurrency(result.annual.payable)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    {result.program && (
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Program Estimate</span>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-500">Total Program Savings</span>
                            <span className="text-emerald-600">{formatCurrency(result.program.scholarship)}</span>
                          </div>
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-500">Total Program Payable</span>
                            <span className="text-slate-800">{formatCurrency(result.program.payable)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex justify-center pt-6">
                <ShareResultButton 
                  shareText={buildShareText(result, formatCurrency, feeCycle, scholarshipType, scholarshipValue)} 
                />
              </div>

              <div className="text-[10px] text-slate-400 font-semibold text-center mt-4">
                Disclaimer: This calculator estimates fee savings from scholarship information you already know. It does not predict eligibility or guarantee an award from any university or organization.
              </div>
            </div>
          )}
        </section>

        {faqs && faqs.length > 0 && (
          <FAQSection faqs={faqs} />
        )}
      </div>
    </CalculatorLayout>
  );
}
