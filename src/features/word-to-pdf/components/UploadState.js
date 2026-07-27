"use client";

import React from "react";
import { UploadCloud, FileCode, Shield, Info, AlertCircle } from "lucide-react";

export default function UploadState({
  onFileSelect,
  fileError,
  isDragging,
  setIsDragging,
  fileInputRef
}) {
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
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Drag and Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? "border-amber-500 bg-amber-50/60 shadow-lg scale-[1.01]"
            : "border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-amber-400"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
          accept=".docx"
          className="hidden"
          id="docx-file-input"
        />

        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
          <UploadCloud size={32} />
        </div>

        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-2">
          Select or Drag & Drop Word Document
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mb-6 leading-relaxed">
          Convert Microsoft Word files (<code className="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded text-xs font-semibold">.docx</code>) into high-quality PDF documents.
        </p>

        <button
          type="button"
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm rounded-xl shadow-sm hover:shadow transition-all"
        >
          <FileCode size={18} /> Browse File
        </button>

        <p className="text-[11px] text-slate-400 font-medium mt-4">
          Maximum file size: <span className="font-bold text-slate-600">10MB</span> (DOCX only)
        </p>
      </div>

      {/* Error Alert */}
      {fileError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-700 text-xs sm:text-sm font-semibold animate-in fade-in duration-200">
          <AlertCircle size={20} className="shrink-0 mt-0.5 text-red-500" />
          <div className="flex-1">{fileError}</div>
        </div>
      )}

      {/* Privacy Badge */}
      <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 py-2.5 px-4 rounded-xl">
        <Shield size={16} className="text-emerald-600" />
        <span>100% private — your document never leaves your device</span>
      </div>

      {/* Limitation Notice */}
      <div className="flex items-start gap-2.5 text-xs text-slate-500 bg-slate-100/80 p-3.5 rounded-xl border border-slate-200/60 leading-relaxed">
        <Info size={16} className="shrink-0 mt-0.5 text-slate-400" />
        <span>
          <strong className="text-slate-700">Note:</strong> Complex Word layouts, floating shapes, or custom fonts may appear slightly different in the generated PDF.
        </span>
      </div>
    </div>
  );
}
