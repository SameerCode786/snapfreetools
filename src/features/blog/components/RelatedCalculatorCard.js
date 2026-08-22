import React from "react";
import Link from "next/link";
import { ALL_TOOLS } from "@/features/tools-hub/constants/allToolsRegistry";
import { ArrowRight, Calculator } from "lucide-react";

export default function RelatedCalculatorCard({ calculatorSlug, customTitle, customDescription }) {
  const tool = ALL_TOOLS.find(t => t.slug === calculatorSlug);

  if (!tool) return null;

  return (
    <div className="my-8 bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
      <div className="flex items-start sm:items-center gap-4 sm:gap-6 flex-col sm:flex-row">
        <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center flex-shrink-0 border border-amber-100">
          <Calculator size={28} />
        </div>
        
        <div className="flex-grow">
          <h4 className="text-lg font-bold text-slate-900 mb-1">
            {customTitle || tool.name}
          </h4>
          <p className="text-slate-500 font-medium text-sm sm:text-base leading-relaxed">
            {customDescription || tool.description}
          </p>
        </div>

        <Link 
          href={`/${tool.slug}`}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-all shadow-md shadow-amber-500/20 whitespace-nowrap focus:ring-4 focus:ring-amber-500/20 focus:outline-none"
        >
          Open Calculator <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
