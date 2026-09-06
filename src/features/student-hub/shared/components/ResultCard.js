import React from "react";
import { RotateCcw } from "lucide-react";

export default function ResultCard({ 
  value, 
  label = "Your Result", 
  subtext,
  onReset,
  className = "" 
}) {
  return (
    <div className={`bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-8 text-white shadow-xl shadow-amber-500/10 flex flex-col md:flex-row justify-between items-center gap-6 ${className}`}>
      <div className="text-center md:text-left">
        <span className="text-xs font-extrabold uppercase tracking-widest text-amber-100 opacity-90 block mb-1">
          {label}
        </span>
        <div className="text-6xl font-black tracking-tight leading-none mb-3">
          {value}
        </div>
        {subtext && (
          <p className="text-sm text-amber-50 font-medium max-w-md">
            {subtext}
          </p>
        )}
      </div>

      {onReset && (
        <div className="flex gap-3 shrink-0">
          <button
            onClick={onReset}
            className="bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white font-bold p-3 rounded-2xl flex items-center justify-center gap-2 text-sm border border-white/10"
            title="Reset calculator inputs"
          >
            <RotateCcw size={18} />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      )}
    </div>
  );
}

