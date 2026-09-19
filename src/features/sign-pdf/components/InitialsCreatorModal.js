"use client";

import React, { useState, useMemo } from "react";
import { X, Check, Type, Sparkles } from "lucide-react";
import {
  INITIALS_FONTS,
  INITIALS_COLORS,
  generateInitialsDataUrl
} from "../utils/initialsCanvasUtils";

export default function InitialsCreatorModal({
  isOpen,
  onClose,
  onApply,
  initialText = "SS"
}) {
  const [text, setText] = useState(initialText);
  const [selectedFontId, setSelectedFontId] = useState("initials-script");
  const [selectedColor, setSelectedColor] = useState("#0f172a");

  // Filter text to 1-4 uppercase alphanumeric characters
  const handleTextChange = (e) => {
    const clean = e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().substring(0, 4);
    setText(clean);
  };

  const previewDataUrl = useMemo(() => {
    if (!text.trim()) return null;
    return generateInitialsDataUrl(text, selectedFontId, selectedColor);
  }, [text, selectedFontId, selectedColor]);

  if (!isOpen) return null;

  const handleApply = () => {
    if (!text.trim()) return;
    const finalDataUrl = generateInitialsDataUrl(text, selectedFontId, selectedColor);
    onApply({
      type: "initials",
      dataUrl: finalDataUrl,
      initialsText: text,
      fontId: selectedFontId,
      color: selectedColor
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
              <Type className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-800">Create Initials</h3>
              <p className="text-xs text-slate-500">Type 1–4 letters for your document initials</p>
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
          {/* Text Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
              Enter Your Initials
            </label>
            <input
              type="text"
              value={text}
              onChange={handleTextChange}
              placeholder="e.g. SS or JD"
              maxLength={4}
              className="w-full px-4 py-2.5 text-center text-2xl font-bold tracking-widest text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all uppercase"
              autoFocus
            />
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
              Ink Color
            </label>
            <div className="flex items-center gap-3">
              {INITIALS_COLORS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedColor(c.hex)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    selectedColor === c.hex
                      ? "border-emerald-500 bg-emerald-50/50 text-emerald-800 ring-2 ring-emerald-500/20 shadow-sm"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full border border-slate-300"
                    style={{ backgroundColor: c.hex }}
                  />
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Style Selector Grid */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
              Initials Style
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {INITIALS_FONTS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFontId(f.id)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    selectedFontId === f.id
                      ? "border-emerald-500 bg-emerald-50/30 ring-2 ring-emerald-500/20 shadow-sm"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div
                    className="text-2xl h-10 flex items-center justify-center"
                    style={{
                      fontFamily: f.fontFamily,
                      fontStyle: f.slant,
                      fontWeight: f.weight,
                      color: selectedColor,
                      letterSpacing: f.letterSpacing
                    }}
                  >
                    {text.trim() || "SS"}
                  </div>
                  <span className="text-[11px] font-medium text-slate-500 block mt-1">
                    {f.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Preview Box */}
          <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center min-h-[90px]">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
              Live Preview
            </span>
            {previewDataUrl ? (
              <img
                src={previewDataUrl}
                alt="Initials Preview"
                className="max-h-16 object-contain"
              />
            ) : (
              <span className="text-xs text-slate-400 italic">Type letters above to see preview</span>
            )}
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
            disabled={!text.trim()}
            className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-sm hover:shadow transition-all"
          >
            <Check className="w-4 h-4" />
            Apply Initials
          </button>
        </div>
      </div>
    </div>
  );
}
