import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  RefreshCw,
  FileText,
  Filter,
  ArrowRight,
  Info,
  Download,
} from "lucide-react";
import JSZip from "jszip";
import ImageCard from "./ImageCard";
import ImageLightbox from "./ImageLightbox";

export default function ResultsGrid({ result, file, onReset }) {
  const [minSizeFilter, setMinSizeFilter] = useState(1); // 1, 32, 64, 128
  const [expandedIndex, setExpandedIndex] = useState(null);

  // ZIP packaging state
  const [isZipping, setIsZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);

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

  const images = result?.images || [];
  const uniqueCount = result?.uniqueImagesCount || 0;
  const totalCount = result?.totalImagesCount || 0;
  const pageCount = result?.pageCount || 0;
  const filename = file?.name || "document.pdf";
  const filesize = file?.size || 0;

  // Apply client-side visibility filter
  const visibleImages = images.filter(
    (img) => img.width >= minSizeFilter && img.height >= minSizeFilter
  );

  // Reset expanded index if filter changes and index becomes out of bounds
  useEffect(() => {
    if (expandedIndex !== null && expandedIndex >= visibleImages.length) {
      setExpandedIndex(null);
    }
  }, [minSizeFilter, visibleImages.length, expandedIndex]);

  // Handle Batch ZIP Export
  const handleDownloadZip = async () => {
    if (visibleImages.length === 0 || isZipping) return;

    setIsZipping(true);
    setZipProgress(5);

    try {
      const zip = new JSZip();
      const baseName = getSafeBaseName(filename);
      const usedNames = new Set();

      for (let i = 0; i < visibleImages.length; i++) {
        const item = visibleImages[i];
        const ext = item.format || "png";

        let entryName = `${baseName}-image-${i + 1}.${ext}`;
        let counter = 1;
        while (usedNames.has(entryName)) {
          entryName = `${baseName}-image-${i + 1}-${counter}.${ext}`;
          counter++;
        }
        usedNames.add(entryName);

        // Add binary Uint8Array directly to ZIP
        zip.file(entryName, item.data);

        // Update progress callback
        const prog = Math.round(((i + 1) / visibleImages.length) * 85) + 5;
        setZipProgress(prog);
      }

      const zipBlob = await zip.generateAsync(
        { type: "blob" },
        (metadata) => {
          setZipProgress(Math.round(90 + metadata.percent / 10));
        }
      );

      const downloadUrl = URL.createObjectURL(zipBlob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${baseName}-extracted-images.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(downloadUrl), 5000);
    } catch (err) {
      console.error("ZIP packaging failed:", err);
    } finally {
      setIsZipping(false);
      setZipProgress(0);
    }
  };

  // Empty State: No embedded images found in PDF
  if (images.length === 0) {
    return (
      <div className="w-full max-w-3xl mx-auto space-y-6 animate-fade">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-5 shadow-xs">
          <div className="w-14 h-14 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-center mx-auto text-amber-500 shadow-inner">
            <Info size={26} />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h3 className="font-extrabold text-slate-800 text-lg">
              No supported embedded images were found in this PDF.
            </h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              This document appears to contain selectable text or vector drawing graphics rather than standalone embedded raster photo objects.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/pdf-to-jpg"
              className="py-3 px-6 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              Try PDF to JPG <ArrowRight size={14} />
            </Link>
            <button
              type="button"
              onClick={onReset}
              className="py-3 px-6 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 w-full sm:w-auto"
            >
              <RefreshCw size={14} /> Extract Another PDF
            </button>
          </div>

          <p className="text-[11px] text-slate-400 font-medium pt-2 border-t border-slate-100">
            <strong>Tip:</strong> PDF to JPG converts full PDF pages into image snapshots including text and layout.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade w-full max-w-6xl mx-auto">
      {/* Top Bar Summary Dashboard */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center lg:text-left">
          <h3 className="font-extrabold text-slate-800 text-base flex items-center justify-center lg:justify-start gap-2">
            <CheckCircle2 size={18} className="text-emerald-500" />
            Extraction Complete! ({uniqueCount} Unique Image{uniqueCount !== 1 ? "s" : ""})
          </h3>
          <p className="text-xs text-slate-400 font-medium leading-relaxed flex flex-wrap items-center justify-center lg:justify-start gap-x-3 gap-y-1">
            <span className="flex items-center gap-1">
              <FileText size={12} /> {filename} ({formatSize(filesize)})
            </span>
            <span>•</span>
            <span>{pageCount} Page{pageCount !== 1 ? "s" : ""}</span>
            <span>•</span>
            <span>{totalCount} Total Placement{totalCount !== 1 ? "s" : ""}</span>
          </p>
        </div>

        {/* Action Controls & Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 w-full lg:w-auto">
          {/* Dimension Filter Controls */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl p-1 text-xs">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase px-2 flex items-center gap-1">
              <Filter size={10} /> Filter:
            </span>
            {[
              { label: "All", val: 1 },
              { label: "32×32+", val: 32 },
              { label: "64×64+", val: 64 },
              { label: "128×128+", val: 128 },
            ].map((f) => (
              <button
                key={f.val}
                type="button"
                onClick={() => setMinSizeFilter(f.val)}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                  minSizeFilter === f.val
                    ? "bg-white text-slate-900 shadow-2xs border border-slate-200/80"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Download All as ZIP Button */}
          {visibleImages.length > 0 && (
            <button
              type="button"
              disabled={isZipping}
              onClick={handleDownloadZip}
              className={`py-2.5 px-5 text-xs font-extrabold rounded-xl shadow-xs transition-all active:scale-95 flex items-center justify-center gap-2 ${
                isZipping
                  ? "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-amber-500 hover:bg-amber-600 text-white font-extrabold"
              }`}
              aria-label="Download all visible extracted images as a ZIP file"
            >
              <Download size={14} />
              {isZipping ? `Packaging ZIP (${zipProgress}%)` : "Download All as ZIP"}
            </button>
          )}

          {/* Reset Button */}
          <button
            type="button"
            onClick={onReset}
            className="py-2.5 px-5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95"
          >
            <RefreshCw size={13} /> Extract Another PDF
          </button>
        </div>
      </div>

      {/* Grid of Image Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {visibleImages.map((image, idx) => (
          <ImageCard
            key={image.id || idx}
            image={image}
            index={idx}
            originalFilename={filename}
            onExpand={(cardIndex) => setExpandedIndex(cardIndex)}
          />
        ))}
      </div>

      {/* Lightbox Preview Modal */}
      {expandedIndex !== null && visibleImages[expandedIndex] && (
        <ImageLightbox
          image={visibleImages[expandedIndex]}
          currentIndex={expandedIndex}
          totalCount={visibleImages.length}
          originalFilename={filename}
          onClose={() => setExpandedIndex(null)}
          onNext={() =>
            setExpandedIndex((prev) =>
              prev < visibleImages.length - 1 ? prev + 1 : prev
            )
          }
          onPrev={() =>
            setExpandedIndex((prev) => (prev > 0 ? prev - 1 : prev))
          }
        />
      )}

      {/* Hidden Filter State Warning */}
      {visibleImages.length === 0 && images.length > 0 && (
        <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-6 text-center text-xs text-amber-700 space-y-2">
          <p className="font-bold">All extracted images are smaller than the selected filter size.</p>
          <button
            type="button"
            onClick={() => setMinSizeFilter(1)}
            className="underline font-extrabold text-amber-800 hover:text-amber-900"
          >
            Show All Images
          </button>
        </div>
      )}
    </div>
  );
}
