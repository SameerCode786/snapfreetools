import React, { useState, useRef } from "react";
import { Upload, Image as ImageIcon, Clipboard, ShieldCheck, Zap, AlertCircle } from "lucide-react";

export default function ImageUploader({ onFilesSelected, error = null }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(Array.from(e.target.files));
    }
  };

  const handlePasteClipboard = async () => {
    try {
      if (!navigator.clipboard || !navigator.clipboard.read) {
        alert("Clipboard image pasting is not supported in this browser. Please use drag & drop or file browse.");
        return;
      }
      const clipboardItems = await navigator.clipboard.read();
      const imageFiles = [];

      for (const item of clipboardItems) {
        for (const type of item.types) {
          if (type.startsWith("image/")) {
            const blob = await item.getType(type);
            const file = new File([blob], `pasted-image.${type.split("/")[1] || "png"}`, { type });
            imageFiles.push(file);
          }
        }
      }

      if (imageFiles.length > 0) {
        onFilesSelected(imageFiles);
      } else {
        alert("No image found on your clipboard. Copy an image first!");
      }
    } catch {
      alert("Could not access clipboard image. Permission denied or no image copied.");
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer select-none ${
          isDragging
            ? "border-amber-500 bg-amber-50/60 scale-[1.01]"
            : "border-slate-300 hover:border-amber-400 bg-white hover:bg-slate-50/50 shadow-xs hover:shadow-md"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/bmp"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-500 shadow-xs">
            <Upload size={30} />
          </div>

          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              Drag & drop your images here
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              or <span className="text-amber-600 font-bold underline">click to browse</span> from your device
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px] font-bold text-slate-400">
            <span className="px-2.5 py-1 bg-slate-100 rounded-lg">JPG</span>
            <span className="px-2.5 py-1 bg-slate-100 rounded-lg">PNG</span>
            <span className="px-2.5 py-1 bg-slate-100 rounded-lg">WebP</span>
            <span className="px-2.5 py-1 bg-slate-100 rounded-lg">GIF</span>
            <span className="px-2.5 py-1 bg-slate-100 rounded-lg">BMP</span>
            <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-slate-500">Up to 50 MB per file</span>
          </div>

          {/* Paste Clipboard Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePasteClipboard();
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Clipboard size={14} className="text-amber-500" />
              <span>Paste Image from Clipboard</span>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl flex items-center gap-2 text-xs font-bold" role="alert">
          <AlertCircle size={16} className="shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Privacy Guarantee Pill */}
      <p className="text-[11px] text-slate-400 font-semibold text-center leading-relaxed">
        🔒 100% Client-Side Processing: Your images never leave your browser or get uploaded to any server.
      </p>
    </div>
  );
}
