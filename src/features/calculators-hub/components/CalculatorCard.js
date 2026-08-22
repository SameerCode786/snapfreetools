import Link from "next/link";
import { Icons } from "@/lib/lucide-icons";
import { ChevronRight } from "lucide-react";

export default function CalculatorCard({ calc }) {
  // Use a fallback icon if the specified one doesn't exist
  const IconComponent = Icons[calc.icon] || Icons.Calculator;
  const isComingSoon = calc.status === "coming-soon" || calc.future;

  if (isComingSoon) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-6 opacity-65 cursor-not-allowed flex flex-col justify-between min-h-[200px] shadow-sm relative overflow-hidden select-none">
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
              <IconComponent size={24} />
            </div>
            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-md font-bold uppercase tracking-wider">
              Coming Soon
            </span>
          </div>
          <h3 className="font-bold text-slate-700 text-lg leading-tight">{calc.name}</h3>
          <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-2">
            {calc.description}
          </p>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-100 text-slate-400 text-sm font-bold">
          Available Soon
        </div>
      </div>
    );
  }

  return (
    <Link
      href={`/${calc.slug}`}
      className="bg-white border border-slate-200 hover:border-amber-400 rounded-3xl p-6 flex flex-col justify-between min-h-[200px] hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-amber-500/10 group focus:outline-none focus:ring-4 focus:ring-amber-500/20"
      aria-label={`Open ${calc.name}`}
    >
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 group-hover:scale-110 flex items-center justify-center text-amber-500 transition-transform duration-300">
            <IconComponent size={24} />
          </div>
          {calc.popular && (
            <span className="text-[10px] bg-orange-50 border border-orange-100 text-orange-600 px-2 py-1 rounded-md font-extrabold uppercase tracking-wider">
              Popular
            </span>
          )}
        </div>
        <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors text-lg leading-tight">
          {calc.name}
        </h3>
        <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-2">
          {calc.description}
        </p>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm font-bold text-amber-500 group-hover:text-amber-600 transition-colors pt-4 border-t border-slate-100">
        <span>Use Calculator</span>
        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
