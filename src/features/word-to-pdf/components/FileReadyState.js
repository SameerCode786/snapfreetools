"use client";

import React from "react";
import { FileCode, ArrowRight, RefreshCw, Shield } from "lucide-react";

export default function FileReadyState({ file, onConvert, onChangeFile }) {
  const sizeMb = (file.size / 1024 / 1024).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Selected File Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
            <FileCode size={24} />
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-slate-900 text-sm truncate">{file.name}</h4>
            <p className="text-xs text-slate-400 font-medium mt-0.5">{sizeMb} MB • Ready to convert</p>
          </div>
        </div>

        <button
          onClick={onChangeFile}
          className="text-xs font-semibold text-slate-500 hover:text-amber-600 p-2 rounded-lg hover:bg-slate-50 transition-colors shrink-0 flex items-center gap-1.5"
        >
          <RefreshCw size={14} /> Change
        </button>
      </div>

      {/* Action Button */}
      <button
        onClick={onConvert}
        className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
      >
        <span>Convert to PDF</span>
        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
      </button>

      {/* Privacy Note */}
      <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-medium text-center">
        <Shield size={14} className="text-emerald-500" />
        <span>Your file is processed locally and never uploaded to any server.</span>
      </div>
    </div>
  );
}
