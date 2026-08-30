import React from "react";
import { ArrowLeft, ArrowRight, Trash2, GripHorizontal } from "lucide-react";
import { calculatePageLayout } from "../utils/layoutCalculator";

export default function ImageItem({
  item,
  index,
  total,
  settings,
  onMove,
  onRemove,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDrop
}) {
  // Format file size
  const formatSize = (bytes) => {
    if (!bytes) return "0 KB";
    const kb = bytes / 1024;
    if (kb < 1024) return kb.toFixed(1) + " KB";
    return (kb / 1024).toFixed(1) + " MB";
  };

  // Get dynamic page layout dimensions & scale coordinates
  const {
    pageWidth,
    pageHeight,
    drawX,
    drawY,
    drawWidth,
    drawHeight
  } = calculatePageLayout(item.width || 800, item.height || 600, settings);

  // Compute percentage coordinates for HTML preview rendering
  const imgLeft = (drawX / pageWidth) * 100;
  const imgTop = (drawY / pageHeight) * 100;
  const imgWidth = (drawWidth / pageWidth) * 100;
  const imgHeight = (drawHeight / pageHeight) * 100;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDragEnd={onDragEnd}
      onDrop={(e) => onDrop(e, index)}
      className="bg-white border border-slate-200 hover:border-amber-400 rounded-3xl p-4 flex flex-col justify-between shadow-xs transition-all select-none group cursor-grab active:cursor-grabbing relative"
    >
      {/* Index Badge */}
      <span className="absolute top-3 left-3 z-10 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-black px-2.5 py-0.5 rounded-lg shadow-sm">
        {index + 1}
      </span>

      {/* Image Preview Container (Live PDF Page Sheet) */}
      <div className="relative w-full bg-slate-50 border border-slate-150 rounded-2xl overflow-hidden mb-3 shadow-inner flex items-center justify-center p-4 min-h-[220px]">
        {/* The PDF Page Sheet Wrapper */}
        <div
          className="relative bg-white shadow-sm border border-slate-200 transition-all select-none overflow-hidden duration-350"
          style={{
            width: "100%",
            maxWidth: "140px",
            aspectRatio: `${pageWidth} / ${pageHeight}`,
            margin: "0 auto"
          }}
        >
          {/* Image absolutely placed within page margins */}
          <img
            src={item.url}
            alt={item.name}
            className="absolute shadow-2xs"
            style={{
              left: `${imgLeft}%`,
              top: `${imgTop}%`,
              width: `${imgWidth}%`,
              height: `${imgHeight}%`,
              objectFit: "fill"
            }}
            loading="lazy"
          />
        </div>
        {/* Drag Handle overlay on hover */}
        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <div className="bg-white/95 p-1.5 rounded-full shadow-md">
            <GripHorizontal size={14} className="text-slate-700" />
          </div>
        </div>
      </div>

      {/* Meta details */}
      <div className="space-y-1 mb-3">
        <div className="text-xs font-bold text-slate-800 truncate" title={item.name}>
          {item.name}
        </div>
        <div className="text-[10px] text-slate-400 font-semibold">
          {formatSize(item.size)}
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-2 gap-1">
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={index === 0}
            onClick={(e) => {
              e.stopPropagation();
              onMove(index, index - 1);
            }}
            className={`p-1.5 rounded-lg border transition-all ${
              index === 0
                ? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed"
                : "bg-white border-slate-200 text-slate-600 hover:border-amber-300 hover:text-amber-600"
            }`}
            title="Move backward"
          >
            <ArrowLeft size={12} />
          </button>
          <button
            type="button"
            disabled={index === total - 1}
            onClick={(e) => {
              e.stopPropagation();
              onMove(index, index + 1);
            }}
            className={`p-1.5 rounded-lg border transition-all ${
              index === total - 1
                ? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed"
                : "bg-white border-slate-200 text-slate-600 hover:border-amber-300 hover:text-amber-600"
            }`}
            title="Move forward"
          >
            <ArrowRight size={12} />
          </button>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(index);
          }}
          className="p-1.5 rounded-lg border border-red-100 bg-red-50/50 hover:bg-red-50 text-red-500 transition-colors"
          title="Remove image"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}
