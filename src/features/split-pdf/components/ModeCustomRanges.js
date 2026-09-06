import React from "react";
import { Layers, Plus, Trash2, AlertCircle, CheckCircle } from "lucide-react";
import { validateCustomRangeGroups } from "../utils/rangeParser";

export default function ModeCustomRanges({ totalPages, ranges, onChangeRanges }) {
  const validation = validateCustomRangeGroups(ranges, totalPages);

  const handleUpdateRange = (index, field, value) => {
    const updated = [...ranges];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    onChangeRanges(updated);
  };

  const handleAddRange = () => {
    const lastEnd = ranges.length > 0 ? parseInt(ranges[ranges.length - 1].endPage, 10) || 1 : 1;
    const nextStart = Math.min(lastEnd + 1, totalPages);
    const nextEnd = Math.min(nextStart + 2, totalPages);

    onChangeRanges([
      ...ranges,
      {
        id: Date.now() + Math.random(),
        startPage: nextStart.toString(),
        endPage: nextEnd.toString()
      }
    ]);
  };

  const handleRemoveRange = (index) => {
    if (ranges.length <= 1) return;
    const updated = ranges.filter((_, idx) => idx !== index);
    onChangeRanges(updated);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Layers className="text-amber-500" size={18} />
            Split by Custom Page Ranges
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Create custom page groups. Each group becomes an individual PDF document.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddRange}
          className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 shadow-sm"
        >
          <Plus size={14} /> Add Range Group
        </button>
      </div>

      {/* Range Rows List */}
      <div className="space-y-3">
        {ranges.map((group, index) => (
          <div 
            key={group.id || index}
            className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4"
          >
            <span className="text-xs font-black text-amber-600 uppercase tracking-wider shrink-0">
              PDF #{index + 1}
            </span>

            <div className="flex items-center gap-3 flex-1">
              <div className="flex-1 space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  From Page
                </label>
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={group.startPage}
                  onChange={(e) => handleUpdateRange(index, "startPage", e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <span className="text-slate-400 font-bold self-end mb-2.5">to</span>

              <div className="flex-1 space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  To Page
                </label>
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={group.endPage}
                  onChange={(e) => handleUpdateRange(index, "endPage", e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="button"
              disabled={ranges.length <= 1}
              onClick={() => handleRemoveRange(index)}
              className={`p-2.5 rounded-xl border transition-colors shrink-0 ${
                ranges.length <= 1
                  ? "text-slate-300 border-slate-100 cursor-not-allowed"
                  : "text-slate-500 hover:text-red-600 bg-white hover:bg-red-50 border-slate-200 hover:border-red-200"
              }`}
              title="Delete Range"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Validation Message */}
      {!validation.isValid && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-bold flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{validation.error}</span>
        </div>
      )}

      {validation.isValid && (
        <div className="space-y-2">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-bold flex items-center justify-between">
            <span>
              ✔ Ready to generate {validation.ranges.length} custom PDF document{validation.ranges.length > 1 ? "s" : ""}.
            </span>
          </div>
          {validation.overlapFound && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-semibold">
              ⚠️ Note: Some page numbers overlap between ranges. Each range group will include its specified pages cleanly.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
