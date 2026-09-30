import React, { useState, useRef } from "react";
import { Upload, ShieldCheck, FileText, Sliders } from "lucide-react";

export default function UploadZone({ onFileSelect, onError }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const processFile = (file) => {
    if (!file) return;

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      onError("Invalid file format. Please select a valid PDF document.");
      return;
    }

    onError(null);
    onFileSelect(file);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const triggerInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Hidden File Input */}
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
        id="edit-pdf-metadata-input"
        aria-label="Upload PDF File to Edit Metadata"
      />

      {/* Main Drag-Drop Target */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerInput}
        className={`border-2 border-dashed rounded-3xl p-10 sm:p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[340px] group ${
          isDragging
            ? "border-amber-500 bg-amber-50/50"
            : "border-slate-300 bg-white hover:border-amber-400 hover:bg-slate-50/40"
        }`}
        tabIndex="0"
        role="button"
        aria-label="Drag and drop PDF here, or click to choose file"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            triggerInput();
          }
        }}
      >
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all shadow-xs ${
            isDragging
              ? "bg-amber-500 text-white animate-bounce"
              : "bg-slate-100 text-slate-400 group-hover:bg-amber-50 group-hover:text-amber-500"
          }`}
        >
          <Sliders size={28} />
        </div>

        <h3 className="text-lg font-extrabold text-slate-800 mb-2">
          Drag & drop your PDF file here
        </h3>
        <p className="text-xs text-slate-400 font-medium mb-6 max-w-xs leading-relaxed">
          Update PDF title, author, subject, keywords, creator, and document properties.
        </p>

        <span className="bg-white border border-slate-200 text-slate-700 text-xs font-bold py-2.5 px-6 rounded-xl shadow-xs group-hover:border-amber-300 transition-all flex items-center gap-2">
          <FileText size={16} className="text-amber-500" /> Choose PDF File
        </span>
      </div>

      {/* Privacy Notice */}
      <div className="flex items-center gap-3 bg-amber-50/40 border border-amber-100/50 rounded-2xl p-4 max-w-2xl mx-auto text-slate-650">
        <ShieldCheck size={18} className="text-amber-500 shrink-0" />
        <p className="text-xs leading-relaxed font-medium">
          <strong>100% Local Browser Processing:</strong> Your PDF is processed locally in your browser. The document is not uploaded to our servers.
        </p>
      </div>
    </div>
  );
}
