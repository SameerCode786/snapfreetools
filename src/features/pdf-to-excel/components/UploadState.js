"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { FileSpreadsheet, Upload, ShieldCheck, AlertCircle, Lock, Unlock } from "lucide-react";

export default function UploadState({ onFileSelected, isLoading = false, error = null, isPasswordError = false }) {
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
      {/* Upload Dropzone Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 transition-all cursor-pointer bg-white shadow-xs ${
          isDragOver
            ? "border-emerald-500 bg-emerald-50/50 scale-[1.01]"
            : "border-slate-200/90 hover:border-emerald-400 hover:shadow-md"
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
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shadow-2xs">
            <FileSpreadsheet size={32} />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xl font-black text-slate-900">
              Select or Drop PDF File
            </h3>
            <p className="text-sm font-semibold text-slate-500 max-w-md mx-auto">
              Extract tables and financial reports from PDF into editable Microsoft Excel spreadsheets (.xlsx). 100% private in your browser.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              disabled={isLoading}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-xl shadow-xs transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Upload size={18} />
              <span>Choose PDF File</span>
            </button>
          </div>

          <p className="text-xs font-bold text-slate-400">
            Supports digital PDF tables, reports, invoices & spreadsheets
          </p>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className={`p-5 rounded-2xl text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border shadow-2xs ${
          isPasswordError
            ? "bg-amber-50/90 border-amber-200 text-amber-900"
            : "bg-rose-50 border-rose-200 text-rose-700"
        }`}>
          <div className="flex items-start gap-3 text-sm font-semibold">
            {isPasswordError ? (
              <Lock size={20} className="shrink-0 mt-0.5 text-amber-600" />
            ) : (
              <AlertCircle size={20} className="shrink-0 mt-0.5 text-rose-600" />
            )}
            <div>
              <p className="font-extrabold text-base">
                {isPasswordError ? "Password-Protected PDF Detected" : "Error Loading PDF"}
              </p>
              <p className={`text-xs mt-0.5 font-medium ${isPasswordError ? "text-amber-800" : "text-rose-600"}`}>
                {error}
              </p>
            </div>
          </div>

          {isPasswordError && (
            <Link
              href="/unlock-pdf"
              className="shrink-0 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-slate-950 font-black text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Unlock size={15} />
              <span>Go to Unlock PDF</span>
            </Link>
          )}
        </div>
      )}

      {/* Privacy Guarantee Footer */}
      <div className="flex items-center justify-center gap-2 text-xs font-extrabold text-slate-500 bg-slate-50 border border-slate-200/80 rounded-2xl py-3 px-4 max-w-md mx-auto">
        <ShieldCheck size={16} className="text-emerald-500" />
        <span>100% Client-Side Privacy — Your PDF is processed locally in your browser</span>
      </div>
    </div>
  );
}
