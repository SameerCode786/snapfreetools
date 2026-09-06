"use client";

import React, { useState, useEffect } from "react";
import CalculatorLayout from "@/features/student-hub/shared/components/CalculatorLayout";
import { UserCheck, Info, Target } from "lucide-react";
import { calculateAggregate, calculateRequiredEntryTestScore } from "./utils/calculations";
import { validateAdmissionInput, safeFormatNumber } from "./utils/validation";
import { getAdmissionRecommendations, getTargetRecommendations } from "./utils/recommendations";

import AdmissionInputForm from "./components/AdmissionInputForm";
import WeightConfiguration from "./components/WeightConfiguration";
import AdmissionResultDashboard from "./components/AdmissionResultDashboard";
import WhatIfSimulator from "./components/WhatIfSimulator";
import TargetPlanner from "./components/TargetPlanner";
import EducationalContent from "./content/educationalContent";

export default function AdmissionCalculatorFeature({ faqs }) {
  const [data, setData] = useState({
    sscObtained: "",
    sscTotal: "1100",
    hsscObtained: "",
    hsscTotal: "1100",
    etObtained: "",
    etTotal: "100",
    sscWeight: "20",
    hsscWeight: "30",
    etWeight: "50"
  });

  const [result, setResult] = useState(null);
  const [simulationResult, setSimulationResult] = useState(null);
  const [targetResult, setTargetResult] = useState(null);
  const [targetValue, setTargetValue] = useState("");
  const [validation, setValidation] = useState({ isValid: true, errors: [], weightValidation: { isValid: true, total: 100, difference: 0 } });
  const [recommendations, setRecommendations] = useState([]);

  const updateData = (key, value) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const v = validateAdmissionInput(data);
    setValidation(v);
    
    if (v.isValid && v.weightValidation.isValid) {
      const calcResult = calculateAggregate(data);
      setResult(calcResult);
      setRecommendations(getAdmissionRecommendations(calcResult, data));
      
      if (targetValue) {
        setTargetResult(calculateRequiredEntryTestScore(data, targetValue));
      }
    } else {
      setResult(null);
      setRecommendations([]);
    }
  }, [data, targetValue]);

  const handleSimulate = (simResult) => {
    setSimulationResult(simResult);
    setTargetResult(null); // Clear target result when simulating
  };

  const handleCalculateTarget = (res, val) => {
    setTargetResult(res);
    setTargetValue(val);
    setSimulationResult(null);
  };

  const buildShareText = () => {
    if (!result) return "";
    return `📊 My Admission Aggregate Result\n\nSSC: ${result.sscPercentage.toFixed(2)}%\nHSSC: ${result.hsscPercentage.toFixed(2)}%\nEntry Test: ${result.etPercentage.toFixed(2)}%\n\nFinal Aggregate: ${result.finalAggregate.toFixed(2)}%\n\nCalculated with SnapFreeTools Admission Calculator.`;
  };

  const activeResult = (result && !result.isEmpty && validation.weightValidation.isValid && validation.isValid) ? {
    summary: `Admission Chance Estimate: ${result.percentage ? result.percentage.toFixed(1) : ''}% (${result.category || ''})`
  } : null;

  return (
    <CalculatorLayout
      title="Admission Calculator"
      subtitle="Estimate your admission chances, simulate scores, and calculate required target entry test marks."
      icon={<UserCheck className="w-8 h-8 text-white" />}
      faqs={faqs}
      toolId="admission-calculator"
      activeResult={activeResult}
      educationalContent={<EducationalContent />}
    >
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-3/5 space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <AdmissionInputForm data={data} updateData={updateData} />
            <div className="mt-8">
              <WeightConfiguration data={data} updateData={updateData} validation={validation.weightValidation} />
            </div>
            
            {!validation.isValid && validation.errors.length > 0 && (
              <div className="mt-6 p-4 rounded-lg bg-red-50 text-red-800 border border-red-100">
                <ul className="list-disc pl-5 text-sm font-medium space-y-1">
                  {validation.errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {validation.weightValidation.isValid && validation.isValid && (
            <WhatIfSimulator 
              originalData={data} 
              onSimulate={handleSimulate} 
              onReset={() => setSimulationResult(null)} 
            />
          )}

          {validation.weightValidation.isValid && validation.isValid && (
            <TargetPlanner 
              data={data}
              onCalculateTarget={handleCalculateTarget}
            />
          )}
        </div>

        <div className="w-full lg:w-2/5">
          <div className="sticky top-6">
            <AdmissionResultDashboard 
              result={simulationResult || result} 
              isSimulation={!!simulationResult} 
            />

            {!simulationResult && targetResult && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-indigo-500" />
                  Target Planner Result
                </h3>
                <div className="space-y-3">
                  {getTargetRecommendations(targetResult).map((rec, i) => (
                    <div 
                      key={i} 
                      className={`p-4 text-sm font-medium rounded-r-lg border-l-4 ${
                        rec.type === "success" ? "bg-emerald-50/60 text-emerald-900 border-emerald-500" :
                        rec.type === "warning" ? "bg-amber-50/60 text-amber-900 border-amber-500" :
                        "bg-blue-50/60 text-blue-900 border-blue-500"
                      }`}
                    >
                      {rec.text}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!simulationResult && !targetResult && !result?.isEmpty && recommendations.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                  <Info className="w-5 h-5 text-indigo-500" />
                  Recommendations
                </h3>
                <div className="space-y-3">
                  {recommendations.map((rec, i) => (
                    <div 
                      key={i} 
                      className={`p-4 text-sm font-medium rounded-r-lg border-l-4 ${
                        rec.type === "success" ? "bg-emerald-50/60 text-emerald-900 border-emerald-500" :
                        rec.type === "warning" ? "bg-amber-50/60 text-amber-900 border-amber-500" :
                        "bg-blue-50/60 text-blue-900 border-blue-500"
                      }`}
                    >
                      {rec.text}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
}
