"use client";

import React, { useRef, useState } from "react";
import { Upload, ShieldCheck, AlertCircle, FileImage, Sparkles, ImagePlus } from "lucide-react";

export default function UploadState({ onFilesSelected, isLoading = false, error = null }) {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFilesSelected(Array.from(files));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFilesSelected(Array.from(files));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="max-w-3xl mx-auto text-center space-y-6">
      {/* Primary Upload Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label="Upload PNG Images Dropzone"
        className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 transition-all cursor-pointer bg-white shadow-xs focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
          isDragOver
            ? "border-amber-500 bg-amber-50/50 scale-[1.01]"
            : "border-slate-200/90 hover:border-amber-400 hover:shadow-md"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,.png"
          multiple
          onChange={handleFileChange}
          className="hidden"
          disabled={isLoading}
        />

        <div className="space-y-4 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shadow-2xs">
            <FileImage size={32} />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-2xl font-black text-slate-900">
              Upload PNG Images
            </h3>
            <p className="text-sm font-semibold text-slate-500 max-w-md mx-auto">
              Convert PNG images into a single PDF directly in your browser.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              disabled={isLoading}
              className="px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-base rounded-xl shadow-xs transition-all inline-flex items-center gap-2.5 cursor-pointer hover:scale-[1.01]"
            >
              <Upload size={20} />
              <span>Upload PNG Images</span>
            </button>
          </div>

          {/* Boundaries & Privacy Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-slate-500 pt-3 max-w-lg mx-auto w-full border-t border-slate-100">
            <div className="flex items-center justify-center gap-1.5">
              <Sparkles size={14} className="text-amber-500 shrink-0" />
              <span>PNG files only • Up to 100 images</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <ImagePlus size={14} className="text-amber-500 shrink-0" />
              <span>Max 50 MB per image</span>
            </div>
          </div>

          <div className="pt-1 flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50/80 px-3 py-1.5 rounded-lg border border-emerald-200/60">
            <ShieldCheck size={15} className="text-emerald-600 shrink-0" />
            <span>Your files stay on your device during conversion.</span>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-left flex items-start gap-3 text-rose-700 text-sm font-semibold shadow-2xs">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Image Validation Notice</p>
            <p className="text-xs text-rose-600 mt-0.5">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
