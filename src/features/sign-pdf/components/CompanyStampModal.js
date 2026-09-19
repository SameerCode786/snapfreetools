"use client";

import React, { useState, useRef } from "react";
import { X, Check, Award, Upload, AlertCircle } from "lucide-react";

export default function CompanyStampModal({
  isOpen,
  onClose,
  onApply
}) {
  const [stampDataUrl, setStampDataUrl] = useState(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image MIME type
    if (!file.type.match(/^image\/(png|jpeg|jpg|webp)$/i)) {
      setError("Please upload a valid image file (PNG, JPG, or WebP). Transparent PNGs work best.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size exceeds 5MB limit. Please choose a smaller image.");
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      setStampDataUrl(event.target?.result);
    };
    reader.readAsDataURL(file);
  };

  const handleApply = () => {
    if (!stampDataUrl) return;
    onApply({
      type: "stamp",
      dataUrl: stampDataUrl,
      fileName
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-800">Company & Official Stamp</h3>
              <p className="text-xs text-slate-500">Upload a seal, logo, or official organization stamp</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {error && (
            <div className="flex items-start gap-2 p-3 text-xs text-red-700 bg-red-50 rounded-xl border border-red-200">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Upload Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/20 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[160px]"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
            />
            {stampDataUrl ? (
              <div className="space-y-3">
                <div className="w-24 h-24 mx-auto p-2 bg-slate-100/80 rounded-xl border border-slate-200 flex items-center justify-center">
                  <img
                    src={stampDataUrl}
                    alt="Stamp Preview"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <p className="text-xs font-medium text-slate-600">{fileName || "Stamp Image Loaded"}</p>
                <span className="text-[11px] text-emerald-600 underline font-medium">Click to replace image</span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 text-slate-500 flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">Click to upload stamp image</p>
                  <p className="text-xs text-slate-400 mt-0.5">Supports transparent PNG, JPG, or WebP (max 5MB)</p>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-500 leading-relaxed">
            💡 <strong>Tip:</strong> For best results, use a transparent PNG background so the stamp blends naturally over contract text and lines.
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={!stampDataUrl}
            className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-sm hover:shadow transition-all"
          >
            <Check className="w-4 h-4" />
            Apply Stamp
          </button>
        </div>
      </div>
    </div>
  );
}
