"use client";

import React, { useState } from "react";
import { Hash, Type, LayoutGrid, Layers, AlertTriangle, Sliders, ChevronDown, ChevronUp } from "lucide-react";

export default function PageNumberControls({
  format,
  setFormat,
  style,
  setStyle,
  customTemplate,
  setCustomTemplate,
  startNumber,
  setStartNumber,
  skipFirstN,
  setSkipFirstN,
  totalSemantics,
  setTotalSemantics,
  position,
  setPosition,
  fontName,
  setFontName,
  fontSize,
  setFontSize,
  color,
  setColor,
  opacity,
  setOpacity,
  marginX,
  setMarginX,
  marginY,
  setMarginY,
  bgBoxType,
  setBgBoxType,
  bgBoxColor,
  setBgBoxColor,
  rangeMode,
  setRangeMode,
  specificPagesStr,
  setSpecificPagesStr,
  totalPages,
  rangeValidation
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const formatOptions = [
    { id: "arabic", label: "1, 2, 3" },
    { id: "prefixed", label: "Page 1, Page 2" },
    { id: "page-x-of-n", label: "Page 1 of N" },
    { id: "x-slash-n", label: "1 / N" },
    { id: "custom", label: "Custom Template" }
  ];

  const styleOptions = [
    { id: "arabic", label: "Arabic (1, 2, 3)" },
    { id: "roman-lower", label: "Roman Lower (i, ii, iii)" },
    { id: "roman-upper", label: "Roman Upper (I, II, III)" },
    { id: "letter-lower", label: "Letters Lower (a, b, c)" },
    { id: "letter-upper", label: "Letters Upper (A, B, C)" }
  ];

  const positionOptions = [
    { id: "bottom-center", label: "Bottom Center" },
    { id: "bottom-right", label: "Bottom Right" },
    { id: "bottom-left", label: "Bottom Left" },
    { id: "top-center", label: "Top Center" },
    { id: "top-right", label: "Top Right" },
    { id: "top-left", label: "Top Left" }
  ];

  const fontOptions = [
    { id: "helvetica", label: "Helvetica (Regular)" },
    { id: "helvetica-bold", label: "Helvetica (Bold)" },
    { id: "helvetica-oblique", label: "Helvetica (Italic)" },
    { id: "times", label: "Times Roman" },
    { id: "courier", label: "Courier (Monospace)" }
  ];

  const presetColors = ["#374151", "#000000", "#DC2626", "#2563EB", "#059669", "#FFFFFF"];

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 space-y-6 text-left shadow-xs">
      
      {/* 1. NUMBERING FORMAT & STYLE */}
      <div className="space-y-4">
        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
          <Hash size={15} className="text-amber-500" />
          <span>Numbering Format & Style</span>
        </h4>

        {/* Format Selector Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {formatOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setFormat(opt.id)}
              className={`py-2.5 px-3 text-xs font-black rounded-xl border text-center transition-all cursor-pointer ${
                format === opt.id
                  ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Custom Template Input */}
        {format === "custom" && (
          <div className="space-y-1.5 p-3 bg-amber-50/60 border border-amber-200/80 rounded-2xl">
            <label className="text-xs font-black text-amber-900 flex justify-between">
              <span>Custom Format Template</span>
              <span className="text-[10px] text-amber-700 font-semibold">Placeholders: &#123;page&#125;, &#123;total&#125;</span>
            </label>
            <input
              type="text"
              value={customTemplate}
              onChange={(e) => setCustomTemplate(e.target.value)}
              placeholder="e.g. Document - {page} of {total}"
              className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
            />
          </div>
        )}

        {/* Style Selector & Starting Number Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-800">Numbering Style</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500"
            >
              {styleOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-800">Starting Number</label>
            <input
              type="number"
              min="1"
              max="9999"
              value={startNumber}
              onChange={(e) => setStartNumber(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* 2. POSITION & MARGINS */}
      <div className="space-y-4 pt-2 border-t border-slate-100">
        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
          <LayoutGrid size={15} className="text-amber-500" />
          <span>Position & Margins</span>
        </h4>

        {/* Position Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {positionOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setPosition(opt.id)}
              className={`py-2 px-2 text-[11px] font-bold rounded-xl border text-center transition-all cursor-pointer ${
                position === opt.id
                  ? "bg-amber-500 text-slate-950 border-amber-500 shadow-2xs"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Margin Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-black text-slate-800">
              <span>Vertical Margin (Y)</span>
              <span className="text-amber-600">{marginY}px</span>
            </div>
            <input
              type="range"
              min="10"
              max="80"
              step="2"
              value={marginY}
              onChange={(e) => setMarginY(parseInt(e.target.value, 10))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-black text-slate-800">
              <span>Horizontal Margin (X)</span>
              <span className="text-amber-600">{marginX}px</span>
            </div>
            <input
              type="range"
              min="10"
              max="80"
              step="2"
              value={marginX}
              onChange={(e) => setMarginX(parseInt(e.target.value, 10))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 3. FONT & APPEARANCE */}
      <div className="space-y-4 pt-2 border-t border-slate-100">
        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
          <Type size={15} className="text-amber-500" />
          <span>Font & Appearance</span>
        </h4>

        {/* Font Family & Size Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-800">Font Family</label>
            <select
              value={fontName}
              onChange={(e) => setFontName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500"
            >
              {fontOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-black text-slate-800">
              <span>Font Size</span>
              <span className="text-amber-600">{fontSize}px</span>
            </div>
            <input
              type="range"
              min="8"
              max="36"
              step="1"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Text Color & Opacity Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-800">Text Color</label>
            <div className="flex items-center gap-2">
              {presetColors.map((col) => (
                <button
                  key={col}
                  type="button"
                  onClick={() => setColor(col)}
                  className={`w-6 h-6 rounded-lg border cursor-pointer transition-transform ${
                    color === col ? "scale-110 border-amber-500 ring-2 ring-amber-400/50" : "border-slate-300"
                  }`}
                  style={{ backgroundColor: col }}
                />
              ))}
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-7 h-7 rounded-lg border border-slate-300 cursor-pointer p-0 bg-transparent"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-black text-slate-800">
              <span>Opacity</span>
              <span className="text-amber-600">{Math.round(opacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 4. ADVANCED OPTIONS TOGGLE */}
      <div className="pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full py-2 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-between transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Sliders size={14} className="text-amber-500" />
            <span>Advanced Options (Skip Cover Page, Knockout Box, Range)</span>
          </span>
          {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {showAdvanced && (
          <div className="mt-4 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-4">
            
            {/* Skip First N Pages */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-800">Skip First N Pages (Cover Page)</label>
                <input
                  type="number"
                  min="0"
                  max={totalPages - 1}
                  value={skipFirstN}
                  onChange={(e) => setSkipFirstN(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="w-full px-3 py-2 bg-white border border-slate-200/90 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                />
                <p className="text-[10px] text-slate-400 font-semibold">e.g. Set to 1 to leave Page 1 unnumbered.</p>
              </div>

              {/* Total Semantics */}
              {(format === "page-x-of-n" || format === "x-slash-n" || format === "custom") && (
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-800">&#123;total&#125; Counts</label>
                  <select
                    value={totalSemantics}
                    onChange={(e) => setTotalSemantics(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200/90 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500"
                  >
                    <option value="document">Total Document Pages ({totalPages})</option>
                    <option value="numbered">Numbered Pages Count Only</option>
                  </select>
                </div>
              )}
            </div>

            {/* Background Knockout Box */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-800">Background Knockout Box (High Contrast)</label>
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: "none", label: "None" },
                  { id: "white", label: "White Box" },
                  { id: "semi-white", label: "Semi-Transparent White" },
                  { id: "custom", label: "Custom Box Color" }
                ].map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBgBoxType(b.id)}
                    className={`py-1.5 px-3 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      bgBoxType === b.id
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    {b.label}
                  </button>
                ))}

                {bgBoxType === "custom" && (
                  <input
                    type="color"
                    value={bgBoxColor}
                    onChange={(e) => setBgBoxColor(e.target.value)}
                    className="w-7 h-7 rounded-lg border border-slate-300 cursor-pointer p-0 bg-transparent"
                  />
                )}
              </div>
            </div>

            {/* Range Mode Selection */}
            <div className="space-y-2 pt-2 border-t border-slate-200/60">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <Layers size={14} className="text-amber-500" />
                  <span>Target Pages Selection</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setRangeMode("all")}
                    className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      rangeMode === "all"
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    All Pages ({totalPages})
                  </button>

                  <button
                    type="button"
                    onClick={() => setRangeMode("specific")}
                    className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      rangeMode === "specific"
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    Specific Pages
                  </button>
                </div>
              </div>

              {rangeMode === "specific" && (
                <div className="space-y-1.5">
                  <input
                    type="text"
                    value={specificPagesStr}
                    onChange={(e) => setSpecificPagesStr(e.target.value)}
                    placeholder="e.g. 1, 3, 5-8"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200/90 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                  <p className="text-[11px] font-semibold text-slate-400">
                    Enter 1-based page numbers or ranges (1 to {totalPages}).
                  </p>
                </div>
              )}

              {/* Range Warnings */}
              {rangeValidation && (
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
        )}
      </div>

    </div>
  );
}
