import React from "react";
import { Link as LinkIcon, Unlink, Sliders, Layers, Sparkles, Paintbrush, HardDrive } from "lucide-react";
import { PRESETS, FORMAT_OPTIONS } from "../utils/imagePresets";

export default function ResizeControls({
  mode,
  setMode,
  width,
  setWidth,
  height,
  setHeight,
  percentage,
  setPercentage,
  lockAspectRatio,
  setLockAspectRatio,
  selectedPreset,
  setSelectedPreset,
  quality,
  setQuality,
  outputFormat,
  setOutputFormat,
  backgroundColor,
  setBackgroundColor,
  targetSizeKb,
  setTargetSizeKb,
  originalWidth,
  originalHeight,
  originalType = "image/jpeg",
  onReset
}) {

  // Handle Preset Selection
  const handlePresetChange = (presetId) => {
    setSelectedPreset(presetId);
    if (presetId === "custom") return;

    const presetObj = PRESETS.find((p) => p.id === presetId);
    if (presetObj && presetObj.width && presetObj.height) {
      setMode("custom");
      setLockAspectRatio(false);
      setWidth(presetObj.width);
      setHeight(presetObj.height);
    }
  };

  // Quick Percentage Buttons
  const percentageButtons = [25, 50, 75, 100, 125, 150, 200];

  // Determine if target output format is PNG (either explicitly or original PNG)
  const isPngOutput = outputFormat === "png" || (outputFormat === "original" && originalType === "image/png");

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
          <Sliders size={18} className="text-amber-500" />
          Resize & Optimization Controls
        </h3>

        <button
          type="button"
          onClick={onReset}
          className="text-xs font-extrabold text-amber-600 hover:text-amber-700 transition-colors cursor-pointer"
        >
          Reset Settings
        </button>
      </div>

      {/* Resize Mode Tabs */}
      <div className="space-y-2">
        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
          Resize Method
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: "custom", label: "Custom Pixels" },
            { id: "percentage", label: "Percentage %" },
            { id: "fit", label: "Fit Inside Box" },
            { id: "fill", label: "Fill & Center Crop" }
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setMode(item.id);
                setSelectedPreset("custom");
              }}
              className={`py-2.5 px-3 rounded-2xl text-xs font-bold transition-all cursor-pointer outline-none ${
                mode === item.id
                  ? "bg-amber-500 text-white shadow-sm ring-2 ring-amber-500 ring-offset-1"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Presets Dropdown (for Custom / Fit / Fill) */}
      <div className="space-y-2">
        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
          Standard Size Presets
        </label>
        <select
          value={selectedPreset}
          onChange={(e) => handlePresetChange(e.target.value)}
          className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/10 cursor-pointer"
        >
          <option value="custom">Custom Dimensions (Manual)</option>
          <optgroup label="Social Media">
            {PRESETS.filter((p) => p.group === "Social Media").map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </optgroup>
          <optgroup label="Common Resolutions">
            {PRESETS.filter((p) => p.group === "Common").map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </optgroup>
          <optgroup label="Web & Banners">
            {PRESETS.filter((p) => p.group === "Web").map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      {/* Inputs according to Mode */}
      {mode === "percentage" ? (
        <div className="space-y-3">
          <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
            Scale Percentage
          </label>

          <div className="flex items-center gap-3">
            <input
              type="number"
              min="1"
              max="500"
              value={percentage}
              onChange={(e) => setPercentage(Math.max(1, Math.min(500, Number(e.target.value))))}
              className="w-28 px-3.5 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/10"
            />
            <span className="text-sm font-extrabold text-slate-700">%</span>

            <span className="text-xs font-semibold text-slate-400 ml-auto">
              Result: {Math.round(originalWidth * (percentage / 100))} × {Math.round(originalHeight * (percentage / 100))} px
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {percentageButtons.map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => setPercentage(pct)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  percentage === pct
                    ? "bg-amber-500 text-white shadow-xs"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Target Dimensions (Pixels)
            </label>

            {mode === "custom" && (
              <button
                type="button"
                onClick={() => setLockAspectRatio(!lockAspectRatio)}
                className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-xl transition-all cursor-pointer ${
                  lockAspectRatio
                    ? "bg-amber-50 text-amber-800 border border-amber-200"
                    : "bg-slate-100 text-slate-500 border border-slate-200"
                }`}
              >
                {lockAspectRatio ? <LinkIcon size={13} className="text-amber-600" /> : <Unlink size={13} />}
                <span>{lockAspectRatio ? "Aspect Ratio Locked" : "Aspect Ratio Unlocked"}</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-slate-400">Width (px)</span>
              <input
                type="number"
                min="1"
                max="12000"
                value={width}
                onChange={(e) => setWidth(Math.max(1, Number(e.target.value)))}
                className="w-full px-3.5 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/10"
              />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-slate-400">Height (px)</span>
              <input
                type="number"
                min="1"
                max="12000"
                value={height}
                onChange={(e) => setHeight(Math.max(1, Number(e.target.value)))}
                className="w-full px-3.5 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/10"
              />
            </div>
          </div>
        </div>
      )}

      {/* Output Format & Quality Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
        
        {/* Format Selector */}
        <div className="space-y-2">
          <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
            Output Image Format
          </label>
          <select
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
            className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/10 cursor-pointer"
          >
            {FORMAT_OPTIONS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        {/* Quality Slider (for JPG & WebP) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-extrabold tracking-wider text-slate-400">
            <span>Compression Quality</span>
            <span className="text-amber-600 font-bold">{Math.round(quality * 100)}%</span>
          </div>

          <input
            type="range"
            min="0.10"
            max="1.00"
            step="0.05"
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            disabled={isPngOutput}
            className="w-full accent-amber-500 cursor-pointer disabled:opacity-40"
          />

          <p className="text-[10px] text-slate-400 font-medium">
            {isPngOutput
              ? "PNG is a lossless format (quality slider disabled)."
              : "Higher quality produces clearer images with slightly larger file size."}
          </p>
        </div>
      </div>

      {/* Background Fill for JPEG conversion */}
      {(outputFormat === "jpeg" || backgroundColor !== "#FFFFFF") && (
        <div className="space-y-2 pt-2">
          <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Paintbrush size={14} className="text-amber-500" />
            Background Color (for Transparency Conversion)
          </label>
          <div className="flex items-center gap-3">
            {[
              { label: "White", color: "#FFFFFF" },
              { label: "Black", color: "#000000" },
              { label: "Transparent", color: "" }
            ].map((b) => (
              <button
                key={b.label}
                type="button"
                onClick={() => setBackgroundColor(b.color)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  backgroundColor === b.color
                    ? "bg-amber-500 text-white shadow-xs"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                {b.color && <span className="w-3 h-3 rounded-full border border-slate-300" style={{ backgroundColor: b.color }} />}
                <span>{b.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Optional Target KB Optimization */}
      <div className="pt-3 border-t border-slate-100 space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <HardDrive size={14} className="text-amber-500" />
            Target Maximum File Size (Optional)
          </label>

          {targetSizeKb && (
            <button
              type="button"
              onClick={() => setTargetSizeKb("")}
              className="text-[11px] font-bold text-red-600 hover:underline cursor-pointer"
            >
              Clear Target KB
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <input
            type="number"
            placeholder="e.g. 500"
            value={targetSizeKb}
            onChange={(e) => setTargetSizeKb(e.target.value)}
            className="w-36 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/10"
          />
          <span className="text-xs font-bold text-slate-600">KB</span>
          <span className="text-[11px] text-slate-400 font-medium">
            (Auto-adjusts compression quality to fit under target size)
          </span>
        </div>
      </div>
    </div>
  );
}
