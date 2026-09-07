import React, { useState } from "react";
import { Sliders, Wrench, ChevronDown, ChevronUp } from "lucide-react";
import { SMART_TRANSFORMATIONS } from "../utils/textTransformations";

export default function TransformationsMenu({
  preserveLineBreaks,
  setPreserveLineBreaks,
  preserveSpaces,
  setPreserveSpaces,
  onApplyTransformation
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
      
      {/* Header & Toggle Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Sliders size={16} className="text-amber-500" />
            Conversion Preferences & Formatting Rules
          </h3>
        </div>

        {/* Toggles */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-700">
          
          {/* Preserve Line Breaks Toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={preserveLineBreaks}
              onChange={(e) => setPreserveLineBreaks(e.target.checked)}
              className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 border-slate-300 transition-colors cursor-pointer"
            />
            <span>Preserve line breaks</span>
          </label>

          {/* Preserve Spaces Toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={preserveSpaces}
              onChange={(e) => setPreserveSpaces(e.target.checked)}
              className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 border-slate-300 transition-colors cursor-pointer"
            />
            <span>Preserve multiple spaces</span>
          </label>
        </div>
      </div>

      {/* Smart Text Actions Collapsible */}
      <div className="pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between text-xs font-extrabold text-slate-600 hover:text-slate-900 py-1 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <Wrench size={14} className="text-amber-500" />
            <span>Smart Text Cleaning & Filtering Utilities</span>
          </span>
          <span className="flex items-center gap-1 text-[11px] text-amber-600 font-bold">
            <span>{isOpen ? "Hide Utilities" : "Show Utilities"}</span>
            {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </span>
        </button>

        {isOpen && (
          <div className="pt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 animate-fadeIn">
            {SMART_TRANSFORMATIONS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => onApplyTransformation(t.id)}
                title={t.desc}
                className="px-3 py-2 bg-slate-50 hover:bg-amber-50 hover:text-amber-900 border border-slate-200/60 hover:border-amber-200 rounded-xl text-xs font-bold text-slate-700 text-left transition-all cursor-pointer truncate"
              >
                {t.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
