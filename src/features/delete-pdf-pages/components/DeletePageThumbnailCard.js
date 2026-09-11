"use client";

import React from "react";
import { Trash2, Undo, CheckSquare, Square } from "lucide-react";

export default function DeletePageThumbnailCard({
  pageNumber,
  pageIndex,
  thumbnailUrl,
  isMarkedForDeletion,
  onToggleDelete
}) {
  return (
    <div
      onClick={() => onToggleDelete(pageIndex)}
      className={`group relative bg-white border-2 rounded-2xl p-3 flex flex-col items-center gap-3 transition-all cursor-pointer select-none ${
        isMarkedForDeletion
          ? "border-red-500 bg-red-50/30 shadow-xs scale-[0.99]"
          : "border-slate-200/90 hover:border-slate-400 hover:shadow-xs"
      }`}
      tabIndex={0}
      role="checkbox"
      aria-checked={isMarkedForDeletion}
      aria-label={`Page ${pageNumber} - ${isMarkedForDeletion ? "Marked for deletion" : "Kept"}`}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          onToggleDelete(pageIndex);
        }
      }}
    >
      {/* Top Bar: Checkbox & Status */}
      <div className="w-full flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <div
            className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
              isMarkedForDeletion
                ? "bg-red-600 text-white"
                : "bg-slate-100 text-slate-400 border border-slate-300 group-hover:border-slate-400"
            }`}
          >
            {isMarkedForDeletion ? <CheckSquare size={14} /> : <Square size={14} />}
          </div>
          <span className="text-xs font-black text-slate-800">
            Page {pageNumber}
          </span>
        </div>

        {isMarkedForDeletion && (
          <span className="px-2 py-0.5 bg-red-100 border border-red-200 text-red-700 text-[10px] font-black rounded-md flex items-center gap-1">
            <Trash2 size={10} />
            <span>Delete</span>
          </span>
        )}
      </div>

      {/* Page Preview Thumbnail Container */}
      <div className="relative w-full aspect-[1/1.4] bg-slate-100 border border-slate-200/80 rounded-xl overflow-hidden flex items-center justify-center">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={`Thumbnail of page ${pageNumber}`}
            className={`w-full h-full object-contain transition-opacity ${
              isMarkedForDeletion ? "opacity-40 grayscale-[30%]" : "opacity-100"
            }`}
            loading="lazy"
          />
        ) : (
          <div className="text-xs font-bold text-slate-400 animate-pulse">
            Loading...
          </div>
        )}

        {/* Deletion Overlay Banner */}
        {isMarkedForDeletion && (
          <div className="absolute inset-0 bg-red-950/20 backdrop-blur-[1px] flex flex-col items-center justify-center gap-1.5 text-red-600 p-2">
            <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md">
              <Trash2 size={20} />
            </div>
            <span className="text-xs font-black text-white bg-red-600/90 px-2 py-0.5 rounded-md shadow-xs text-center">
              Will Be Deleted
            </span>
          </div>
        )}
      </div>

      {/* Card Action Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleDelete(pageIndex);
        }}
        className={`w-full py-1.5 text-xs font-extrabold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
          isMarkedForDeletion
            ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
            : "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/60"
        }`}
      >
        {isMarkedForDeletion ? (
          <>
            <Undo size={12} />
            <span>Keep Page</span>
          </>
        ) : (
          <>
            <Trash2 size={12} />
            <span>Delete Page</span>
          </>
        )}
      </button>
    </div>
  );
}
