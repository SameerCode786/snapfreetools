"use client";

import React, { useRef } from "react";
import { Type, Image as ImageIcon, LayoutGrid, RotateCw, Sun, Layers, AlertTriangle, Upload } from "lucide-react";

export default function WatermarkControls({
  watermarkType,
  setWatermarkType,
  textConfig,
  setTextConfig,
  imageConfig,
  setImageConfig,
  pageSelectionMode,
  setPageSelectionMode,
  specificPagesStr,
  setSpecificPagesStr,
  totalPages,
  rangeValidation
}) {
  const imageInputRef = useRef(null);

  const positionOptions = [
    { id: "center", label: "Center" },
    { id: "top-left", label: "Top Left" },
    { id: "top-right", label: "Top Right" },
    { id: "bottom-left", label: "Bottom Left" },
    { id: "bottom-right", label: "Bottom Right" },
    { id: "tiled", label: "Tiled (3x3 Grid)" }
  ];

  const presetColors = ["#000000", "#DC2626", "#2563EB", "#059669", "#4B5563", "#D97706"];

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImageConfig((prev) => ({
        ...prev,
        imageFile: file,
        previewUrl
      }));
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 space-y-6 text-left shadow-xs">
      
      {/* Mode Selector Header */}
      <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
        <button
          type="button"
          onClick={() => setWatermarkType("text")}
          className={`flex-1 py-2.5 px-4 font-black text-xs rounded-xl border transition-all flex items-center justify-center gap-2 cursor-pointer ${
            watermarkType === "text"
              ? "bg-slate-900 text-white border-slate-900 shadow-xs"
              : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80"
          }`}
        >
          <Type size={16} />
          <span>Text Watermark</span>
        </button>

        <button
          type="button"
          onClick={() => setWatermarkType("image")}
          className={`flex-1 py-2.5 px-4 font-black text-xs rounded-xl border transition-all flex items-center justify-center gap-2 cursor-pointer ${
            watermarkType === "image"
              ? "bg-slate-900 text-white border-slate-900 shadow-xs"
              : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80"
          }`}
        >
          <ImageIcon size={16} />
          <span>Image / Logo</span>
        </button>
      </div>

      {/* TEXT WATERMARK CONTROLS */}
      {watermarkType === "text" && (
        <div className="space-y-4">
          {/* Text Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-800 flex items-center justify-between">
              <span>Watermark Text</span>
              <span className="text-[10px] text-slate-400 font-semibold">Standard Latin Font</span>
            </label>
            <input
              type="text"
              value={textConfig.text}
              onChange={(e) => setTextConfig({ ...textConfig, text: e.target.value })}
              placeholder="e.g. CONFIDENTIAL"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>

          {/* Size & Opacity Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-black text-slate-800">
                <span>Font Size</span>
                <span className="text-amber-600">{textConfig.fontSize}px</span>
              </div>
              <input
                type="range"
                min="12"
                max="96"
                step="2"
                value={textConfig.fontSize}
                onChange={(e) => setTextConfig({ ...textConfig, fontSize: parseInt(e.target.value, 10) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-black text-slate-800">
                <span>Opacity (Transparency)</span>
                <span className="text-amber-600">{Math.round(textConfig.opacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="1.0"
                step="0.05"
                value={textConfig.opacity}
                onChange={(e) => setTextConfig({ ...textConfig, opacity: parseFloat(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Rotation Angle & Color Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-black text-slate-800">
                <span>Rotation Angle</span>
                <span className="text-amber-600">{textConfig.rotation}°</span>
              </div>
              <input
                type="range"
                min="-90"
                max="90"
                step="5"
                value={textConfig.rotation}
                onChange={(e) => setTextConfig({ ...textConfig, rotation: parseInt(e.target.value, 10) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Color Swatches */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-800">Text Color</label>
              <div className="flex items-center gap-2">
                {presetColors.map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setTextConfig({ ...textConfig, color: col })}
                    className={`w-6 h-6 rounded-lg border cursor-pointer transition-transform ${
                      textConfig.color === col ? "scale-110 border-amber-500 ring-2 ring-amber-400/50" : "border-slate-300"
                    }`}
                    style={{ backgroundColor: col }}
                  />
                ))}
                <input
                  type="color"
                  value={textConfig.color}
                  onChange={(e) => setTextConfig({ ...textConfig, color: e.target.value })}
                  className="w-7 h-7 rounded-lg border border-slate-300 cursor-pointer p-0 bg-transparent"
                />
              </div>
            </div>
          </div>

          {/* Position Selector */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-black text-slate-800">Position Placement</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {positionOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTextConfig({ ...textConfig, position: opt.id })}
                  className={`py-2 px-2 text-[11px] font-bold rounded-xl border text-center transition-all cursor-pointer ${
                    textConfig.position === opt.id
                      ? "bg-amber-500 text-slate-950 border-amber-500 shadow-2xs"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* IMAGE WATERMARK CONTROLS */}
      {watermarkType === "image" && (
        <div className="space-y-4">
          {/* File Upload Button */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-800">Upload Image / Logo</label>
            <div className="flex items-center gap-3">
              <input
                ref={imageInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-2xs transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <Upload size={14} />
                <span>{imageConfig.imageFile ? "Change Image" : "Select Image (PNG/JPG/WebP)"}</span>
              </button>

              {imageConfig.imageFile && (
                <span className="text-xs font-bold text-slate-600 truncate max-w-xs">
                  {imageConfig.imageFile.name}
                </span>
              )}
            </div>
          </div>

          {/* Scale & Opacity Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-black text-slate-800">
                <span>Scale Factor</span>
                <span className="text-amber-600">{Math.round(imageConfig.scale * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="2.0"
                step="0.05"
                value={imageConfig.scale}
                onChange={(e) => setImageConfig({ ...imageConfig, scale: parseFloat(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-black text-slate-800">
                <span>Opacity (Transparency)</span>
                <span className="text-amber-600">{Math.round(imageConfig.opacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="1.0"
                step="0.05"
                value={imageConfig.opacity}
                onChange={(e) => setImageConfig({ ...imageConfig, opacity: parseFloat(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Rotation Angle */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-black text-slate-800">
              <span>Rotation Angle</span>
              <span className="text-amber-600">{imageConfig.rotation}°</span>
            </div>
            <input
              type="range"
              min="-90"
              max="90"
              step="5"
              value={imageConfig.rotation}
              onChange={(e) => setImageConfig({ ...imageConfig, rotation: parseInt(e.target.value, 10) })}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Position Selector */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-black text-slate-800">Position Placement</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {positionOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setImageConfig({ ...imageConfig, position: opt.id })}
                  className={`py-2 px-2 text-[11px] font-bold rounded-xl border text-center transition-all cursor-pointer ${
                    imageConfig.position === opt.id
                      ? "bg-amber-500 text-slate-950 border-amber-500 shadow-2xs"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PAGE RANGE SELECTION SECTION */}
      <div className="pt-4 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black text-slate-900 flex items-center gap-1.5">
            <Layers size={14} className="text-amber-500" />
            <span>Target Pages</span>
          </label>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPageSelectionMode("all")}
              className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                pageSelectionMode === "all"
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
              }`}
            >
              All Pages ({totalPages})
            </button>

            <button
              type="button"
              onClick={() => setPageSelectionMode("specific")}
              className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                pageSelectionMode === "specific"
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
              }`}
            >
              Specific Pages
            </button>
          </div>
        </div>

        {pageSelectionMode === "specific" && (
          <div className="space-y-2">
            <input
              type="text"
              value={specificPagesStr}
              onChange={(e) => setSpecificPagesStr(e.target.value)}
              placeholder="e.g. 1, 3, 5-8"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
            />
            <p className="text-[11px] font-semibold text-slate-400">
              Enter individual page numbers or ranges (1 to {totalPages}).
            </p>
          </div>
        )}

        {/* Range Validation Warnings/Notices */}
        {pageSelectionMode === "specific" && rangeValidation && (
          <>
            {rangeValidation.warningMessage && (
              <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl flex items-start gap-2 text-amber-800 text-xs font-bold">
                <AlertTriangle size={15} className="text-amber-600 shrink-0 mt-0.5" />
                <span>{rangeValidation.warningMessage}</span>
              </div>
            )}

            {rangeValidation.errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200/80 rounded-xl flex items-start gap-2 text-rose-700 text-xs font-bold">
                <AlertTriangle size={15} className="text-rose-600 shrink-0 mt-0.5" />
                <span>{rangeValidation.errorMessage}</span>
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
}
