"use client";

import React, { useState } from "react";
import { Sliders, ChevronDown, ChevronUp, FileText, Monitor, Check } from "lucide-react";

export default function Workspace({ settings, setSettings }) {
  const [isOpen, setIsOpen] = useState(false);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
      {/* Toggle Accordion Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-100/60 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-amber-100 text-amber-700 rounded-lg flex items-center justify-center">
            <Sliders size={16} />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">
              PDF Formatting & Output Options
            </h4>
            <p className="text-[11px] text-slate-500">
              Page size, orientation, margins, media mode & footer
            </p>
          </div>
        </div>
        <div className="text-slate-400">
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {/* Options Body */}
      {isOpen && (
        <div className="p-4 sm:p-6 border-t border-slate-200 bg-white space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Page Size */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Page Size
              </label>
              <select
                value={settings.pageSize || "A4"}
                onChange={(e) => updateSetting("pageSize", e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-amber-500"
              >
                <option value="A4">A4 (210 x 297 mm)</option>
                <option value="Letter">Letter (8.5 x 11 in)</option>
                <option value="Legal">Legal (8.5 x 14 in)</option>
                <option value="A3">A3 (297 x 420 mm)</option>
              </select>
            </div>

            {/* Orientation */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Orientation
              </label>
              <select
                value={settings.orientation || "portrait"}
                onChange={(e) => updateSetting("orientation", e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-amber-500"
              >
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </div>

            {/* Media Type */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Media Emulation
              </label>
              <select
                value={settings.mediaType || "print"}
                onChange={(e) => updateSetting("mediaType", e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-amber-500"
              >
                <option value="print">Print CSS Styles</option>
                <option value="screen">Screen CSS Styles</option>
              </select>
            </div>

            {/* Render Scale */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Render Scale ({settings.scale || 1.0}x)
              </label>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={settings.scale || 1.0}
                onChange={(e) => updateSetting("scale", parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer mt-1"
              />
            </div>
          </div>

          {/* Margins Row */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Margins (Top / Right / Bottom / Left)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block mb-1">Top</span>
                <input
                  type="text"
                  value={settings.marginTop || "10mm"}
                  onChange={(e) => updateSetting("marginTop", e.target.value)}
                  placeholder="10mm"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block mb-1">Right</span>
                <input
                  type="text"
                  value={settings.marginRight || "10mm"}
                  onChange={(e) => updateSetting("marginRight", e.target.value)}
                  placeholder="10mm"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block mb-1">Bottom</span>
                <input
                  type="text"
                  value={settings.marginBottom || "10mm"}
                  onChange={(e) => updateSetting("marginBottom", e.target.value)}
                  placeholder="10mm"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block mb-1">Left</span>
                <input
                  type="text"
                  value={settings.marginLeft || "10mm"}
                  onChange={(e) => updateSetting("marginLeft", e.target.value)}
                  placeholder="10mm"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Feature Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100/50">
              <input
                type="checkbox"
                checked={settings.printBackground !== false}
                onChange={(e) => updateSetting("printBackground", e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
              />
              <div>
                <span className="block text-xs font-bold text-slate-800">Print Backgrounds</span>
                <span className="block text-[10px] text-slate-500">Include background colors & images</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100/50">
              <input
                type="checkbox"
                checked={Boolean(settings.showFooter)}
                onChange={(e) => updateSetting("showFooter", e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
              />
              <div>
                <span className="block text-xs font-bold text-slate-800">Page Numbers Footer</span>
                <span className="block text-[10px] text-slate-500">Show page numbering in footer</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100/50">
              <input
                type="checkbox"
                checked={Boolean(settings.respectCssPageSize)}
                onChange={(e) => updateSetting("respectCssPageSize", e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
              />
              <div>
                <span className="block text-xs font-bold text-slate-800">Respect @page CSS</span>
                <span className="block text-[10px] text-slate-500">Honor document @page sizing</span>
              </div>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
