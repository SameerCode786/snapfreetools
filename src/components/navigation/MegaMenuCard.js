import Link from "next/link";
import { ArrowRight, GraduationCap } from "lucide-react";

export default function MegaMenuCard({ item, onItemClick }) {
  if (!item) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between h-full relative overflow-hidden group transition-all duration-300 hover:border-amber-500/30">
      {/* Decorative gradient background blur */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none transition-opacity duration-300 group-hover:bg-amber-500/15" />
      
      <div className="space-y-5">
        <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/15 group-hover:scale-105 transition-transform duration-300">
          <GraduationCap size={24} />
        </div>
        <div>
          <span className="text-[10px] font-extrabold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block mb-3">
            Featured Tool
          </span>
          <h4 className="font-extrabold text-white text-lg leading-snug">
            {item.name}
          </h4>
          <p className="text-xs text-slate-400 font-medium leading-relaxed mt-2.5">
            {item.description}
          </p>
        </div>
      </div>

      <div className="mt-8 pt-5 border-t border-slate-800">
        <Link
          href={`/${item.slug}`}
          onClick={onItemClick}
          className="inline-flex items-center justify-center gap-2 w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-3 rounded-2xl text-xs transition-all shadow-md shadow-amber-500/10 hover:shadow-lg hover:shadow-amber-500/20 outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
        >
          Calculate GPA Now
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
        </Link>
      </div>
    </div>
  );
}

