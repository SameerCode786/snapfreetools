"use client";

import React, { useRef, useState } from "react";
import { RotateCw, Upload, ShieldCheck, FileText, AlertCircle } from "lucide-react";

export default function UploadState({ onFileSelect, fileError }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

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

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndPassFile(files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndPassFile(e.target.files[0]);
    }
  };

  const validateAndPassFile = (file) => {
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      onFileSelect(null, "Please select a valid PDF file (.pdf).");
      return;
    }
    onFileSelect(file);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Error Message Alert */}
      {fileError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 text-red-600 font-bold text-xs shadow-xs text-left">
          <AlertCircle size={18} className="shrink-0 text-red-500" />
          <span>{fileError}</span>
        </div>
      )}

      {/* Main Upload Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`bg-white border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer select-none relative overflow-hidden group ${
          isDragging
            ? "border-amber-500 bg-amber-50/50 shadow-lg scale-[1.01]"
            : "border-slate-300 hover:border-amber-400 hover:bg-slate-50/60 shadow-xs"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="space-y-4 max-w-md mx-auto pointer-events-none">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 text-amber-500 flex items-center justify-center mx-auto group-hover:scale-110 group-hover:bg-amber-100 transition-transform duration-300 shadow-sm">
            <RotateCw size={32} />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Drop your PDF here
            </h2>
            <p className="text-xs text-slate-500 font-semibold">
              or click to browse PDF files from your computer or phone
            </p>
          </div>

          <div>
            <span className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs rounded-2xl shadow-md shadow-amber-500/20 transition-all pointer-events-auto cursor-pointer">
              <Upload size={14} />
              <span>Browse PDF File</span>
            </span>
          </div>

          <p className="text-[11px] font-bold text-slate-400">
            Supports single or multi-page PDF documents.
          </p>
        </div>
      </div>

      {/* Privacy Guarantee Badge */}
      <div className="flex justify-center items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50/80 border border-emerald-200/60 px-4 py-2.5 rounded-2xl max-w-fit mx-auto select-none">
        <ShieldCheck size={16} className="text-emerald-600" />
        <span>Your PDF is processed locally in your browser and is never uploaded.</span>
      </div>

    </div>
  );
}
