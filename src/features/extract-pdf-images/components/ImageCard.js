import React, { useState, useEffect } from "react";
import { Download, FileImage, Layers, Eye } from "lucide-react";

export default function ImageCard({
  image,
  index,
  originalFilename,
  onExpand,
}) {
  const [objectUrl, setObjectUrl] = useState(null);

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

  useEffect(() => {
    if (!image || !image.data) return;

    const blob = new Blob([image.data], { type: image.mimeType || "image/png" });
    const url = URL.createObjectURL(blob);
    setObjectUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [image]);

  const handleDownload = (e) => {
    e.stopPropagation();
    if (!objectUrl) return;

    const baseName = getSafeBaseName(originalFilename);
    const ext = image.format || "png";
    const downloadFilename = `${baseName}-image-${index + 1}.${ext}`;

    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = downloadFilename;
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
      : "PDF.js Fallback";

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-4 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-all relative group">
      {/* Top Source Pages Badge */}
      <div className="flex items-center justify-between mb-3 z-10">
        <span className="bg-slate-900/90 backdrop-blur-xs text-white text-[10px] font-black px-2.5 py-0.5 rounded-lg shadow-2xs flex items-center gap-1">
          <Layers size={11} className="text-amber-400" />
          {pageLabel}
        </span>
        <span className="bg-amber-50 text-amber-700 border border-amber-200/80 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
          {image.format || "PNG"}
        </span>
      </div>

      {/* Thumbnail Viewport (Clickable for Lightbox) */}
      <div
        onClick={() => onExpand && onExpand(index)}
        className="relative w-full aspect-[4/3] bg-slate-50 border border-slate-150 rounded-2xl overflow-hidden mb-4 shadow-inner flex items-center justify-center p-2 cursor-pointer group/thumb"
        title="Click to view full image preview"
      >
        {objectUrl ? (
          <img
            src={objectUrl}
            alt={`Extracted PDF image ${index + 1} from ${pageLabel}`}
            className="object-contain w-full h-full rounded-md group-hover/thumb:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="flex items-center justify-center text-slate-300">
            <FileImage size={24} />
          </div>
        )}

        {/* Hover Eye Overlay */}
        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center">
          <span className="bg-white/95 text-slate-800 p-2.5 rounded-full shadow-md transition-all transform scale-90 group-hover/thumb:scale-100">
            <Eye size={16} className="text-amber-500" />
          </span>
        </div>
      </div>

      {/* Card Info & Actions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-extrabold uppercase border-b border-slate-100 pb-2">
          <span>Dimensions</span>
          <span className="text-slate-700 font-bold">
            {image.width} × {image.height} px
          </span>
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-extrabold uppercase border-b border-slate-100 pb-2">
          <span>File Size</span>
          <span className="text-slate-700 font-bold">{formatSize(image.byteSize)}</span>
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-extrabold uppercase border-b border-slate-100 pb-2">
          <span>Method</span>
          <span className="text-slate-600 font-bold truncate max-w-[120px]" title={methodLabel}>
            {methodLabel}
          </span>
        </div>

        {/* Download Button */}
        <button
          type="button"
          onClick={handleDownload}
          className="w-full py-2.5 px-4 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-200 text-slate-700 hover:text-amber-600 font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
        >
          <Download size={13} /> Download Image
        </button>
      </div>
    </div>
  );
}
