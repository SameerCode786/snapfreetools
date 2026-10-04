"use client";

import React, { useState } from "react";
import {
  FileText,
  SlidersHorizontal,
  Layers,
  ArrowRight,
  RefreshCw,
  Info,
  CheckCircle2,
  Image as ImageIcon
} from "lucide-react";

export default function Workspace({
  pdfData,
  thumbnails = [],
  isLoadingThumbnails = false,
  onStartConversion,
  onReset
}) {
  const [dpi, setDpi] = useState(150);
  const [selectionMode, setSelectionMode] = useState("all"); // 'all' or 'custom'
  const [customRange, setCustomRange] = useState("");
  const [validationError, setValidationError] = useState("");

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const handleConvertClick = () => {
    setValidationError("");

    let pageRange = "all";
    if (selectionMode === "custom") {
      if (!customRange.trim()) {
        setValidationError("Please enter a valid page range (e.g., 1-3, 5).");
        return;
      }
      pageRange = customRange.trim();
    }

    onStartConversion({
      dpi,
      pageRange
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* File Overview Header */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
            <FileText size={28} />
          </div>
          <div>
            <h3 className="font-black text-slate-900 text-lg sm:text-xl truncate max-w-md">
              {pdfData.name}
            </h3>
            <div className="flex items-center gap-3 text-xs font-bold text-slate-500 mt-1">
              <span>{formatFileSize(pdfData.size)}</span>
              <span>•</span>
              <span className="text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                {pdfData.pageCount} {pdfData.pageCount === 1 ? "Page" : "Pages"}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onReset}
          className="px-4 py-2 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer bg-slate-50 hover:bg-slate-100"
        >
          <RefreshCw size={14} />
          Change PDF
        </button>
      </div>

      {/* Conversion Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* DPI / Resolution Setting */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-black text-base">
            <SlidersHorizontal size={20} className="text-amber-500" />
            <h4>Image Quality / Resolution (DPI)</h4>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "72 DPI", value: 72, note: "Standard / Web" },
              { label: "150 DPI", value: 150, note: "High Quality (Recommended)" },
              { label: "300 DPI", value: 300, note: "Ultra / Print" }
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setDpi(option.value)}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  dpi === option.value
                    ? "border-amber-500 bg-amber-50/70 text-slate-950 font-black shadow-xs ring-2 ring-amber-500/20"
                    : "border-slate-200 text-slate-600 hover:border-slate-300 font-semibold"
                }`}
              >
                <span className="text-sm">{option.label}</span>
                <span className="text-[10px] opacity-75 font-normal">{option.note}</span>
              </button>
            ))}
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-2.5 text-xs text-slate-500 font-medium">
            <Info size={16} className="text-amber-500 shrink-0 mt-0.5" />
            <p>
              Higher DPI produces sharper PNG images but requires slightly more memory and processing time. Canvas rendering auto-caps at 12 Megapixels for memory stability.
            </p>
          </div>
        </div>

        {/* Page Range Selection */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-black text-base">
            <Layers size={20} className="text-amber-500" />
            <h4>Page Selection</h4>
          </div>

          <div className="space-y-3">
            <label
              onClick={() => setSelectionMode("all")}
              className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                selectionMode === "all"
                  ? "border-amber-500 bg-amber-50/70 text-slate-950 font-bold shadow-xs"
                  : "border-slate-200 text-slate-600 hover:border-slate-300 font-semibold"
              }`}
            >
              <div className="flex items-center gap-2.5 text-sm">
                <input
                  type="radio"
                  name="selectionMode"
                  checked={selectionMode === "all"}
                  onChange={() => setSelectionMode("all")}
                  className="accent-amber-500"
                />
                <span>All Pages (1 - {pdfData.pageCount})</span>
              </div>
              <span className="text-xs bg-white px-2 py-0.5 rounded-md border border-slate-200 font-bold text-slate-500">
                {pdfData.pageCount} {pdfData.pageCount === 1 ? "PNG" : "PNGs"}
              </span>
            </label>

            <label
              onClick={() => setSelectionMode("custom")}
              className={`p-3.5 rounded-2xl border space-y-3 cursor-pointer transition-all ${
                selectionMode === "custom"
                  ? "border-amber-500 bg-amber-50/70 text-slate-950 font-bold shadow-xs"
                  : "border-slate-200 text-slate-600 hover:border-slate-300 font-semibold"
              }`}
            >
              <div className="flex items-center gap-2.5 text-sm">
                <input
                  type="radio"
                  name="selectionMode"
                  checked={selectionMode === "custom"}
                  onChange={() => setSelectionMode("custom")}
                  className="accent-amber-500"
                />
                <span>Custom Page Range</span>
              </div>

              {selectionMode === "custom" && (
                <div className="pl-7 pr-1 pt-1" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="text"
                    value={customRange}
                    onChange={(e) => setCustomRange(e.target.value)}
                    placeholder={`e.g. 1-3, 5 (Max: ${pdfData.pageCount})`}
                    className="w-full px-3 py-2 text-xs font-mono font-bold bg-white border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 text-slate-900"
                  />
                  <p className="text-[11px] text-slate-500 font-medium mt-1">
                    Use commas and hyphens (e.g. <code className="font-mono bg-white px-1 py-0.5 rounded">1-4, 7</code>)
                  </p>
                </div>
              )}
            </label>
          </div>

          {validationError && (
            <p className="text-xs text-rose-600 font-bold bg-rose-50 p-2.5 rounded-xl border border-rose-200">
              {validationError}
            </p>
          )}
        </div>
      </div>

      {/* Visual Page Thumbnails Preview */}
      {thumbnails.length > 0 && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-900 font-black text-base">
              <ImageIcon size={20} className="text-amber-500" />
              <h4>Document Preview ({thumbnails.length} {thumbnails.length === 1 ? "page" : "pages"})</h4>
            </div>
            {isLoadingThumbnails && (
              <span className="text-xs text-amber-600 font-bold animate-pulse">
                Loading previews...
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-72 overflow-y-auto p-1">
            {thumbnails.map((thumb) => (
              <div
                key={thumb.pageNumber}
                className="relative bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-2xs group flex flex-col items-center justify-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumb.url}
                  alt={`Page ${thumb.pageNumber}`}
                  className="w-full h-28 object-contain bg-white p-1"
                />
                <div className="w-full bg-slate-900/80 text-white text-[10px] font-bold text-center py-1">
                  Page {thumb.pageNumber}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Action CTA */}
      <div className="flex flex-col items-center gap-3 pt-2">
        <button
          onClick={handleConvertClick}
          className="w-full sm:w-auto px-10 py-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-base rounded-2xl shadow-md transition-all inline-flex items-center justify-center gap-3 cursor-pointer hover:scale-[1.01]"
        >
          <span>Convert PDF to PNG</span>
          <ArrowRight size={20} />
        </button>
        <p className="text-xs font-semibold text-slate-400">
          Fast, free client-side conversion • No file uploads
        </p>
      </div>
    </div>
  );
}
