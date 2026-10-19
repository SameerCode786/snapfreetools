"use client";

import React, { useRef, useState } from "react";
import { Presentation, Upload, ShieldCheck, AlertCircle, Sparkles, FileText, CheckCircle2 } from "lucide-react";
import { PPT_SAFETY_LIMITS } from "../utils/pdfToPowerpointEngine";

export default function UploadState({ onFileSelected, isLoading = false, error = null }) {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [localError, setLocalError] = useState(null);

  const validateAndPass = (file) => {
    setLocalError(null);
    if (!file) return;

    const isPdfExt = file.name.toLowerCase().endsWith(".pdf");
    const isPdfMime = file.type === "application/pdf" || file.type === "";

    if (!isPdfExt && !isPdfMime) {
      setLocalError("Invalid file type. Please select a PDF document (.pdf).");
      return;
    }

    if (file.size === 0) {
      setLocalError("The selected PDF file is empty (0 bytes).");
      return;
    }

    if (file.size > PPT_SAFETY_LIMITS.MAX_FILE_SIZE_BYTES) {
      setLocalError("File exceeds the 50MB limit for local browser processing.");
      return;
    }

    onFileSelected(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) validateAndPass(file);
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
    if (file) validateAndPass(file);
  };

  const activeError = error || localError;

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
            <Presentation size={32} />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              Select or Drop PDF File
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 max-w-md mx-auto">
              Convert PDF pages into downloadable PowerPoint presentation files (.pptx). Processed 100% locally in your browser for absolute privacy.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              disabled={isLoading}
              className="px-7 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm rounded-xl shadow-xs transition-all inline-flex items-center gap-2 cursor-pointer hover:scale-[1.01]"
            >
              <Upload size={18} />
              <span>Choose PDF File</span>
            </button>
          </div>

          {/* Privacy & Capability Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-slate-400 pt-3">
            <span className="flex items-center gap-1.5 text-slate-600 bg-slate-100/80 px-3 py-1 rounded-full border border-slate-200/60">
              <ShieldCheck size={14} className="text-emerald-500" />
              100% Client-Side Processing
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 bg-slate-100/80 px-3 py-1 rounded-full border border-slate-200/60">
              <Sparkles size={14} className="text-amber-500" />
              Editable Text & High Fidelity
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 bg-slate-100/80 px-3 py-1 rounded-full border border-slate-200/60">
              <FileText size={14} className="text-blue-500" />
              Up to 50MB
            </span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {activeError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 text-xs font-bold text-left animate-in fade-in duration-200">
          <AlertCircle size={18} className="shrink-0" />
          <span>{activeError}</span>
        </div>
      )}

      {/* Reassurance text */}
      <p className="text-xs text-slate-400 font-medium">
        Your PDF is processed locally in your browser. No files are uploaded to our servers.
      </p>
    </div>
  );
}
