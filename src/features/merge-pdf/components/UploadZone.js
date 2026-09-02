import React, { useState, useRef } from "react";
import { Upload, ShieldCheck, FilePlus } from "lucide-react";

export default function UploadZone({ onFilesSelected, onError }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const processFiles = (files) => {
    if (!files || files.length === 0) return;

    const validFiles = [];
    let hasInvalidFile = false;

    Array.from(files).forEach((file) => {
      const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
      if (isPdf) {
        validFiles.push(file);
      } else {
        hasInvalidFile = true;
      }
    });

    if (hasInvalidFile && validFiles.length === 0) {
      onError("Please select valid PDF files only.");
      return;
    }

    if (hasInvalidFile) {
      onError("Some non-PDF files were skipped. Only PDF files have been added.");
    } else {
      onError(null);
    }

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      // Reset input value so same files can be re-added if cleared
      e.target.value = "";
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
      processFiles(e.dataTransfer.files);
    }
  };

  const triggerInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* File input (Hidden multiple select) */}
      <input
        type="file"
        accept="application/pdf"
        multiple
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
        id="pdf-merge-upload-input"
        aria-label="Upload Multiple PDF Files"
      />

      {/* Main Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerInput}
        className={`border-2 border-dashed rounded-3xl p-10 sm:p-14 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[350px] group ${
          isDragging
            ? "border-amber-500 bg-amber-50/50"
            : "border-slate-300 bg-white hover:border-amber-400 hover:bg-slate-50/30"
        }`}
        tabIndex="0"
        role="button"
        aria-label="Drag and drop multiple PDF files here, or click to browse"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            triggerInput();
          }
        }}
      >
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all shadow-xs ${
          isDragging
            ? "bg-amber-500 text-white animate-bounce"
            : "bg-slate-100 text-slate-400 group-hover:bg-amber-50 group-hover:text-amber-500"
        }`}>
          <Upload size={28} />
        </div>
        
        <h3 className="text-xl font-extrabold text-slate-800 mb-2">Drag & drop your PDF files here</h3>
        <p className="text-xs text-slate-400 font-semibold mb-6 max-w-xs leading-relaxed">
          Select two or more PDF documents to combine into a single file.
        </p>

        <span className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold py-3 px-6 rounded-xl shadow-xs group-hover:border-amber-300 transition-all">
          <FilePlus size={16} className="text-amber-500" /> Browse PDF Files
        </span>
      </div>

      {/* Privacy Notice */}
      <div className="flex items-center gap-3 bg-amber-50/40 border border-amber-100/50 rounded-2xl p-4 max-w-2xl mx-auto text-slate-650">
        <ShieldCheck size={18} className="text-amber-500 shrink-0" />
        <p className="text-xs leading-relaxed font-medium">
          <strong>100% Private & Secure:</strong> Your files stay in your browser and are not uploaded to our servers.
        </p>
      </div>
    </div>
  );
}
