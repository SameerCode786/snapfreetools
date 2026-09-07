import React, { useRef } from "react";
import { UploadCloud, Shield, Lock, FileText } from "lucide-react";

export default function ProtectPdfUploadZone({ onFileSelected, disabled = false }) {
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
        onFileSelected(file);
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelected(e.target.files[0]);
      e.target.value = "";
    }
  };

  const triggerSelect = () => {
    if (disabled) return;
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-6">
      {/* Drag & Drop Upload Container */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={triggerSelect}
        tabIndex={0}
        role="button"
        aria-label="Upload PDF document to password protect"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            triggerSelect();
          }
        }}
        className="border-2 border-dashed border-slate-200 hover:border-amber-400 hover:bg-slate-50/50 bg-white rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all group flex flex-col items-center justify-center min-h-[260px] shadow-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,application/pdf"
          className="hidden"
          disabled={disabled}
        />

        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300 shadow-xs border border-amber-100/50">
          <Lock size={32} />
        </div>

        <h3 className="font-extrabold text-slate-900 text-xl tracking-tight">
          Drop your PDF document here
        </h3>

        <p className="text-slate-500 text-xs font-semibold mt-1">
          or <span className="text-amber-600 font-bold underline">Browse File</span>
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <span className="bg-slate-100 px-3 py-1 rounded-full text-slate-600">PDF Documents Only</span>
          <span className="bg-slate-100 px-3 py-1 rounded-full text-slate-600">Max File Size 50MB</span>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4 flex items-center justify-center gap-3 text-center max-w-2xl mx-auto shadow-2xs">
        <Shield size={18} className="text-emerald-600 shrink-0" />
        <p className="text-xs text-emerald-800 font-bold leading-relaxed">
          100% Private — Your PDF never leaves your device. All encryption processing happens locally inside your browser.
        </p>
      </div>

      {/* Cross-Origin Isolation Warning Banner if header missing */}
      {typeof window !== "undefined" && !window.crossOriginIsolated && (
        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex items-center justify-center gap-3 text-center max-w-2xl mx-auto shadow-2xs">
          <Lock size={18} className="text-amber-600 shrink-0" />
          <p className="text-xs text-amber-900 font-bold leading-relaxed">
            Secure PDF protection requires a compatible browser environment. Please ensure cross-origin isolation headers are active.
          </p>
        </div>
      )}
    </div>
  );
}
