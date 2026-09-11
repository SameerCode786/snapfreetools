"use client";

import React, { useState, useMemo } from "react";
import { RotateCw, RefreshCw, CheckSquare, Square, FileText, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";
import PageThumbnailCard from "./PageThumbnailCard";

// Format file size in readable units
function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default function RotateWorkspace({
  file,
  thumbnails = [],
  pageRotations = {},
  selectedIndices = [],
  onUpdatePageRotation,
  onRotateAll,
  onRotateSelected,
  onToggleSelectPage,
  onSelectAllPages,
  onDeselectAllPages,
  onResetRotations,
  onResetFile,
  onExecuteRotate
}) {
  // Count pages that have active non-zero rotation
  const rotatedCount = useMemo(() => {
    return Object.values(pageRotations).filter(deg => deg !== 0).length;
  }, [pageRotations]);

  // Rotate single page Clockwise
  const handleSingleRotateCW = (index) => {
    const current = pageRotations[index] || 0;
    const next = (current + 90) % 360;
    onUpdatePageRotation(index, next);
  };

  // Rotate single page Counter-Clockwise
  const handleSingleRotateCCW = (index) => {
    const current = pageRotations[index] || 0;
    const next = (current - 90 + 360) % 360;
    onUpdatePageRotation(index, next);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-left">
      
      {/* File Info & Header Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
            <FileText size={24} />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 line-clamp-1">{file.name}</h2>
            <div className="flex items-center gap-3 text-xs font-bold text-slate-400 mt-0.5">
              <span>{formatBytes(file.size)}</span>
              <span>•</span>
              <span>{file.pageCount} {file.pageCount === 1 ? "page" : "pages"}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onResetFile}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold rounded-xl border border-slate-200/80 transition-all shrink-0 cursor-pointer"
        >
          Change PDF
        </button>
      </div>

      {/* Global Toolbar */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <RotateCw size={16} className="text-amber-500" />
              Rotation Controls
            </h3>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              Rotate all pages globally or customize individual pages below.
            </p>
          </div>

          {rotatedCount > 0 && (
            <button
              type="button"
              onClick={onResetRotations}
              className="text-xs font-extrabold text-slate-500 hover:text-amber-600 inline-flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <RefreshCw size={12} />
              <span>Reset Rotations ({rotatedCount})</span>
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Rotate All Pages Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400 pr-1">Rotate All:</span>
            <button
              type="button"
              onClick={() => onRotateAll(90)}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-2xs transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              <RotateCw size={13} />
              <span>All 90°</span>
            </button>

            <button
              type="button"
              onClick={() => onRotateAll(180)}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-2xs transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              <RotateCw size={13} />
              <span>All 180°</span>
            </button>

            <button
              type="button"
              onClick={() => onRotateAll(270)}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-2xs transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              <RotateCw size={13} />
              <span>All 270°</span>
            </button>
          </div>

          {/* Batch Selection Tools */}
          <div className="flex items-center gap-2 border-l border-slate-200/80 pl-3">
            <button
              type="button"
              onClick={onSelectAllPages}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-200/60 transition-colors cursor-pointer inline-flex items-center gap-1"
            >
              <CheckSquare size={13} />
              <span>Select All</span>
            </button>

            <button
              type="button"
              onClick={onDeselectAllPages}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-200/60 transition-colors cursor-pointer inline-flex items-center gap-1"
            >
              <Square size={13} />
              <span>Deselect</span>
            </button>

            {selectedIndices.length > 0 && (
              <button
                type="button"
                onClick={() => onRotateSelected(90)}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold rounded-lg shadow-2xs transition-all cursor-pointer inline-flex items-center gap-1"
              >
                <RotateCw size={13} />
                <span>Rotate Selected ({selectedIndices.length})</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Page Thumbnails Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 font-extrabold">
          <span>PAGE PREVIEW GRID ({file.pageCount} PAGES)</span>
          <span>{rotatedCount} pages rotated</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: file.pageCount }).map((_, idx) => {
            const pageNum = idx + 1;
            const thumbObj = thumbnails.find(t => t.pageNumber === pageNum);
            const rotation = pageRotations[idx] || 0;
            const isSelected = selectedIndices.includes(idx);

            return (
              <PageThumbnailCard
                key={idx}
                pageNumber={pageNum}
                pageIndex={idx}
                thumbnailUrl={thumbObj ? thumbObj.thumbnailUrl : null}
                rotationAngle={rotation}
                isSelected={isSelected}
                onToggleSelect={onToggleSelectPage}
                onRotateClockwise={handleSingleRotateCW}
                onRotateCounterClockwise={handleSingleRotateCCW}
              />
            );
          })}
        </div>
      </div>

      {/* Output Summary & Primary CTA Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-sm font-black text-slate-900">Ready to Rotate PDF</h4>
          <p className="text-xs text-slate-500 font-semibold">
            {rotatedCount === 0
              ? "All pages are at 0°. Rotate any page above or apply a global rotation."
              : `Will permanently rotate ${rotatedCount} of ${file.pageCount} pages without rasterizing text.`}
          </p>
        </div>

        <button
          type="button"
          onClick={onExecuteRotate}
          className="w-full sm:w-auto px-8 py-3.5 bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-white font-black text-xs rounded-2xl shadow-md shadow-amber-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <span>Rotate PDF</span>
          <ArrowRight size={14} />
        </button>
      </div>

    </div>
  );
}
