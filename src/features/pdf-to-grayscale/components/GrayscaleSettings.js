"use client";

import React from "react";
import { SunMedium, Sliders, CheckCircle2, Sparkles } from "lucide-react";

export default function GrayscaleSettings({ settings, onSettingsChange, onConvert, disabled }) {
  const dpiOptions = [
    {
      id: 150,
      label: "Standard (150 DPI)",
      description: "Optimal balance for screen viewing and general desktop printing."
    },
    {
      id: 300,
      label: "High Resolution (300 DPI)",
      description: "Crisp maximum quality for professional printing and archiving."
    }
  ];

  const qualityOptions = [
    { id: 0.80, label: "Compact File Size" },
    { id: 0.85, label: "Balanced Quality (Recommended)" },
    { id: 0.95, label: "Maximum Precision" }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 max-w-xl mx-auto shadow-xs">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
          <Sliders size={20} />
        </div>
        <div>
          <h3 className="font-extrabold text-slate-900 text-base">Grayscale Conversion Options</h3>
          <p className="text-xs text-slate-500 font-medium">Configure resolution and output quality</p>
        </div>
      </div>

      {/* Mode Indicator */}
      <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 flex items-center gap-3">
        <SunMedium size={24} className="text-amber-600 shrink-0" />
        <div className="space-y-0.5 text-xs">
          <p className="font-extrabold text-amber-900">Standard Luminance Grayscale Engine</p>
          <p className="text-amber-800 font-medium">
            Converts all color text, photographs, shapes, and fills into pure monochrome tonal values (ITU-R BT.601 standard).
          </p>
        </div>
      </div>

      {/* DPI Resolution Selection */}
      <div className="space-y-3">
        <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
          Rendering Resolution (DPI)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {dpiOptions.map((opt) => {
            const isSelected = settings.dpi === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onSettingsChange({ ...settings, dpi: opt.id })}
                disabled={disabled}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? "border-amber-500 bg-amber-50/40 ring-2 ring-amber-500/20"
                    : "border-slate-200 hover:border-amber-300 hover:bg-slate-50/50"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-extrabold text-slate-900 text-xs">{opt.label}</span>
                  {isSelected && <CheckCircle2 size={16} className="text-amber-500 shrink-0" />}
                </div>
                <p className="text-[11px] text-slate-500 font-medium mt-1 leading-relaxed">
                  {opt.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quality Setting */}
      <div className="space-y-2">
        <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
          Output Compression Level
        </label>
        <select
          value={settings.quality}
          onChange={(e) => onSettingsChange({ ...settings, quality: parseFloat(e.target.value) })}
          disabled={disabled}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500"
        >
          {qualityOptions.map((q) => (
            <option key={q.id} value={q.id}>
              {q.label}
            </option>
          ))}
        </select>
      </div>

      {/* Convert CTA Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onConvert}
          disabled={disabled}
          className="w-full py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-white font-extrabold text-sm shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
        >
          <Sparkles size={18} />
          <span>Convert PDF to Grayscale</span>
        </button>
      </div>
    </div>
  );
}
