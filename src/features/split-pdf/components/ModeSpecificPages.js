import React from "react";
import { FileText, AlertCircle, Info, Sparkles } from "lucide-react";
import { parsePageRanges } from "../utils/rangeParser";

export default function ModeSpecificPages({ totalPages, rangeValue, onChangeRange }) {
  const validation = parsePageRanges(rangeValue, totalPages);

  const applyPreset = (preset) => {
    if (preset === "all") {
      onChangeRange(`1-${totalPages}`);
    } else if (preset === "odd") {
      const odds = [];
      for (let i = 1; i <= totalPages; i += 2) odds.push(i);
      onChangeRange(odds.join(", "));
    } else if (preset === "even") {
      const evens = [];
      for (let i = 2; i <= totalPages; i += 2) evens.push(i);
      onChangeRange(evens.join(", "));
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
      <div className="space-y-1">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
          <FileText className="text-amber-500" size={18} />
          Extract Specific Pages
        </h3>
        <p className="text-xs text-slate-500 font-medium">
          Enter individual page numbers or ranges separated by commas.
        </p>
      </div>

      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-700 block">
          Pages to Extract:
        </label>

        <div className="relative">
          <input
            type="text"
            value={rangeValue}
            onChange={(e) => onChangeRange(e.target.value)}
            placeholder="e.g. 1, 3, 5-10"
            className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-xl px-4 py-3 text-sm font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
          />
        </div>

        {/* Validation Feedback */}
        {rangeValue && !validation.isValid && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-bold flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{validation.error}</span>
          </div>
        )}

        {validation.isValid && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-bold flex items-center justify-between">
            <span>
              ✔ Valid range selection: {validation.pageIndices.length} page{validation.pageIndices.length > 1 ? "s" : ""} selected.
            </span>
            {validation.hasDuplicates && (
              <span className="text-[11px] text-amber-700 font-normal">
                (Duplicate page entries consolidated)
              </span>
            )}
          </div>
        )}

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Quick Presets:</span>
          <button
            type="button"
            onClick={() => applyPreset("all")}
            className="text-xs font-bold text-slate-600 hover:text-amber-600 bg-slate-100 hover:bg-amber-50 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
          >
            All Pages (1–{totalPages})
          </button>
          <button
            type="button"
            onClick={() => applyPreset("odd")}
            className="text-xs font-bold text-slate-600 hover:text-amber-600 bg-slate-100 hover:bg-amber-50 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
          >
            Odd Pages Only
          </button>
          <button
            type="button"
            onClick={() => applyPreset("even")}
            className="text-xs font-bold text-slate-600 hover:text-amber-600 bg-slate-100 hover:bg-amber-50 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
          >
            Even Pages Only
          </button>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] text-slate-500 font-medium space-y-1">
          <p className="font-bold text-slate-700 flex items-center gap-1">
            <Info size={13} className="text-amber-500" /> Example formats:
          </p>
          <ul className="list-disc list-inside space-y-0.5 text-slate-600">
            <li><code>1, 3, 5</code> — extracts pages 1, 3, and 5 into one PDF</li>
            <li><code>1-5</code> — extracts pages 1 through 5</li>
            <li><code>1, 3, 5-10</code> — combines individual pages and page ranges</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
