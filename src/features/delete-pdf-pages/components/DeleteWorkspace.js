"use client";

import React, { useMemo } from "react";
import { Trash2, FileText, CheckSquare, Square, RefreshCw, ArrowRight, AlertTriangle, ShieldCheck } from "lucide-react";
import DeletePageThumbnailCard from "./DeletePageThumbnailCard";

// Format file size in readable units
function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default function DeleteWorkspace({
  file,
  thumbnails = [],
  markedIndices = [],
  onToggleDeletePage,
  onSelectAllForDeletion,
  onKeepAllPages,
  onResetFile,
  onExecuteDelete
}) {
  const totalPages = file.pageCount || thumbnails.length;
  const deletedCount = markedIndices.length;
  const remainingCount = totalPages - deletedCount;
  const isAllSelected = deletedCount === totalPages && totalPages > 0;
  const isNoneSelected = deletedCount === 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-left">
      
      {/* File Info & Change File Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center shrink-0">
            <FileText size={24} />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 line-clamp-1">{file.name}</h2>
            <div className="flex items-center gap-3 text-xs font-bold text-slate-400 mt-0.5">
              <span>{formatBytes(file.size)}</span>
              <span>•</span>
              <span>{totalPages} {totalPages === 1 ? "page" : "pages"}</span>
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

      {/* Global Selection Toolbar */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Trash2 size={16} className="text-red-600" />
              Page Selection Controls
            </h3>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              Click on page cards to select pages you want to remove.
            </p>
          </div>

          {!isNoneSelected && (
            <button
              type="button"
              onClick={onKeepAllPages}
              className="text-xs font-extrabold text-slate-500 hover:text-red-600 inline-flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <RefreshCw size={12} />
              <span>Reset Selection</span>
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Quick Selection Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onSelectAllForDeletion}
              className="px-3.5 py-2 bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 text-xs font-bold rounded-xl border border-slate-200/80 transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <CheckSquare size={14} />
              <span>Select All Pages</span>
            </button>

            <button
              type="button"
              onClick={onKeepAllPages}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200/80 transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <Square size={14} />
              <span>Deselect All</span>
            </button>
          </div>

          {/* Selection Counter Pill */}
          <div className="text-xs font-black px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200/60 text-slate-700">
            {deletedCount === 0 ? (
              <span className="text-slate-500 font-bold">No pages selected for deletion</span>
            ) : (
              <span>
                <strong className="text-red-600 font-black">{deletedCount}</strong> of {totalPages} {totalPages === 1 ? "page" : "pages"} marked to delete ({remainingCount} remaining)
              </span>
            )}
          </div>
        </div>

        {/* Safety Warning Banner if ALL pages selected */}
        {isAllSelected && (
          <div className="p-4 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-start gap-3 text-amber-800 text-xs font-bold animate-fadeIn">
            <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-extrabold text-amber-900">You must keep at least one page in the PDF.</p>
              <p className="text-amber-700 font-semibold mt-0.5">
                Deleting all pages is not permitted because a PDF document cannot be completely empty. Please uncheck at least one page.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Page Thumbnails Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {thumbnails.map((thumb) => {
          const isMarked = markedIndices.includes(thumb.index);
          return (
            <DeletePageThumbnailCard
              key={thumb.index}
              pageNumber={thumb.pageNumber}
              pageIndex={thumb.index}
              thumbnailUrl={thumb.dataUrl}
              isMarkedForDeletion={isMarked}
              onToggleDelete={onToggleDeletePage}
            />
          );
        })}
      </div>

      {/* Main Action Banner */}
      <div className="sticky bottom-6 bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 z-10">
        <div>
          <div className="text-sm font-black text-slate-900">
            Ready to generate new PDF?
          </div>
          <div className="text-xs font-semibold text-slate-500 mt-0.5">
            {isNoneSelected
              ? "Select at least 1 page to delete"
              : isAllSelected
              ? "Cannot delete all pages from PDF"
              : `${deletedCount} ${deletedCount === 1 ? "page" : "pages"} will be deleted cleanly without rasterization.`}
          </div>
        </div>

        <button
          type="button"
          disabled={isNoneSelected || isAllSelected}
          onClick={onExecuteDelete}
          className={`px-8 py-3.5 font-extrabold text-sm rounded-2xl shadow-sm transition-all inline-flex items-center gap-2 cursor-pointer ${
            isNoneSelected || isAllSelected
              ? "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300/60"
              : "bg-red-600 hover:bg-red-700 text-white hover:shadow-md active:scale-95"
          }`}
        >
          <Trash2 size={18} />
          <span>Delete {deletedCount > 0 ? `${deletedCount} ${deletedCount === 1 ? "Page" : "Pages"}` : "Selected Pages"}</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Privacy Guarantee */}
      <div className="flex items-center justify-center gap-2 text-xs font-extrabold text-slate-400 pt-2">
        <ShieldCheck size={14} className="text-emerald-500" />
        <span>100% Client-Side Processing — No Files Uploaded to Server</span>
      </div>

    </div>
  );
}
