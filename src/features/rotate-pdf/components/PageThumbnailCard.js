"use client";

import React from "react";
import { RotateCw, RotateCcw, Check } from "lucide-react";

export default function PageThumbnailCard({
  pageNumber,
  pageIndex,
  thumbnailUrl,
  rotationAngle = 0, // 0, 90, 180, 270
  isSelected = false,
  onToggleSelect,
  onRotateClockwise,
  onRotateCounterClockwise
}) {
  return (
    <div
      className={`bg-white border rounded-2xl p-3 flex flex-col justify-between space-y-3 transition-all relative group select-none ${
        isSelected
          ? "border-amber-400 ring-2 ring-amber-400/40 shadow-sm"
          : "border-slate-200 hover:border-slate-300 shadow-2xs"
      }`}
    >
      {/* Top Bar: Page Number & Selection Checkbox */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(pageIndex)}
            className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 border-slate-300 cursor-pointer"
            id={`page-select-${pageIndex}`}
          />
          <label htmlFor={`page-select-${pageIndex}`} className="text-xs font-black text-slate-800 cursor-pointer">
            Page {pageNumber}
          </label>
        </div>

        {rotationAngle !== 0 && (
          <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200/60">
            +{rotationAngle}°
          </span>
        )}
      </div>

      {/* Thumbnail Container with CSS Visual Rotation */}
      <div className="bg-slate-100 rounded-xl p-3 flex items-center justify-center min-h-[160px] max-h-[220px] overflow-hidden border border-slate-200/60 relative">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={`Page ${pageNumber} Preview`}
            className="max-h-[180px] w-auto object-contain transition-transform duration-300 shadow-xs rounded"
            style={{
              transform: `rotate(${rotationAngle}deg)`
            }}
          />
        ) : (
          <div className="text-xs font-bold text-slate-400 animate-pulse">
            Rendering Page {pageNumber}...
          </div>
        )}
      </div>

      {/* Bottom Rotate Actions */}
      <div className="flex items-center justify-between gap-1 pt-1 border-t border-slate-100">
        <button
          type="button"
          onClick={() => onRotateCounterClockwise(pageIndex)}
          title="Rotate 90° Counter-Clockwise"
          aria-label={`Rotate page ${pageNumber} 90 degrees counter-clockwise`}
          className="flex-1 py-1.5 px-2 bg-slate-50 hover:bg-amber-50 hover:text-amber-700 text-slate-600 rounded-lg text-[11px] font-extrabold border border-slate-200/80 transition-colors flex items-center justify-center gap-1 cursor-pointer"
        >
          <RotateCcw size={12} />
          <span>↺ 90°</span>
        </button>

        <button
          type="button"
          onClick={() => onRotateClockwise(pageIndex)}
          title="Rotate 90° Clockwise"
          aria-label={`Rotate page ${pageNumber} 90 degrees clockwise`}
          className="flex-1 py-1.5 px-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-[11px] font-extrabold border border-amber-200/60 transition-colors flex items-center justify-center gap-1 cursor-pointer"
        >
          <RotateCw size={12} />
          <span>↻ 90°</span>
        </button>
      </div>
    </div>
  );
}
