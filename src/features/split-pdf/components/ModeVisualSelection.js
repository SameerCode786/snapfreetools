import React, { useState, useEffect } from "react";
import { Grid, CheckCircle, Circle, CheckSquare, Square, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { renderPageThumbnailsBatch } from "../utils/thumbnailRenderer";

export default function ModeVisualSelection({
  file,
  selectedIndices,
  onTogglePage,
  onSelectAll,
  onClearSelection
}) {
  const [thumbnails, setThumbnails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progressMsg, setProgressMsg] = useState("Loading page thumbnails...");

  const totalPages = file.pageCount;

  useEffect(() => {
    let isMounted = true;

    async function loadThumbnails() {
      setLoading(true);
      try {
        // Initial render batch (first 24 pages or all if totalPages <= 24)
        const batchLimit = Math.min(24, totalPages);
        const initialBatch = await renderPageThumbnailsBatch(
          file.rawFile,
          { start: 1, end: batchLimit },
          0.25,
          ({ current, total }) => {
            if (isMounted) {
              setProgressMsg(`Rendering thumbnails (${current}/${total})...`);
            }
          }
        );

        if (isMounted) {
          setThumbnails(initialBatch);
          setLoading(false);
        }

        // If page count > 24, load remaining pages asynchronously in background
        if (totalPages > 24 && isMounted) {
          const remainingBatch = await renderPageThumbnailsBatch(
            file.rawFile,
            { start: 25, end: totalPages },
            0.25
          );

          if (isMounted) {
            setThumbnails(prev => [...prev, ...remainingBatch]);
          }
        }
      } catch (err) {
        console.error("Failed to render page thumbnails:", err);
        if (isMounted) setLoading(false);
      }
    }

    loadThumbnails();

    return () => {
      isMounted = false;
    };
  }, [file]);

  const selectedCount = selectedIndices.length;

  const getReadableSummary = () => {
    if (selectedCount === 0) return "No pages selected.";
    if (selectedCount === totalPages) return `All ${totalPages} pages selected.`;

    const sortedPages = [...selectedIndices].sort((a, b) => a - b).map(idx => idx + 1);
    if (sortedPages.length <= 6) {
      return `Selected Pages: ${sortedPages.join(", ")}`;
    }
    return `Selected ${selectedCount} of ${totalPages} pages (${sortedPages.slice(0, 5).join(", ")}, ...)`;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
      {/* Workspace Header & Action Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="space-y-1">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Grid className="text-amber-500" size={18} />
            Visual Page Selection
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Click thumbnails to select or deselect pages to extract.
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            type="button"
            onClick={onSelectAll}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <CheckSquare size={14} /> Select All
          </button>
          <button
            type="button"
            onClick={onClearSelection}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Square size={14} /> Clear Selection
          </button>
        </div>
      </div>

      {/* Selected Summary Badge */}
      <div className="p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-semibold text-amber-900">
        <span>{getReadableSummary()}</span>
        <span className="text-[11px] text-amber-700 font-medium">
          Original page order is automatically preserved.
        </span>
      </div>

      {/* Thumbnails Loading Overlay / Grid */}
      {loading && thumbnails.length === 0 ? (
        <div className="py-12 text-center space-y-3">
          <Loader2 className="animate-spin text-amber-500 mx-auto" size={32} />
          <p className="text-xs font-bold text-slate-500">{progressMsg}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-[460px] overflow-y-auto p-1 pr-2 custom-scrollbar">
          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNum = idx + 1;
            const thumb = thumbnails.find(t => t.pageIndex === idx);
            const isSelected = selectedIndices.includes(idx);

            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onTogglePage(idx)}
                className={`relative group rounded-2xl border p-2 text-center transition-all flex flex-col items-center justify-between aspect-[3/4] overflow-hidden ${
                  isSelected
                    ? "bg-amber-50 border-amber-500 ring-2 ring-amber-500/30 shadow-md scale-[1.02]"
                    : "bg-slate-50 border-slate-200 hover:border-slate-300 opacity-75 hover:opacity-100"
                }`}
              >
                {/* Page Number Badge */}
                <div className="w-full flex items-center justify-between z-10">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${isSelected ? "bg-amber-500 text-white" : "bg-slate-200 text-slate-700"}`}>
                    Page {pageNum}
                  </span>
                  {isSelected ? (
                    <CheckCircle size={16} className="text-amber-500 shrink-0 fill-white" />
                  ) : (
                    <Circle size={16} className="text-slate-300 shrink-0" />
                  )}
                </div>

                {/* Thumbnail Image */}
                <div className="my-auto w-full h-[80%] flex items-center justify-center overflow-hidden rounded-lg bg-white border border-slate-100 shadow-2xs">
                  {thumb && thumb.thumbnailUrl ? (
                    <img
                      src={thumb.thumbnailUrl}
                      alt={`Page ${pageNum}`}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <div className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                      <Loader2 size={12} className="animate-spin" /> Page {pageNum}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
