"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, HelpCircle } from "lucide-react";
import CalculatorLayout from "../../shared/components/CalculatorLayout";
import ResultCard from "../../shared/components/ResultCard";
import GeoAnswerCard from "../../shared/components/GeoAnswerCard";
import FormulaCard from "../../shared/components/FormulaCard";
import ExampleGrid from "../../shared/components/ExampleGrid";
import FAQSection from "../../shared/components/FAQSection";
import GradeScaleSelector from "../../shared/components/GradeScaleSelector";
import { calculateGPA } from "../../utils/formulaEngine";
import { GRADE_SCALES } from "../../shared/constants/gradeScales";

export default function GPACalculatorFeature({ faqs, initialScale = null }) {
  const [mounted, setMounted] = useState(false);
  const [scale, setScale] = useState(initialScale || "standard-4");
  const [courses, setCourses] = useState([
    { id: "1", name: "", grade: "A", credits: "3" },
    { id: "2", name: "", grade: "B", credits: "3" },
    { id: "3", name: "", grade: "A-", credits: "3" }
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeScale = GRADE_SCALES[scale];
  const gradesList = Object.keys(activeScale.grades);

  const addCourse = () => {
    setCourses([...courses, { id: Math.random().toString(), name: "", grade: gradesList[0], credits: "3" }]);
  };

  const removeCourse = (id) => {
    if (courses.length > 1) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  if (!mounted) {
    return (
      <CalculatorLayout 
        title={initialScale ? `${activeScale.name}` : "GPA Calculator"} 
        description={initialScale ? `Official GPA calculator pre-configured for ${activeScale.name}.` : "Calculate your semester and cumulative GPA with standard 4.0, 5.0, or custom university scales."}
        currentSlug={initialScale ? `gpa-calculator/${initialScale}` : "gpa-calculator"}
      >
        <div className="animate-pulse space-y-8">
          <div className="bg-slate-100 h-96 rounded-3xl" />
        </div>
      </CalculatorLayout>
    );
  }

  const updateCourse = (id, field, value) => {
    setCourses(courses.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const resetCalculator = () => {
    setCourses([
      { id: "1", name: "", grade: gradesList[0], credits: "3" }
    ]);
  };

  const gpa = calculateGPA(courses, scale);
  const totalCredits = courses.reduce((acc, c) => acc + (parseFloat(c.credits) || 0), 0);
  const activeResult = gpa ? {
    summary: `Calculated GPA: ${gpa} (Scale: ${activeScale.name}, Total Credits: ${totalCredits})`
  } : null;

  const examples = [
    {
      scenario: "I got an A in Physics (3 credits), a B in Calculus (4 credits), and an A- in English (3 credits). What is my GPA?",
      solution: "Physics grade points = 4.0 * 3 = 12. Calculus grade points = 3.0 * 4 = 12. English grade points = 3.7 * 3 = 11.1. Total Points = 12 + 12 + 11.1 = 35.1. Total Credits = 3 + 4 + 3 = 10. GPA = 35.1 / 10 = 3.51.",
      steps: [
        "Multiply course grade values by credits to find grade points.",
        "Add all course grade points together.",
        "Divide total grade points by total credit hours."
      ]
    },
    {
      scenario: "Can I calculate weighted AP/Honors classes?",
      solution: "Yes, you can select standard weighted scale ranges. Standard honors classes often add 0.5 to grade weights, and AP classes add 1.0, raising maximum potential scores to 5.0.",
      steps: [
        "Select the 5.0 weighted scale from the dropdown.",
        "Input your adjusted grade marks to calculate overall averages."
      ]
    }
  ];

  return (
    <CalculatorLayout 
      title={initialScale ? `${activeScale.name}` : "GPA Calculator"} 
      description={initialScale ? `Official GPA calculator pre-configured for ${activeScale.name}.` : "Calculate your semester and cumulative GPA with standard 4.0, 5.0, or custom university scales."}
      currentSlug={initialScale ? `gpa-calculator/${initialScale}` : "gpa-calculator"}
      activeResult={activeResult}
    >
      <div className="space-y-8">
        {/* Tool Header */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900">
                {initialScale ? `${activeScale.name.split(" GPA")[0].split(" Scale")[0]}` : "GPA Calculator"}
              </h1>
              <p className="text-slate-500 text-sm font-semibold">
                {initialScale ? `Official ${activeScale.description} grading system.` : "Track your semester grade point averages."}
              </p>
            </div>
            {!initialScale ? (
              <GradeScaleSelector value={scale} onChange={(val) => {
                setScale(val);
                // Normalize course grades to fit the new scale
                const newGrades = Object.keys(GRADE_SCALES[val].grades);
                setCourses(prev => prev.map(c => ({
                  ...c,
                  grade: newGrades.includes(c.grade) ? c.grade : newGrades[0]
                })));
              }} />
            ) : (
              <div className="bg-amber-50 text-amber-600 border border-amber-100 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider">
                Locked Scale: {activeScale.name}
              </div>
            )}
          </div>

          {/* Table Headers */}
          <div className="hidden md:grid grid-cols-12 gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest px-4 border-b border-slate-100 pb-2">
            <div className="col-span-6">Course Description</div>
            <div className="col-span-3">Grade Letter</div>
            <div className="col-span-2">Credit Hours</div>
            <div className="col-span-1"></div>
          </div>

          {/* Courses Rows */}
          <div className="space-y-4">
            {courses.map((course) => (
              <div 
                key={course.id} 
                className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-50 md:bg-transparent p-4 md:p-0 rounded-2xl md:px-4"
              >
                <div className="col-span-1 md:col-span-6">
                  <input
                    type="text"
                    placeholder="e.g. Mathematics"
                    value={course.name}
                    onChange={(e) => updateCourse(course.id, "name", e.target.value)}
                    className="w-full bg-white md:bg-slate-50 border border-slate-200 md:border-transparent rounded-xl px-4 py-2.5 focus:bg-white focus:border-amber-400 focus:outline-none transition-all text-sm font-semibold text-slate-700"
                  />
                </div>
                <div className="col-span-1 md:col-span-3">
                  <select
                    value={course.grade}
                    onChange={(e) => updateCourse(course.id, "grade", e.target.value)}
                    className="w-full bg-white md:bg-slate-50 border border-slate-200 md:border-transparent rounded-xl px-4 py-2.5 focus:bg-white focus:border-amber-400 focus:outline-none transition-all text-sm font-semibold text-slate-700 cursor-pointer"
                  >
                    {gradesList.map(g => (
                      <option key={g} value={g}>{g} ({activeScale.grades[g].toFixed(2)})</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-1 md:col-span-2">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    placeholder="Credits"
                    value={course.credits}
                    onChange={(e) => updateCourse(course.id, "credits", e.target.value)}
                    className="w-full bg-white md:bg-slate-50 border border-slate-200 md:border-transparent rounded-xl px-4 py-2.5 focus:bg-white focus:border-amber-400 focus:outline-none transition-all text-sm font-semibold text-slate-700"
                  />
                </div>
                <div className="col-span-1 md:col-span-1 text-center">
                  <button
                    onClick={() => removeCourse(course.id)}
                    disabled={courses.length === 1}
                    className="text-slate-300 hover:text-red-500 disabled:opacity-30 disabled:hover:text-slate-300 transition-colors p-2"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Course Form Matrix */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex justify-between items-center flex-wrap gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Courses & Grades</h2>
              <p className="text-xs text-slate-500 font-medium">Log your individual subject credits and grade marks.</p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handlePresetCollege}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                Reset 4 Courses
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {courses.map((course, idx) => (
              <div key={course.id} className="flex items-center gap-3 bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                <span className="w-6 text-center text-xs font-bold text-slate-400">{idx + 1}</span>
                <input
                  type="text"
                  placeholder="Course Name (Optional)"
                  value={course.name}
                  onChange={(e) => updateCourse(course.id, "name", e.target.value)}
                  className="flex-1 min-w-0 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-amber-400"
                />
                <input
                  type="number"
                  placeholder="Credits"
                  value={course.credits}
                  onChange={(e) => updateCourse(course.id, "credits", e.target.value)}
                  className="w-20 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-amber-400"
                  step="0.5"
                  min="0"
                />
                <select
                  value={course.grade}
                  onChange={(e) => updateCourse(course.id, "grade", e.target.value)}
                  className="w-24 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  {activeScale.grades.map((g) => (
                    <option key={g.letter} value={g.letter}>
                      {g.letter} ({g.points})
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => removeCourse(course.id)}
                  disabled={courses.length <= 1}
                  className="p-2 text-slate-400 hover:text-red-500 disabled:opacity-30 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={addCourse}
              className="w-full py-3 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-2xl font-bold text-xs border border-amber-200/60 transition-all flex items-center justify-center gap-2"
            >
              <Plus size={16} /> Add Class
            </button>
          </div>
        </div>

        {/* Dynamic Results Banner */}
        <ResultCard 
          value={gpa} 
          label="Calculated GPA"
          subtext={`Calculated using the ${activeScale.name} with ${courses.reduce((acc, c) => acc + (parseFloat(c.credits) || 0), 0)} credit hours.`}
          onReset={resetCalculator} 
        />
      </div>
    </CalculatorLayout>
  );
}
