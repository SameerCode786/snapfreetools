"use client";

import React, { useState } from "react";
import { FileText, EyeOff, Plus, Trash2, ShieldCheck, Lock, RefreshCw, Layers } from "lucide-react";

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default function RedactionWorkspace({
  fileInfo,
  redactions,
  onAddRedaction,
  onRemoveRedaction,
  onClearRedactions,
  onApplyRedactions,
  onChangeFile,
  isProcessing,
}) {
  const [selectedPageIndex, setSelectedPageIndex] = useState(0);
  const [customColor, setCustomColor] = useState("#000000");

  // Preset box additions
  const handleAddPreset = (type) => {
    if (!fileInfo || !fileInfo.pages[selectedPageIndex]) return;
    const page = fileInfo.pages[selectedPageIndex];

    let box = null;
    if (type === "topHeader") {
      box = {
        id: Date.now() + Math.random(),
        pageIndex: selectedPageIndex,
        pageNumber: selectedPageIndex + 1,
        x: 30,
        y: page.height - 80,
        width: page.width - 60,
        height: 60,
        color: customColor,
        label: "Top Header Region",
      };
    } else if (type === "bottomFooter") {
      box = {
        id: Date.now() + Math.random(),
        pageIndex: selectedPageIndex,
        pageNumber: selectedPageIndex + 1,
        x: 30,
        y: 20,
        width: page.width - 60,
        height: 50,
        color: customColor,
        label: "Bottom Footer Region",
      };
    } else if (type === "centerBox") {
      box = {
        id: Date.now() + Math.random(),
        pageIndex: selectedPageIndex,
        pageNumber: selectedPageIndex + 1,
        x: page.width * 0.2,
        y: page.height * 0.4,
        width: page.width * 0.6,
        height: page.height * 0.2,
        color: customColor,
        label: "Central Region",
      };
    } else if (type === "fullPage") {
      box = {
        id: Date.now() + Math.random(),
        pageIndex: selectedPageIndex,
        pageNumber: selectedPageIndex + 1,
        x: 10,
        y: 10,
        width: page.width - 20,
        height: page.height - 20,
        color: customColor,
        label: "Full Page Block",
      };
    }

    if (box) {
      onAddRedaction(box);
    }
  };

  const currentPage = fileInfo?.pages[selectedPageIndex] || { width: 500, height: 700 };

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-8 space-y-8 max-w-4xl mx-auto shadow-xs">
      
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-6 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <FileText size={24} />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm break-all">{fileInfo.name}</h3>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">
              {formatBytes(fileInfo.byteSize)} • {fileInfo.pageCount} {fileInfo.pageCount === 1 ? "page" : "pages"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onChangeFile}
          disabled={isProcessing}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-colors shrink-0 disabled:opacity-50"
        >
          Change File
        </button>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Page Selection & Preset Triggers */}
        <div className="space-y-6 md:col-span-1">
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-slate-700 block">
              Select Page to Redact:
            </label>
            <select
              value={selectedPageIndex}
              onChange={(e) => setSelectedPageIndex(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-400"
            >
              {fileInfo.pages.map((p, idx) => (
                <option key={idx} value={idx}>
                  Page {p.pageNumber} ({Math.round(p.width)} x {Math.round(p.height)} pt)
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-extrabold text-slate-700 block">
              Redaction Fill Color:
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="w-9 h-9 rounded-lg border border-slate-200 cursor-pointer p-0.5 bg-white"
              />
              <span className="text-xs font-semibold text-slate-500 uppercase font-mono">{customColor}</span>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-extrabold text-slate-700 block">
              Add Redaction Region:
            </label>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => handleAddPreset("topHeader")}
                className="w-full text-left bg-slate-50 hover:bg-amber-50 hover:border-amber-200 border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 flex items-center justify-between transition-colors"
              >
                <span>+ Top Header Box</span>
                <Plus size={14} className="text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => handleAddPreset("centerBox")}
                className="w-full text-left bg-slate-50 hover:bg-amber-50 hover:border-amber-200 border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 flex items-center justify-between transition-colors"
              >
                <span>+ Center Content Box</span>
                <Plus size={14} className="text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => handleAddPreset("bottomFooter")}
                className="w-full text-left bg-slate-50 hover:bg-amber-50 hover:border-amber-200 border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 flex items-center justify-between transition-colors"
              >
                <span>+ Bottom Footer Box</span>
                <Plus size={14} className="text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => handleAddPreset("fullPage")}
                className="w-full text-left bg-slate-50 hover:bg-amber-50 hover:border-amber-200 border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 flex items-center justify-between transition-colors"
              >
                <span>+ Entire Page Mask</span>
                <Plus size={14} className="text-slate-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Preview & Selected Redactions Queue */}
        <div className="space-y-6 md:col-span-2">
          
          {/* Visual Page Representation */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-700">
                Page {selectedPageIndex + 1} Preview & Redaction Bounds
              </span>
              <span className="text-[11px] font-semibold text-slate-400">
                {redactions.filter(r => r.pageIndex === selectedPageIndex).length} box(es) on this page
              </span>
            </div>

            <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 flex items-center justify-center overflow-auto max-h-80">
              <div
                className="bg-white border border-slate-300 shadow-sm relative select-none"
                style={{
                  width: "240px",
                  height: `${Math.round((currentPage.height / currentPage.width) * 240)}px`,
                  maxHeight: "280px",
                }}
              >
                <div className="absolute inset-0 p-3 text-[9px] text-slate-300 pointer-events-none overflow-hidden font-mono leading-tight">
                  Page {selectedPageIndex + 1} Page Operators & Text Layer...
                </div>

                {/* Render active page redaction boxes */}
                {redactions
                  .filter((r) => r.pageIndex === selectedPageIndex)
                  .map((box) => {
                    const scaleX = 240 / currentPage.width;
                    const scaleY = (currentPage.height / currentPage.width * 240) / currentPage.height;
                    const left = box.x * scaleX;
                    const top = (currentPage.height - box.y - box.height) * scaleY;
                    const width = box.width * scaleX;
                    const height = box.height * scaleY;

                    return (
                      <div
                        key={box.id}
                        className="absolute border border-rose-500/50 flex items-center justify-center text-[9px] text-white font-bold font-mono transition-all"
                        style={{
                          left: `${left}px`,
                          top: `${top}px`,
                          width: `${width}px`,
                          height: `${height}px`,
                          backgroundColor: box.color,
                        }}
                      >
                        REDACTED
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Redactions Queue List */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-slate-800">
                Pending Redaction Regions ({redactions.length})
              </h4>
              {redactions.length > 0 && (
                <button
                  type="button"
                  onClick={onClearRedactions}
                  className="text-[11px] font-bold text-rose-600 hover:text-rose-800 transition-colors"
                >
                  Clear All Boxes
                </button>
              )}
            </div>

            {redactions.length === 0 ? (
              <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 text-center text-xs text-slate-400 font-medium">
                No redaction regions added yet. Click a preset box button above to add a redaction area.
              </div>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {redactions.map((box, idx) => (
                  <div
                    key={box.id || idx}
                    className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded border border-slate-300 shrink-0"
                        style={{ backgroundColor: box.color }}
                      />
                      <span className="font-extrabold text-slate-800">Page {box.pageNumber}</span>
                      <span className="text-slate-400 font-medium">({box.label || "Redaction Box"})</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveRedaction(box.id)}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                      title="Remove Box"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
          <span>Permanently sanitizes content streams & bakes opaque boxes</span>
        </div>

        <button
          type="button"
          onClick={onApplyRedactions}
          disabled={isProcessing || redactions.length === 0}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {isProcessing ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              Sanitizing PDF...
            </>
          ) : (
            <>
              <EyeOff size={16} />
              Apply Permanent Redactions ({redactions.length})
            </>
          )}
        </button>
      </div>

    </div>
  );
}
