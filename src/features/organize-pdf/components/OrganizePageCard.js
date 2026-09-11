"use client";

import React from "react";
import { GripVertical, ArrowLeft, ArrowRight, ArrowUpToLine, ArrowDownToLine } from "lucide-react";

export default function OrganizePageCard({
  item,
  currentPosition,
  totalCount,
  isDragging,
  isDragOverTarget,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDrop,
  onMoveLeft,
  onMoveRight,
  onMoveFirst,
  onMoveLast
}) {
  const { originalPageNumber, thumbnailUrl } = item;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, currentPosition - 1)}
      onDragOver={(e) => onDragOver(e, currentPosition - 1)}
      onDragEnd={onDragEnd}
      onDrop={(e) => onDrop(e, currentPosition - 1)}
      className={`group relative bg-white border-2 rounded-2xl p-3 flex flex-col items-center gap-2.5 transition-all select-none ${
        isDragging
          ? "opacity-30 border-amber-400 scale-95"
          : isDragOverTarget
          ? "border-amber-500 bg-amber-50/40 shadow-md scale-[1.02]"
          : "border-slate-200/90 hover:border-slate-400 hover:shadow-xs"
      }`}
      tabIndex={0}
      role="article"
      aria-label={`Page ${originalPageNumber} currently at position ${currentPosition} of ${totalCount}`}
    >
      {/* Top Bar: Position Pill & Drag Handle */}
      <div className="w-full flex items-center justify-between gap-1.5 border-b border-slate-100 pb-2">
        <div className="flex items-center gap-1.5">
          <span className="w-6 h-6 rounded-lg bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0">
            {currentPosition}
          </span>
          <span className="text-[11px] font-extrabold text-slate-500 truncate">
            Orig P.{originalPageNumber}
          </span>
        </div>

        <div
          className="p-1 text-slate-400 group-hover:text-slate-700 cursor-grab active:cursor-grabbing hover:bg-slate-100 rounded"
          title="Drag to reorder"
        >
          <GripVertical size={16} />
        </div>
      </div>

      {/* Thumbnail Preview Image */}
      <div className="relative w-full aspect-[1/1.4] bg-slate-100 border border-slate-200/80 rounded-xl overflow-hidden flex items-center justify-center">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={`Thumbnail of page ${originalPageNumber}`}
            className="w-full h-full object-contain"
            loading="lazy"
          />
        ) : (
          <div className="text-xs font-bold text-slate-400 animate-pulse">
            Loading...
          </div>
        )}
      </div>

      {/* Reordering Action Controls (For Accessibility & Mobile Taps) */}
      <div className="w-full grid grid-cols-4 gap-1 pt-1 border-t border-slate-100">
        <button
          type="button"
          onClick={() => onMoveFirst(currentPosition - 1)}
          disabled={currentPosition === 1}
          title="Move to First"
          className="p-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
        >
          <ArrowUpToLine size={13} />
        </button>

        <button
          type="button"
          onClick={() => onMoveLeft(currentPosition - 1)}
          disabled={currentPosition === 1}
          title="Move Left"
          className="p-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
        >
          <ArrowLeft size={13} />
        </button>

        <button
          type="button"
          onClick={() => onMoveRight(currentPosition - 1)}
          disabled={currentPosition === totalCount}
          title="Move Right"
          className="p-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
        >
          <ArrowRight size={13} />
        </button>

        <button
          type="button"
          onClick={() => onMoveLast(currentPosition - 1)}
          disabled={currentPosition === totalCount}
          title="Move to Last"
          className="p-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
        >
          <ArrowDownToLine size={13} />
        </button>
      </div>
    </div>
  );
}
