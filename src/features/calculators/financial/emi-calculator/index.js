"use client";

import React, { useState, useEffect } from "react";
import CalculatorLayout from "@/features/student-hub/shared/components/CalculatorLayout";
import ModeSwitcher from "./components/ModeSwitcher";
import EMIInputForm from "./components/EMIInputForm";
import EMIResultDashboard from "./components/EMIResultDashboard";
import AmortizationSchedule from "./components/AmortizationSchedule";
import WhatIfSimulator from "./components/WhatIfSimulator";
import PrepaymentAnalysis from "./components/PrepaymentAnalysis";
import LoanComparison from "./components/LoanComparison";
import FinancialInsights from "./components/FinancialInsights";
import SharePreview from "./components/SharePreview";

import { 
  validateStandardEMI, 
  validateAffordability, 
  validateComparison, 
  validatePrepayment, 
  validateReverseEMI, 
  validateRequiredEMI 
} from "./utils/validation";

import { 
  calculateStandardEMI, 
  generateAmortizationSchedule, 
  groupAmortizationByYear, 
  calculateAffordability, 
  calculateReverseEMI, 
  calculateRequiredEMI,
  getFrequencyDetails
} from "./utils/calculations";

import { 
  generateStandardRecommendations, 
  generateAffordabilityRecommendations 
} from "./utils/recommendations";

import { EDUCATIONAL_CONTENT } from "./content/educationalContent";

export default function EMICalculatorFeature({ faqs }) {
  const [mode, setMode] = useState('standard');
  const [currencyCode, setCurrencyCode] = useState('USD');
  
  // States initialized as empty strings
  const [data, setData] = useState({
    amount: '',
    rate: '',
    tenure: '',
    tenureUnit: 'years',
    frequency: 'monthly',
    income: '',
    debt: '',
    dti: '',
    extraPayment: '',
    oneTimePrepayment: '',
    targetEmi: '',
    maxEmi: ''
  });

  const [dataB, setDataB] = useState({
    amount: '',
    rate: '',
    tenure: '',
    tenureUnit: 'years',
    frequency: 'monthly'
  });

  const [result, setResult] = useState(null);
  const [resultB, setResultB] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [insights, setInsights] = useState([]);
  const [prepaymentResult, setPrepaymentResult] = useState(null);

  useEffect(() => {
    // Reset results when mode changes
    setResult(null);
    setResultB(null);
    setSchedule([]);
    setInsights([]);
    setPrepaymentResult(null);
  }, [mode]);

  useEffect(() => {
    let isValid = false;
    let newResult = null;
    let newResultB = null;
    let newSchedule = [];
    let newInsights = [];
    let newPrepaymentResult = null;

    if (mode === 'standard') {
      const v = validateStandardEMI(data);
      if (v.isValid) {
        newResult = calculateStandardEMI(data.amount, data.rate, data.tenure, data.tenureUnit, data.frequency);
        if (!newResult.isEmpty) {
          const rawSchedule = generateAmortizationSchedule(data.amount, data.rate, data.tenure, data.tenureUnit, data.frequency);
          const freq = getFrequencyDetails(data.frequency);
          newSchedule = groupAmortizationByYear(rawSchedule, freq.periodsPerYear);
          newInsights = generateStandardRecommendations(newResult, currencyCode);
        }
      }
    } 
    else if (mode === 'affordability') {
      const v = validateAffordability(data);
      if (v.isValid) {
        newResult = calculateAffordability(data.income, data.debt, data.rate, data.tenure, data.tenureUnit, data.dti);
        if (!newResult.isEmpty) {
          newInsights = generateAffordabilityRecommendations(newResult, currencyCode);
        }
      }
    }
    else if (mode === 'comparison') {
      const v = validateComparison(data, dataB);
      if (v.isValid) {
        newResult = calculateStandardEMI(data.amount, data.rate, data.tenure, data.tenureUnit, data.frequency);
        newResultB = calculateStandardEMI(dataB.amount, dataB.rate, dataB.tenure, dataB.tenureUnit, dataB.frequency);
      }
    }
    else if (mode === 'prepayment') {
      const vBase = validateStandardEMI(data);
      const vPrep = validatePrepayment(data);
      if (vBase.isValid) {
        newResult = calculateStandardEMI(data.amount, data.rate, data.tenure, data.tenureUnit, data.frequency);
        if (vPrep.isValid && !newResult.isEmpty) {
          const prepRawSchedule = generateAmortizationSchedule(data.amount, data.rate, data.tenure, data.tenureUnit, data.frequency, data.extraPayment, data.oneTimePrepayment);
          
          if (prepRawSchedule.length > 0) {
            let totalInterest = 0;
            let totalPayment = 0;
            prepRawSchedule.forEach(m => {
              totalInterest += m.interest;
              totalPayment += m.payment;
            });
            newPrepaymentResult = {
              isEmpty: false,
              totalInterest,
              totalPayment,
              numberOfPayments: prepRawSchedule.length
            };
          } else {
            newPrepaymentResult = { isEmpty: true };
          }
        } else {
          newPrepaymentResult = { isEmpty: true };
        }
      }
    }
    else if (mode === 'reverse') {
      const v = validateReverseEMI(data);
      if (v.isValid) {
        newResult = calculateReverseEMI(data.targetEmi, data.rate, data.tenure, data.tenureUnit, data.frequency);
      }
    }
    else if (mode === 'required') {
      const v = validateRequiredEMI(data);
      if (v.isValid) {
        newResult = calculateRequiredEMI(data.amount, data.maxEmi, data.rate, data.frequency);
      }
    }

    if (newResult && !newResult.isEmpty) {
      setResult(newResult);
      setResultB(newResultB);
      setSchedule(newSchedule);
      setInsights(newInsights);
      setPrepaymentResult(newPrepaymentResult);
    } else {
      setResult(null);
      setResultB(null);
      setSchedule([]);
      setInsights([]);
      setPrepaymentResult(null);
    }
  }, [data, dataB, mode, currencyCode]);

  return (
    <CalculatorLayout
      title="EMI Calculator & Loan Repayment Analysis Suite"
      description="Calculate Equated Monthly Installments, view detailed amortization schedules, compare loans, and explore repayment scenarios."
      currentSlug="emi-calculator"
      activeResult={result}
      icon="LineChart"
      faqs={faqs}
      content={EDUCATIONAL_CONTENT}
      relatedTools={[
        { id: "loan-calculator", name: "Loan Calculator", slug: "loan-calculator", icon: "Calculator", description: "Advanced loan calculation suite." },
        { id: "credit-hour-calculator", name: "Credit Hour Calculator", slug: "credit-hour-calculator", icon: "Clock", description: "Track your degree progress." }
      ]}
    >
      <div className="space-y-6">
        <ModeSwitcher mode={mode} setMode={setMode} />
        
        <EMIInputForm 
          mode={mode}
          data={data}
          setData={setData}
          dataB={dataB}
          setDataB={setDataB}
          currencyCode={currencyCode}
          setCurrencyCode={setCurrencyCode}
        />
        
        {mode === 'comparison' ? (
          <div className="space-y-8">
            <LoanComparison resultA={result} resultB={resultB} currencyCode={currencyCode} />
          </div>
        ) : mode === 'prepayment' ? (
          <div className="space-y-8">
            <EMIResultDashboard result={result} mode="standard" currencyCode={currencyCode} />
            <PrepaymentAnalysis baseResult={result} prepaymentResult={prepaymentResult} currencyCode={currencyCode} />
          </div>
        ) : (
          <div className="space-y-8">
            <EMIResultDashboard result={result} mode={mode} currencyCode={currencyCode} />
            
            {mode === 'standard' && (
              <>
                <FinancialInsights insights={insights} />
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
                  <div className="xl:col-span-2">
                    <AmortizationSchedule result={result} schedule={schedule} currencyCode={currencyCode} />
                    <WhatIfSimulator originalData={data} originalResult={result} currencyCode={currencyCode} />
                  </div>
                  <div className="xl:col-span-1">
                    <div className="sticky top-24">
                      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <p className="text-xs text-slate-500">
                          This calculator provides estimates for informational purposes only. Actual loan payments, rates, fees, eligibility and approval requirements vary by lender and loan agreement.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {mode === 'affordability' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <FinancialInsights insights={insights} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
}
