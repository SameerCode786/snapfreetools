"use client";

import React, { useEffect } from "react";
import { X, Keyboard, Command } from "lucide-react";

/**
 * KeyboardShortcutsModal
 * Accessible dialog displaying power-user keyboard shortcuts for Sign PDF canvas.
 */
export default function KeyboardShortcutsModal({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shortcutGroups = [
    {
      title: "Field Movement & Transform",
      shortcuts: [
        { keys: ["↑", "↓", "←", "→"], description: "Move selected field by 1 unit" },
        { keys: ["Shift", "+", "Arrow"], description: "Move selected field by 10 units" },
        { keys: ["Enter", "/", "Space"], description: "Select / activate focused field" }
      ]
    },
    {
      title: "Field Management",
      shortcuts: [
        { keys: ["Ctrl/Cmd", "+", "D"], description: "Duplicate selected field" },
        { keys: ["Delete", "/", "Backspace"], description: "Delete selected field (outside typing)" },
        { keys: ["Escape"], description: "Deselect field / close open panels" }
      ]
    },
    {
      title: "History & Viewport",
      shortcuts: [
        { keys: ["Ctrl/Cmd", "+", "Z"], description: "Undo last field action" },
        { keys: ["Ctrl/Cmd", "+", "Shift", "+", "Z"], description: "Redo last field action" },
        { keys: ["+"], description: "Zoom in document" },
        { keys: ["-"], description: "Zoom out document" },
        { keys: ["0"], description: "Reset zoom to 100%" },
        { keys: ["?"], description: "Toggle this shortcuts guide" }
      ]
    }
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Semi-transparent backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col animate-in zoom-in-95 fade-in duration-200 max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h3 id="shortcuts-modal-title" className="text-sm font-bold text-slate-900">
                Keyboard Shortcuts & Navigation
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Power-user hotkeys for fast document signing
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            title="Close"
            aria-label="Close shortcuts guide"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-120px)]">
          {shortcutGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-2.5">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {group.title}
              </h4>
              <div className="space-y-1.5 bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
                {group.shortcuts.map((sc, sIdx) => (
                  <div
                    key={sIdx}
                    className="flex items-center justify-between text-xs py-1"
                  >
                    <span className="text-slate-700 font-medium">{sc.description}</span>
                    <div className="flex items-center gap-1 shrink-0 ml-3">
                      {sc.keys.map((k, kIdx) => (
                        <kbd
                          key={kIdx}
                          className="px-2 py-0.5 text-[10.5px] font-mono font-bold bg-white text-slate-800 border border-slate-200 rounded-md shadow-2xs"
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Press <kbd className="px-1.5 py-0.5 font-mono text-[10px] font-bold bg-white border border-slate-200 rounded">Esc</kbd> to close</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
