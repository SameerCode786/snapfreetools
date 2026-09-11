"use client";

import React, { useState } from "react";
import { LayoutGrid, FileText, RefreshCw, ArrowUpDown, ArrowRight, ShieldCheck, Info } from "lucide-react";
import OrganizePageCard from "./OrganizePageCard";

// Format file size in readable units
function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default function OrganizeWorkspace({
  file,
  pageItems = [],
  onUpdatePageItems,
  onResetOrder,
  onReverseOrder,
  onResetFile,
  onExecuteOrganize
}) {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const totalPages = file.pageCount || pageItems.length;

  // Drag and Drop Handlers
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const updated = [...pageItems];
    const [movedItem] = updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, movedItem);

    onUpdatePageItems(updated);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Button Reordering Handlers
  const handleMoveLeft = (index) => {
    if (index <= 0) return;
    const updated = [...pageItems];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    onUpdatePageItems(updated);
  };

  const handleMoveRight = (index) => {
    if (index >= pageItems.length - 1) return;
    const updated = [...pageItems];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    onUpdatePageItems(updated);
  };

  const handleMoveFirst = (index) => {
    if (index <= 0) return;
    const updated = [...pageItems];
    const [movedItem] = updated.splice(index, 1);
    updated.unshift(movedItem);
    onUpdatePageItems(updated);
  };

  const handleMoveLast = (index) => {
    if (index >= pageItems.length - 1) return;
    const updated = [...pageItems];
    const [movedItem] = updated.splice(index, 1);
    updated.push(movedItem);
    onUpdatePageItems(updated);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-left">
      
      {/* File Info Card */}
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

      {/* Reorder Toolbar Controls */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <LayoutGrid size={16} className="text-amber-500" />
              Page Organizer Toolbar
            </h3>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              Drag page cards to reorder, or use quick sequence buttons below.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onResetOrder}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200/60 transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <RefreshCw size={13} />
              <span>Reset Order</span>
            </button>

            <button
              type="button"
              onClick={onReverseOrder}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200/60 transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <ArrowUpDown size={13} />
              <span>Reverse Order</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 border border-slate-200/60 rounded-xl p-3">
          <Info size={16} className="text-amber-500 shrink-0" />
          <span>
            Tip: Drag thumbnails with your mouse/touch, or use the arrow buttons on each page card to move pages left, right, first, or last.
          </span>
        </div>
      </div>

      {/* Page Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {pageItems.map((item, idx) => (
          <OrganizePageCard
            key={item.id}
            item={item}
            currentPosition={idx + 1}
            totalCount={pageItems.length}
            isDragging={draggedIndex === idx}
            isDragOverTarget={dragOverIndex === idx}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDrop={handleDrop}
            onMoveLeft={handleMoveLeft}
            onMoveRight={handleMoveRight}
            onMoveFirst={handleMoveFirst}
            onMoveLast={handleMoveLast}
          />
        ))}
      </div>

      {/* Main Action Bar */}
      <div className="sticky bottom-6 bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 z-10">
        <div>
          <div className="text-sm font-black text-slate-900">
            Ready to generate organized PDF?
          </div>
          <div className="text-xs font-semibold text-slate-500 mt-0.5">
            Your {pageItems.length} pages will be reconstructed in the exact custom order above without rasterization.
          </div>
        </div>

        <button
          type="button"
          onClick={onExecuteOrganize}
          className="px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm rounded-2xl shadow-sm hover:shadow-md transition-all inline-flex items-center gap-2 cursor-pointer active:scale-95 shrink-0"
        >
          <LayoutGrid size={18} />
          <span>Organize & Save PDF</span>
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
