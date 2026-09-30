import React, { useState, useEffect, useRef } from "react";
import { X, ChevronLeft, ChevronRight, Download, Layers, FileImage, Cpu } from "lucide-react";

export default function ImageLightbox({
  image,
  currentIndex,
  totalCount,
  onClose,
  onNext,
  onPrev,
  originalFilename,
}) {
  const [objectUrl, setObjectUrl] = useState(null);
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  const formatSize = (bytes) => {
    if (!bytes) return "0 KB";
    const kb = bytes / 1024;
    if (kb < 1024) return kb.toFixed(1) + " KB";
    return (kb / 1024).toFixed(1) + " MB";
  };

  const getSafeBaseName = (filename) => {
    if (!filename) return "extracted";
    return filename
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .replace(/-+/g, "-")
      .toLowerCase();
  };

  // Focus trap management and Object URL creation
  useEffect(() => {
    if (!image || !image.data) return;

    const blob = new Blob([image.data], { type: image.mimeType || "image/png" });
    const url = URL.createObjectURL(blob);
    setObjectUrl(url);

    // Focus close button when lightbox opens
    if (closeButtonRef.current) {
      closeButtonRef.current.focus();
    }

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [image]);

  // Keyboard navigation listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowLeft") {
        if (currentIndex > 0) {
          e.preventDefault();
          onPrev();
        }
      } else if (e.key === "ArrowRight") {
        if (currentIndex < totalCount - 1) {
          e.preventDefault();
          onNext();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, totalCount, onClose, onNext, onPrev]);

  if (!image) return null;

  const handleIndividualDownload = (e) => {
    e.stopPropagation(); // Do not close lightbox or trigger backdrop
    if (!objectUrl) return;

    const baseName = getSafeBaseName(originalFilename);
    const ext = image.format || "png";
    const filename = `${baseName}-image-${currentIndex + 1}.${ext}`;

    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const pageLabel =
    image.sourcePages && image.sourcePages.length > 0
      ? image.sourcePages.length === 1
        ? `Page ${image.sourcePages[0]}`
        : `Pages ${image.sourcePages.join(", ")}`
      : "Unknown Page";

  const methodLabel =
    image.extractionMethod === "original-stream"
      ? "Original Stream"
      : image.extractionMethod === "decoded-png"
      ? "Decoded PNG"
      : "PDF.js Fallback Engine";

  const hasMultiple = totalCount > 1;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade"
      role="dialog"
      aria-modal="true"
      aria-label="Extracted PDF image lightbox preview"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking content
        className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden relative"
      >
        {/* Header Bar */}
        <div className="px-5 py-4 border-b border-slate-150 flex items-center justify-between shrink-0 bg-slate-50/50">
          <div className="flex items-center gap-2 text-xs font-extrabold text-slate-800 truncate">
            <FileImage size={16} className="text-amber-500 shrink-0" />
            <span className="truncate">
              Image {currentIndex + 1} of {totalCount}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-all"
              aria-label="Close image lightbox"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Image Viewport & Side Navigation Buttons */}
        <div className="relative flex-1 bg-slate-950/5 p-4 flex items-center justify-center min-h-[250px] sm:min-h-[350px] overflow-hidden">
          {/* Previous Arrow Button */}
          {hasMultiple && currentIndex > 0 && (
            <button
              type="button"
              onClick={onPrev}
              className="absolute left-3 z-10 p-3 bg-white/90 hover:bg-white text-slate-800 rounded-2xl shadow-lg border border-slate-200/80 transition-all hover:scale-105 active:scale-95"
              aria-label="Previous visible image"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          {/* Next Arrow Button */}
          {hasMultiple && currentIndex < totalCount - 1 && (
            <button
              type="button"
              onClick={onNext}
              className="absolute right-3 z-10 p-3 bg-white/90 hover:bg-white text-slate-800 rounded-2xl shadow-lg border border-slate-200/80 transition-all hover:scale-105 active:scale-95"
              aria-label="Next visible image"
            >
              <ChevronRight size={20} />
            </button>
          )}

          {/* Image Display */}
          {objectUrl ? (
            <img
              src={objectUrl}
              alt={`Full resolution preview of extracted image ${currentIndex + 1} from ${pageLabel}`}
              className="max-h-[55vh] sm:max-h-[65vh] w-auto max-w-full object-contain rounded-xl shadow-xs"
            />
          ) : (
            <div className="text-slate-400 text-xs font-bold">Loading preview...</div>
          )}
        </div>

        {/* Footer Metadata & Individual Download Bar */}
        <div className="p-4 sm:p-5 border-t border-slate-150 bg-white shrink-0 space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center sm:text-left">
            <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-2xl">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase block">
                Format
              </span>
              <span className="text-xs font-extrabold text-slate-800 uppercase">
                {image.format || "PNG"}
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-2xl">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase block">
                Dimensions
              </span>
              <span className="text-xs font-extrabold text-slate-800">
                {image.width} × {image.height} px
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-2xl">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase block">
                File Size
              </span>
              <span className="text-xs font-extrabold text-slate-800">
                {formatSize(image.byteSize)}
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-2xl">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase block flex items-center justify-center sm:justify-start gap-1">
                <Cpu size={10} className="text-amber-500" /> Method
              </span>
              <span className="text-xs font-extrabold text-slate-800 truncate block">
                {methodLabel}
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-2xl">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase block flex items-center justify-center sm:justify-start gap-1">
                <Layers size={10} className="text-amber-500" /> Source
              </span>
              <span className="text-xs font-extrabold text-slate-800 truncate block">
                {pageLabel}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={handleIndividualDownload}
              className="py-2.5 px-6 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 active:scale-95 w-full sm:w-auto"
              aria-label={`Download image ${currentIndex + 1} (${image.format || "png"})`}
            >
              <Download size={14} /> Download This Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
