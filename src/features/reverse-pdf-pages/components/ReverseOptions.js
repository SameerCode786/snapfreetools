"use client";

import React, { useState } from "react";
import { ArrowUpDown, ArrowRight, Sparkles, ShieldCheck, Sliders, Info, CheckCircle2 } from "lucide-react";

function getSequencePreview(totalPages, mode, rangeStart, rangeEnd) {
  if (totalPages <= 0) return { original: [], reversed: [] };

  let start = 1;
  let end = totalPages;

  if (mode === "range") {
    start = Math.max(1, Math.min(totalPages, parseInt(rangeStart, 10) || 1));
    end = Math.max(start, Math.min(totalPages, parseInt(rangeEnd, 10) || totalPages));
  }

  // Format array representation for preview
  if (totalPages <= 6) {
    const orig = Array.from({ length: totalPages }, (_, i) => i + 1);
    let rev;
    if (mode === "range") {
      rev = [
        ...orig.slice(0, start - 1),
        ...orig.slice(start - 1, end).reverse(),
        ...orig.slice(end)
      ];
    } else {
      rev = [...orig].reverse();
    }
    return {
      originalStr: orig.join(" → "),
      reversedStr: rev.join(" → ")
    };
  }

  // Large PDFs: Compact representation
  if (mode === "range") {
    return {
      originalStr: `1 → ... → ${start} → ... → ${end} → ... → ${totalPages}`,
      reversedStr: `1 → ... → ${end} → ... → ${start} → ... → ${totalPages}`
    };
  }

  return {
    originalStr: `1 → 2 → 3 → ... → ${totalPages - 1} → ${totalPages}`,
    reversedStr: `${totalPages} → ${totalPages - 1} → ... → 3 → 2 → 1`
  };
}

export default function ReverseOptions({ pageCount, options, onOptionsChange, onConvert, disabled }) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const pages = pageCount || 0;

  const mode = options?.mode || "all";
  const rangeStart = options?.rangeStart || 1;
  const rangeEnd = options?.rangeEnd || pages;

  const handleModeChange = (newMode) => {
    onOptionsChange({
      ...options,
      mode: newMode,
      rangeStart: 1,
      rangeEnd: pages
    });
  };

  const handleStartChange = (val) => {
    const num = parseInt(val, 10);
    onOptionsChange({
      ...options,
      rangeStart: isNaN(num) ? 1 : Math.max(1, Math.min(pages, num))
    });
  };

  const handleEndChange = (val) => {
    const num = parseInt(val, 10);
    onOptionsChange({
      ...options,
      rangeEnd: isNaN(num) ? pages : Math.max(1, Math.min(pages, num))
    });
  };

  const preview = getSequencePreview(pages, mode, rangeStart, rangeEnd);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 max-w-xl mx-auto shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <ArrowUpDown size={20} />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Page Order Reversal</h3>
            <p className="text-xs text-slate-500 font-medium">Invert page sequence without re-encoding</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            showAdvanced || mode === "range"
              ? "bg-amber-100 text-amber-800"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Sliders size={14} />
          <span>{showAdvanced ? "Hide Options" : "Advanced Options"}</span>
        </button>
      </div>

      {/* Advanced Range Options Accordion */}
      {(showAdvanced || mode === "range") && (
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-4 animate-fadeIn">
          <div className="text-xs font-black text-slate-800 uppercase tracking-wider">
            Reversal Mode
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleModeChange("all")}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                mode === "all"
                  ? "border-amber-500 bg-white ring-2 ring-amber-500/20 font-extrabold text-amber-900"
                  : "border-slate-200 bg-white/50 text-slate-600 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold">Reverse Entire PDF</span>
                {mode === "all" && <CheckCircle2 size={14} className="text-amber-500" />}
              </div>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">All {pages} pages (Default)</p>
            </button>

            <button
              type="button"
              onClick={() => handleModeChange("range")}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                mode === "range"
                  ? "border-amber-500 bg-white ring-2 ring-amber-500/20 font-extrabold text-amber-900"
                  : "border-slate-200 bg-white/50 text-slate-600 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold">Selected Page Range</span>
                {mode === "range" && <CheckCircle2 size={14} className="text-amber-500" />}
              </div>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Reverse specific pages</p>
            </button>
          </div>

          {mode === "range" && (
            <div className="pt-2 grid grid-cols-2 gap-3 border-t border-slate-200/60">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">From Page</label>
                <input
                  type="number"
                  min="1"
                  max={pages}
                  value={rangeStart}
                  onChange={(e) => handleStartChange(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">To Page</label>
                <input
                  type="number"
                  min="1"
                  max={pages}
                  value={rangeEnd}
                  onChange={(e) => handleEndChange(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Visual Sequence Preview Card */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between gap-4 text-center">
          {/* Original Order */}
          <div className="flex-1 space-y-1.5 min-w-0">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Original Sequence</span>
            <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs">
              <p className="text-xs font-extrabold text-slate-800 truncate" title={preview.originalStr}>
                {preview.originalStr}
              </p>
            </div>
          </div>

          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <ArrowRight size={16} />
          </div>

          {/* Reversed Order */}
          <div className="flex-1 space-y-1.5 min-w-0">
            <span className="text-[10px] font-black text-amber-600 uppercase tracking-wider">
              {mode === "range" ? "Range Reversed Sequence" : "Reversed Sequence"}
            </span>
            <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-3 shadow-2xs">
              <p className="text-xs font-extrabold text-amber-900 truncate" title={preview.reversedStr}>
                {preview.reversedStr}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Accurate Content Preservation Wording */}
      <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-4 flex items-center gap-3">
        <ShieldCheck size={22} className="text-emerald-600 shrink-0" />
        <div className="space-y-0.5 text-xs text-emerald-900">
          <p className="font-extrabold">No Rasterization — Original PDF Content Preserved</p>
          <p className="text-emerald-800 font-medium">
            Page reordering is executed via native PDF object stream copying. All vector text, fonts, images, and formatting stay 100% untouched without image conversion.
          </p>
        </div>
      </div>

      {/* Convert Action Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onConvert}
          disabled={disabled}
          className="w-full py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-white font-extrabold text-sm shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
        >
          <Sparkles size={18} />
          <span>Reverse PDF</span>
        </button>
      </div>
    </div>
  );
}
