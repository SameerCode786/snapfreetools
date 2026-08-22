"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Calculator, Star, BookOpen } from "lucide-react";
import { Icons } from "@/lib/lucide-icons";
import { ALL_TOOLS } from "@/features/tools-hub/constants/allToolsRegistry";
import { getCalculatorsList, getCalculatorCategories, filterCalculators } from "./utils/registryHelpers";

import CalculatorsSearch from "./components/CalculatorsSearch";
import CategoryNav from "./components/CategoryNav";
import CalculatorCard from "./components/CalculatorCard";
import SharePageButton from "./components/SharePageButton";
import FAQSection from "@/features/student-hub/shared/components/FAQSection";

export default function CalculatorsHubFeature({ faqs }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Memoize the base calculators list derived from the registry
  const allCalculators = useMemo(() => getCalculatorsList(), []);
  
  // Memoize categories derived dynamically
  const categories = useMemo(() => getCalculatorCategories(allCalculators), [allCalculators]);

  // Memoize filtered calculators
  const filteredCalculators = useMemo(
    () => filterCalculators(allCalculators, searchQuery, selectedCategory),
    [allCalculators, searchQuery, selectedCategory]
  );

  // Extract featured and popular ones (only from live, visible tools)
  const featuredCalculators = useMemo(() => 
    allCalculators.filter((c) => c.featured && !c.future && c.status === "live"),
    [allCalculators]
  );
  
  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Premium Hero Section */}
      <section className="bg-white border-b border-slate-200 py-16 text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-amber-200/30 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-orange-200/30 blur-3xl" />
        </div>

        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-100 text-slate-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
            <Calculator size={14} className="text-amber-500" /> 
            CALCULATOR HUB
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Free Online Calculators
          </h1>
          <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            Accurate, easy-to-use calculators for finance, education, health, math, everyday planning, and more. Free to use, fast, and completely private.
          </p>

          <CalculatorsSearch 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
          />
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        
        {/* Category Navigation */}
        <CategoryNav 
          categories={categories} 
          selectedCategory={selectedCategory} 
          setSelectedCategory={setSelectedCategory} 
        />

        {/* Featured Section (Only when All is selected and no search) */}
        {(selectedCategory === "All" && searchQuery === "" && featuredCalculators.length > 0) && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Star size={20} className="text-amber-500 fill-amber-500" />
                Featured Calculators
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredCalculators.map((calc) => (
                <CalculatorCard key={calc.slug} calc={calc} />
              ))}
            </div>
          </section>
        )}

        {/* Main Directory Grid */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <h2 className="text-xl font-bold text-slate-900">
              {searchQuery !== "" ? "Search Results" : "All Calculators"}
              <span className="ml-2 text-sm font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                {filteredCalculators.length}
              </span>
            </h2>
            <SharePageButton />
          </div>

          {filteredCalculators.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center flex flex-col items-center justify-center space-y-3">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
                <Calculator size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No calculators found</h3>
              <p className="text-slate-500 font-medium">Try a different search term or browse another category.</p>
              <button 
                onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                className="mt-4 px-6 py-2.5 bg-amber-50 text-amber-600 hover:bg-amber-100 font-bold rounded-xl transition-colors text-sm"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCalculators.map((calc) => (
                <CalculatorCard key={calc.slug} calc={calc} />
              ))}
            </div>
          )}
        </section>

        {/* SEO Educational Content Section */}
        <section className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm relative overflow-hidden mt-16">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <BookOpen size={200} />
          </div>
          <div className="relative z-10 max-w-4xl space-y-6 text-slate-600 font-medium leading-relaxed">
            <h2 className="text-2xl font-black text-slate-900">Online Calculators for Everyday Decisions</h2>
            <p>
              Navigating complex financial choices, academic milestones, and daily planning can be challenging without the right tools. Our suite of <strong>free online calculators</strong> is designed to provide you with instant, mathematically precise answers so you can make informed decisions.
            </p>
            
            <h3 className="text-xl font-bold text-slate-800 pt-4">Financial Calculators</h3>
            <p>
              Whether you are taking out a new mortgage, planning to finance a car, or looking to grow your wealth through compounding interest, financial calculators remove the guesswork. By visualizing amortization schedules and projecting future returns, these tools empower you to take control of your personal finances.
            </p>

            <h3 className="text-xl font-bold text-slate-800 pt-4">Academic Calculators</h3>
            <p>
              Students and educators can leverage our academic tools to compute GPAs, estimate cumulative CGPAs, and translate confusing percentage scales. These tools are indispensable for tracking graduation requirements or evaluating scholarship eligibility without doing the math by hand.
            </p>
            
            <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-6 mt-6">
              <p className="text-sm text-slate-700">
                <strong>Disclaimer:</strong> While we strive for absolute mathematical accuracy, all results generated by our online calculators should be treated as estimates and educational aids. Always consult with a qualified financial advisor, academic counselor, or appropriate professional before making significant life decisions.
              </p>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <FAQSection faqs={faqs} className="mt-16" />

      </div>
    </div>
  );
}
