"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, ShieldCheck, AlertCircle, FileText, Loader2 } from "lucide-react";

export default function UploadZone({ onFileSelected, isLoading = false, error = null }) {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [validationError, setValidationError] = useState(null);

  const validateAndPass = (file) => {
    setValidationError(null);
    if (!file) return;

    // Validate file type
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      setValidationError("Please select a valid PDF file (.pdf).");
      return;
    }

    // Validate size (100MB limit)
    const maxBytes = 100 * 1024 * 1024;
    if (file.size > maxBytes) {
      setValidationError("The selected file exceeds the 100MB maximum size limit.");
      return;
    }

    onFileSelected(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (isLoading) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndPass(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!isLoading) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const displayError = validationError || (error ? error.message || String(error) : null);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Main Upload Dropzone Container */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => {
          if (!isLoading && fileInputRef.current) {
            fileInputRef.current.click();
          }
        }}
        tabIndex={0}
        role="button"
        aria-label="Upload PDF file"
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !isLoading) {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        className={`bg-white border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all duration-300 cursor-pointer shadow-xs relative overflow-hidden group focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${
          isDragOver
            ? "border-amber-500 bg-amber-50/50 scale-[1.01]"
            : "border-slate-200 hover:border-amber-400 hover:bg-slate-50/50"
        } ${isLoading ? "opacity-75 cursor-wait" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          disabled={isLoading}
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              validateAndPass(e.target.files[0]);
              e.target.value = "";
            }
          }}
        />

        <div className="space-y-4 pointer-events-none">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 mx-auto flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform duration-300">
            {isLoading ? (
              <Loader2 size={32} className="animate-spin text-amber-600" />
            ) : (
              <UploadCloud size={32} />
            )}
          </div>

          <div className="space-y-1.5">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              {isLoading ? "Reading PDF File..." : "Drop your PDF file here"}
            </h2>
            <p className="text-xs text-slate-500 font-medium max-w-md mx-auto">
              {isLoading
                ? "Parsing document pages and building page selector..."
                : "or click to browse your computer to select pages for extraction."}
            </p>
          </div>

          {!isLoading && (
            <div className="pt-2">
              <span className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white font-black text-xs shadow-sm transition-all">
                Select PDF File
              </span>
            </div>
          )}

          <p className="text-[11px] text-slate-400 font-semibold pt-1">
            Supports standard PDF files up to 100MB
          </p>
        </div>
      </div>

      {/* Error Message Callout */}
      {displayError && (
        <div className="bg-rose-50 border border-rose-200/80 rounded-2xl p-4 flex items-start gap-3 text-rose-700">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-xs">
            <p className="font-extrabold text-rose-900">Upload Issue</p>
            <p className="font-medium text-rose-700">{displayError}</p>
          </div>
        </div>
      )}

      {/* Privacy Guarantee Badge */}
      <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
        <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
        <span>Your file stays in your browser and is processed locally.</span>
      </div>
    </div>
  );
}
