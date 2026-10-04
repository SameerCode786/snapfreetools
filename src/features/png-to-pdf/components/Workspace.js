"use client";

import React, { useRef, useState } from "react";
import {
  FileImage,
  Upload,
  Trash2,
  ArrowUp,
  ArrowDown,
  GripVertical,
  Plus,
  Settings,
  FileText,
  AlertTriangle,
  Info,
  Sparkles,
  ShieldCheck
} from "lucide-react";

export const formatBytes = (bytes, decimals = 1) => {
  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

export default function Workspace({
  images = [],
  settings = {},
  onSettingsChange,
  onAddImages,
  onRemoveImage,
  onMoveImage,
  onClearAll,
  onConvert,
  error = null
}) {
  const addFileInputRef = useRef(null);
  const [draggedIndex, setDraggedIndex] = useState(null);

  const handleAddFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onAddImages(Array.from(files));
      if (addFileInputRef.current) {
        addFileInputRef.current.value = "";
      }
    }
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;
    onMoveImage(draggedIndex, targetIndex);
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const isOriginalPageSize = settings.pageSize === "original";
  const isOriginalFitMode = settings.fitMode === "ORIGINAL_SIZE";
  const isFillFitMode = settings.fitMode === "FILL_PAGE";

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Action Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center font-black">
            <FileImage size={20} />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900">
              Selected PNG Images
            </h3>
            <p className="text-xs font-semibold text-slate-500">
              <span className="text-amber-600 font-bold">{images.length}</span> of 100 images loaded
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <input
            ref={addFileInputRef}
            type="file"
            accept="image/png,.png"
            multiple
            onChange={handleAddFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => addFileInputRef.current?.click()}
            disabled={images.length >= 100}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-2xs transition-all inline-flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
          >
            <Plus size={16} />
            <span>Add More Images</span>
          </button>

          <button
            type="button"
            onClick={onClearAll}
            className="px-4 py-2.5 border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 size={16} />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {/* Error / Validation Warning Alert */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-700 text-sm font-semibold shadow-2xs">
          <AlertTriangle size={20} className="shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">Workspace Alert</p>
            <p className="text-xs text-rose-600 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Main Workspace Layout (Grid of Images + Sidebar Settings) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Reorderable Cards (8 Cols) */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
            <span>Drag or use arrows to reorder PDF page sequence</span>
            <span>{images.length} {images.length === 1 ? "Image" : "Images"}</span>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {images.map((img, index) => (
              <div
                key={img.id || index}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`bg-white border rounded-2xl p-3.5 flex items-center justify-between gap-4 transition-all ${
                  draggedIndex === index
                    ? "border-amber-500 bg-amber-50/40 opacity-60 shadow-md"
                    : "border-slate-200/90 hover:border-amber-300 hover:shadow-xs"
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Drag Handle & Page Index */}
                  <div className="flex items-center gap-1.5 shrink-0 text-slate-400 cursor-grab active:cursor-grabbing">
                    <GripVertical size={18} />
                    <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center border border-slate-200/80">
                      {index + 1}
                    </span>
                  </div>

                  {/* Thumbnail */}
                  <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center relative group">
                    <img
                      src={img.url}
                      alt={img.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Image Metadata */}
                  <div className="min-w-0 space-y-0.5">
                    <p className="text-sm font-bold text-slate-900 truncate max-w-[200px] sm:max-w-[280px]">
                      {img.name}
                    </p>
                    <p className="text-xs font-semibold text-slate-500 flex items-center gap-2">
                      <span>{img.width} × {img.height} px</span>
                      <span>•</span>
                      <span>{formatBytes(img.size)}</span>
                    </p>
                  </div>
                </div>

                {/* Card Actions: Move Up, Move Down, Delete */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => onMoveImage(index, index - 1)}
                    disabled={index === 0}
                    aria-label={`Move image ${index + 1} up`}
                    className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
                  >
                    <ArrowUp size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onMoveImage(index, index + 1)}
                    disabled={index === images.length - 1}
                    aria-label={`Move image ${index + 1} down`}
                    className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
                  >
                    <ArrowDown size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onRemoveImage(index)}
                    aria-label={`Remove image ${img.name}`}
                    className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all cursor-pointer ml-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Settings Panel & Conversion CTA (4 Cols) */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-5 shadow-xs">
            <div className="flex items-center gap-2 text-slate-900 font-black text-base border-b border-slate-100 pb-3">
              <Settings size={18} className="text-amber-500" />
              <h3>PDF Page Settings</h3>
            </div>

            {/* 1. Page Size */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Page Size
              </label>
              <select
                value={settings.pageSize}
                onChange={(e) => onSettingsChange("pageSize", e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                <option value="a4">A4 (210 × 297 mm)</option>
                <option value="letter">Letter (8.5 × 11 in)</option>
                <option value="legal">Legal (8.5 × 14 in)</option>
                <option value="a3">A3 (297 × 420 mm)</option>
                <option value="original">Original Image Size</option>
              </select>
            </div>

            {/* 2. Orientation */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Orientation
              </label>
              <select
                value={settings.orientation}
                disabled={isOriginalPageSize}
                onChange={(e) => onSettingsChange("orientation", e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                <option value="auto">Auto (Fit Image Ratio)</option>
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </div>

            {/* 3. Fit Mode */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Fit Mode
              </label>
              <select
                value={settings.fitMode}
                disabled={isOriginalPageSize}
                onChange={(e) => onSettingsChange("fitMode", e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                <option value="FIT_TO_PAGE">Fit to Page (No Clipping)</option>
                <option value="FILL_PAGE">Fill Page (Cover & Crop)</option>
                <option value="ORIGINAL_SIZE">Original Size (96 DPI Physical)</option>
              </select>
            </div>

            {/* 4. Margins */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Margins
              </label>
              <select
                value={settings.margin}
                onChange={(e) => onSettingsChange("margin", e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                <option value="none">No Margin (0 mm)</option>
                <option value="small">Small (10 mm)</option>
                <option value="large">Large (20 mm)</option>
              </select>
            </div>

            {/* Explanatory Warnings & Badges */}
            {isOriginalPageSize && (
              <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl flex items-start gap-2 text-xs font-semibold text-amber-900">
                <Info size={16} className="shrink-0 mt-0.5 text-amber-600" />
                <span>
                  Each page will match the physical dimensions of the PNG at 96 DPI. Page orientation and fit mode are auto-adapted.
                </span>
              </div>
            )}

            {!isOriginalPageSize && isOriginalFitMode && (
              <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl flex items-start gap-2 text-xs font-semibold text-amber-900">
                <AlertTriangle size={16} className="shrink-0 mt-0.5 text-amber-600" />
                <span>
                  Original Size uses the image's 96 DPI physical dimensions. Large images may extend beyond the selected page.
                </span>
              </div>
            )}

            {!isOriginalPageSize && isFillFitMode && (
              <div className="p-3 bg-blue-50/80 border border-blue-200/80 rounded-xl flex items-start gap-2 text-xs font-semibold text-blue-900">
                <Info size={16} className="shrink-0 mt-0.5 text-blue-600" />
                <span>
                  Fill Page preserves the image's proportions and may crop the outer edges to cover the page.
                </span>
              </div>
            )}

            {/* Convert CTA */}
            <div className="pt-2">
              <button
                type="button"
                onClick={onConvert}
                className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-base rounded-xl shadow-md transition-all inline-flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
              >
                <FileText size={20} />
                <span>Convert PNG to PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
