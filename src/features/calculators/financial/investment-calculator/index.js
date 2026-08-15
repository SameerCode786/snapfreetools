"use client";

import React, { useState, useEffect, useMemo } from "react";
import CalculatorLayout from "@/features/student-hub/shared/components/CalculatorLayout";
import ModeSwitcher from "./components/ModeSwitcher";
import InvestmentInputForm from "./components/InvestmentInputForm";
import InvestmentResultDashboard from "./components/InvestmentResultDashboard";
import GrowthChart from "./components/GrowthChart";
import YearlyGrowthTable from "./components/YearlyGrowthTable";
import WhatIfSimulator from "./components/WhatIfSimulator";
import InvestmentComparison from "./components/InvestmentComparison";
import SharePreview from "./components/SharePreview";
import InvestmentInsights from "./components/InvestmentInsights";
import { calculateInvestmentGrowth, calculateGoal, calculateInflation } from "./utils/calculations";
import { validateInvestmentData, validateGoalData, validateInflationData } from "./utils/validation";
import { EDUCATIONAL_CONTENT } from "./content/educationalContent";
import { INVESTMENT_FAQS } from "./content/faqs";

export default function InvestmentCalculatorSuite() {
  const [mode, setMode] = useState("growth");
  const [currencyCode, setCurrencyCode] = useState("USD");
  
  const [data, setData] = useState({
    principal: "",
    monthlyContribution: "",
    annualRate: "",
    years: "",
    frequency: "monthly",
    targetAmount: "",
    futureValue: "",
    inflationRate: ""
  });
  
  const [dataB, setDataB] = useState({
    principal: "",
    monthlyContribution: "",
    annualRate: "",
    years: "",
    frequency: "monthly"
  });

  const result = useMemo(() => {
    if (mode === 'goal') {
      if (!validateGoalData(data).isValid) return null;
      return calculateGoal(data.targetAmount, data.principal, data.annualRate, data.years);
    }
    
    if (mode === 'inflation') {
      if (!validateInflationData(data).isValid) return null;
      return calculateInflation(data.futureValue, data.inflationRate, data.years);
    }
    
    if (!validateInvestmentData(data, mode).isValid) return null;
    return calculateInvestmentGrowth(
      data.principal,
      mode === 'compound' ? 0 : data.monthlyContribution,
      data.annualRate,
      data.years,
      mode === 'growth' || mode === 'sip' ? 'monthly' : data.frequency
    );
  }, [data, mode]);
  
  const resultB = useMemo(() => {
    if (mode !== 'comparison') return null;
    if (!validateInvestmentData(dataB, mode).isValid) return null;
    return calculateInvestmentGrowth(
      dataB.principal,
      dataB.monthlyContribution,
      dataB.annualRate,
      dataB.years,
      dataB.frequency
    );
  }, [dataB, mode]);

  // Handle Mode changes (preserve relevant fields where logical)
  const handleSetMode = (newMode) => {
    setMode(newMode);
  };

  const calculatorTitle = "Investment Calculator & Growth Analysis Suite";
  const calculatorSubtitle = "Calculate compound interest, project future growth, and analyze your investments with our advanced financial tools.";

  return (
    <CalculatorLayout 
      title={calculatorTitle} 
      subtitle={calculatorSubtitle}
      faqs={INVESTMENT_FAQS}
      content={EDUCATIONAL_CONTENT}
    >
      <div className="investment-calculator-page space-y-6">
        <ModeSwitcher mode={mode} setMode={handleSetMode} />
        
        <div className="space-y-8">
          {/* Inputs Section */}
          <div className="w-full">
            <InvestmentInputForm 
              mode={mode} 
              data={data} 
              setData={setData} 
              dataB={dataB}
              setDataB={setDataB}
              currencyCode={currencyCode} 
              setCurrencyCode={setCurrencyCode} 
            />
          </div>
          
          {/* Results Section */}
          <div className="w-full space-y-8">
            {mode === 'comparison' ? (
              <div className="space-y-8 mt-4">
                <InvestmentComparison resultA={result} resultB={resultB} currencyCode={currencyCode} />
                <div className="max-w-sm mx-auto">
                  <SharePreview result={result} resultB={resultB} mode={mode} currencyCode={currencyCode} />
                </div>
              </div>
            ) : (
              <>
                <InvestmentResultDashboard result={result} mode={mode} currencyCode={currencyCode} />
                <InvestmentInsights result={result} mode={mode} currencyCode={currencyCode} />
                {(mode === 'growth' || mode === 'compound' || mode === 'sip') && (
                  <>
                    <GrowthChart result={result} currencyCode={currencyCode} />
                    <WhatIfSimulator originalData={data} originalResult={result} currencyCode={currencyCode} />
                    <YearlyGrowthTable result={result} currencyCode={currencyCode} />
                  </>
                )}
                
                {/* Mobile share preview */}
                {mode !== 'comparison' && mode !== 'inflation' && mode !== 'goal' && (
                  <div className="max-w-sm mx-auto">
                    <SharePreview result={result} mode={mode} currencyCode={currencyCode} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
}
