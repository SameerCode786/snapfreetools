"use client";

import React from "react";
import { Download, CheckCircle2, RefreshCw, FileArchive, Image as ImageIcon, ArrowRight, ShieldCheck } from "lucide-react";
import ShareSystem from "@/components/share";

export default function SuccessState({ result, onReset }) {
  const { zipFilename, zipDownloadUrl, images = [], convertedCount = 0 } = result || {};

  const handleDownloadZip = () => {
    if (!zipDownloadUrl) return;
    const link = document.createElement("a");
    link.href = zipDownloadUrl;
    link.download = zipFilename || "converted-images.zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadSingleImage = (img) => {
    if (!img.objectUrl) return;
    const link = document.createElement("a");
    link.href = img.objectUrl;
    link.download = img.filename || `page-${img.pageNumber}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Success Banner */}
      <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-xs">
        <div className="w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 size={36} />
        </div>

        <div className="space-y-1">
          <h3 className="text-2xl font-black text-slate-900">
            Conversion Complete!
          </h3>
          <p className="text-sm font-semibold text-slate-600">
            Successfully converted {convertedCount} {convertedCount === 1 ? "page" : "pages"} to high-quality PNG images.
          </p>
        </div>

        {/* Primary ZIP Download Button */}
        {zipDownloadUrl && (
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleDownloadZip}
              className="w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-base rounded-2xl shadow-md transition-all inline-flex items-center justify-center gap-3 cursor-pointer hover:scale-[1.01]"
            >
              <FileArchive size={22} />
              <span>Download All PNGs as ZIP</span>
            </button>

            <button
              onClick={onReset}
              className="w-full sm:w-auto px-6 py-4 border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 font-bold text-sm rounded-2xl transition-all inline-flex items-center justify-center gap-2 cursor-pointer bg-white"
            >
              <RefreshCw size={16} />
              <span>Convert Another PDF</span>
            </button>
          </div>
        )}
      </div>

      {/* Individual PNG File Downloads */}
      {images.length > 0 && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-900 font-black text-lg">
              <ImageIcon size={22} className="text-amber-500" />
              <h4>Individual PNG Downloads ({images.length})</h4>
            </div>
            <span className="text-xs font-bold text-slate-400">
              Click thumbnail or download button
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((img) => (
              <div
                key={img.pageNumber}
                className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between gap-3 hover:border-amber-300 transition-all group"
              >
                <div className="relative bg-white rounded-xl overflow-hidden border border-slate-200/80 flex items-center justify-center h-44 p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.objectUrl}
                    alt={`Page ${img.pageNumber} PNG`}
                    className="max-h-full max-w-full object-contain"
                  />
                  <div className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    Page {img.pageNumber}
                  </div>
                  {img.isCapped && (
                    <div className="absolute top-2 right-2 bg-amber-500/90 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-md">
                      Auto-Capped
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                    <span className="truncate max-w-[140px]" title={img.filename}>
                      {img.filename}
                    </span>
                    <span>
                      {img.width}x{img.height} px
                    </span>
                  </div>

                  <button
                    onClick={() => handleDownloadSingleImage(img)}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all inline-flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                  >
                    <Download size={14} />
                    <span>Download PNG</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Share System Integration */}
      <div className="pt-4">
        <ShareSystem
          title="PDF to PNG Converter – SnapFreeTools"
          description="Convert PDF pages into high-quality PNG images online for free directly in your browser."
        />
      </div>
    </div>
  );
}
