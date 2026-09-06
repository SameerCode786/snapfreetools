import React, { useState } from "react";
import { Download, RefreshCw, AlertCircle, Eye, CheckCircle2 } from "lucide-react";
import JSZip from "jszip";

export default function ConversionResults({
  results,
  originalFilename,
  onReset,
  onImageExpand
}) {
  const [isZipping, setIsZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);

  // Format file size
  const formatSize = (bytes) => {
    if (!bytes) return "0 KB";
    const kb = bytes / 1024;
    if (kb < 1024) return kb.toFixed(1) + " KB";
    return (kb / 1024).toFixed(1) + " MB";
  };

  // Safe filename helper
  const getSafeBaseName = (filename) => {
    return filename
      .replace(/\.[^/.]+$/, "") // remove extension
      .replace(/[^a-zA-Z0-9-_]/g, "-") // sanitize special chars
      .replace(/-+/g, "-") // collapse repeat hyphens
      .toLowerCase();
  };

  // ZIP packaging trigger (uses existing JSZip dependency)
  const handleDownloadZip = async () => {
    if (results.length === 0) return;
    setIsZipping(true);
    setZipProgress(5);

    try {
      const zip = new JSZip();
      const baseName = getSafeBaseName(originalFilename);

      for (let i = 0; i < results.length; i++) {
        const item = results[i];
        const pageNum = item.pageNumber;
        
        // Add blob to ZIP file
        zip.file(`${baseName}-page-${pageNum}.jpg`, item.blob);
        
        // Update packing progress dynamically
        const prog = Math.round(((i + 1) / results.length) * 90) + 5;
        setZipProgress(prog);
      }

      const zipBlob = await zip.generateAsync({ type: "blob" }, (metadata) => {
        setZipProgress(Math.round(95 + (metadata.percent / 20)));
      });

      // Trigger download
      const downloadUrl = URL.createObjectURL(zipBlob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${baseName}-converted-pages.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // GC Revocation
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 5000);
    } catch (err) {
      console.error("ZIP packaging failed:", err);
    } finally {
      setIsZipping(false);
      setZipProgress(0);
    }
  };

  // Handle individual page download
  const handleDownloadSingle = (item) => {
    const baseName = getSafeBaseName(originalFilename);
    const downloadUrl = URL.createObjectURL(item.blob);
    
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `${baseName}-page-${item.pageNumber}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => URL.revokeObjectURL(downloadUrl), 5000);
  };

  // Check if any pages had safe fallbacks applied (isCapped = true)
  const hasFallbackPage = results.some(item => item.isCapped);

  return (
    <div className="space-y-8 animate-fade">
      
      {/* Top dashboard action bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1.5 text-center md:text-left py-1">
          <h3 className="font-extrabold text-slate-800 text-sm flex items-center justify-center md:justify-start gap-2">
            <CheckCircle2 size={18} className="text-emerald-500" />
            Conversion Complete! ({results.length} Pages)
          </h3>
          <p className="text-xs text-slate-400 font-semibold leading-relaxed">
            All PDF pages have been successfully extracted into JPG images.
          </p>
        </div>

        {/* CTA triggers */}
        <div className="flex flex-wrap items-center justify-center gap-3 w-full md:w-auto">
          <button
            type="button"
            disabled={isZipping}
            onClick={handleDownloadZip}
            className={`py-3 px-6 text-xs font-extrabold rounded-xl shadow-xs transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
              isZipping
                ? "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-amber-500 hover:bg-amber-600 text-white font-extrabold"
            }`}
          >
            <Download size={14} /> 
            {isZipping ? `Packaging ZIP (${zipProgress}%)` : "Download All JPGs"}
          </button>
          
          <button
            type="button"
            onClick={onReset}
            className="py-3 px-6 bg-white hover:bg-slate-50 border border-slate-200 text-slate-650 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5"
          >
            <RefreshCw size={14} /> Convert Another PDF
          </button>
        </div>
      </div>

      {/* DPI Safe Fallback Alert Banner */}
      {hasFallbackPage && (
        <div className="flex items-start gap-3 bg-amber-50/40 border border-amber-100/50 rounded-2xl p-4 max-w-4xl mx-auto text-slate-650">
          <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-800">Safe Resolution Ceiling Applied</p>
            <p className="text-[11px] leading-relaxed text-slate-500 font-medium">
              Some of your PDF pages contained exceptionally large dimensions. To prevent browser memory crashes on this device, these pages were scaled to a mathematically safe maximum ceiling while preserving complete clarity.
            </p>
          </div>
        </div>
      )}

      {/* Grid of Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((item) => {
          const imgUrl = URL.createObjectURL(item.blob);
          const baseName = getSafeBaseName(originalFilename);
          
          return (
            <div
              key={item.pageNumber}
              className="bg-white border border-slate-200 rounded-3xl p-4 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-all relative group"
            >
              {/* Page Number index */}
              <span className="absolute top-3 left-3 z-10 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-black px-2.5 py-0.5 rounded-lg shadow-sm">
                Page {item.pageNumber}
              </span>

              {/* Converted JPG preview block */}
              <div className="relative w-full aspect-[1/1.4] bg-slate-50 border border-slate-150 rounded-2xl overflow-hidden mb-4 shadow-inner flex items-center justify-center p-3">
                <img
                  src={imgUrl}
                  alt={`Page ${item.pageNumber} converted JPG`}
                  className="object-contain w-full h-full shadow-2xs rounded-md"
                />
                
                {/* Expand Image overlay */}
                <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => onImageExpand(imgUrl)}
                    className="bg-white/95 text-slate-700 hover:text-amber-500 p-2.5 rounded-full shadow-md transition-all active:scale-95"
                    title="Zoom Image"
                  >
                    <Eye size={16} />
                  </button>
                </div>
              </div>

              {/* Card Meta & Download */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-extrabold uppercase border-b border-slate-50 pb-2">
                  <span>Dimensions</span>
                  <span className="text-slate-700 font-bold">{item.width} x {item.height} px</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-extrabold uppercase border-b border-slate-50 pb-2">
                  <span>File Size</span>
                  <span className="text-slate-700 font-bold">{formatSize(item.blob.size)}</span>
                </div>
                {item.isCapped && (
                  <div className="flex items-center justify-between text-[9px] text-amber-500 font-extrabold uppercase pb-1">
                    <span>Resolution Capped</span>
                    <span className="font-bold">~ {item.dpi} DPI</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => handleDownloadSingle(item)}
                  className="w-full py-2.5 px-4 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-200 text-slate-700 hover:text-amber-600 font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center justify-center gap-1.5"
                >
                  <Download size={12} /> Download Page {item.pageNumber}
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
