import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";
import { CALCULATORS } from "../constants/calculatorList";
import { Icons } from "@/lib/lucide-icons";
import { JsonLd } from "@/seo/structured-data";

export default function CalculatorLayout({ 
  title, 
  description, 
  currentSlug = "", 
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

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.snapfreetools.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Calculators",
        "item": "https://www.snapfreetools.com/calculators"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": title,
        "item": `https://www.snapfreetools.com/${currentSlug}`
      }
    ]
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <JsonLd schema={breadcrumbSchema} />
      {/* Dynamic Breadcrumbs */}
      <nav className="mb-6 flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
        <Link href="/" className="hover:text-amber-600 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/calculators" className="hover:text-amber-600 transition-colors">Calculators</Link>
        <span>/</span>
        <span className="text-slate-800">{title}</span>
      </nav>

      {/* Main Content Area */}
      <div className="w-full space-y-10">
        <main className="w-full space-y-10">
          {children}
        </main>

        {/* Related calculators list (UX & SEO) */}
        {relatedCalculators.length > 0 && (
          <div className="border-t border-slate-100 pt-10 mt-12 space-y-6">
            <div className="flex items-center gap-2">
              <Star size={18} className="text-amber-500 fill-amber-500 animate-pulse" />
              <h3 className="font-extrabold text-slate-800 text-base">Explore Related Calculators</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedCalculators.map((calc) => {
                const IconComponent = Icons[calc.icon] || Icons.Calculator;
                return (
                  <Link
                    key={calc.slug}
                    href={`/${calc.slug}`}
                    className="flex items-start gap-4 p-5 bg-white border border-slate-200 rounded-3xl shadow-sm hover:border-amber-300 hover:shadow-md hover:shadow-amber-50/20 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-slate-50 group-hover:bg-amber-50 flex items-center justify-center text-slate-500 group-hover:text-amber-600 transition-colors shrink-0">
                      <IconComponent size={18} />
                    </div>
                    <div className="space-y-1 py-0.5 min-w-0 flex-1">
                      <h4 className="font-bold text-slate-800 text-sm group-hover:text-amber-600 transition-colors truncate">
                        {calc.name}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed truncate">
                        {calc.description || "Free educational calculation tool."}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="flex justify-center pt-2">
              <Link 
                href="/calculators"
                className="inline-flex items-center gap-1.5 py-2.5 px-6 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-xs rounded-xl shadow-xs transition-all"
              >
                <ArrowLeft size={14} /> View All Calculators
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
