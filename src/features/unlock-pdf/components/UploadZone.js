import React, { useRef } from "react";
import { UploadCloud, Shield, Lock, FileText } from "lucide-react";

export default function UploadZone({ onFileSelected, disabled = false }) {
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
        aria-label="Upload password-protected PDF document"
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

        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300 shadow-xs">
          <Lock size={32} />
        </div>

        <h3 className="font-extrabold text-slate-900 text-xl tracking-tight">
          Drop your password-protected PDF here
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
      <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-4 flex items-center justify-center gap-3 text-center max-w-2xl mx-auto">
        <Shield size={18} className="text-emerald-600 shrink-0" />
        <p className="text-xs text-emerald-800 font-bold leading-relaxed">
          Your PDF is processed locally in your browser and is never uploaded or saved on any server.
        </p>
      </div>
    </div>
  );
}
