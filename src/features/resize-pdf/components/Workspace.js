"use client";

import React, { useState, useMemo } from "react";
import {
  FileText,
  Scaling,
  Layers,
  ArrowRight,
  RefreshCw,
  Info,
  Maximize2,
  AlertTriangle,
  Compass,
  Sparkles
} from "lucide-react";

import {
  PAPER_PRESETS,
  getPaperPresetDimensions,
  convertMmToPoints,
  convertInchesToPoints,
  convertPointsToMm,
  convertPointsToInches,
  validateCustomDimensions,
  parsePageSelectionRange
} from "../utils/pdfResizeEngine.js";

export default function Workspace({ pdfData, onStartResize, onReset }) {
  // Preset or Custom selection state
  const [selectedPresetKey, setSelectedPresetKey] = useState("A4"); // 'A4', 'LETTER', 'CUSTOM', etc.
  const [orientation, setOrientation] = useState("portrait"); // 'portrait' | 'landscape'

  // Custom dimensions state (in selected unit)
  const [unit, setUnit] = useState("mm"); // 'mm' | 'inches' | 'pt'
  const [customWidthInput, setCustomWidthInput] = useState("210");
  const [customHeightInput, setCustomHeightInput] = useState("297");

  // Content resize mode
  const [resizeMode, setResizeMode] = useState("FIT_CONTENT"); // 'FIT_CONTENT' | 'KEEP_CONTENT_SIZE' | 'STRETCH_CONTENT'

  // Page Selection Range
  const [selectionMode, setSelectionMode] = useState("all"); // 'all' | 'custom'
  const [customRangeString, setCustomRangeString] = useState("");

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  // Check if PDF pages have mixed dimensions
  const hasMixedSizes = useMemo(() => {
    if (!pdfData || !pdfData.pages || pdfData.pages.length <= 1) return false;
    const firstW = Math.round(pdfData.pages[0].widthPt);
    const firstH = Math.round(pdfData.pages[0].heightPt);
    return pdfData.pages.some((p) => Math.round(p.widthPt) !== firstW || Math.round(p.heightPt) !== firstH);
  }, [pdfData]);

  // Compute calculated target dimensions in points
  const targetDimensions = useMemo(() => {
    if (selectedPresetKey !== "CUSTOM") {
      return getPaperPresetDimensions(selectedPresetKey, orientation);
    }

    // Convert custom inputs to points
    let wPt = 0;
    let hPt = 0;
    const wVal = parseFloat(customWidthInput) || 0;
    const hVal = parseFloat(customHeightInput) || 0;

    if (unit === "mm") {
      wPt = convertMmToPoints(wVal);
      hPt = convertMmToPoints(hVal);
    } else if (unit === "inches") {
      wPt = convertInchesToPoints(wVal);
      hPt = convertInchesToPoints(hVal);
    } else {
      wPt = wVal;
      hPt = hVal;
    }

    return {
      name: "Custom Dimensions",
      widthPt: wPt,
      heightPt: hPt,
      orientation
    };
  }, [selectedPresetKey, orientation, unit, customWidthInput, customHeightInput]);

  // Validate target dimensions
  const dimensionValidation = useMemo(() => {
    return validateCustomDimensions(targetDimensions.widthPt, targetDimensions.heightPt);
  }, [targetDimensions]);

  // Parse page selection
  const selectedPagesList = useMemo(() => {
    const rangeStr = selectionMode === "all" ? "all" : customRangeString;
    return parsePageSelectionRange(rangeStr, pdfData.pageCount);
  }, [selectionMode, customRangeString, pdfData.pageCount]);

  // Range validation error message
  const rangeError = useMemo(() => {
    if (selectionMode === "custom") {
      if (!customRangeString.trim()) {
        return "Please enter a page range (e.g. 1-3, 5).";
      }
      if (selectedPagesList.length === 0) {
        return "No valid page numbers found in range.";
      }
    }
    return null;
  }, [selectionMode, customRangeString, selectedPagesList]);

  // Form submit handler
  const handleResizeSubmit = () => {
    if (!dimensionValidation.isValid || rangeError || selectedPagesList.length === 0) {
      return;
    }

    const pageRangeParam = selectionMode === "all" ? "all" : customRangeString.trim();

    onStartResize({
      targetWidthPt: targetDimensions.widthPt,
      targetHeightPt: targetDimensions.heightPt,
      mode: resizeMode,
      pageRange: pageRangeParam
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Document Information Header */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
            <FileText size={28} />
          </div>
          <div>
            <h3 className="font-black text-slate-900 text-lg sm:text-xl truncate max-w-md">
              {pdfData.name}
            </h3>
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-bold text-slate-500 mt-1">
              <span>{formatFileSize(pdfData.size)}</span>
              <span>•</span>
              <span className="text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                {pdfData.pageCount} {pdfData.pageCount === 1 ? "Page" : "Pages"}
              </span>
              {pdfData.firstPageSize && (
                <>
                  <span>•</span>
                  <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md font-mono">
                    Page 1: {pdfData.firstPageSize.widthMm} × {pdfData.firstPageSize.heightMm} mm
                  </span>
                </>
              )}
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

      {/* Notice for PDFs with mixed page sizes */}
      {hasMixedSizes && (
        <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-800 text-xs font-semibold">
          <Info size={18} className="shrink-0 mt-0.5 text-amber-600" />
          <p>
            Your PDF contains pages with different sizes. Resizing will unify selected pages to the target dimensions while maintaining optimal content alignment.
          </p>
        </div>
      )}

      {/* Configuration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Target Page Size & Orientation */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-900 font-black text-base">
              <Scaling size={20} className="text-amber-500" />
              <h4>Target Paper Size</h4>
            </div>

            {/* Orientation Toggle */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setOrientation("portrait")}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  orientation === "portrait"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Portrait
              </button>
              <button
                type="button"
                onClick={() => setOrientation("landscape")}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  orientation === "landscape"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Landscape
              </button>
            </div>
          </div>

          {/* Preset Buttons Grid */}
          <div className="grid grid-cols-3 gap-2.5">
            {Object.keys(PAPER_PRESETS).map((key) => {
              const preset = PAPER_PRESETS[key];
              const isSelected = selectedPresetKey === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedPresetKey(key)}
                  className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                    isSelected
                      ? "border-amber-500 bg-amber-50/70 text-slate-950 font-black shadow-xs ring-2 ring-amber-500/20"
                      : "border-slate-200 text-slate-600 hover:border-slate-300 font-semibold"
                  }`}
                >
                  <span className="text-xs">{preset.name}</span>
                  <span className="text-[10px] opacity-75 font-normal truncate max-w-full">
                    {Math.round(convertPointsToMm(preset.widthPt))}×{Math.round(convertPointsToMm(preset.heightPt))} mm
                  </span>
                </button>
              );
            })}

            {/* Custom Preset Button */}
            <button
              type="button"
              onClick={() => setSelectedPresetKey("CUSTOM")}
              className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                selectedPresetKey === "CUSTOM"
                  ? "border-amber-500 bg-amber-50/70 text-slate-950 font-black shadow-xs ring-2 ring-amber-500/20"
                  : "border-slate-200 text-slate-600 hover:border-slate-300 font-semibold"
              }`}
            >
              <span className="text-xs">Custom</span>
              <span className="text-[10px] opacity-75 font-normal">Exact Entry</span>
            </button>
          </div>

          {/* Custom Dimension Input Fields */}
          {selectedPresetKey === "CUSTOM" && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Custom Page Dimensions</span>
                <div className="flex gap-1.5">
                  {["mm", "inches", "pt"].map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setUnit(u)}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        unit === u
                          ? "bg-slate-900 text-white"
                          : "bg-white text-slate-600 border border-slate-200"
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">
                    Width ({unit})
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={customWidthInput}
                    onChange={(e) => setCustomWidthInput(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono font-bold bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">
                    Height ({unit})
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={customHeightInput}
                    onChange={(e) => setCustomHeightInput(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono font-bold bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Validation Error Display */}
          {!dimensionValidation.isValid && (
            <p className="text-xs text-rose-600 font-bold bg-rose-50 p-2.5 rounded-xl border border-rose-200">
              {dimensionValidation.error}
            </p>
          )}
        </div>

        {/* Section 2: Resize Mode & Content Scaling */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2 text-slate-900 font-black text-base">
            <Maximize2 size={20} className="text-amber-500" />
            <h4>Content Scaling Mode</h4>
          </div>

          <div className="space-y-3">
            {/* Fit Content (Default / Recommended) */}
            <label
              onClick={() => setResizeMode("FIT_CONTENT")}
              className={`p-3.5 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                resizeMode === "FIT_CONTENT"
                  ? "border-amber-500 bg-amber-50/70 text-slate-950 font-bold shadow-xs ring-2 ring-amber-500/20"
                  : "border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              <input
                type="radio"
                name="resizeMode"
                checked={resizeMode === "FIT_CONTENT"}
                onChange={() => setResizeMode("FIT_CONTENT")}
                className="accent-amber-500 mt-1"
              />
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 text-sm font-black text-slate-900">
                  <span>Fit Content (Recommended)</span>
                  <span className="text-[10px] bg-amber-500 text-slate-950 px-2 py-0.5 rounded-md font-bold">
                    Aspect Locked
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-normal">
                  Scale content proportionally to fit the new page size without clipping or distortion.
                </p>
              </div>
            </label>

            {/* Keep Content Size */}
            <label
              onClick={() => setResizeMode("KEEP_CONTENT_SIZE")}
              className={`p-3.5 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                resizeMode === "KEEP_CONTENT_SIZE"
                  ? "border-amber-500 bg-amber-50/70 text-slate-950 font-bold shadow-xs ring-2 ring-amber-500/20"
                  : "border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              <input
                type="radio"
                name="resizeMode"
                checked={resizeMode === "KEEP_CONTENT_SIZE"}
                onChange={() => setResizeMode("KEEP_CONTENT_SIZE")}
                className="accent-amber-500 mt-1"
              />
              <div className="space-y-0.5">
                <div className="text-sm font-black text-slate-900">
                  Keep Original Content Size
                </div>
                <p className="text-xs text-slate-500 font-normal">
                  Keep the original 1:1 content scale and center it on the new page canvas.
                </p>
              </div>
            </label>

            {/* Stretch Content (Advanced) */}
            <label
              onClick={() => setResizeMode("STRETCH_CONTENT")}
              className={`p-3.5 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                resizeMode === "STRETCH_CONTENT"
                  ? "border-amber-500 bg-amber-50/70 text-slate-950 font-bold shadow-xs ring-2 ring-amber-500/20"
                  : "border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              <input
                type="radio"
                name="resizeMode"
                checked={resizeMode === "STRETCH_CONTENT"}
                onChange={() => setResizeMode("STRETCH_CONTENT")}
                className="accent-amber-500 mt-1"
              />
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 text-sm font-black text-slate-900">
                  <span>Stretch Content (Fill Page)</span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-bold">
                    Advanced
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-normal">
                  Fill the entire target page by stretching horizontally and vertically. May distort aspect ratios.
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Section 3: Target Page Selection */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900 font-black text-base">
            <Layers size={20} className="text-amber-500" />
            <h4>Target Pages</h4>
          </div>
          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            {selectedPagesList.length} of {pdfData.pageCount} {pdfData.pageCount === 1 ? "page" : "pages"} selected
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  value={customRangeString}
                  onChange={(e) => setCustomRangeString(e.target.value)}
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

        {rangeError && (
          <p className="text-xs text-rose-600 font-bold bg-rose-50 p-2.5 rounded-xl border border-rose-200">
            {rangeError}
          </p>
        )}
      </div>

      {/* Summary Card */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-black text-xs uppercase tracking-wider">
            <Sparkles size={16} />
            <span>Resize Specifications Summary</span>
          </div>
          <div className="text-lg font-black">
            Target Size: {targetDimensions.name} ({orientation})
          </div>
          <div className="text-xs text-slate-300 font-medium flex flex-wrap items-center gap-3">
            <span>
              Dimensions: {Math.round(convertPointsToMm(targetDimensions.widthPt))} × {Math.round(convertPointsToMm(targetDimensions.heightPt))} mm ({Math.round(targetDimensions.widthPt)} × {Math.round(targetDimensions.heightPt)} pt)
            </span>
            <span>•</span>
            <span>Mode: {resizeMode === "FIT_CONTENT" ? "Fit Content" : resizeMode === "KEEP_CONTENT_SIZE" ? "Keep Original Size" : "Stretch Content"}</span>
            <span>•</span>
            <span>Pages: {selectedPagesList.length} of {pdfData.pageCount}</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleResizeSubmit}
          disabled={!dimensionValidation.isValid || Boolean(rangeError) || selectedPagesList.length === 0}
          className="w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-700 disabled:text-slate-500 text-slate-950 font-black text-base rounded-2xl shadow-md transition-all inline-flex items-center justify-center gap-3 cursor-pointer disabled:cursor-not-allowed hover:scale-[1.01]"
        >
          <span>Resize PDF</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
