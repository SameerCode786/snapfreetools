"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";

export default function PageNavigationStrip({
  currentPage = 1,
  pageCount = 1,
  pageThumbnails = [],
  onSelectPage
}) {
  const [jumpInput, setJumpInput] = useState(String(currentPage));

  useEffect(() => {
    setJumpInput(String(currentPage));
  }, [currentPage]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      onSelectPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pageCount) {
      onSelectPage(currentPage + 1);
    }
  };

  const handleApplyJump = (e) => {
    if (e) e.preventDefault();
    const parsed = parseInt(jumpInput, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= pageCount) {
      onSelectPage(parsed);
    } else {
      setJumpInput(String(currentPage));
    }
  };

  return (
    <div className="w-full bg-slate-900 border-t border-slate-800 text-white px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
      {/* Page Navigation Prev / Next Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={handlePrevPage}
          disabled={currentPage <= 1}
          title="Previous Page"
          aria-label="Previous Page"
          className="p-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white disabled:opacity-40 disabled:hover:bg-slate-800 transition-colors"
        >
          <ChevronLeft size={18} />
        </button>

        <form onSubmit={handleApplyJump} className="flex items-center gap-1.5 text-xs font-semibold">
          <span>Page</span>
          <input
            type="text"
            value={jumpInput}
            onChange={(e) => setJumpInput(e.target.value)}
            onBlur={handleApplyJump}
            aria-label="Page number input"
            className="w-10 text-center bg-slate-800 border border-slate-700 rounded-md py-1 text-white focus:outline-none focus:ring-1 focus:ring-amber-400 font-bold"
          />
          <span className="text-slate-400">of {pageCount}</span>
        </form>

        <button
          onClick={handleNextPage}
          disabled={currentPage >= pageCount}
          title="Next Page"
          aria-label="Next Page"
          className="p-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white disabled:opacity-40 disabled:hover:bg-slate-800 transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Horizontal Page Thumbnail Strip */}
      <div className="flex items-center gap-2 overflow-x-auto max-w-full py-1 scrollbar-thin scrollbar-thumb-slate-700">
        {Array.from({ length: pageCount }, (_, i) => i + 1).map((pNum) => {
          const thumbObj = pageThumbnails.find((t) => t.pageNumber === pNum);
          const isSelected = pNum === currentPage;

          return (
            <button
              key={pNum}
              onClick={() => onSelectPage(pNum)}
              aria-label={`Go to page ${pNum}`}
              className={`relative flex flex-col items-center p-1 rounded-xl transition-all shrink-0 border ${
                isSelected
                  ? "border-amber-400 bg-amber-500/10 ring-2 ring-amber-400/30"
                  : "border-slate-800 hover:border-slate-700 bg-slate-950/60"
              }`}
            >
              <div className="w-12 h-16 bg-slate-800 rounded overflow-hidden flex items-center justify-center relative">
                {thumbObj && thumbObj.thumbnailUrl ? (
                  <img
                    src={thumbObj.thumbnailUrl}
                    alt={`Page ${pNum} thumbnail`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <FileText size={18} className="text-slate-500" />
                )}
              </div>
              <span className={`text-[10px] font-bold mt-1 ${isSelected ? "text-amber-400" : "text-slate-400"}`}>
                {pNum}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
