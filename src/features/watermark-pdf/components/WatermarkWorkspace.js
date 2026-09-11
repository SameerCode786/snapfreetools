"use client";

import React, { useState } from "react";
import { FileText, Stamp, ArrowRight, ShieldCheck } from "lucide-react";
import WatermarkControls from "./WatermarkControls";
import { parsePageRange } from "../utils/watermarkPdfEngine";

// Format file size in readable units
function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default function WatermarkWorkspace({
  file,
  onResetFile,
  onExecuteWatermark
}) {
  const totalPages = file.pageCount || 1;

  // Watermark Configuration States
  const [watermarkType, setWatermarkType] = useState("text"); // 'text' | 'image'

  const [textConfig, setTextConfig] = useState({
    text: "CONFIDENTIAL",
    fontSize: 36,
    opacity: 0.3,
    color: "#DC2626",
    rotation: 45,
    position: "center"
  });

  const [imageConfig, setImageConfig] = useState({
    imageFile: null,
    previewUrl: null,
    scale: 0.5,
    opacity: 0.3,
    rotation: 0,
    position: "center"
  });

  const [pageSelectionMode, setPageSelectionMode] = useState("all"); // 'all' | 'specific'
  const [specificPagesStr, setSpecificPagesStr] = useState("1");

  // Validate range
  const rangeValidation = parsePageRange(
    pageSelectionMode === "all" ? "all" : specificPagesStr,
    totalPages
  );

  const isTextInvalid = watermarkType === "text" && !textConfig.text.trim();
  const isImageInvalid = watermarkType === "image" && !imageConfig.imageFile;
  const isRangeInvalid = pageSelectionMode === "specific" && Boolean(rangeValidation.errorMessage);

  const isDisabled = isTextInvalid || isImageInvalid || isRangeInvalid;

  const handleApply = () => {
    if (isDisabled) return;
    onExecuteWatermark({
      watermarkType,
      textConfig,
      imageConfig,
      pageSelectionMode,
      specificPagesStr
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-left">
      
      {/* File Info Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
            <FileText size={24} />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 line-clamp-1">{file.name}</h2>
            <div className="flex items-center gap-3 text-xs font-bold text-slate-400 mt-0.5">
              <span>{formatBytes(file.size)}</span>
              <span>•</span>
              <span>{totalPages} {totalPages === 1 ? "page" : "pages"}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onResetFile}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold rounded-xl border border-slate-200/80 transition-all shrink-0 cursor-pointer"
        >
          Change PDF
        </button>
      </div>

      {/* Workspace Grid: Controls & Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Controls */}
        <div className="lg:col-span-7">
          <WatermarkControls
            watermarkType={watermarkType}
            setWatermarkType={setWatermarkType}
            textConfig={textConfig}
            setTextConfig={setTextConfig}
            imageConfig={imageConfig}
            setImageConfig={setImageConfig}
            pageSelectionMode={pageSelectionMode}
            setPageSelectionMode={setPageSelectionMode}
            specificPagesStr={specificPagesStr}
            setSpecificPagesStr={setSpecificPagesStr}
            totalPages={totalPages}
            rangeValidation={rangeValidation}
          />
        </div>

        {/* Right Column: Live Visual Preview */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs space-y-3 text-center">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-black text-slate-900">Live Watermark Preview</span>
              <span className="text-[10px] font-bold text-slate-400">Page 1 Sample</span>
            </div>

            {/* Preview Box Container */}
            <div className="relative w-full aspect-[1/1.4] bg-slate-100 border border-slate-200/80 rounded-2xl overflow-hidden flex items-center justify-center select-none">
              {file.firstPageThumbnail ? (
                <img
                  src={file.firstPageThumbnail}
                  alt="Page 1 Preview"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-xs font-bold text-slate-400">Page Preview</div>
              )}

              {/* OVERLAY TEXT PREVIEW */}
              {watermarkType === "text" && textConfig.text && (
                <div
                  className={`absolute pointer-events-none transition-all flex items-center justify-center ${
                    textConfig.position === "center"
                      ? "inset-0"
                      : textConfig.position === "top-left"
                      ? "top-6 left-6"
                      : textConfig.position === "top-right"
                      ? "top-6 right-6"
                      : textConfig.position === "bottom-left"
                      ? "bottom-6 left-6"
                      : textConfig.position === "bottom-right"
                      ? "bottom-6 right-6"
                      : "inset-0"
                  }`}
                >
                  {textConfig.position === "tiled" ? (
                    <div className="grid grid-cols-3 gap-6 p-4 w-full h-full items-center justify-items-center">
                      {Array.from({ length: 9 }).map((_, i) => (
                        <span
                          key={i}
                          className="font-black truncate max-w-[90px]"
                          style={{
                            fontSize: `${Math.max(10, Math.min(24, textConfig.fontSize * 0.4))}px`,
                            color: textConfig.color,
                            opacity: textConfig.opacity,
                            transform: `rotate(${textConfig.rotation}deg)`
                          }}
                        >
                          {textConfig.text}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span
                      className="font-black tracking-wider text-center max-w-[80%]"
                      style={{
                        fontSize: `${Math.max(12, Math.min(36, textConfig.fontSize * 0.6))}px`,
                        color: textConfig.color,
                        opacity: textConfig.opacity,
                        transform: `rotate(${textConfig.rotation}deg)`
                      }}
                    >
                      {textConfig.text}
                    </span>
                  )}
                </div>
              )}

              {/* OVERLAY IMAGE PREVIEW */}
              {watermarkType === "image" && imageConfig.previewUrl && (
                <div
                  className={`absolute pointer-events-none transition-all flex items-center justify-center ${
                    imageConfig.position === "center"
                      ? "inset-0"
                      : imageConfig.position === "top-left"
                      ? "top-6 left-6"
                      : imageConfig.position === "top-right"
                      ? "top-6 right-6"
                      : imageConfig.position === "bottom-left"
                      ? "bottom-6 left-6"
                      : imageConfig.position === "bottom-right"
                      ? "bottom-6 right-6"
                      : "inset-0"
                  }`}
                >
                  {imageConfig.position === "tiled" ? (
                    <div className="grid grid-cols-3 gap-6 p-4 w-full h-full items-center justify-items-center">
                      {Array.from({ length: 9 }).map((_, i) => (
                        <img
                          key={i}
                          src={imageConfig.previewUrl}
                          alt="Logo Watermark Tiled"
                          className="object-contain"
                          style={{
                            width: `${Math.max(20, 60 * imageConfig.scale)}px`,
                            opacity: imageConfig.opacity,
                            transform: `rotate(${imageConfig.rotation}deg)`
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <img
                      src={imageConfig.previewUrl}
                      alt="Logo Watermark"
                      className="object-contain max-w-[70%] max-h-[70%]"
                      style={{
                        width: `${Math.max(30, 120 * imageConfig.scale)}px`,
                        opacity: imageConfig.opacity,
                        transform: `rotate(${imageConfig.rotation}deg)`
                      }}
                    />
                  )}
                </div>
              )}
            </div>

            <p className="text-[10px] font-bold text-slate-400">
              Interactive preview overlay. The final PDF uses vector page placement.
            </p>
          </div>
        </div>

      </div>

      {/* Main Action Bar */}
      <div className="sticky bottom-6 bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 z-10">
        <div>
          <div className="text-sm font-black text-slate-900">
            Ready to apply watermark?
          </div>
          <div className="text-xs font-semibold text-slate-500 mt-0.5">
            {isDisabled
              ? isTextInvalid
                ? "Please enter watermark text above"
                : isImageInvalid
                ? "Please upload a logo/image file"
                : "Please enter valid page numbers"
              : `Watermark will be stamped on ${rangeValidation.validIndices.length} ${rangeValidation.validIndices.length === 1 ? "page" : "pages"} with zero rasterization.`}
          </div>
        </div>

        <button
          type="button"
          disabled={isDisabled}
          onClick={handleApply}
          className={`px-8 py-3.5 font-extrabold text-sm rounded-2xl shadow-sm transition-all inline-flex items-center gap-2 cursor-pointer ${
            isDisabled
              ? "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300/60"
              : "bg-amber-500 hover:bg-amber-600 text-slate-950 hover:shadow-md active:scale-95"
          }`}
        >
          <Stamp size={18} />
          <span>Apply & Download Watermark PDF</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Privacy Guarantee */}
      <div className="flex items-center justify-center gap-2 text-xs font-extrabold text-slate-400 pt-2">
        <ShieldCheck size={14} className="text-emerald-500" />
        <span>100% Client-Side Processing — No Files Uploaded to Server</span>
      </div>

    </div>
  );
}
