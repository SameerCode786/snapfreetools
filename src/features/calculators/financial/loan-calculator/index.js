"use client";

import React, { useState, useEffect } from "react";
import CalculatorLayout from "@/features/student-hub/shared/components/CalculatorLayout";
import ModeSwitcher from "./components/ModeSwitcher";
import LoanInputForm from "./components/LoanInputForm";
import LoanResultDashboard from "./components/LoanResultDashboard";
import AmortizationSchedule from "./components/AmortizationSchedule";
import WhatIfSimulator from "./components/WhatIfSimulator";
import LoanComparison from "./components/LoanComparison";
import LoanInsights from "./components/LoanInsights";
import SharePreview from "./components/SharePreview";
import { EDUCATIONAL_CONTENT } from "./content/educationalContent";
import { 
  calculateStandardAmortization, 
  calculateAffordability, 
  calculateReverseLoan, 
  generateYearlySchedule,
  getFrequencyDetails
} from "./utils/calculations";
import { 
  validateLoanInput, 
  validateAffordabilityInput,
  validateExtraPaymentInput
} from "./utils/validation";
import { 
  generateStandardRecommendations, 
  generateAffordabilityRecommendations 
} from "./utils/recommendations";

export default function LoanCalculatorFeature({ faqs }) {
  const [mode, setMode] = useState('standard');
  const [data, setData] = useState({
    amount: "",
    interest: "",
    term: "",
    termUnit: "years",
    frequency: "monthly",
    currencyCode: "USD",
    income: "",
    expenses: "",
    desiredDti: "",
    payment: "",
    extraPayment: "",
  });
  
  const [dataB, setDataB] = useState({
    amount: "",
    interest: "",
    term: "",
    termUnit: "years",
    frequency: "monthly",
  });

  const [validation, setValidation] = useState({ isValid: true, errors: {} });
  const [validationB, setValidationB] = useState({ isValid: true, errors: {} });
  
  const [result, setResult] = useState(null);
  const [resultB, setResultB] = useState(null);
  const [yearlySchedule, setYearlySchedule] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  const updateData = (field, value) => setData(prev => ({ ...prev, [field]: value }));
  const updateDataB = (field, value) => setDataB(prev => ({ ...prev, [field]: value }));

  useEffect(() => {
    // Validate based on mode
    let currentValidation = { isValid: true, errors: {} };
    if (mode === 'standard' || mode === 'comparison') {
      currentValidation = validateLoanInput(data);
    } else if (mode === 'affordability') {
      currentValidation = validateAffordabilityInput(data);
    } else if (mode === 'extra') {
      currentValidation = validateLoanInput(data);
      const extraVal = validateExtraPaymentInput(data);
      if (!extraVal.isValid) currentValidation.isValid = false;
      currentValidation.errors = { ...currentValidation.errors, ...extraVal.errors };
    }
    
    setValidation(currentValidation);

    if (mode === 'comparison') {
      setValidationB(validateLoanInput(dataB));
    }
  }, [data, dataB, mode]);

  useEffect(() => {
    if (!validation.isValid) {
      setResult(null);
      setYearlySchedule([]);
      setRecommendations([]);
      return;
    }

    let p, rAnnual, n, freq;

    if (mode === 'standard' || mode === 'extra' || mode === 'comparison') {
      p = Number(data.amount);
      rAnnual = Number(data.interest);
      n = Number(data.term);
      if (data.termUnit === 'years') n = n * 12;
      freq = getFrequencyDetails(data.frequency);
    }

    if (mode === 'standard' || mode === 'comparison') {
      const res = calculateStandardAmortization(p, rAnnual, n, freq.periodsPerYear, 0);
      setResult(res);
      if (!res.isEmpty) {
        setYearlySchedule(generateYearlySchedule(res.schedule));
        setRecommendations(generateStandardRecommendations(res, data.currencyCode));
      } else {
        setYearlySchedule([]);
        setRecommendations([]);
      }
    } 
    
    if (mode === 'extra') {
      const extraPmt = Number(data.extraPayment) || 0;
      const res = calculateStandardAmortization(p, rAnnual, n, freq.periodsPerYear, extraPmt);
      setResult(res);
      if (!res.isEmpty) {
        setYearlySchedule(generateYearlySchedule(res.schedule));
        setRecommendations(generateStandardRecommendations(res, data.currencyCode));
      }
    }

    if (mode === 'affordability') {
      let termMonths = Number(data.term);
      if (data.termUnit === 'years') termMonths *= 12; // if we added years to affordability, but right now it's months in input
      
      const res = calculateAffordability(
        Number(data.income), 
        Number(data.expenses), 
        0, 
        Number(data.desiredDti), 
        Number(data.interest), 
        Number(data.term)
      );
      setResult(res);
      setRecommendations(generateAffordabilityRecommendations(res, data.currencyCode));
    }

    if (mode === 'reverse') {
      const res = calculateReverseLoan(Number(data.payment), Number(data.interest), Number(data.term));
      setResult(res);
      setRecommendations([]);
    }

    // Comparison Mode B
    if (mode === 'comparison' && validationB.isValid) {
      const pB = Number(dataB.amount);
      const rAnnualB = Number(dataB.interest);
      let nB = Number(dataB.term);
      if (dataB.termUnit === 'years') nB = nB * 12;
      const freqB = getFrequencyDetails(dataB.frequency);
      
      const resB = calculateStandardAmortization(pB, rAnnualB, nB, freqB.periodsPerYear, 0);
      setResultB(resB);
    }

  }, [data, dataB, mode, validation.isValid, validationB?.isValid]);

  return (
    <CalculatorLayout
      title="Loan Calculator & Analysis Suite"
      description="Calculate loan payments, explore affordability, compare loans, and see your amortization schedule. Free, secure, and accurate loan analysis tool."
      currentSlug="loan-calculator"
      activeResult={result}
      faqs={faqs}
      educationalContent={EDUCATIONAL_CONTENT}
    >
      <div className="w-full">
        <ModeSwitcher currentMode={mode} onModeChange={setMode} />
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-3/5">
            <LoanInputForm 
              currentMode={mode} 
              data={data} 
              updateData={updateData} 
              validation={validation} 
            />
            
            {mode === 'comparison' && (
              <div className="mt-8">
                <h3 className="text-sm font-bold text-slate-700 mb-3">Loan B Details</h3>
                <LoanInputForm 
                  currentMode="standard" // Reuse standard inputs for Loan B
                  data={dataB} 
                  updateData={updateDataB} 
                  validation={validationB} 
                />
              </div>
            )}
            
            {mode === 'comparison' ? (
              <LoanComparison resultA={result} resultB={resultB} currencyCode={data.currencyCode} />
            ) : (
              <>
                <LoanResultDashboard result={result} mode={mode} currencyCode={data.currencyCode} />
                {(mode === 'standard' || mode === 'extra') && (
                  <WhatIfSimulator originalData={data} originalResult={result} currencyCode={data.currencyCode} />
                )}
                {(mode === 'standard' || mode === 'extra') && (
                  <AmortizationSchedule yearlySchedule={yearlySchedule} currencyCode={data.currencyCode} />
                )}
              </>
            )}
          </div>
          
          <div className="w-full lg:w-2/5">
            <div className="sticky top-6">
              <LoanInsights recommendations={recommendations} />
              
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <p className="text-xs text-slate-500">
                  This calculator provides estimates for informational purposes only. Actual loan payments, rates, fees, eligibility and approval requirements vary by lender and loan agreement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
}
