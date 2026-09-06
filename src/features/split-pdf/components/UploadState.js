import React from "react";
import { UploadCloud, ShieldCheck, Zap, Lock, FileText } from "lucide-react";

export default function UploadState({ onFileSelect, fileError }) {
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf" || droppedFile.name.endsWith(".pdf")) {
        onFileSelect(droppedFile);
      } else {
        alert("Please upload a valid PDF document (.pdf).");
      }
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Upload Box */}
      <div 
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="bg-white border-2 border-dashed border-slate-200 hover:border-amber-400 rounded-3xl p-8 sm:p-12 text-center transition-all duration-200 hover:shadow-lg group relative cursor-pointer"
      >
        <input 
          type="file" 
          accept=".pdf,application/pdf" 
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />

        <div className="w-16 h-16 bg-amber-50 group-hover:bg-amber-100 text-amber-500 rounded-2xl flex items-center justify-center mx-auto transition-transform group-hover:scale-110 shadow-sm">
          <UploadCloud size={32} />
        </div>

        <div className="mt-6 space-y-2">
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
            Drop your PDF file here, or <span className="text-amber-500 underline decoration-amber-300">browse</span>
          </h3>
          <p className="text-xs text-slate-500 font-semibold max-w-sm mx-auto">
            Separate PDF pages, extract page ranges, or split into individual PDFs.
          </p>
        </div>

        {fileError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-bold">
            {fileError}
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-semibold">
          <span className="flex items-center gap-1.5">
            <Lock size={14} className="text-emerald-500" /> 100% Client-Side Processing
          </span>
          <span className="flex items-center gap-1.5">
            <Zap size={14} className="text-amber-500" /> Fast & Free
          </span>
          <span className="flex items-center gap-1.5">
            <FileText size={14} className="text-blue-500" /> Preserves Original PDF Quality
          </span>
        </div>
      </div>
    </div>
  );
}
