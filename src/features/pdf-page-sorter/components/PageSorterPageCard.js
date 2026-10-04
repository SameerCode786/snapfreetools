"use client";

import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RotateCw,
  Trash2,
  GripVertical
} from "lucide-react";

export default function PageSorterPageCard({
  page,
  currentIndex,
  totalItems,
  onMove,
  onRotate,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  isDragTarget = false
}) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, currentIndex)}
      onDragOver={(e) => onDragOver(e, currentIndex)}
      onDrop={(e) => onDrop(e, currentIndex)}
      className={`group relative bg-white border rounded-2xl p-3 shadow-xs hover:shadow-md transition-all flex flex-col justify-between select-none ${
        isDragTarget
          ? "border-amber-500 ring-2 ring-amber-400/30 scale-[1.02]"
          : "border-slate-200/90 hover:border-amber-300"
      }`}
    >
      {/* Top Header: Badge & Quick Action Buttons */}
      <div className="flex items-center justify-between gap-1 pb-2 border-b border-slate-100 mb-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="cursor-grab active:cursor-grabbing text-slate-300 group-hover:text-amber-500 transition-colors shrink-0">
            <GripVertical size={14} />
          </span>
          <span className="text-[11px] font-black text-slate-800 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200/60 truncate">
            #{currentIndex + 1}
          </span>
          {page.originalPageNumber !== currentIndex + 1 && (
            <span className="text-[9px] font-extrabold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60 shrink-0">
              Orig: P.{page.originalPageNumber}
            </span>
          )}
        </div>

        {/* Action Buttons (Rotate & Delete) */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => onRotate(currentIndex)}
            title="Rotate Page 90° Clockwise"
            className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-amber-50 text-slate-500 hover:text-amber-600 border border-slate-200/60 hover:border-amber-200 flex items-center justify-center transition-all cursor-pointer"
          >
            <RotateCw size={13} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(currentIndex)}
            title="Delete Page"
            className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200/60 hover:border-rose-200 flex items-center justify-center transition-all cursor-pointer"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Thumbnail Container */}
      <div className="relative aspect-[3/4] bg-slate-50 border border-slate-100 rounded-xl overflow-hidden flex items-center justify-center p-1 my-1">
        {page.thumbnailUrl ? (
          <img
            src={page.thumbnailUrl}
            alt={`Page ${page.originalPageNumber}`}
            style={{ transform: `rotate(${page.rotation || 0}deg)` }}
            className="max-h-full max-w-full object-contain shadow-2xs transition-transform duration-200"
          />
        ) : (
          <div className="text-xs text-slate-400 font-semibold">Page {page.originalPageNumber}</div>
        )}
      </div>

      {/* Directional Navigation Control Strip (Touch & Keyboard Friendly) */}
      <div className="pt-2 border-t border-slate-100 mt-2 flex items-center justify-between gap-1">
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={() => onMove(currentIndex, 0)}
            title="Move to First"
            className="w-6 h-6 rounded-md bg-slate-50 hover:bg-amber-50 text-slate-500 hover:text-amber-600 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center text-xs transition-colors"
          >
            <ChevronsLeft size={12} />
          </button>
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={() => onMove(currentIndex, currentIndex - 1)}
            title="Move Left"
            className="w-6 h-6 rounded-md bg-slate-50 hover:bg-amber-50 text-slate-500 hover:text-amber-600 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center text-xs transition-colors"
          >
            <ChevronLeft size={12} />
          </button>
        </div>

        <span className="text-[9px] font-bold text-slate-400">
          {currentIndex + 1} / {totalItems}
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={currentIndex === totalItems - 1}
            onClick={() => onMove(currentIndex, currentIndex + 1)}
            title="Move Right"
            className="w-6 h-6 rounded-md bg-slate-50 hover:bg-amber-50 text-slate-500 hover:text-amber-600 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center text-xs transition-colors"
          >
            <ChevronRight size={12} />
          </button>
          <button
            type="button"
            disabled={currentIndex === totalItems - 1}
            onClick={() => onMove(currentIndex, totalItems - 1)}
            title="Move to End"
            className="w-6 h-6 rounded-md bg-slate-50 hover:bg-amber-50 text-slate-500 hover:text-amber-600 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center text-xs transition-colors"
          >
            <ChevronsRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
