"use client";

import React, { useState, useEffect } from "react";
import CalculatorLayout from "@/features/student-hub/shared/components/CalculatorLayout";
import { CURRENCIES } from "@/features/calculators/financial/emi-calculator/utils/currency";
import ModeSwitcher from "./components/ModeSwitcher";
import SavingsInputForm from "./components/SavingsInputForm";
import SavingsResultDashboard from "./components/SavingsResultDashboard";
import GrowthChart from "./components/GrowthChart";
import YearlyGrowthTable from "./components/YearlyGrowthTable";
import WhatIfSimulator from "./components/WhatIfSimulator";
import FinancialInsights from "./components/FinancialInsights";
import ShareResultButton from "@/features/calculators/student-admission/attendance-calculator/components/ShareResultButton";
import { Icons } from "@/lib/lucide-icons";
import { validateSavingsInput } from "./utils/validation";
import { 
  calculateSavingsGrowth, 
  calculateSavingsGoal, 
  calculateRequiredMonthly, 
  calculateEmergencyFund,
  safeFormatNumber
} from "./utils/calculations";
import { SAVINGS_EDUCATIONAL_CONTENT } from "./content/educationalContent";

export default function SavingsCalculatorSuite() {
  const [mode, setMode] = useState("growth"); // growth, goal, required, compound, emergency, comparison
  const [currencyCode, setCurrencyCode] = useState("USD");
  const currencySymbol = CURRENCIES.find(c => c.code === currencyCode)?.symbol || "$";
  
  const [data, setData] = useState({
    principal: "",
    monthlyContribution: "",
    annualRate: "",
    years: "",
    frequency: "monthly",
    targetAmount: "",
    monthlyExpenses: "",
    targetMonths: "6"
  });

  const [dataB, setDataB] = useState({
    principal: "",
    monthlyContribution: "",
    annualRate: "",
    years: "",
    frequency: "monthly",
  });

  const [result, setResult] = useState(null);
  const [resultB, setResultB] = useState(null);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    // Reset data when mode changes to prevent invalid calculations
    // But keep standard values if they make sense
    setErrors([]);
  }, [mode]);

  useEffect(() => {
    calculateResults();
  }, [data, dataB, mode]);

  const calculateResults = () => {
    const errs = validateSavingsInput(data, mode);
    setErrors(errs);
    
    if (errs.length > 0) {
      setResult(null);
      setResultB(null);
      return;
    }

    if (mode === 'growth' || mode === 'compound') {
      const res = calculateSavingsGrowth({
        initial: data.principal,
        monthly: data.monthlyContribution,
        annualRate: data.annualRate,
        years: data.years,
        frequency: data.frequency
      });
      setResult(res);
    } else if (mode === 'goal') {
      const res = calculateSavingsGoal({
        current: data.principal,
        target: data.targetAmount,
        monthly: data.monthlyContribution,
        annualRate: data.annualRate,
        frequency: data.frequency
      });
      setResult(res);
    } else if (mode === 'required') {
      const res = calculateRequiredMonthly({
        current: data.principal,
        target: data.targetAmount,
        years: data.years,
        annualRate: data.annualRate,
        frequency: data.frequency
      });
      setResult(res);
    } else if (mode === 'emergency') {
      const res = calculateEmergencyFund({
        expenses: data.monthlyExpenses,
        current: data.principal,
        targetMonths: data.targetMonths
      });
      setResult(res);
    } else if (mode === 'comparison') {
      const resA = calculateSavingsGrowth({
        initial: data.principal,
        monthly: data.monthlyContribution,
        annualRate: data.annualRate,
        years: data.years,
        frequency: data.frequency
      });
      const resB = calculateSavingsGrowth({
        initial: dataB.principal,
        monthly: dataB.monthlyContribution,
        annualRate: dataB.annualRate,
        years: dataB.years,
        frequency: dataB.frequency
      });
      setResult(resA);
      setResultB(resB);
    }
  };

  const getShareText = () => {
    if (!result || result.isEmpty || !result.isValid) return "";
    let text = `My Savings Projection (${mode.toUpperCase()} Mode):\n`;
    
    if (mode === 'emergency') {
      text += `Target Fund: ${currencySymbol}${safeFormatNumber(result.targetFund, 0)}\n`;
      text += `Current Fund: ${currencySymbol}${safeFormatNumber(result.currentFund, 0)}\n`;
      text += `Shortfall: ${currencySymbol}${safeFormatNumber(result.remaining, 0)}\n`;
    } else if (mode === 'required') {
      text += `Target Goal: ${currencySymbol}${safeFormatNumber(data.targetAmount, 0)}\n`;
      text += `Required Monthly: ${currencySymbol}${safeFormatNumber(result.requiredMonthly, 0)}\n`;
    } else {
      text += `Future Savings: ${currencySymbol}${safeFormatNumber(result.futureValue, 0)}\n`;
      text += `Total Contributions: ${currencySymbol}${safeFormatNumber(result.totalContributions, 0)}\n`;
      text += `Interest Earned: ${currencySymbol}${safeFormatNumber(result.totalInterest, 0)}\n`;
    }
    
    text += `\nCalculate your savings for free at: https://www.snapfreetools.com/savings-calculator`;
    return text;
  };

  const renderComparisonResult = () => {
    if (!result || !result.isValid || !resultB || !resultB.isValid) return null;
    
    const diff = result.futureValue - resultB.futureValue;
    const winner = diff >= 0 ? "Scenario A" : "Scenario B";
    const amount = Math.abs(diff);
    
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-full">
        <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <Icons.ArrowRightLeft size={20} className="text-indigo-500" />
          <h2 className="text-lg font-bold text-slate-800">Scenario Comparison</h2>
        </div>
        <div className="p-6">
          <div className="text-center p-6 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-100 mb-8">
            <div className="text-sm font-semibold mb-1">{winner} Yields More By</div>
            <div className="text-3xl font-black">{currencySymbol}{safeFormatNumber(amount, 0)}</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-slate-800 text-center mb-4">Scenario A</h3>
              <div className="space-y-3">
                <div className="flex justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-sm font-medium text-slate-600">Future Savings</span>
                  <span className="font-bold text-slate-800">{currencySymbol}{safeFormatNumber(result.futureValue, 0)}</span>
                </div>
                <div className="flex justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-sm font-medium text-slate-600">Contributions</span>
                  <span className="font-bold text-slate-800">{currencySymbol}{safeFormatNumber(result.totalContributions, 0)}</span>
                </div>
                <div className="flex justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-sm font-medium text-slate-600">Interest</span>
                  <span className="font-bold text-indigo-600">{currencySymbol}{safeFormatNumber(result.totalInterest, 0)}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-slate-800 text-center mb-4">Scenario B</h3>
              <div className="space-y-3">
                <div className="flex justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-sm font-medium text-slate-600">Future Savings</span>
                  <span className="font-bold text-slate-800">{currencySymbol}{safeFormatNumber(resultB.futureValue, 0)}</span>
                </div>
                <div className="flex justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-sm font-medium text-slate-600">Contributions</span>
                  <span className="font-bold text-slate-800">{currencySymbol}{safeFormatNumber(resultB.totalContributions, 0)}</span>
                </div>
                <div className="flex justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-sm font-medium text-slate-600">Interest</span>
                  <span className="font-bold text-indigo-600">{currencySymbol}{safeFormatNumber(resultB.totalInterest, 0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <CalculatorLayout 
      title="Savings Calculator & Growth Analysis"
      description="Calculate your savings growth, monthly contributions, and compound interest. Plan your emergency fund and reach your savings goals faster."
    >
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        <ModeSwitcher mode={mode} setMode={setMode} />

        {errors.length > 0 && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 flex gap-3">
            <Icons.AlertCircle className="text-rose-500 shrink-0" />
            <div className="flex flex-col gap-1">
              {errors.map((err, i) => (
                <span key={i} className="text-sm text-rose-700 font-medium">{err}</span>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-8">
          <div className="w-full">
            <SavingsInputForm 
              mode={mode} 
              data={data} 
              setData={setData}
              dataB={dataB}
              setDataB={setDataB}
              currencyCode={currencyCode}
              setCurrencyCode={setCurrencyCode}
            />
          </div>

          <div className="w-full">
            {mode === 'comparison' ? (
              renderComparisonResult()
            ) : (
              <SavingsResultDashboard 
                result={result} 
                mode={mode} 
                currencySymbol={currencySymbol} 
              />
            )}
          </div>
        </div>

        {result && result.isValid && mode !== 'emergency' && mode !== 'comparison' && mode !== 'required' && mode !== 'goal' && (
          <div className="mt-8">
            <WhatIfSimulator 
              baseData={data} 
              baseResult={result} 
              currencySymbol={currencySymbol} 
            />
          </div>
        )}

        {result && result.isValid && mode !== 'comparison' && mode !== 'emergency' && (
          <div className="mt-8">
            <GrowthChart 
              data={result.yearlyData} 
              currencySymbol={currencySymbol} 
            />
          </div>
        )}

        {result && result.isValid && mode !== 'comparison' && (
          <div className="mt-8">
            <FinancialInsights 
              result={result} 
              mode={mode} 
              currencySymbol={currencySymbol} 
            />
          </div>
        )}

        {result && result.isValid && mode !== 'comparison' && mode !== 'emergency' && (
          <div className="mt-8">
            <YearlyGrowthTable 
              data={result.yearlyData} 
              currencySymbol={currencySymbol} 
            />
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <ShareResultButton shareText={getShareText()} />
        </div>

        {SAVINGS_EDUCATIONAL_CONTENT && (
          <div className="mt-16 border-t border-slate-200 pt-16">
            <div className="prose prose-slate max-w-none lg:prose-lg" dangerouslySetInnerHTML={{ __html: SAVINGS_EDUCATIONAL_CONTENT }} />
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
}
