"use client";

import React, { useState, useEffect } from "react";
import CalculatorLayout from "@/features/student-hub/shared/components/CalculatorLayout";
import { BookOpen, CalendarRange, GraduationCap, Info } from "lucide-react";
import { CREDIT_HOUR_CALCULATOR_FAQS } from "./content/faqs";
import EducationalContent from "./content/educationalContent";
import CreditHourDashboard from "./components/CreditHourDashboard";
import CourseListForm from "./components/CourseListForm";
import DegreeProgressForm from "./components/DegreeProgressForm";
import WhatIfSimulator from "./components/WhatIfSimulator";
import { calculateCourseListWorkload, calculateDegreeProgress } from "./utils/calculations";
import { validateDegreeProgress } from "./utils/validation";
import { getCourseListRecommendations, getDegreeProgressRecommendations } from "./recommendations/recommendationEngine";

export default function CreditHourCalculatorFeature({ faqs }) {
  const [activeMode, setActiveMode] = useState("core");

  const [courses, setCourses] = useState([{ id: Date.now(), name: "", credits: "" }]);
  
  const [degreeConfig, setDegreeConfig] = useState({
    targetCredits: 120,
    completedCredits: 0,
    currentSemesterCredits: 0,
    remainingSemesters: 4
  });

  const [simulationResult, setSimulationResult] = useState(null);
  
  const result = activeMode === "degree" 
    ? calculateDegreeProgress(degreeConfig.targetCredits, degreeConfig.completedCredits, degreeConfig.currentSemesterCredits, degreeConfig.remainingSemesters)
    : calculateCourseListWorkload(courses);

  const activeResult = simulationResult || result;

  const recommendations = activeMode === "degree" 
    ? getDegreeProgressRecommendations(activeResult)
    : getCourseListRecommendations(activeResult);

  const validation = activeMode === "degree"
    ? validateDegreeProgress(degreeConfig.targetCredits, degreeConfig.completedCredits, degreeConfig.currentSemesterCredits)
    : { isValid: true, errors: [] };

  useEffect(() => {
    // Reset simulation when mode changes or primary config changes
    setSimulationResult(null);
  }, [activeMode, courses, degreeConfig]);

  const tabs = [
    { id: "core", label: "Total Credits", icon: BookOpen },
    { id: "semester", label: "Semester Workload", icon: CalendarRange },
    { id: "degree", label: "Degree Progress", icon: GraduationCap }
  ];

  return (
    <CalculatorLayout
      title="Credit Hour Calculator"
      description="Calculate your total college credit hours, semester workload, and track your degree progress instantly."
      icon={<BookOpen className="w-8 h-8 text-white" />}
      color="from-indigo-500 to-indigo-600"
      activeMode={activeMode}
      onModeChange={setActiveMode}
      tabs={tabs}
      faqs={faqs}
      activeResult={activeResult}
      educationalContent={<EducationalContent />}
    >
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-3/5 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6">
              {activeMode === "degree" ? "Degree Details" : activeMode === "semester" ? "Semester Courses" : "Completed Courses"}
            </h2>

            {activeMode === "degree" ? (
              <DegreeProgressForm config={degreeConfig} setConfig={setDegreeConfig} />
            ) : (
              <CourseListForm courses={courses} setCourses={setCourses} />
            )}

            {!validation.isValid && (
              <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl">
                <h4 className="text-sm font-bold text-red-800 mb-2">Please fix the following issues:</h4>
                <ul className="list-disc pl-5 text-sm text-red-700 space-y-1">
                  {validation.errors.map((err, i) => <li key={i}>{err}</li>)}
                </ul>
              </div>
            )}
          </div>
          
          {activeMode === "degree" && validation.isValid && (
            <WhatIfSimulator 
              originalConfig={degreeConfig} 
              onSimulate={setSimulationResult} 
              onReset={() => setSimulationResult(null)} 
            />
          )}
        </div>

        <div className="w-full lg:w-2/5">
          <div className="sticky top-6">
            <CreditHourDashboard mode={activeMode} result={result} simulation={simulationResult} />
            
            {!activeResult.isEmpty && recommendations.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 mb-8">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-4">
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
