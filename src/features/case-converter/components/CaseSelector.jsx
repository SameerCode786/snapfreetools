import React, { useState } from "react";
import { CASE_MODES } from "../utils/caseConverter";
import { Sparkles, ChevronDown, ChevronUp, Check, Info } from "lucide-react";

export default function CaseSelector({ activeMode, setActiveMode }) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const basicModes = CASE_MODES.filter((m) => m.category === "basic");
  const advancedModes = CASE_MODES.filter((m) => m.category === "advanced");

  const currentModeObj = CASE_MODES.find((m) => m.id === activeMode) || CASE_MODES[0];

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Sparkles size={18} className="text-amber-500" />
            Select Case Transformation
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Click any style below to convert your text instantly.
          </p>
        </div>

        {/* Active Mode Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200/60 rounded-full text-xs font-bold text-amber-900 shrink-0">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span>Active: <strong className="font-extrabold">{currentModeObj.name}</strong></span>
        </div>
      </div>

      {/* Main Grid: Popular / Basic Cases */}
      <div className="space-y-2">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
          Popular Formats
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {basicModes.map((mode) => {
            const isActive = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setActiveMode(mode.id)}
                className={`relative px-3.5 py-3 rounded-2xl text-xs font-bold text-left transition-all cursor-pointer flex flex-col justify-between gap-1 outline-none ${
                  isActive
                    ? "bg-amber-500 text-white shadow-md shadow-amber-500/20 ring-2 ring-amber-500 ring-offset-1"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="truncate">{mode.name}</span>
                  {isActive && <Check size={14} className="shrink-0 text-white" />}
                </div>
                <span
                  className={`text-[10px] font-medium truncate ${
                    isActive ? "text-amber-100" : "text-slate-400"
                  }`}
                >
                  {mode.example}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Advanced Cases Section */}
      <div className="space-y-3 pt-1">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between py-2 px-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-2xl text-xs font-extrabold text-slate-700 transition-all cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <span>Developer & Advanced Cases</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-600">
              {advancedModes.length} modes
            </span>
          </span>
          {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {showAdvanced && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 animate-fadeIn">
            {advancedModes.map((mode) => {
              const isActive = activeMode === mode.id;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setActiveMode(mode.id)}
                  className={`relative px-3.5 py-3 rounded-2xl text-xs font-bold text-left transition-all cursor-pointer flex flex-col justify-between gap-1 outline-none ${
                    isActive
                      ? "bg-amber-500 text-white shadow-md shadow-amber-500/20 ring-2 ring-amber-500 ring-offset-1"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="truncate">{mode.name}</span>
                    {isActive && <Check size={14} className="shrink-0 text-white" />}
                  </div>
                  <span
                    className={`text-[10px] font-medium truncate ${
                      isActive ? "text-amber-100" : "text-slate-400"
                    }`}
                  >
                    {mode.example}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Description Footer */}
      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/60 rounded-2xl p-3 text-xs text-slate-600">
        <Info size={16} className="text-amber-500 shrink-0" />
        <span className="font-medium">
          <strong className="font-bold text-slate-800">{currentModeObj.name}:</strong> {currentModeObj.desc} (Example: <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-[11px] text-amber-700">{currentModeObj.example}</code>)
        </span>
      </div>
    </div>
  );
}
