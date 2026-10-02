"use client";

import React, { useState, useEffect } from "react";
import {
  CheckSquare,
  Square,
  RefreshCw,
  ArrowRight,
  SlidersHorizontal,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from "lucide-react";
import { parsePageSelection } from "../engine/extractPdfEngine";

export default function PageSelector({
  totalPages,
  thumbnails = [],
  selectedPages = [],
  onSelectionChange,
  isRenderingThumbnails = false
}) {
  const [rangeInput, setRangeInput] = useState("");
  const [rangeError, setRangeError] = useState(null);

  // Sync range input text when selectedPages changes externally or via button actions
  useEffect(() => {
    if (selectedPages.length === 0) {
      setRangeInput("");
    } else {
      // Format sorted pages into range string (e.g. 1-3, 5, 8-10)
      setRangeInput(formatPagesToRangeString(selectedPages));
    }
  }, [selectedPages]);

  // Helper to format array of page numbers into clean readable range string (e.g. 1-3, 5, 7-9)
  function formatPagesToRangeString(pages) {
    if (!pages || pages.length === 0) return "";
    const sorted = [...pages].sort((a, b) => a - b);
    const ranges = [];
    let start = sorted[0];
    let end = sorted[0];

    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] === end + 1) {
        end = sorted[i];
      } else {
        ranges.push(start === end ? `${start}` : `${start}-${end}`);
        start = sorted[i];
        end = sorted[i];
      }
    }
    ranges.push(start === end ? `${start}` : `${start}-${end}`);
    return ranges.join(", ");
  }

  // Toggle single page selection
  const handleTogglePage = (pageNum) => {
    setRangeError(null);
    let updated;
    if (selectedPages.includes(pageNum)) {
      updated = selectedPages.filter((p) => p !== pageNum);
    } else {
      updated = [...selectedPages, pageNum].sort((a, b) => a - b);
    }
    onSelectionChange(updated);
  };

  // Quick Action Handlers
  const handleSelectAll = () => {
    setRangeError(null);
    const all = Array.from({ length: totalPages }, (_, i) => i + 1);
    onSelectionChange(all);
  };

  const handleClearAll = () => {
    setRangeError(null);
    onSelectionChange([]);
  };

  const handleInvertSelection = () => {
    setRangeError(null);
    const inverted = [];
    for (let p = 1; p <= totalPages; p++) {
      if (!selectedPages.includes(p)) {
        inverted.push(p);
      }
    }
    onSelectionChange(inverted);
  };

  // Handle Range Text Input change
  const handleRangeInputChange = (e) => {
    const value = e.target.value;
    setRangeInput(value);
    setRangeError(null);

    if (!value.trim()) {
      onSelectionChange([]);
      return;
    }

    try {
      // Use Phase 1 Engine parser directly
      const parsed = parsePageSelection(value, totalPages);
      onSelectionChange(parsed.pages1Based);
    } catch (err) {
      setRangeError(err.message || "Invalid page range format.");
    }
  };

  const selectedCount = selectedPages.length;
  const isAllSelected = selectedCount === totalPages && totalPages > 0;
  const isNoneSelected = selectedCount === 0;

  // Extraction sequence text (e.g., 2 → 4 → 6)
  const sortedSequence = [...selectedPages].sort((a, b) => a - b);
  const sequenceText =
    sortedSequence.length > 0
      ? sortedSequence.length > 10
        ? `${sortedSequence.slice(0, 8).join(" → ")} ... → ${sortedSequence[sortedSequence.length - 1]}`
        : sortedSequence.join(" → ")
      : "None";

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-left">
      {/* Selection Control Toolbar */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <SlidersHorizontal size={18} className="text-amber-500" />
              Select Pages to Extract
            </h2>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              Click thumbnail cards below or enter page numbers/ranges to select pages.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleSelectAll}
              className="px-3.5 py-2 bg-slate-100 hover:bg-amber-50 hover:text-amber-700 text-slate-700 text-xs font-bold rounded-xl border border-slate-200/80 transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <CheckSquare size={14} />
              <span>Select All</span>
            </button>

            <button
              type="button"
              onClick={handleClearAll}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200/80 transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <Square size={14} />
              <span>Clear Selection</span>
            </button>

            <button
              type="button"
              onClick={handleInvertSelection}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200/80 transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <RefreshCw size={12} />
              <span>Invert Selection</span>
            </button>
          </div>
        </div>

        {/* Range Text Input & Selection Status Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
          {/* Page Range Input */}
          <div className="md:col-span-7 space-y-1.5">
            <label htmlFor="page-range-input" className="block text-xs font-extrabold text-slate-700">
              Pages to Extract (Range Input)
            </label>
            <div className="relative">
              <input
                id="page-range-input"
                type="text"
                value={rangeInput}
                onChange={handleRangeInputChange}
                placeholder="e.g. 1-3, 5, 8-12"
                className={`w-full px-4 py-2.5 rounded-xl border text-xs font-bold transition-all focus:outline-none focus:ring-2 ${
                  rangeError
                    ? "border-rose-300 bg-rose-50/50 text-rose-900 focus:ring-rose-400"
                    : "border-slate-200 bg-slate-50/50 text-slate-900 focus:ring-amber-500/50 focus:border-amber-400"
                }`}
              />
            </div>
            {rangeError ? (
              <p className="text-[11px] font-bold text-rose-600 flex items-center gap-1">
                <AlertCircle size={12} className="shrink-0" />
                <span>{rangeError}</span>
              </p>
            ) : (
              <p className="text-[11px] font-semibold text-slate-400">
                Examples: <code className="bg-slate-100 px-1 py-0.5 rounded">1-5</code>, <code className="bg-slate-100 px-1 py-0.5 rounded">1-3, 7, 10</code>, <code className="bg-slate-100 px-1 py-0.5 rounded">2, 4, 6</code>
              </p>
            )}
          </div>

          {/* Selected Count & Sequence Display */}
          <div className="md:col-span-5 bg-slate-50 border border-slate-200/70 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-700">Selected Counter</span>
              <span className={`text-xs font-black px-2.5 py-0.5 rounded-md ${
                selectedCount > 0 ? "bg-amber-100 text-amber-800 border border-amber-200/80" : "bg-slate-200 text-slate-600"
              }`}>
                {selectedCount} of {totalPages} {totalPages === 1 ? "page" : "pages"} selected
              </span>
            </div>

            <div className="pt-1 border-t border-slate-200/60">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Extraction Sequence</p>
              <p className="text-xs font-black text-slate-800 truncate mt-0.5" title={sequenceText}>
                {sequenceText}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Bar for Thumbnail Generation */}
      {isRenderingThumbnails && (
        <div className="p-4 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-center gap-3 text-amber-800 text-xs font-bold animate-pulse">
          <RefreshCw size={16} className="animate-spin text-amber-600 shrink-0" />
          <span>Generating high-quality page previews...</span>
        </div>
      )}

      {/* Page Thumbnails Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: totalPages }, (_, i) => {
          const pageNum = i + 1;
          const isSelected = selectedPages.includes(pageNum);
          const thumbObj = thumbnails.find((t) => t.pageNumber === pageNum || t.pageIndex === i);
          const thumbUrl = thumbObj?.thumbnailUrl || thumbObj?.dataUrl || null;

          return (
            <div
              key={pageNum}
              onClick={() => handleTogglePage(pageNum)}
              tabIndex={0}
              role="checkbox"
              aria-checked={isSelected}
              aria-label={`Page ${pageNum} - ${isSelected ? "Selected" : "Not selected"}`}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  handleTogglePage(pageNum);
                }
              }}
              className={`group relative bg-white border-2 rounded-2xl p-3 flex flex-col items-center gap-2.5 transition-all cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${
                isSelected
                  ? "border-amber-500 bg-amber-50/20 shadow-xs scale-[0.99]"
                  : "border-slate-200/90 hover:border-amber-300 hover:shadow-xs"
              }`}
            >
              {/* Card Header: Checkbox & Page Badge */}
              <div className="w-full flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                      isSelected
                        ? "bg-amber-500 text-white"
                        : "bg-slate-100 text-slate-400 border border-slate-300 group-hover:border-amber-400"
                    }`}
                  >
                    {isSelected ? <CheckCircle2 size={14} /> : <Square size={14} />}
                  </div>
                  <span className="text-xs font-black text-slate-800">
                    Page {pageNum}
                  </span>
                </div>

                {isSelected && (
                  <span className="px-1.5 py-0.5 bg-amber-100 border border-amber-200 text-amber-800 text-[10px] font-black rounded-md">
                    Selected
                  </span>
                )}
              </div>

              {/* Page Thumbnail Image */}
              <div className="relative w-full aspect-[1/1.4] bg-slate-100 border border-slate-200/80 rounded-xl overflow-hidden flex items-center justify-center">
                {thumbUrl ? (
                  <img
                    src={thumbUrl}
                    alt={`Preview of Page ${pageNum}`}
                    className={`w-full h-full object-contain transition-all ${
                      isSelected ? "opacity-100" : "opacity-75 group-hover:opacity-100"
                    }`}
                    loading="lazy"
                  />
                ) : (
                  <div className="text-[11px] font-extrabold text-slate-400 animate-pulse flex flex-col items-center gap-1">
                    <span>Page {pageNum}</span>
                    <span className="text-[9px] font-semibold text-slate-300">Rendering...</span>
                  </div>
                )}

                {/* Selection Overlay Check */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-md">
                    <CheckCircle2 size={16} />
                  </div>
                )}
              </div>

              {/* Card Toggle Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTogglePage(pageNum);
                }}
                className={`w-full py-1.5 text-[11px] font-extrabold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  isSelected
                    ? "bg-amber-500 text-white hover:bg-amber-600"
                    : "bg-slate-100 hover:bg-amber-50 hover:text-amber-700 text-slate-700 border border-slate-200/80"
                }`}
              >
                {isSelected ? "Deselect Page" : "Select Page"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
