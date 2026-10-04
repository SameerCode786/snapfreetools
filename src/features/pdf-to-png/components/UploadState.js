"use client";

import React, { useRef, useState } from "react";
import { FileImage, Upload, ShieldCheck, AlertCircle, Sparkles } from "lucide-react";

export default function UploadState({ onFileSelected, isLoading = false, error = null }) {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        return;
      }
      onFileSelected(file);
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
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        return;
      }
      onFileSelected(file);
    }
  };

  return (
    <div className="max-w-3xl mx-auto text-center space-y-6">
      {/* Upload Dropzone Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 transition-all cursor-pointer bg-white shadow-xs ${
          isDragOver
            ? "border-amber-500 bg-amber-50/50 scale-[1.01]"
            : "border-slate-200/90 hover:border-amber-400 hover:shadow-md"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          className="hidden"
          disabled={isLoading}
        />

        <div className="space-y-4 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shadow-2xs">
            <FileImage size={32} />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xl font-black text-slate-900">
              Select or Drop PDF File
            </h3>
            <p className="text-sm font-semibold text-slate-500 max-w-md mx-auto">
              Convert PDF pages into high-resolution PNG images. Processed 100% locally in your browser for absolute privacy.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              disabled={isLoading}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm rounded-xl shadow-xs transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Upload size={18} />
              <span>Choose PDF File</span>
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 pt-2">
            <span className="flex items-center gap-1">
              <ShieldCheck size={14} className="text-emerald-500" />
              100% Private Client-Side Processing
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Sparkles size={14} className="text-amber-500" />
              Custom Quality & Range
            </span>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-left flex items-start gap-3 text-rose-700 text-sm font-semibold">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Error loading PDF</p>
            <p className="text-xs text-rose-600 mt-0.5">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
