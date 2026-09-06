import React from "react";
import { Scissors, ArrowRight, ShieldCheck } from "lucide-react";

export default function OutputPreviewCard({
  summaryText,
  isValid,
  onExecuteSplit
}) {
  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 space-y-6 shadow-xl relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full inline-block">
            Output Summary
          </span>
          <h3 className="text-base md:text-lg font-extrabold text-white leading-snug">
            {summaryText}
          </h3>
          <p className="text-xs text-slate-400 font-medium">
            Pages are copied natively without rasterization or quality loss.
          </p>
        </div>

        <button
          type="button"
          disabled={!isValid}
          onClick={onExecuteSplit}
          className={`w-full md:w-auto px-8 py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2.5 shadow-lg shrink-0 ${
            isValid
              ? "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20 hover:scale-105 active:scale-95 cursor-pointer"
              : "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"
          }`}
        >
          <Scissors size={20} />
          Split PDF Now
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
