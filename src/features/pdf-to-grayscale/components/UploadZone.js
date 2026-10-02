"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, ShieldCheck, AlertCircle, FileText } from "lucide-react";

export default function UploadZone({ onFileSelected, error }) {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const validateAndPass = (file) => {
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      alert("Please upload a valid PDF document (.pdf).");
      return;
    }

    const maxBytes = 50 * 1024 * 1024; // 50MB limit
    if (file.size > maxBytes) {
      alert("This file exceeds the maximum supported size of 50 MB for client-side processing.");
      return;
    }

    onFileSelected(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndPass(e.dataTransfer.files[0]);
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

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Upload Zone Container */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`bg-white border-2 border-dashed rounded-3xl p-10 text-center transition-all duration-300 cursor-pointer shadow-xs relative overflow-hidden group ${
          isDragOver
            ? "border-amber-500 bg-amber-50/50 scale-[1.01]"
            : "border-slate-200 hover:border-amber-400 hover:bg-slate-50/50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              validateAndPass(e.target.files[0]);
              e.target.value = "";
            }
          }}
        />

        <div className="space-y-4 pointer-events-none">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 mx-auto flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform duration-300">
            <UploadCloud size={32} />
          </div>

          <div className="space-y-1">
            <h2 className="text-base font-black text-slate-900 tracking-tight">
              Choose a PDF File or Drag & Drop Here
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Convert color PDF pages to grayscale for eco-friendly printing and toner saving.
            </p>
          </div>

          <div className="pt-2">
            <span className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-xs transition-colors">
              Select PDF File
            </span>
          </div>

          <p className="text-[11px] text-slate-400 font-semibold pt-1">
            Supports standard PDF documents up to 50MB
          </p>
        </div>
      </div>

      {/* Error Message Box */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3 text-rose-700">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-xs">
            <p className="font-extrabold">{error.title || "File Error"}</p>
            <p className="font-medium text-rose-600">{error.message}</p>
          </div>
        </div>
      )}

      {/* Privacy Notice */}
      <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
        <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
        <span>100% Client-Side Privacy: Your PDF is processed locally in your browser and never uploaded to any server.</span>
      </div>
    </div>
  );
}
