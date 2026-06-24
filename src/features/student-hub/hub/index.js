"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ChevronRight, Calculator, Star } from "lucide-react";
import * as Icons from "lucide-react";
import { CALCULATORS } from "../shared/constants/calculatorList";
import FAQSection from "../shared/components/FAQSection";

export default function StudentCalculatorHubFeature({ faqs }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Academic Calculators", "Student & Admission Tools", "Financial Calculators", "Utility Calculators"];

  // Filter calculations based on query and tab
  const filteredCalculators = CALCULATORS.filter(calc => {
    const matchesSearch = calc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          calc.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || calc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredCalculators = CALCULATORS.filter(c => c.featured && !c.future);
  const popularCalculators = CALCULATORS.filter(c => c.popular && !c.future);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Premium Hero Banner */}
      <section className="bg-white border-b border-slate-200 py-16 text-center px-4 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-40">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-amber-200/30 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-orange-200/30 blur-3xl" />
        </div>

        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <Calculator size={14} /> Student Calculator Hub
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Academic & Grade Planners <span className="text-amber-500">Made Simple</span>
          </h1>
          <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            Calculate your semester GPA, project cumulative CGPA, plan required goals for scholarships, and convert grade percentages instantly with our collection of free browser-based student tools.
          </p>

          {/* Large Interactive Search Bar */}
          <div className="max-w-xl mx-auto relative pt-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search calculators (e.g. GPA, Merit, Percentage...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white focus:border-amber-400 rounded-2xl pl-12 pr-4 py-4 text-sm font-semibold focus:outline-none transition-all shadow-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid View */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        
        {/* Category Filtering Tabs */}
        <div className="flex flex-wrap items-center gap-2 pb-4 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat 
                  ? "bg-amber-500 text-white shadow-md shadow-amber-500/15" 
                  : "bg-white text-slate-600 hover:text-amber-500 border border-slate-200 hover:border-amber-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Card Spotlight (Only when All or Academic selected) */}
        {(selectedCategory === "All" || selectedCategory === "Academic Calculators") && searchQuery === "" && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Star size={18} className="text-amber-500 fill-amber-500" />
              Featured Planners
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredCalculators.map((calc) => {
                const IconComponent = Icons[calc.icon] || Icons.Calculator;
                return (
                  <Link 
                    key={calc.slug}
                    href={`/${calc.slug}`}
                    className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl p-8 text-white hover:-translate-y-1 transition-all duration-200 shadow-lg shadow-amber-500/10 flex flex-col justify-between h-64 group relative overflow-hidden"
                  >
                    <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 opacity-10 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent size={200} />
                    </div>
                    <div className="relative z-10 space-y-3">
                      <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/10">
                        <IconComponent size={24} />
                      </div>
                      <h3 className="text-2xl font-black">{calc.name}</h3>
                      <p className="text-amber-50 text-sm max-w-md leading-relaxed font-semibold">
                        {calc.description}
                      </p>
                    </div>
                    <div className="relative z-10 flex items-center gap-1.5 font-bold text-xs bg-white text-amber-600 w-fit px-4 py-2 rounded-xl">
                      Launch Tool <ChevronRight size={14} />
                    </div>
                  </Link>
                );
              })}

              {/* Extra visual secondary featured card */}
              <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col justify-between h-64 shadow-sm hover:shadow-md transition-all">
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center border border-orange-100">
                    <Icons.TrendingUp size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Raise Your GPA</h3>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium">
                    Use our goal-setting Required GPA calculator to determine the grades needed in future terms to reach graduation or scholarship limits.
                  </p>
                </div>
                <Link 
                  href="/required-gpa-calculator"
                  className="flex items-center gap-1.5 font-bold text-xs bg-slate-50 hover:bg-amber-50 border border-slate-100 hover:border-amber-200 text-slate-700 hover:text-amber-600 w-fit px-4 py-2 rounded-xl transition-all"
                >
                  Target Planner <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Directory Grid of filtered items */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800">
            {searchQuery !== "" ? "Search Results" : "All Calculators"} ({filteredCalculators.length})
          </h2>
          
          {filteredCalculators.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-500 font-medium">
              No calculators matching your search. Try search terms like "GPA", "Merit", "EMI".
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCalculators.map((calc) => {
                const IconComponent = Icons[calc.icon] || Icons.Calculator;
                
                return calc.future ? (
                  <div 
                    key={calc.slug}
                    className="bg-white border border-slate-200 rounded-3xl p-6 opacity-60 cursor-not-allowed flex flex-col justify-between min-h-[180px] shadow-sm relative overflow-hidden"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                          <IconComponent size={18} />
                        </div>
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">Coming Soon</span>
                      </div>
                      <h3 className="font-bold text-slate-700 text-base">{calc.name}</h3>
                      <p className="text-slate-400 text-xs font-semibold leading-relaxed line-clamp-2">
                        {calc.description}
                      </p>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={calc.slug}
                    href={`/${calc.slug}`}
                    className="bg-white border border-slate-200 hover:border-amber-300 rounded-3xl p-6 flex flex-col justify-between min-h-[180px] hover:-translate-y-0.5 transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-amber-500/5 group"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-amber-50 flex items-center justify-center text-slate-500 group-hover:text-amber-600 transition-colors">
                          <IconComponent size={18} />
                        </div>
                        {calc.popular && (
                          <span className="text-[9px] bg-amber-50 text-amber-600 border border-amber-100 px-2 py-0.5 rounded-md font-extrabold uppercase tracking-widest">Popular</span>
                        )}
                      </div>
                      <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors text-base">{calc.name}</h3>
                      <p className="text-slate-500 text-xs font-semibold leading-relaxed line-clamp-2">
                        {calc.description}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center gap-1 text-xs font-bold text-amber-500 group-hover:text-amber-600 transition-colors pt-2 border-t border-slate-50">
                      Open Tool <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Structured SEO Article Layout */}
        <section className="bg-white rounded-3xl border border-slate-200 p-8 md:p-12 space-y-8 mt-12 shadow-sm">
          <div className="prose max-w-none text-slate-600 space-y-6 font-medium text-sm md:text-base leading-relaxed">
            <h2 className="text-2xl font-black text-slate-900 leading-tight">
              Why Track Your Grades and CGPA Regularly?
            </h2>
            <p>
              Academic success is more than just study sessions—it's about setting clear objectives and measuring progress. Monitoring your Semester Grade Point Average (SGPA) and Cumulative Grade Point Average (CGPA) helps you identify performance fluctuations, adjust study plans, and stay on track for graduation requirements, honor lists, and scholarships.
            </p>
            <p>
              SnapFreeTools offers a suite of educational grade conversion tools designed for students, high-schoolers, and admissions candidates. You can instantly run GPA-to-Percentage calculations, evaluate final grade scores, or compute university aggregate merit rankings using pre-configured admission structures.
            </p>

            <h3 className="text-xl font-extrabold text-slate-800">
              Topical Clusters & Practical Use Cases
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Cumulative Projections</strong>: Add past semester credits and forecast future GPAs to project graduation averages.
              </li>
              <li>
                <strong>Goal Tracking</strong>: Plan ahead to meet specific grade requirements for honors programs or college applications.
              </li>
              <li>
                <strong>Percentage Conversions</strong>: Convert GPAs to percentage values (and vice-versa) for university admission guidelines.
              </li>
            </ul>
          </div>
        </section>

        {/* FAQs */}
        <FAQSection faqs={faqs} className="mt-12" />

      </section>
    </div>
  );
}
