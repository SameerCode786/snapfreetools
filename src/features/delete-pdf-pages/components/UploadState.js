"use client";

import React, { useRef, useState } from "react";
import { Trash2, Upload, ShieldCheck, FileText, AlertCircle } from "lucide-react";

export default function UploadState({ onFileSelected, isLoading = false, error = null }) {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
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
      onFileSelected(file);
    }
  };

  return (
    <div className="max-w-3xl mx-auto text-center space-y-6">
      {/* Upload Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 transition-all cursor-pointer bg-white shadow-xs ${
          isDragOver
            ? "border-red-500 bg-red-50/50 scale-[1.01]"
            : "border-slate-200/90 hover:border-red-400 hover:shadow-md"
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
          <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 text-red-600 flex items-center justify-center shadow-2xs">
            <Trash2 size={32} />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xl font-black text-slate-900">
              Select or Drop PDF File
            </h3>
            <p className="text-sm font-semibold text-slate-500 max-w-md mx-auto">
              Select pages to delete from your PDF document instantly. 100% private & processed in your browser.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              disabled={isLoading}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm rounded-xl shadow-xs transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Upload size={18} />
              <span>Choose PDF File</span>
            </button>
          </div>

          <p className="text-xs font-bold text-slate-400">
            Supports standard PDF files up to any size
          </p>
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

      {/* Privacy Guarantee Footer */}
      <div className="flex items-center justify-center gap-2 text-xs font-extrabold text-slate-500 bg-slate-50 border border-slate-200/80 rounded-2xl py-3 px-4 max-w-md mx-auto">
        <ShieldCheck size={16} className="text-emerald-500" />
        <span>100% Client-Side Privacy — Your PDF never leaves your device</span>
      </div>
    </div>
  );
}
