"use client";

import React, { useRef, useState } from "react";
import { Presentation, Upload, ShieldCheck, AlertCircle, Sparkles, FileText, CheckCircle2 } from "lucide-react";
import { PPTX_SAFETY_LIMITS } from "../utils/powerpointToPdfEngine";

export default function UploadState({ onFileSelected, isLoading = false, error = null }) {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [localError, setLocalError] = useState(null);

  const validateAndPass = (file) => {
    setLocalError(null);
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const isPptx = fileName.endsWith(".pptx");
    const isPpt = fileName.endsWith(".ppt");

    if (isPpt) {
      setLocalError(
        "Legacy .ppt files are binary and not supported in the browser. Please open in PowerPoint and save as modern .pptx format."
      );
      return;
    }

    if (!isPptx) {
      setLocalError("Invalid file type. Please select a modern PowerPoint presentation (.pptx).");
      return;
    }

    if (file.size === 0) {
      setLocalError("The selected presentation file is empty (0 bytes).");
      return;
    }

    if (file.size > PPTX_SAFETY_LIMITS.MAX_FILE_SIZE_BYTES) {
      setLocalError("File exceeds the 50MB limit for local browser processing.");
      return;
    }

    onFileSelected(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) validateAndPass(file);
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
    if (file) validateAndPass(file);
  };

  const activeError = error || localError;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Upload Drop Zone Card */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-14 text-center cursor-pointer transition-all duration-300 bg-white group shadow-xs ${
          isDragOver
            ? "border-amber-500 bg-amber-50/50 scale-[1.005] shadow-md"
            : "border-slate-300 hover:border-amber-400 hover:bg-slate-50/60"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation"
          onChange={handleFileChange}
          className="hidden"
          disabled={isLoading}
        />

        <div className="max-w-md mx-auto space-y-5">
          {/* Main Action Icon */}
          <div className="w-20 h-20 rounded-3xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto transition-transform duration-300 group-hover:scale-110 shadow-2xs">
            <Presentation size={40} className="stroke-[1.75]" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Select or Drop PowerPoint File
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Drag & drop your <span className="font-bold text-slate-900">.pptx</span> presentation here, or browse from your computer
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              className="px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm rounded-2xl shadow-sm transition-all duration-200 inline-flex items-center gap-2 group-hover:shadow-md pointer-events-none cursor-pointer"
            >
              <Upload size={18} />
              <span>Choose PowerPoint File</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs font-semibold text-slate-600 pt-2 border-t border-slate-100">
            <span>Supports .pptx</span>
            <span>•</span>
            <span>Max 50MB</span>
            <span>•</span>
            <span className="text-emerald-800 flex items-center gap-1 font-bold">
              <ShieldCheck size={14} className="text-emerald-700" />
              100% Private (No Uploads)
            </span>
          </div>
        </div>
      </div>

      {/* Error Message Alert */}
      {activeError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-700 text-sm font-medium animate-in fade-in duration-200">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Conversion Alert</p>
            <p className="text-xs leading-relaxed">{activeError}</p>
          </div>
        </div>
      )}

      {/* Trust & Feature Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-2xs space-y-1.5 text-left">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Sparkles size={18} className="text-amber-500" />
            <span>Preserves Presentation Layout</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Maintains slide background colors, text formatting, embedded pictures, tables, and dimensions.
          </p>
        </div>

        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-2xs space-y-1.5 text-left">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <ShieldCheck size={18} className="text-emerald-500" />
            <span>Zero Server Uploads</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Your PowerPoint files are parsed entirely in your browser using client-side JavaScript. No data ever leaves your device.
          </p>
        </div>

        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-2xs space-y-1.5 text-left">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Presentation size={18} className="text-blue-500" />
            <span>Custom Slides & Sizing</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Choose custom slide ranges (e.g. 1-5, 8) and output as Match Presentation, A4, or Letter dimensions.
          </p>
        </div>
      </div>
    </div>
  );
}
