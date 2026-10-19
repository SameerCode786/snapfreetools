"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Presentation,
  SlidersHorizontal,
  Layers,
  ArrowRight,
  RefreshCw,
  Info,
  CheckCircle2,
  Sparkles,
  Maximize2,
  FileCheck,
  AlertCircle,
  Eye,
  Type
} from "lucide-react";
import { SLIDE_PRESETS, parsePageRange } from "../utils/pdfToPowerpointEngine";

export default function Workspace({
  fileInfo,
  analysis,
  thumbnails = [],
  isLoadingThumbnails = false,
  onStartConversion,
  onReset
}) {
  const [conversionMode, setConversionMode] = useState(
    analysis?.recommendedMode || "editable"
  );
  const [slidePreset, setSlidePreset] = useState("match");
  const [pageSelection, setPageSelection] = useState("all"); // 'all' | 'custom'
  const [customRangeText, setCustomRangeText] = useState("");
  const [rangeError, setRangeError] = useState("");

  const totalPages = fileInfo?.pageCount || analysis?.numPages || 1;

  // Validate custom range interactively
  const activeRangeResult = parsePageRange(
    pageSelection === "custom" ? customRangeText : "all",
    totalPages
  );

  const selectedCount = activeRangeResult.valid ? activeRangeResult.pages.length : 0;

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const handleConvert = () => {
    setRangeError("");
    if (pageSelection === "custom") {
      if (!customRangeText.trim()) {
        setRangeError("Please enter a page range (e.g. 1-3, 5).");
        return;
      }
      if (!activeRangeResult.valid || activeRangeResult.pages.length === 0) {
        setRangeError("Invalid page range. Ensure page numbers exist in this document.");
        return;
      }
    }

    onStartConversion({
      mode: conversionMode,
      preset: slidePreset,
      pageRange: pageSelection === "custom" ? customRangeText.trim() : "all"
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Document Overview Header */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
            <Presentation size={28} />
          </div>
          <div>
            <h3 className="font-black text-slate-900 text-lg sm:text-xl truncate max-w-md">
              {fileInfo?.name}
            </h3>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-bold text-slate-500 mt-1">
              <span>{formatFileSize(fileInfo?.size)}</span>
              <span>•</span>
              <span className="text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                {totalPages} {totalPages === 1 ? "Page" : "Pages"}
              </span>
              <span>•</span>
              <span className="text-slate-600">
                {analysis?.paperName || "Custom"} ({analysis?.orientation || "Portrait"})
              </span>
              <span>•</span>
              <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {analysis?.detectedContentType || "Digital Text"}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onReset}
          className="px-4 py-2 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer bg-slate-50 hover:bg-slate-100 shrink-0"
        >
          <RefreshCw size={14} />
          Change PDF
        </button>
      </div>

      {/* Conversion Mode Selection Box */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-2 text-slate-900 font-black text-lg">
          <SlidersHorizontal size={20} className="text-amber-500" />
          <h4>Choose Conversion Mode</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Mode A: Editable Content */}
          <div
            onClick={() => setConversionMode("editable")}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-2 relative ${
              conversionMode === "editable"
                ? "border-amber-500 bg-amber-50/30 shadow-xs"
                : "border-slate-200/80 hover:border-slate-300 bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-black text-sm text-slate-900">
                <Type size={18} className="text-amber-600" />
                <span>Editable Content (Recommended)</span>
              </div>
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  conversionMode === "editable"
                    ? "border-amber-500 bg-amber-500 text-slate-950"
                    : "border-slate-300"
                }`}
              >
                {conversionMode === "editable" && <CheckCircle2 size={14} />}
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Reconstructs headings, paragraphs, and selectable text into native editable PowerPoint text boxes. Scanned or image-only pages are preserved as high-fidelity slide images.
            </p>
          </div>

          {/* Mode B: High Fidelity */}
          <div
            onClick={() => setConversionMode("fidelity")}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-2 relative ${
              conversionMode === "fidelity"
                ? "border-amber-500 bg-amber-50/30 shadow-xs"
                : "border-slate-200/80 hover:border-slate-300 bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-black text-sm text-slate-900">
                <Eye size={18} className="text-blue-600" />
                <span>High Fidelity (Visual Preservation)</span>
              </div>
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  conversionMode === "fidelity"
                    ? "border-amber-500 bg-amber-500 text-slate-950"
                    : "border-slate-300"
                }`}
              >
                {conversionMode === "fidelity" && <CheckCircle2 size={14} />}
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Renders each PDF page as a high-resolution visual slide. Preserves the original visual layout with high fidelity for complex graphic designs, charts, and vector art.
            </p>
          </div>
        </div>
      </div>

      {/* Presentation Slide Sizing & Page Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Slide Dimensions */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-black text-base">
            <Maximize2 size={18} className="text-amber-500" />
            <h4>Slide Dimensions</h4>
          </div>

          <div className="space-y-2">
            {[
              { id: "match", label: "Match PDF Dimensions", sub: "Preserves original page aspect ratio" },
              { id: "16:9", label: "16:9 Widescreen", sub: "Standard for modern screens (13.33\" × 7.5\")" },
              { id: "4:3", label: "4:3 Standard", sub: "Classic presentation format (10\" × 7.5\")" },
              { id: "a4", label: "A4 Presentation", sub: "Standard international A4 landscape/portrait" },
              { id: "letter", label: "US Letter", sub: "Standard US Letter landscape/portrait" }
            ].map((preset) => (
              <label
                key={preset.id}
                onClick={() => setSlidePreset(preset.id)}
                className={`flex items-start justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  slidePreset === preset.id
                    ? "border-amber-500 bg-amber-50/40"
                    : "border-slate-200/70 hover:border-slate-300"
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">{preset.label}</div>
                  <div className="text-[11px] text-slate-500 font-medium">{preset.sub}</div>
                </div>
                <input
                  type="radio"
                  name="slidePreset"
                  checked={slidePreset === preset.id}
                  onChange={() => setSlidePreset(preset.id)}
                  className="mt-0.5 accent-amber-500"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Page Range Selection */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-black text-base">
            <Layers size={18} className="text-amber-500" />
            <h4>Page Range</h4>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setPageSelection("all");
                  setRangeError("");
                }}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  pageSelection === "all"
                    ? "border-amber-500 bg-amber-500 text-slate-950 font-black shadow-2xs"
                    : "border-slate-200 text-slate-700 hover:border-slate-300"
                }`}
              >
                All Pages ({totalPages})
              </button>

              <button
                type="button"
                onClick={() => setPageSelection("custom")}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  pageSelection === "custom"
                    ? "border-amber-500 bg-amber-500 text-slate-950 font-black shadow-2xs"
                    : "border-slate-200 text-slate-700 hover:border-slate-300"
                }`}
              >
                Custom Range
              </button>
            </div>

            {pageSelection === "custom" && (
              <div className="space-y-2 pt-1 animate-in fade-in duration-200">
                <input
                  type="text"
                  aria-label="Custom page range"
                  placeholder="e.g. 1-3, 5, 8-10"
                  value={customRangeText}
                  onChange={(e) => {
                    setCustomRangeText(e.target.value);
                    setRangeError("");
                  }}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span>Selected: {selectedCount} of {totalPages} {totalPages === 1 ? "page" : "pages"}</span>
                  <span>Range: 1 to {totalPages}</span>
                </div>
              </div>
            )}

            {rangeError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-semibold flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0" />
                <span>{rangeError}</span>
              </div>
            )}

            <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl text-[11px] text-slate-600 leading-relaxed font-medium">
              <span className="font-bold text-slate-900">Output Format:</span> Microsoft PowerPoint (.pptx) file compatible with Office 365, Google Slides, Keynote, and LibreOffice.
            </div>
          </div>
        </div>
      </div>

      {/* Page Thumbnails Preview (if available) */}
      {thumbnails && thumbnails.length > 0 && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <FileCheck size={16} className="text-amber-500" />
              <span>Slide Preview ({thumbnails.length} {thumbnails.length === 1 ? "Page" : "Pages"})</span>
            </h4>
            <span className="text-[11px] font-bold text-slate-400">
              {pageSelection === "all" ? "All slides will be converted" : `${selectedCount} slides selected`}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-60 overflow-y-auto p-1">
            {thumbnails.map((t) => {
              const isIncluded = pageSelection === "all" || activeRangeResult.pages.includes(t.pageNumber);
              return (
                <div
                  key={t.pageNumber}
                  className={`relative rounded-xl border p-1 text-center transition-all ${
                    isIncluded
                      ? "border-amber-400 bg-amber-50/20"
                      : "border-slate-200 opacity-40 bg-slate-50"
                  }`}
                >
                  <img
                    src={t.url}
                    alt={`Page ${t.pageNumber}`}
                    className="w-full h-24 object-contain rounded-lg bg-white shadow-2xs mx-auto"
                  />
                  <div className="mt-1 text-[11px] font-black text-slate-700">
                    Slide {t.pageNumber}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Primary Convert CTA */}
      <div className="text-center pt-2">
        <button
          onClick={handleConvert}
          className="w-full sm:w-auto px-10 py-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-base rounded-2xl shadow-md transition-all inline-flex items-center justify-center gap-3 cursor-pointer hover:scale-[1.01]"
        >
          <Presentation size={20} />
          <span>Convert to PowerPoint (.pptx)</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
