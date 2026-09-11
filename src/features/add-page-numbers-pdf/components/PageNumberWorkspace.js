"use client";

import React, { useState } from "react";
import { FileText, Hash, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import PageNumberControls from "./PageNumberControls";
import { parseNumberingRange, buildPageNumberText } from "../utils/pageNumbersEngine";

// Format file size in readable units
function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default function PageNumberWorkspace({
  file,
  onResetFile,
  onExecuteAddPageNumbers
}) {
  const totalPages = file.pageCount || 1;

  // Numbering Configuration States
  const [format, setFormat] = useState("arabic"); // 'arabic' | 'prefixed' | 'page-x-of-n' | 'x-slash-n' | 'custom'
  const [style, setStyle] = useState("arabic"); // 'arabic' | 'roman-lower' | 'roman-upper' | 'letter-lower' | 'letter-upper'
  const [customTemplate, setCustomTemplate] = useState("Page {page} of {total}");
  const [startNumber, setStartNumber] = useState(1);
  const [skipFirstN, setSkipFirstN] = useState(0);
  const [totalSemantics, setTotalSemantics] = useState("document"); // 'document' | 'numbered'

  const [position, setPosition] = useState("bottom-center");
  const [fontName, setFontName] = useState("helvetica");
  const [fontSize, setFontSize] = useState(12);
  const [color, setColor] = useState("#374151");
  const [opacity, setOpacity] = useState(1.0);
  const [marginX, setMarginX] = useState(30);
  const [marginY, setMarginY] = useState(30);

  const [bgBoxType, setBgBoxType] = useState("none"); // 'none' | 'white' | 'semi-white' | 'custom'
  const [bgBoxColor, setBgBoxColor] = useState("#FFFFFF");

  const [rangeMode, setRangeMode] = useState("all"); // 'all' | 'specific'
  const [specificPagesStr, setSpecificPagesStr] = useState("1");

  // Validate range
  const rangeValidation = parseNumberingRange({
    totalPages,
    skipFirstN,
    rangeMode,
    specificPagesStr
  });

  const isDisabled = Boolean(rangeValidation.errorMessage);

  // Sample page number text for live preview
  const samplePageText = buildPageNumberText({
    num: startNumber,
    total: totalSemantics === "numbered" ? rangeValidation.validIndices.length : totalPages,
    format,
    style,
    customTemplate
  });

  const handleApply = () => {
    if (isDisabled) return;
    onExecuteAddPageNumbers({
      format,
      style,
      customTemplate,
      startNumber,
      skipFirstN,
      totalSemantics,
      position,
      fontName,
      fontSize,
      color,
      opacity,
      marginX,
      marginY,
      bgBoxType,
      bgBoxColor,
      rangeMode,
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
        
        {/* Left Column: Numbering Controls */}
        <div className="lg:col-span-7">
          <PageNumberControls
            format={format}
            setFormat={setFormat}
            style={style}
            setStyle={setStyle}
            customTemplate={customTemplate}
            setCustomTemplate={setCustomTemplate}
            startNumber={startNumber}
            setStartNumber={setStartNumber}
            skipFirstN={skipFirstN}
            setSkipFirstN={setSkipFirstN}
            totalSemantics={totalSemantics}
            setTotalSemantics={setTotalSemantics}
            position={position}
            setPosition={setPosition}
            fontName={fontName}
            setFontName={setFontName}
            fontSize={fontSize}
            setFontSize={setFontSize}
            color={color}
            setColor={setColor}
            opacity={opacity}
            setOpacity={setOpacity}
            marginX={marginX}
            setMarginX={setMarginX}
            marginY={marginY}
            setMarginY={setMarginY}
            bgBoxType={bgBoxType}
            setBgBoxType={setBgBoxType}
            bgBoxColor={bgBoxColor}
            setBgBoxColor={setBgBoxColor}
            rangeMode={rangeMode}
            setRangeMode={setRangeMode}
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
              <span className="text-xs font-black text-slate-900">Live Placement Preview</span>
              <span className="text-[10px] font-bold text-slate-400">Page Sample</span>
            </div>

            {/* Preview Box Container */}
            <div className="relative w-full aspect-[1/1.4] bg-slate-100 border border-slate-200/80 rounded-2xl overflow-hidden flex items-center justify-center select-none p-4">
              {file.firstPageThumbnail ? (
                <img
                  src={file.firstPageThumbnail}
                  alt="Page Preview"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-xs font-bold text-slate-400">Page Preview</div>
              )}

              {/* OVERLAY PAGE NUMBER PREVIEW */}
              <div
                className={`absolute pointer-events-none transition-all flex items-center ${
                  position === "bottom-center"
                    ? "bottom-4 left-1/2 -translate-x-1/2"
                    : position === "bottom-left"
                    ? "bottom-4 left-4"
                    : position === "bottom-right"
                    ? "bottom-4 right-4"
                    : position === "top-center"
                    ? "top-4 left-1/2 -translate-x-1/2"
                    : position === "top-left"
                    ? "top-4 left-4"
                    : "top-4 right-4"
                }`}
              >
                <span
                  className="font-extrabold px-1.5 py-0.5 rounded transition-all"
                  style={{
                    fontSize: `${Math.max(10, Math.min(22, fontSize * 0.9))}px`,
                    color: color,
                    opacity: opacity,
                    backgroundColor:
                      bgBoxType === "white"
                        ? "#FFFFFF"
                        : bgBoxType === "semi-white"
                        ? "rgba(255, 255, 255, 0.85)"
                        : bgBoxType === "custom"
                        ? bgBoxColor
                        : "transparent"
                  }}
                >
                  {samplePageText}
                </span>
              </div>
            </div>

            <p className="text-[10px] font-bold text-slate-400">
              Representative preview. Final PDF utilizes exact vector page coordinate alignment.
            </p>
          </div>
        </div>

      </div>

      {/* Main Action Bar */}
      <div className="sticky bottom-6 bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 z-10">
        <div>
          <div className="text-sm font-black text-slate-900">
            Ready to add page numbers?
          </div>
          <div className="text-xs font-semibold text-slate-500 mt-0.5">
            {isDisabled
              ? "Please enter valid page numbers or range"
              : `Page numbers will be stamped on ${rangeValidation.validIndices.length} ${rangeValidation.validIndices.length === 1 ? "page" : "pages"} with zero rasterization.`}
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
          <Hash size={18} />
          <span>Apply & Download Numbered PDF</span>
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
