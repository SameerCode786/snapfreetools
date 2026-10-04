"use client";

import React, { useState, useRef } from "react";
import { Upload, FileText, Lock, ShieldCheck, AlertCircle } from "lucide-react";

export default function UploadState({ onFileSelected, error }) {
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState(null);
  const fileInputRef = useRef(null);

  const MAX_SIZE_MB = 50;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

  const handleValidateAndSelect = (file) => {
    setLocalError(null);

    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setLocalError("Invalid file type. Please select a valid PDF document (.pdf).");
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      setLocalError(`File size exceeds the ${MAX_SIZE_MB}MB limit. Please select a smaller PDF.`);
      return;
    }

    onFileSelected(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleValidateAndSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleValidateAndSelect(e.target.files[0]);
    }
  };

  const activeError = localError || error;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Privacy Badge */}
      <div className="flex items-center justify-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50/80 border border-emerald-200/60 rounded-full py-2 px-4 w-fit mx-auto shadow-sm">
        <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
        <span>Your PDF stays on your device. Processing happens entirely in your browser.</span>
      </div>

      {/* Main Upload Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? "border-amber-500 bg-amber-50/40 scale-[1.01] shadow-lg shadow-amber-500/10"
            : "border-slate-300 hover:border-amber-400 bg-white hover:bg-slate-50/50 shadow-sm hover:shadow-md"
        }`}
        role="button"
        tabIndex={0}
        aria-label="Upload PDF file"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          className="hidden"
          id="pdf-draw-file-input"
        />

        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-sm">
            <Upload size={32} />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-bold text-slate-800">
              Drag & Drop your PDF here, or <span className="text-amber-600 underline">browse</span>
            </h3>
            <p className="text-sm text-slate-500 font-medium">
              Draw freehand, add highlights, lines, arrows, shapes, and notes. Max 50MB.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 pt-2">
            <span className="flex items-center gap-1">
              <FileText size={14} /> PDF Documents
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Lock size={14} /> 100% Client-Side Private
            </span>
          </div>
        </div>
      </div>

      {/* Error Message display */}
      {activeError && (
        <div className="flex items-start gap-3 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm font-medium animate-in fade-in">
          <AlertCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">Unable to open PDF</p>
            <p className="text-rose-700 text-xs leading-relaxed">{activeError}</p>
          </div>
        </div>
      )}
    </div>
  );
}
