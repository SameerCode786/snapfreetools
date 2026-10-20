"use client";

import React, { useState } from "react";
import {
  Presentation,
  FileText,
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
import {
  PAGE_SIZE_PRESETS,
  ORIENTATION_OPTIONS,
  QUALITY_OPTIONS,
  parsePageRange
} from "../utils/powerpointToPdfEngine";

export default function Workspace({
  file,
  presentation,
  onStartConversion,
  onReset
}) {
  const [pageSizePreset, setPageSizePreset] = useState("match");
  const [orientation, setOrientation] = useState("match");
  const [quality, setQuality] = useState("standard");
  const [pageSelection, setPageSelection] = useState("all"); // 'all' | 'custom'
  const [customRangeText, setCustomRangeText] = useState("");
  const [rangeError, setRangeError] = useState("");

  const totalSlides = presentation?.slideCount || 1;

  // Validate custom range interactively
  const activeRangeResult = parsePageRange(
    pageSelection === "custom" ? customRangeText : "all",
    totalSlides
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
        setRangeError("Please enter a slide range (e.g. 1-3, 5).");
        return;
      }
      if (!activeRangeResult.valid || activeRangeResult.pages.length === 0) {
        setRangeError(activeRangeResult.error || "Invalid slide range. Ensure slide numbers exist in this presentation.");
        return;
      }
    }

    onStartConversion({
      pageSizePreset,
      orientation,
      quality,
      pageRange: pageSelection === "custom" ? customRangeText.trim() : "all"
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Presentation Overview Header */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs">
            <Presentation size={28} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 truncate max-w-xs sm:max-w-md">
              {file?.name || "presentation.pptx"}
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 pt-1">
              <span>{formatFileSize(file?.size)}</span>
              <span>•</span>
              <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                {totalSlides} {totalSlides === 1 ? "Slide" : "Slides"}
              </span>
              <span>•</span>
              <span className="text-slate-600 font-bold">{presentation?.aspectRatio}</span>
              {presentation?.widthInches && presentation?.heightInches && (
                <>
                  <span>•</span>
                  <span>{presentation.widthInches}" × {presentation.heightInches}"</span>
                </>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={onReset}
          className="px-4 py-2 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 font-bold text-xs rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer bg-white"
        >
          <RefreshCw size={14} />
          <span>Change Presentation</span>
        </button>
      </div>

      {/* Main Settings Form */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-8 text-left">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
          <SlidersHorizontal size={20} className="text-amber-500" />
          <h3 className="text-lg font-black text-slate-900">
            Conversion Settings
          </h3>
        </div>

        {/* 1. Slide Range Selection */}
        <div className="space-y-4">
          <label className="block text-sm font-black text-slate-900">
            1. Select Slides to Convert
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => setPageSelection("all")}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                pageSelection === "all"
                  ? "border-amber-500 bg-amber-50/40 text-slate-900 shadow-2xs"
                  : "border-slate-200 hover:border-slate-300 text-slate-600"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">All Slides</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 font-bold text-slate-600">
                  {totalSlides} Total
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Converts the complete presentation into a multi-page PDF.
              </p>
            </div>

            <div
              onClick={() => setPageSelection("custom")}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                pageSelection === "custom"
                  ? "border-amber-500 bg-amber-50/40 text-slate-900 shadow-2xs"
                  : "border-slate-200 hover:border-slate-300 text-slate-600"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">Custom Slide Range</span>
                {pageSelection === "custom" && activeRangeResult.valid && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                    {selectedCount} Selected
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Extract specific slides e.g., "1-3, 5, 8".
              </p>
            </div>
          </div>

          {pageSelection === "custom" && (
            <div className="pt-2 space-y-2">
              <input
                type="text"
                value={customRangeText}
                onChange={(e) => {
                  setCustomRangeText(e.target.value);
                  setRangeError("");
                }}
                placeholder="e.g. 1-3, 5, 7-9"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-amber-400"
              />
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">
                  Total slides available: 1 to {totalSlides}
                </span>
                {activeRangeResult.valid && (
                  <span className="text-emerald-800 font-bold">
                    Will convert {selectedCount} {selectedCount === 1 ? "page" : "pages"}
                  </span>
                )}
              </div>
              {rangeError && (
                <p className="text-xs text-rose-600 font-bold">{rangeError}</p>
              )}
            </div>
          )}
        </div>

        {/* 2. PDF Page Dimensions */}
        <div className="space-y-4">
          <label className="block text-sm font-black text-slate-900">
            2. Output PDF Page Size
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Object.values(PAGE_SIZE_PRESETS).map((p) => (
              <div
                key={p.id}
                onClick={() => setPageSizePreset(p.id)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  pageSizePreset === p.id
                    ? "border-amber-500 bg-amber-50/40 text-slate-900 shadow-2xs"
                    : "border-slate-200 hover:border-slate-300 text-slate-600"
                }`}
              >
                <div className="font-bold text-sm">{p.name}</div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Orientation (When A4 or Letter selected) */}
        {pageSizePreset !== "match" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <label className="block text-sm font-black text-slate-900">
              3. Page Orientation
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Object.values(ORIENTATION_OPTIONS).map((o) => (
                <div
                  key={o.id}
                  onClick={() => setOrientation(o.id)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all text-center ${
                    orientation === o.id
                      ? "border-amber-500 bg-amber-50/40 text-slate-900 shadow-2xs"
                      : "border-slate-200 hover:border-slate-300 text-slate-600"
                  }`}
                >
                  <span className="font-bold text-sm">{o.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Rendering Quality */}
        <div className="space-y-4">
          <label className="block text-sm font-black text-slate-900">
            {pageSizePreset !== "match" ? "4. Rendering Quality" : "3. Rendering Quality"}
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.values(QUALITY_OPTIONS).map((q) => (
              <div
                key={q.id}
                onClick={() => setQuality(q.id)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  quality === q.id
                    ? "border-amber-500 bg-amber-50/40 text-slate-900 shadow-2xs"
                    : "border-slate-200 hover:border-slate-300 text-slate-600"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">{q.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 font-bold text-slate-600">
                    {q.scale}x Scale
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {q.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Notice on Static PDF Conversion */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3">
          <Info size={18} className="text-slate-500 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-600 space-y-1">
            <span className="font-bold text-slate-800">Conversion Note:</span>
            <p className="leading-relaxed">
              PDF is a static document format. PowerPoint animations, audio, video, and slide transitions are dynamic presentation features that are converted into static visual slides.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-semibold text-slate-500">
            Selected: <span className="font-bold text-slate-900">{selectedCount} {selectedCount === 1 ? "Slide" : "Slides"}</span>
          </div>

          <button
            onClick={handleConvert}
            className="w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-base rounded-2xl shadow-md transition-all inline-flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
          >
            <span>Convert to PDF</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
