import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";
import { CALCULATORS } from "../constants/calculatorList";
import * as Icons from "lucide-react";

export default function CalculatorLayout({ 
  title, 
  description, 
  currentSlug, 
  children 
}) {
  // Get active items from registry
  let relatedCalculators = [];
  const isUniversitySlug = currentSlug.startsWith("gpa-calculator/");

  if (isUniversitySlug) {
    const universities = [
      { name: "FAST GPA Calculator", slug: "gpa-calculator/fast", icon: "GraduationCap" },
      { name: "NUST GPA Calculator", slug: "gpa-calculator/nust", icon: "GraduationCap" },
      { name: "COMSATS GPA Calculator", slug: "gpa-calculator/comsats", icon: "GraduationCap" },
      { name: "UET GPA Calculator", slug: "gpa-calculator/uet", icon: "GraduationCap" },
      { name: "LUMS GPA Calculator", slug: "gpa-calculator/lums", icon: "GraduationCap" },
      { name: "GPA Calculator Pakistan", slug: "gpa-calculator/pakistan", icon: "GraduationCap" }
    ];
    relatedCalculators = universities.filter(u => u.slug !== currentSlug);
  } else {
    relatedCalculators = CALCULATORS
      .filter(c => c.slug !== currentSlug && !c.future)
      .slice(0, 3);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Dynamic Breadcrumbs */}
      <nav className="mb-6 flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
        <Link href="/" className="hover:text-amber-600 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/calculators" className="hover:text-amber-600 transition-colors">Calculators</Link>
        <span>/</span>
        <span className="text-slate-800">{title}</span>
      </nav>

      {/* Main Grid Wrapper */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Main Content Area */}
        <main className="lg:col-span-9 space-y-10">
          {children}
        </main>

        {/* Sidebar panel for internal linking & ads */}
        <aside className="lg:col-span-3 space-y-4 lg:sticky lg:top-[90px] self-start">
          {/* Ad slot placeholder */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 text-center min-h-[150px] flex flex-col justify-center items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Advertisement</span>
            <div className="w-full h-28 bg-slate-50 border border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-300 text-xs font-semibold">
              Ad Banner Slot
            </div>
          </div>

          {/* Related calculators list */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
              <Star size={18} className="text-amber-500 fill-amber-500" />
              Related Tools
            </h3>
            <ul className="space-y-2">
              {relatedCalculators.map((calc) => {
                const IconComponent = Icons[calc.icon] || Icons.Calculator;
                return (
                  <li key={calc.slug}>
                    <Link 
                       href={`/${calc.slug}`} 
                       className="flex items-center gap-3 p-2 rounded-xl text-slate-600 hover:text-amber-600 hover:bg-amber-50/50 border border-transparent hover:border-amber-100 transition-all text-xs font-semibold group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-slate-50 group-hover:bg-amber-50 flex items-center justify-center text-slate-500 group-hover:text-amber-600 transition-colors shrink-0">
                        <IconComponent size={14} />
                      </div>
                      <span className="truncate">{calc.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-3 pt-3 border-t border-slate-100">
              <Link 
                href="/calculators"
                className="text-xs font-bold text-amber-500 hover:text-amber-600 flex items-center gap-1.5 justify-center py-1 bg-amber-50/40 hover:bg-amber-50 rounded-xl transition-all"
              >
                <ArrowLeft size={12} /> View All Calculators
              </Link>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
