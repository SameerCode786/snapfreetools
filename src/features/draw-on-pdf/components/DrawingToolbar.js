"use client";

import React, { useState } from "react";
import {
  MousePointer,
  Pencil,
  Highlighter,
  Eraser,
  Minus,
  MoveRight,
  Square,
  Circle,
  Type,
  Undo2,
  Redo2,
  Trash2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RefreshCw,
  Palette,
  Sliders,
  Sparkles
} from "lucide-react";

const PRESET_COLORS = [
  { name: "Black", hex: "#000000" },
  { name: "Red", hex: "#ef4444" },
  { name: "Blue", hex: "#2563eb" },
  { name: "Green", hex: "#16a34a" },
  { name: "Yellow", hex: "#eab308" },
  { name: "Purple", hex: "#9333ea" },
  { name: "White", hex: "#ffffff" }
];

const STROKE_PRESETS = [2, 4, 8, 16];
const OPACITY_PRESETS = [0.2, 0.35, 0.5, 0.75, 1.0];
const FONT_SIZE_PRESETS = [12, 14, 16, 20, 24, 32];

export default function DrawingToolbar({
  activeTool,
  setActiveTool,
  color,
  setColor,
  strokeWidth,
  setStrokeWidth,
  opacity,
  setOpacity,
  fontSize,
  setFontSize,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onClearPage,
  onClearAll,
  zoomScale,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onFitPage,
  onExportPdf,
  isExporting = false
}) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showStrokePicker, setShowStrokePicker] = useState(false);

  const tools = [
    { id: "select", name: "Select / Move", icon: MousePointer },
    { id: "pen", name: "Freehand Pen", icon: Pencil },
    { id: "highlighter", name: "Highlighter", icon: Highlighter },
    { id: "eraser", name: "Object Eraser", icon: Eraser },
    { id: "line", name: "Line", icon: Minus },
    { id: "arrow", name: "Arrow", icon: MoveRight },
    { id: "rectangle", name: "Rectangle", icon: Square },
    { id: "ellipse", name: "Circle / Ellipse", icon: Circle },
    { id: "text", name: "Add Text", icon: Type }
  ];

  return (
    <div
      role="toolbar"
      aria-label="Drawing and annotation tools"
      className="w-full bg-slate-900 border-b border-slate-800 text-white px-3 py-2 sm:px-6 sm:py-3 shadow-md flex flex-wrap items-center justify-between gap-3 select-none"
    >
      {/* Primary Tool Buttons */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;

          return (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              aria-label={tool.name}
              aria-pressed={isActive}
              title={tool.name}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                isActive
                  ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Icon size={16} />
              <span className="hidden md:inline">{tool.name}</span>
            </button>
          );
        })}
      </div>

      {/* Style Controls (Color, Stroke, Opacity, Font Size) */}
      <div className="flex items-center gap-2 border-l border-r border-slate-800 px-3">
        {/* Color Palette Button & Swatches */}
        <div className="flex items-center gap-1.5">
          <label htmlFor="color-picker-input" className="sr-only">Choose Color</label>
          <div className="relative flex items-center gap-1">
            {PRESET_COLORS.map((c) => (
              <button
                key={c.hex}
                onClick={() => setColor(c.hex)}
                title={c.name}
                aria-label={`Select ${c.name} color`}
                className={`w-5 h-5 rounded-full border border-slate-700 transition-transform ${
                  color.toLowerCase() === c.hex.toLowerCase()
                    ? "scale-125 ring-2 ring-amber-400 ring-offset-1 ring-offset-slate-900"
                    : "hover:scale-110"
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}

            <input
              id="color-picker-input"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              title="Custom Color"
              className="w-6 h-6 rounded border-0 bg-transparent cursor-pointer ml-1"
            />
          </div>
        </div>

        {/* Stroke Width Slider / Controls */}
        {activeTool !== "text" && (
          <div className="flex items-center gap-1.5 ml-2 border-l border-slate-800 pl-3">
            <span className="text-[11px] font-medium text-slate-400 hidden lg:inline">Width:</span>
            <div className="flex items-center gap-1">
              {STROKE_PRESETS.map((w) => (
                <button
                  key={w}
                  onClick={() => setStrokeWidth(w)}
                  title={`${w}px stroke`}
                  aria-label={`${w} pixel stroke width`}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-bold transition-colors ${
                    strokeWidth === w
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/50"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                  }`}
                >
                  {w}px
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Font Size for Text Tool */}
        {activeTool === "text" && (
          <div className="flex items-center gap-1.5 ml-2 border-l border-slate-800 pl-3">
            <span className="text-[11px] font-medium text-slate-400 hidden lg:inline">Font Size:</span>
            <select
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              aria-label="Text font size"
              className="bg-slate-800 text-xs font-semibold text-white border border-slate-700 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-amber-400"
            >
              {FONT_SIZE_PRESETS.map((s) => (
                <option key={s} value={s}>
                  {s}px
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Opacity Selector */}
        {activeTool !== "eraser" && (
          <div className="flex items-center gap-1.5 ml-2 border-l border-slate-800 pl-3 hidden xl:flex">
            <span className="text-[11px] font-medium text-slate-400">Opacity:</span>
            <select
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              aria-label="Annotation opacity"
              className="bg-slate-800 text-xs font-semibold text-white border border-slate-700 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-amber-400"
            >
              {OPACITY_PRESETS.map((op) => (
                <option key={op} value={op}>
                  {Math.round(op * 100)}%
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* History & Zoom Controls */}
      <div className="flex items-center gap-2">
        {/* Undo / Redo */}
        <div className="flex items-center gap-1">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            aria-label="Undo drawing"
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
          >
            <Undo2 size={16} />
          </button>

          <button
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            aria-label="Redo drawing"
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
          >
            <Redo2 size={16} />
          </button>
        </div>

        {/* Clear Actions */}
        <div className="flex items-center gap-1 border-l border-slate-800 pl-2">
          <button
            onClick={onClearPage}
            title="Clear Current Page Drawings"
            aria-label="Clear current page drawings"
            className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/50 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 border-l border-slate-800 pl-2">
          <button
            onClick={onZoomOut}
            title="Zoom Out (-)"
            aria-label="Zoom out"
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ZoomOut size={16} />
          </button>

          <button
            onClick={onResetZoom}
            title="Reset Zoom to 100%"
            aria-label="Reset zoom to 100%"
            className="px-2 py-1 text-xs font-bold text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
          >
            {Math.round(zoomScale * 100)}%
          </button>

          <button
            onClick={onZoomIn}
            title="Zoom In (+)"
            aria-label="Zoom in"
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ZoomIn size={16} />
          </button>

          <button
            onClick={onFitPage}
            title="Fit to Page"
            aria-label="Fit page to view"
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Maximize2 size={16} />
          </button>
        </div>

        {/* Export Action Button */}
        {onExportPdf && (
          <button
            onClick={onExportPdf}
            disabled={isExporting}
            className="ml-2 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-900/30 flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            {isExporting ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : (
              <Sparkles size={14} />
            )}
            <span>Export PDF</span>
          </button>
        )}
      </div>
    </div>
  );
}
