"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import CalculatorLayout from "../../shared/components/CalculatorLayout";
import ResultCard from "../../shared/components/ResultCard";
import GeoAnswerCard from "../../shared/components/GeoAnswerCard";
import FormulaCard from "../../shared/components/FormulaCard";
import ExampleGrid from "../../shared/components/ExampleGrid";
import FAQSection from "../../shared/components/FAQSection";
import GradeScaleSelector from "../../shared/components/GradeScaleSelector";
import { calculateGPA } from "../../utils/formulaEngine";
import { GRADE_SCALES } from "../../shared/constants/gradeScales";

export default function SGPACalculatorFeature({ faqs }) {
  const [mounted, setMounted] = useState(false);
  const [scale, setScale] = useState("standard-4");
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
        title="SGPA Calculator" 
        description="Calculate your Semester Grade Point Average (SGPA) for individual academic terms easily."
        currentSlug="sgpa-calculator"
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

  const sgpa = calculateGPA(courses, scale);
  const totalCredits = courses.reduce((acc, c) => acc + (parseFloat(c.credits) || 0), 0);
  const activeResult = sgpa ? {
    summary: `Semester SGPA: ${sgpa} (${activeScale.name}, ${totalCredits} Credit Hours)`
  } : null;

  const examples = [
    {
      scenario: "I took 3 courses this semester: Chemistry (4 credits - Grade A), Algebra (3 credits - Grade B+), and History (3 credits - Grade B). What is my SGPA?",
      solution: "Chemistry points = 4.0 * 4 = 16. Algebra points = 3.3 * 3 = 9.9. History points = 3.0 * 3 = 9. Total Points = 16 + 9.9 + 9 = 34.9. Total Credits = 4 + 3 + 3 = 10. SGPA = 34.9 / 10 = 3.49.",
      steps: [
        "Find the numeric values corresponding to each grade letter.",
        "Multiply grade values by credits to determine term points.",
        "Sum points and divide by total semester credit hours."
      ]
    }
  ];

  return (
    <CalculatorLayout 
      title="SGPA Calculator" 
      description="Calculate your Semester Grade Point Average (SGPA) for individual academic terms easily."
      currentSlug="sgpa-calculator"
      activeResult={activeResult}
      faqs={faqs}
      seoContent={
        <>
          <GeoAnswerCard 
            question="What is SGPA and how is it calculated?"
            answer="SGPA stands for Semester Grade Point Average. It measures your academic performance inside a single semester. To calculate SGPA, multiply the grade values of each course by their credit hours, sum these points, and divide by the total credit hours taken during the semester."
          />

          <FormulaCard 
            formula="SGPA = \sum (Grade Points \times Course Credits) / \sum (Course Credits)"
            explanation="Multiply the grade points of each letter grade earned by course credits, add them, and divide by total credits registered in the term."
          />

          <ExampleGrid examples={examples} />
        </>
      }
    >
      <div className="space-y-8">
        {/* Forms Card */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900">SGPA Calculator</h1>
              <p className="text-slate-500 text-sm font-semibold">Enter your semester classes below to compute your term standing.</p>
            </div>
            <GradeScaleSelector value={scale} onChange={(val) => {
              setScale(val);
              const newGrades = Object.keys(GRADE_SCALES[val].grades);
              setCourses(prev => prev.map(c => ({
                ...c,
                grade: newGrades.includes(c.grade) ? c.grade : newGrades[0]
              })));
            }} />
          </div>

          <div className="hidden md:grid grid-cols-12 gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest px-4 border-b border-slate-100 pb-2">
            <div className="col-span-6">Class Title</div>
            <div className="col-span-3">Grade</div>
            <div className="col-span-2">Credit Hours</div>
            <div className="col-span-1"></div>
          </div>

          <div className="space-y-4">
            {courses.map((course) => (
              <div 
                key={course.id} 
                className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-50 md:bg-transparent p-4 md:p-0 rounded-2xl md:px-4"
              >
                <div className="col-span-1 md:col-span-6">
                  <input
                    type="text"
                    placeholder="e.g. English Literature"
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

          <div className="pt-4">
            <button
              onClick={addCourse}
              className="bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-100 font-bold px-5 py-2.5 rounded-xl text-sm transition-all flex items-center gap-1.5"
            >
              <Plus size={16} /> Add Class
            </button>
          </div>
        </div>

        {/* Results Banner */}
        <ResultCard 
          value={sgpa} 
          label="Semester SGPA"
          subtext={`Calculated using the ${activeScale.name} scale.`}
          onReset={resetCalculator} 
        />
      </div>
    </CalculatorLayout>
  );
}
