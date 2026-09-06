import React from "react";
import { SlidersHorizontal, Info } from "lucide-react";

export default function ModeEveryNPages({ totalPages, nValue, onChangeN }) {
  const n = parseInt(nValue, 10) || 1;
  const validN = Math.max(1, Math.min(n, totalPages));
  const estimatedFilesCount = Math.ceil(totalPages / validN);

  const presets = [1, 2, 3, 5, 10].filter(p => p <= totalPages);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
      <div className="space-y-1">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
          <SlidersHorizontal className="text-amber-500" size={18} />
          Split Every N Pages
        </h3>
        <p className="text-xs text-slate-500 font-medium">
          Divide this PDF document into equal chunks of N pages.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-full sm:w-48 space-y-1">
            <label className="text-xs font-bold text-slate-700 block">
              Split Interval (N Pages):
            </label>
            <input
              type="number"
              min="1"
              max={totalPages}
              value={nValue}
              onChange={(e) => onChangeN(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:outline-none"
            />
          </div>

          <div className="flex-1 space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Quick Presets:</span>
            <div className="flex flex-wrap gap-2">
              {presets.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => onChangeN(val.toString())}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                    validN === val
                      ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                  }`}
                >
                  Every {val} {val === 1 ? "page" : "pages"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-amber-50/60 border border-amber-200/80 p-4 rounded-2xl text-xs text-amber-900 font-semibold space-y-1">
          <p className="flex items-center gap-1.5 font-bold">
            <Info size={14} className="text-amber-600" /> Output Summary:
          </p>
          <p className="text-amber-800 font-medium">
            Splitting every {validN} {validN === 1 ? "page" : "pages"} will create <strong>{estimatedFilesCount} PDF files</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
