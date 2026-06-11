"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Calculator, Plus, Trash2, RefreshCw } from "lucide-react";
import React from "react";
import ToolLayout from "@/layouts/tool-layout";
import { GRADE_VALUES, calculateGPA } from "./utils/gpa-engine";

export default function GPACalculator() {
  const [courses, setCourses] = useState([
    { id: "1", name: "", grade: "A", credits: "3" },
  ]);

  const addCourse = () => {
    setCourses([...courses, { id: Math.random().toString(), name: "", grade: "A", credits: "3" }]);
  };

  const removeCourse = (id: string) => {
    if (courses.length > 1) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const updateCourse = (id: string, field: string, value: string) => {
    setCourses(courses.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const gpa = calculateGPA(courses);

  return (
    <ToolLayout>
      <div id="gpa-calculator-page" className="max-w-4xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-50 text-amber-600 rounded-xl mb-4">
            <Calculator size={24} />
          </div>
          <h1 className="text-3xl font-bold mb-2">GPA Calculator</h1>
          <p className="text-slate-600">Track your academic progress easily.</p>
        </motion.div>

        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1 text-center md:text-left">Your Current GPA</h2>
              <div className="text-6xl font-black text-amber-500 text-center md:text-left">{gpa}</div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setCourses([{ id: "1", name: "", grade: "A", credits: "3" }])}
                className="px-4 py-2 text-slate-500 hover:text-slate-700 flex items-center gap-2 text-sm font-bold"
              >
                <RefreshCw size={16} /> Reset
              </button>
              <button
                onClick={addCourse}
                className="bg-amber-500 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-amber-600 transition-colors flex items-center gap-2 shadow-lg shadow-amber-200"
              >
                <Plus size={20} /> Add Course
              </button>
            </div>
          </div>

          <div className="p-4 md:p-8">
            <div className="hidden md:grid grid-cols-12 gap-4 mb-4 text-xs font-bold text-slate-400 uppercase tracking-widest px-4">
              <div className="col-span-6">Course Name</div>
              <div className="col-span-3">Grade</div>
              <div className="col-span-2">Credits</div>
              <div className="col-span-1"></div>
            </div>

            <div className="space-y-4">
              {courses.map((course) => (
                <div key={course.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-50 p-4 md:bg-transparent md:p-0 rounded-2xl">
                  <div className="col-span-1 md:col-span-6">
                    <input
                      type="text"
                      placeholder="e.g. Mathematics"
                      className="w-full bg-white md:bg-slate-50 border border-slate-200 md:border-transparent rounded-xl px-4 py-2.5 focus:bg-white focus:border-amber-400 focus:outline-none transition-all"
                      value={course.name}
                      onChange={(e) => updateCourse(course.id, "name", e.target.value)}
                    />
                  </div>
                  <div className="col-span-1 md:col-span-3">
                    <select
                      className="w-full bg-white md:bg-slate-50 border border-slate-200 md:border-transparent rounded-xl px-4 py-2.5 focus:bg-white focus:border-amber-400 focus:outline-none transition-all appearance-none"
                      value={course.grade}
                      onChange={(e) => updateCourse(course.id, "grade", e.target.value)}
                    >
                      {Object.keys(GRADE_VALUES).map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <input
                      type="number"
                      className="w-full bg-white md:bg-slate-50 border border-slate-200 md:border-transparent rounded-xl px-4 py-2.5 focus:bg-white focus:border-amber-400 focus:outline-none transition-all"
                      value={course.credits}
                      onChange={(e) => updateCourse(course.id, "credits", e.target.value)}
                    />
                  </div>
                  <div className="col-span-1 md:col-span-1 text-center">
                    <button
                      onClick={() => removeCourse(course.id)}
                      className="text-slate-300 hover:text-red-500 transition-colors p-2"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center text-slate-500 text-sm max-w-2xl mx-auto">
          <p>This GPA calculator uses the standard 4.0 scale. Please note that some institutions may have different weighted scales for Honors or AP courses.</p>
        </div>
      </div>
    </ToolLayout>
  );
}
