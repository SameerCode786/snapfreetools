"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowUpDown,
  RotateCcw,
  Download,
  FileText,
  RefreshCw,
  Plus,
  SlidersHorizontal,
  Check,
  AlertTriangle
} from "lucide-react";

import PageSorterPageCard from "./PageSorterPageCard";
import { renderPageThumbnailsBatch, executePdfPageSorter } from "../utils/pdfPageSorterEngine";

export default function PageSorterWorkspace({
  file,
  onResetFile,
  onExportStart,
  onExportSuccess
}) {
  const [pages, setPages] = useState([]);
  const [initialPages, setInitialPages] = useState([]);
  const [isRendering, setIsRendering] = useState(true);
  const [renderProgress, setRenderProgress] = useState({ current: 0, total: 0 });
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragTargetIndex, setDragTargetIndex] = useState(null);
  const [sequenceInput, setSequenceInput] = useState("");
  const [sequenceError, setSequenceError] = useState(null);

  // Load and render page thumbnails on workspace initialization
  useEffect(() => {
    let isMounted = true;

    const loadThumbnails = async () => {
      setIsRendering(true);
      try {
        const items = await renderPageThumbnailsBatch(file, 0.3, (prog) => {
          if (isMounted) setRenderProgress(prog);
        });
        if (isMounted) {
          setPages(items);
          setInitialPages([...items]);
        }
      } catch (err) {
        console.error("Failed to render page thumbnails:", err);
      } finally {
        if (isMounted) setIsRendering(false);
      }
    };

    loadThumbnails();

    return () => {
      isMounted = false;
    };
  }, [file]);

  // Reorder page from one index to another
  const handleMovePage = (fromIndex, toIndex) => {
    if (fromIndex === toIndex || toIndex < 0 || toIndex >= pages.length) return;
    const updated = [...pages];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setPages(updated);
    setSequenceError(null);
  };

  // Drag and drop event handlers
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragTargetIndex(index);
    }
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      handleMovePage(draggedIndex, index);
    }
    setDraggedIndex(null);
    setDragTargetIndex(null);
  };

  // Rotate individual page 90 degrees
  const handleRotatePage = (index) => {
    const updated = [...pages];
    const item = updated[index];
    updated[index] = {
      ...item,
      rotation: ((item.rotation || 0) + 90) % 360
    };
    setPages(updated);
  };

  // Delete individual page
  const handleDeletePage = (index) => {
    if (pages.length <= 1) {
      alert("A PDF must contain at least 1 page.");
      return;
    }
    const updated = pages.filter((_, i) => i !== index);
    setPages(updated);
  };

  // Reverse page sequence (flip back-to-front)
  const handleReverseOrder = () => {
    setPages([...pages].reverse());
  };

  // Reset to initial uploaded page sequence
  const handleResetOrder = () => {
    setPages([...initialPages]);
    setSequenceInput("");
    setSequenceError(null);
  };

  // Apply custom numeric sequence (e.g., "1, 4, 3, 2" or "3, 1, 2")
  const handleApplySequence = (e) => {
    e.preventDefault();
    setSequenceError(null);

    if (!sequenceInput.trim()) return;

    const parts = sequenceInput.split(",").map(p => p.trim()).filter(Boolean);
    const requestedIndices = [];

    for (const part of parts) {
      if (part.includes("-")) {
        const [start, end] = part.split("-").map(n => parseInt(n, 10));
        if (isNaN(start) || isNaN(end) || start < 1 || end > initialPages.length || start > end) {
          setSequenceError(`Invalid page range "${part}". Enter pages between 1 and ${initialPages.length}.`);
          return;
        }
        for (let num = start; num <= end; num++) {
          requestedIndices.push(num - 1);
        }
      } else {
        const num = parseInt(part, 10);
        if (isNaN(num) || num < 1 || num > initialPages.length) {
          setSequenceError(`Invalid page number "${part}". Enter page numbers between 1 and ${initialPages.length}.`);
          return;
        }
        requestedIndices.push(num - 1);
      }
    }

    if (requestedIndices.length === 0) {
      setSequenceError("Please enter a valid page sequence (e.g. 1, 3, 2, 4).");
      return;
    }

    // Build new page items according to requested sequence
    const newSequence = requestedIndices.map((idx, i) => {
      const sourceItem = initialPages[idx];
      return {
        ...sourceItem,
        id: `page-item-seq-${i}-${Math.random().toString(36).substring(2, 7)}`
      };
    });

    setPages(newSequence);
  };

  // Export reordered PDF
  const handleExport = async () => {
    if (pages.length === 0) return;

    onExportStart("Compiling custom PDF page order...");
    try {
      const result = await executePdfPageSorter({
        file,
        pageItems: pages,
        onProgress: (msg) => onExportStart(msg)
      });
      onExportSuccess(result);
    } catch (err) {
      console.error("PDF Export Error:", err);
      alert("Failed to export reordered PDF. Please try again or re-upload your document.");
      onResetFile();
    }
  };

  if (isRendering) {
    return (
      <div className="max-w-xl mx-auto py-16 px-6 text-center space-y-6 bg-white border border-slate-200/80 rounded-3xl shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto animate-pulse">
          <RefreshCw size={24} className="animate-spin" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-black text-slate-900">
            Rendering Page Previews
          </h3>
          <p className="text-xs font-semibold text-slate-500">
            Parsing page {renderProgress.current} of {renderProgress.total}...
          </p>
        </div>
        <div className="w-48 mx-auto bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-amber-500 h-full transition-all duration-200 rounded-full"
            style={{
              width: renderProgress.total > 0
                ? `${(renderProgress.current / renderProgress.total) * 100}%`
                : "0%"
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Workspace Control Bar */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 font-bold shrink-0">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 truncate max-w-xs sm:max-w-sm">
                {file.name}
              </h2>
              <p className="text-xs text-slate-500 font-semibold">
                {pages.length} Pages Available • Drag cards to reorder
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleReverseOrder}
              className="px-3 py-2 bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-700 border border-slate-200/80 hover:border-amber-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowUpDown size={14} />
              <span>Reverse Order</span>
            </button>

            <button
              type="button"
              onClick={handleResetOrder}
              className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw size={14} />
              <span>Reset Sequence</span>
            </button>

            <button
              type="button"
              onClick={onResetFile}
              className="px-3 py-2 bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200/80 hover:border-rose-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Change File
            </button>
          </div>
        </div>

        {/* Quick Sequence Input Form */}
        <form onSubmit={handleApplySequence} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
          <div className="relative flex-1">
            <input
              type="text"
              value={sequenceInput}
              onChange={(e) => setSequenceInput(e.target.value)}
              placeholder={`Numeric order e.g. 1, 4, 3, 2, 5-${initialPages.length}`}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shrink-0 cursor-pointer"
          >
            Apply Sequence
          </button>
        </form>

        {sequenceError && (
          <p className="text-xs text-rose-600 font-semibold flex items-center gap-1">
            <AlertTriangle size={14} />
            <span>{sequenceError}</span>
          </p>
        )}
      </div>

      {/* Page Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {pages.map((page, index) => (
          <PageSorterPageCard
            key={page.id}
            page={page}
            currentIndex={index}
            totalItems={pages.length}
            onMove={handleMovePage}
            onRotate={handleRotatePage}
            onDelete={handleDeletePage}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            isDragTarget={dragTargetIndex === index}
          />
        ))}
      </div>

      {/* Export Action Bar */}
      <div className="sticky bottom-6 z-20 bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-lg max-w-xl mx-auto flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black text-slate-900">
            Ready to Export {pages.length} Pages
          </p>
          <p className="text-[11px] font-semibold text-slate-500">
            100% Client-side vector export
          </p>
        </div>

        <button
          type="button"
          onClick={handleExport}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm rounded-2xl shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Download size={18} />
          <span>Export Sorted PDF</span>
        </button>
      </div>
    </div>
  );
}
